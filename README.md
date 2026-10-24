# 🎟️ EVENTHUB - HỆ THỐNG QUẢN LÝ SỰ KIỆN & PHÂN PHỐI VÉ ĐIỆN TỬ
### TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN & TRUYỀN THÔNG - ĐẠI HỌC THÁI NGUYÊN (ICTU)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
</p>

---

## 📌 THÔNG TIN HỌC PHẦN & ĐỀ TÀI
- **Đề tài:** Xây dựng Hệ thống Quản lý Sự kiện & Phân phối Vé điện tử tích hợp Check-in QR Code (EventHub)
- **Đơn vị đào tạo:** Trường Đại học Công nghệ Thông tin & Truyền thông - Đại học Thái Nguyên (ICTU)
- **Cố vấn chuyên môn:** TS. Vũ Việt Dũng
- **Sinh viên thực hiện:** **Lô Quốc Khánh**
- **Mã số sinh viên (MSSV):** `DTC245200125`

---

## 📖 1. TỔNG QUAN HỆ THỐNG
**EventHub** là một nền tảng Web Application Fullstack hiện đại, giải quyết toàn diện bài toán tổ chức và quản lý sự kiện quy mô lớn trong môi trường đại học và doanh nghiệp. Hệ thống tối ưu hóa toàn bộ vòng đời của một sự kiện: từ khâu khởi tạo, phê duyệt, mở bán vé trực tuyến, phát hành vé điện tử định danh QR Code độc nhất, cho đến khâu quét mã check-in thời gian thực tại cổng và xuất báo cáo thống kê doanh thu.

### 🌟 Các Điểm Sáng Đạt Chuẩn Đánh Giá:
1. **Ứng dụng thực thụ & Cơ sở dữ liệu quan hệ:** Xây dựng fullstack bằng Next.js App Router, Prisma ORM và SQLite (`prisma/dev.db`), chuẩn hóa cấu trúc dữ liệu quan hệ (Users, Events, TicketTiers, Orders, Tickets, Reviews).
2. **Kiểm soát truy cập dựa trên vai trò (RBAC):** Phân chia rõ ràng 3 phân hệ người dùng độc lập: **Quản trị viên (Admin)**, **Ban Tổ Chức (Organizer)**, và **Khán Giả / Sinh Viên (Attendee)**.
3. **Mã vé QR Code định danh & Check-in thời gian thực:** Mỗi vé phát hành được cấp một mã Token và mã QR Code riêng biệt. Ban tổ chức sử dụng camera hoặc máy quét để điểm danh tức thì, chống vé trùng lặp hoặc vé giả mạo.
4. **Tiện ích 1-Click Demo Switcher:** Tích hợp thanh chuyển đổi nhanh tài khoản mẫu ở đầu trang web, giúp Thầy/Cô và Hội đồng chấm thi dễ dàng trải nghiệm cả 3 vai trò chỉ bằng một cú nhấp chuột.

---

## 👥 2. PHÂN QUYỀN VÀ CÁC PHÂN HỆ CHỨC NĂNG

### 👑 2.1. Phân Hệ Quản Trị Viên (Admin)
- **Bảng điều khiển (Dashboard Tổng quan):** Thống kê số lượng sự kiện, tổng doanh thu toàn sàn, số vé đã phát hành, số lượng tài khoản đăng ký.
- **Duyệt sự kiện (Event Approval Workflow):** Xem xét thông tin sự kiện do Ban tổ chức gửi lên; kiểm duyệt nội dung, duyệt hoặc từ chối sự kiện.
- **Quản lý người dùng (User Management):** Xem danh sách tài khoản, tìm kiếm, phân quyền (Admin / Organizer / Attendee), kích hoạt hoặc khóa tài khoản vi phạm.

### 🎪 2.2. Phân Hệ Ban Tổ Chức (Organizer)
- **Quản lý sự kiện:** Tạo mới và chỉnh sửa sự kiện với đầy đủ thông tin: banner, thời gian bắt đầu/kết thúc, địa điểm, danh mục, mô tả chi tiết.
- **Cấu hình đa hạng vé (Multi-tier Tickets):** Linh hoạt thiết lập nhiều loại vé cho một sự kiện (VIP, Tiêu chuẩn, Miễn phí) với số lượng và đơn giá khác nhau.
- **Quét mã QR Check-in điểm danh:** Phân hệ quét mã QR trực tiếp qua camera thiết bị để kiểm tra tính hợp lệ của vé và cập nhật trạng thái tham dự thời gian thực.
- **Báo cáo & Xuất file Excel/CSV:** Theo dõi doanh thu, tỷ lệ lấp đầy chỗ và xuất danh sách người tham gia ra file CSV chuẩn UTF-8 BOM.

### 🎟️ 2.3. Phân Hệ Khán Giả / Sinh Viên (Attendee)
- **Khám phá sự kiện:** Tìm kiếm thông minh theo từ khóa, lọc theo danh mục, địa điểm, khoảng giá và trạng thái sự kiện.
- **Đặt vé & Cổng thanh toán giả lập:** Quy trình đặt vé đa hạng, thanh toán trực quan với thời gian phản hồi tức thì.
- **Ví vé điện tử (My Tickets):** Lưu trữ vé đã mua kèm mã QR Code chất lượng cao, hỗ trợ in vé hoặc lưu về thiết bị.
- **Đánh giá & Bình luận (Rating & Reviews):** Chấm điểm sao và gửi nhận xét cảm nhận sau khi tham dự sự kiện.

---

## 🔑 3. THÔNG TIN TÀI KHOẢN MẪU DÀNH CHO GIẢNG VIÊN CHẤM ĐIỂM

*(Thầy/Cô có thể sử dụng thanh Demo Bar trên đầu màn hình để chuyển nhanh không cần gõ mật khẩu)*

