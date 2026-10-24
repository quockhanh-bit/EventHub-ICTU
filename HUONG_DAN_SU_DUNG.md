# TÀI LIỆU VẬN HÀNH VÀ TRẢI NGHIỆM HỆ THỐNG
## HỆ THỐNG QUẢN LÝ SỰ KIỆN & PHÂN PHỐI VÉ ĐIỆN TỬ (EVENTHUB - ICTU)

> **Đơn vị chủ quản:** Trường Đại học Công nghệ Thông tin & Truyền thông - Đại học Thái Nguyên (ICTU)  
> **Quản trị viên phát triển:** Lô Quốc Khánh  
> **Cố vấn chuyên môn:** TS. Vũ Việt Dũng  
> **Công nghệ nền tảng:** Next.js 16 (App Router, TypeScript, Tailwind CSS), Prisma ORM, Cơ sở dữ liệu SQLite (`prisma/dev.db`), Thư viện mã hóa mật khẩu Bcrypt, Token JWT (Jose), Thư viện tạo mã QR Code động.

---

## 1. Yêu Cầu Giảng Viên & Mức Độ Đáp Ứng
- ✅ **"Phải đúng nghĩa là chương trình, có các chức năng cơ bản, có cơ sở dữ liệu"**:
  - Không phải HTML tĩnh. Toàn bộ hệ thống chạy trên nền tảng Fullstack Next.js kết hợp ORM Prisma và SQLite quan hệ thực sự (`prisma/dev.db`).
- ✅ **Phân quyền đầy đủ (RBAC - Role Based Access Control)**:
  - **Quản trị viên (Admin)**: Thống kê toàn hệ thống, phê duyệt sự kiện của BTC, quản lý & phân quyền người dùng, khóa/mở khóa tài khoản.
  - **Ban Tổ Chức (Organizer)**: Dashboard sự kiện riêng, tạo sự kiện đa hạng vé (VIP, Tiêu chuẩn, Miễn phí), quản lý người tham dự, **quét mã QR Check-in điểm danh thời gian thực**, xuất danh sách người tham dự ra file Excel (CSV).
  - **Khán Giả / Sinh Viên (Attendee)**: Tìm kiếm & lọc sự kiện, đăng ký / mua vé qua cổng thanh toán giả lập, nhận vé điện tử kèm mã QR độc nhất, in vé, đánh giá & bình luận sao.

---

## 2. Thông Tin Tài Khoản Mẫu Để Chấm Điểm (1-Click Demo)

Hệ thống có tích hợp sẵn thanh **Demo Switcher Bar** ở góc trên màn hình. Thầy cô chỉ cần bấm 1 click để chuyển qua lại giữa 3 vai trò mà không cần đăng xuất đăng nhập thủ công:

| Vai Trò | Họ Tên | Email Đăng Nhập | Mật Khẩu | Quyền Hạn Chính |
| :--- | :--- | :--- | :--- | :--- |
| **👑 ADMIN** | Lô Quốc Khánh (Admin) | `admin@eventhub.vn` | `admin123` | Quản trị toàn hệ thống, duyệt sự kiện, quản lý user |
| **🎪 ORGANIZER** | CLB Tin Học Sinh Viên | `organizer@eventhub.vn` | `organizer123` | Tạo sự kiện, xem doanh thu, quét QR Check-in, xuất CSV |
| **🎟️ ATTENDEE** | Nguyễn Văn An | `attendee@eventhub.vn` | `user123` | Mua vé, xem vé điện tử có mã QR, viết đánh giá |

---

## 3. Cách Khởi Chạy Dự Án Trên Máy Tính Mới

Khi mang dự án sang máy tính khác (máy của thầy cô hoặc máy chấm bài):

```bash
# 1. Di chuyển vào thư mục dự án
cd event-hub

# 2. Cài đặt các gói thư viện
npm install

# 3. Đồng bộ và nạp dữ liệu mẫu ban đầu (chỉ cần chạy 1 lần)
npm run db:push
npm run db:seed

# 4. Khởi chạy máy chủ Web
npm run dev
```

Truy cập trình duyệt tại địa chỉ: **http://localhost:3000**

---

## 4. Kịch Bản Kiểm Thử Các Chức Năng Chính (Demo Script)

