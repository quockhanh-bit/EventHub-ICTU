-- ========================================================
-- CƠ SỞ DỮ LIỆU: HỆ THỐNG QUẢN LÝ SỰ KIỆN (EVENTHUB)
-- ĐỀ TÀI KẾT THÚC HỌC PHẦN - GIẢNG VIÊN: TS. VŨ VIỆT DŨNG
-- ========================================================

-- 1. BẢNG NGƯỜI DÙNG & PHÂN QUYỀN (USERS)
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ATTENDEE', -- 'ADMIN', 'ORGANIZER', 'ATTENDEE'
    "avatar" TEXT,
    "phone" TEXT,
    "organization" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'BANNED'
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG DANH MỤC SỰ KIỆN (CATEGORIES)
CREATE TABLE IF NOT EXISTS "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG SỰ KIỆN (EVENTS)
CREATE TABLE IF NOT EXISTS "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "shortDesc" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bannerImage" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "locationType" TEXT NOT NULL DEFAULT 'OFFLINE', -- 'OFFLINE', 'ONLINE', 'HYBRID'
    "onlineLink" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED', -- 'DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'REJECTED'
    "isFeatured" BOOLEAN NOT NULL DEFAULT 0,
    "organizerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("organizerId") REFERENCES "User" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT
);

-- 4. BẢNG HẠNG VÉ (TICKET TIERS)
CREATE TABLE IF NOT EXISTS "TicketTier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 100,
    "sold" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "benefits" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE
);

-- 5. BẢNG ĐƠN ĐẶT VÉ (BOOKINGS)
CREATE TABLE IF NOT EXISTS "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingCode" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "totalAmount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PAID', -- 'PENDING', 'PAID', 'CANCELLED'
    "paymentMethod" TEXT NOT NULL DEFAULT 'FREE', -- 'FREE', 'MOMO', 'BANK_TRANSFER', 'CREDIT_CARD'
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE
);

-- 6. BẢNG TẤM VÉ ĐIỆN TỬ & MÃ QR CHECK-IN (TICKETS)
CREATE TABLE IF NOT EXISTS "Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketCode" TEXT NOT NULL UNIQUE,
    "qrCodeData" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "ticketTierId" TEXT NOT NULL,
    "attendeeName" TEXT NOT NULL,
    "attendeeEmail" TEXT NOT NULL,
    "isCheckedIn" BOOLEAN NOT NULL DEFAULT 0,
    "checkedInAt" DATETIME,
    "checkedInBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("ticketTierId") REFERENCES "TicketTier" ("id") ON DELETE CASCADE
);

-- 7. BẢNG ĐÁNH GIÁ & BÌNH LUẬN (REVIEWS)
CREATE TABLE IF NOT EXISTS "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- 8. BẢNG THÔNG BÁO (NOTIFICATIONS)
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT 0,
    "link" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- CÁC CHỈ MỤC TĂNG TỐC TRUY VẤN (INDEXES)
CREATE INDEX IF NOT EXISTS "idx_event_slug" ON "Event"("slug");
CREATE INDEX IF NOT EXISTS "idx_event_status" ON "Event"("status");
CREATE INDEX IF NOT EXISTS "idx_booking_code" ON "Booking"("bookingCode");
CREATE INDEX IF NOT EXISTS "idx_ticket_code" ON "Ticket"("ticketCode");