| Vai Trò | Họ Tên Hiển Thị | Email Đăng Nhập | Mật Khẩu | Quyền Hạn Trải Nghiệm |
| :--- | :--- | :--- | :--- | :--- |
| **👑 ADMIN** | Lô Quốc Khánh (Admin) | `admin@eventhub.vn` | `admin123` | Quản trị toàn hệ thống, duyệt sự kiện, quản lý người dùng |
| **🎪 ORGANIZER** | Ban Tổ Chức ICTU | `organizer@eventhub.vn` | `organizer123` | Tạo sự kiện, xem doanh thu, quét QR Check-in, xuất CSV |
| **🎟️ ATTENDEE** | Nguyễn Văn An | `attendee@eventhub.vn` | `user123` | Mua vé, nhận mã QR định danh, xem vé điện tử, đánh giá |

---

## 🚀 4. HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY HỆ THỐNG

### Cách 1: Khởi chạy 1-Click trên Windows (Khuyên Dùng)
Nhấp đúp chuột vào tệp:
```bash
CHAY_DU_AN_EVENTHUB.bat
```
Kịch bản sẽ tự động định vị thư mục, kích hoạt máy chủ Next.js và mở trình duyệt web tại `http://localhost:3000`.

---

### Cách 2: Khởi chạy thủ công qua Terminal

#### Bước 1: Sao chép dự án về máy tính
```bash
git clone https://github.com/quockhanh-bit/EventHub-ICTU.git
cd EventHub-ICTU
```

#### Bước 2: Cài đặt các gói phụ thuộc
```bash
npm install
```

#### Bước 3: Thiết lập biến môi trường
Tạo tệp `.env` (nếu chưa có) dựa trên `.env.example`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="eventhub_super_secret_jwt_key_2026_antigravity"
```

#### Bước 4: Khởi tạo và nạp dữ liệu mẫu ban đầu (Database Seed)
```bash
npm run db:push
npm run db:seed
```

#### Bước 5: Khởi động máy chủ phát triển
```bash
npm run dev
```

Mở trình duyệt và truy cập: **[http://localhost:3000](http://localhost:3000)**

---

## 📂 5. CẤU TRÚC THƯ MỤC NGUỒN (PROJECT ARCHITECTURE)

```plaintext
EventHub-ICTU/
├── CHAY_DU_AN_EVENTHUB.bat      # Script khởi chạy nhanh 1-Click cho Windows
├── HUONG_DAN_SU_DUNG.md         # Hướng dẫn vận hành và kịch bản demo chi tiết
├── README.md                    # Tài liệu tổng quan dự án báo cáo
├── package.json                 # Cấu hình dự án và dependencies
├── tsconfig.json                # Cấu hình TypeScript
├── prisma/
│   ├── schema.prisma            # Schema cơ sở dữ liệu quan hệ SQLite
│   ├── dev.db                   # Tệp CSDL SQLite đã nạp sẵn dữ liệu demo
│   └── seed.ts                  # Kịch bản nạp dữ liệu mẫu tự động
└── src/
    ├── app/                     # Next.js App Router (Pages & API Routes)
    │   ├── api/                 # Backend REST API endpoints
    │   │   ├── auth/            # Xác thực, JWT cookie, login/register
    │   │   ├── checkin/         # API quét & xác thực mã QR Check-in
    │   │   ├── events/          # API CRUD sự kiện, duyệt sự kiện
    │   │   ├── orders/          # API xử lý đặt vé & thanh toán
    │   │   └── users/           # API quản trị tài khoản người dùng
    │   ├── admin/               # Giao diện dành riêng cho Admin
    │   ├── organizer/           # Giao diện Ban Tổ Chức (QR Scanner, CSV export)
    │   ├── events/              # Chi tiết sự kiện & đặt vé
    │   ├── my-tickets/          # Trang ví vé điện tử cá nhân
    │   └── page.tsx             # Trang chủ hệ thống
    ├── components/              # Các UI Components tái sử dụng
    └── lib/                     # Thư viện dùng chung (Prisma Client, JWT, Auth helpers)
```

---

## 🛠️ 6. CÔNG NGHỆ ÁP DỤNG (TECH STACK)
- **Frontend & Backend Framework:** [Next.js 16 (Turbopack, App Router)](https://nextjs.org)
- **Ngôn ngữ lập trình:** [TypeScript 5](https://www.typescriptlang.org)
- **Giao diện & Styling:** [Tailwind CSS 4](https://tailwindcss.com), [Lucide React](https://lucide.dev)
- **Cơ sở dữ liệu & ORM:** [SQLite](https://www.sqlite.org) & [Prisma ORM 6](https://www.prisma.io)
- **Bảo mật & Mã hóa:** [BcryptJS](https://www.npmjs.com/package/bcryptjs) (Hash mật khẩu an toàn), [Jose](https://github.com/panva/jose) (JWT Stateless Token)
- **Tiện ích mở rộng:** [QRCode](https://www.npmjs.com/package/qrcode) (Tạo QR động), [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti) (Hiệu ứng chúc mừng khi đặt vé thành công)

---

## 👨‍💻 TÁC GIẢ & BẢN QUYỀN
- **Sinh viên:** Lô Quốc Khánh (MSSV: `DTC245200125`)
- **Khoa / Ngành:** Công nghệ Thông tin - Trường Đại học CNTT & Truyền thông (ICTU)
- **Email:** `hua09820@gmail.com`
- **GitHub:** [@quockhanh-bit](https://github.com/quockhanh-bit)
- **Repository:** [https://github.com/quockhanh-bit/EventHub-ICTU](https://github.com/quockhanh-bit/EventHub-ICTU)