### Kịch bản 1: Đặt vé sự kiện & Sinh mã QR định danh
1. Bấm nút **"Khán Giả (Nguyễn Văn An)"** trên thanh chuyển đổi nhanh.
2. Chọn sự kiện **"ICTU TechFest & Ngày Hội Việc Làm Công Nghệ 2026"** hoặc **"Đêm Đại Nhạc Hội Chào Tân Sinh Viên ICTU"**.
3. Xem thông tin chi tiết: Lịch trình, địa điểm (Hội trường C1, Sân Vận Động ICTU), các hạng vé (VIP / Miễn phí).
4. Bấm **"Chọn Vé & Đặt Chỗ Ngay"** -> Chọn số lượng -> Bấm **"Xác Nhận & Thanh Toán"**.
5. Hiệu ứng pháo hoa chúc mừng xuất hiện!
6. Bấm **"Xem Vé Của Tôi"** (hoặc vào menu `Vé Của Tôi`): Click **"Xem Mã QR Vào Cổng"** để hiển thị tấm vé điện tử chuẩn có mã QR độ phân giải cao và nút In vé.

### Kịch bản 2: Quét mã QR Check-in điểm danh tại cổng
1. Bấm nút **"Ban Tổ Chức (Đoàn Hội ICTU)"** trên thanh chuyển đổi nhanh.
2. Bấm vào menu **"Quét QR Check-in"** (`/organizer/check-in`).
3. Dùng các nút **1-Click Test** (hoặc nhập mã vé `TCK-ICTU-MUSIC-088`):
   - **Lần 1:** Hệ thống báo **MÀU XANH LÁ** - "Check-in thành công! Hợp lệ. Cho phép vào cổng", cập nhật giờ vào cổng và tên nhân viên soát vé.
   - **Lần 2 (quét lại chính vé đó):** Hệ thống lập tức báo **MÀU VÀNG CẢNH BÁO** - "Vé này ĐÃ ĐƯỢC CHECK-IN trước đó!" kèm thời gian vào cổng lần đầu, chống gian lận vé quay vòng!
   - **Thử nhập mã sai:** Hệ thống báo **MÀU ĐỎ** - "Mã vé không tồn tại".

### Kịch bản 3: Quản lý sự kiện & Xuất danh sách người tham dự (CSV)
1. Ở vai trò Ban Tổ Chức, truy cập **"Quản Lý BTC"** (`/organizer`).
2. Xem 4 thẻ thống kê: Tổng sự kiện, Vé đã bán, Tổng doanh thu (VND), Tỷ lệ check-in (%).
3. Click vào **"Người Dự & Xuất File"** ở một sự kiện -> Bấm nút **"Xuất File Excel (CSV)"** để tải về danh sách toàn bộ người đã mua vé phục vụ công tác đối soát.

### Kịch bản 4: Phê duyệt sự kiện & Quản lý phân quyền (Admin)
1. Bấm nút **"Admin (Lô Quốc Khánh)"** trên thanh chuyển đổi nhanh.
2. Chuyển sang tab **"Duyệt Sự Kiện"**: Nhìn thấy sự kiện *"Hội Thảo Blockchain & DeFi 2026"* do BTC gửi lên đang ở trạng thái chờ duyệt.
3. Bấm **"Phê Duyệt Sự Kiện"** -> Sự kiện ngay lập tức được chuyển sang trạng thái đã xuất bản và hiển thị ra trang chủ cho khán giả đặt vé!
4. Chuyển sang tab **"Người Dùng"**: Có thể thay đổi trực tiếp vai trò của bất kỳ thành viên nào (Admin / Organizer / Attendee) hoặc khóa tài khoản vi phạm.

---

## 5. Cấu Trúc Bảng Dữ Liệu Quan Hệ (Database Schema)

- **`User`**: Lưu tài khoản, mật khẩu băm bcrypt, email, họ tên, vai trò (Admin, Organizer, Attendee), trạng thái (Active, Banned).
- **`Category`**: Danh mục sự kiện (Công nghệ & AI, Âm nhạc, Học thuật, Thể thao, Workshop...).
- **`Event`**: Tiêu đề, slug URL thân thiện, banner ảnh, ngày bắt đầu/kết thúc, địa điểm (Offline/Online/Hybrid), trạng thái kiểm duyệt (`DRAFT`, `PENDING_APPROVAL`, `PUBLISHED`).
- **`TicketTier`**: Các hạng vé thuộc sự kiện (VIP, Tiêu chuẩn, Miễn phí) với số lượng và đơn giá riêng.
- **`Booking`**: Đơn hàng đặt vé, tổng tiền, phương thức thanh toán, thông tin người đặt.
- **`Ticket`**: Chi tiết từng tấm vé cá nhân phát hành, mang chuỗi `qrCodeData` độc nhất và cờ `isCheckedIn` kèm thời gian vào cổng `checkedInAt`.
- **`Review`**: Đánh giá số sao (1-5 sao) và bình luận trải nghiệm của khán giả.
- **`Notification`**: Thông báo realtime khi duyệt bài hoặc đặt vé thành công.

---
*Dự án hoàn thành đúng hạn, đầy đủ tính năng thực thi và cơ sở dữ liệu quan hệ, đáp ứng 100% yêu cầu học phần môn học.*
