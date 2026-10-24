@echo off
chcp 65001 >nul
title HỆ THỐNG EVENTHUB - ICTU THÁI NGUYÊN (LÔ QUỐC KHÁNH)
color 0b

echo =========================================================================
echo    HỆ THỐNG QUẢN LÝ SỰ KIỆN & VÉ ĐIỆN TỬ (EVENTHUB)
echo    TRƯỜNG ĐẠI HỌC CNTT & TRUYỀN THÔNG THÁI NGUYÊN (ICTU)
echo    CỐ VẤN CHUYÊN MÔN    : TS. VŨ VIỆT DŨNG
echo    QUẢN TRỊ VIÊN HỆ THỐNG: LÔ QUỐC KHÁNH
echo =========================================================================
echo.
echo [1/3] Đang chuyển đến thư mục dự án...
cd /d "%~dp0"

echo [2/3] Đang mở trình duyệt vào trang web hệ thống...
start http://localhost:3000

echo [3/3] Đang kích hoạt máy chủ Web Next.js & CSDL SQLite...
echo.
echo * HƯỚNG DẪN TRẢI NGHIỆM HỆ THỐNG:
echo   - Giữ nguyên cửa sổ này để duy trì hoạt động của trang web.
echo   - Trên thanh đầu trang web có nút chuyển đổi nhanh vai trò:
echo     [Admin (Lô Quốc Khánh)] - [Ban Tổ Chức (Đoàn Hội ICTU)] - [Khán Giả]
echo   - Khi muốn dừng máy chủ, bạn chỉ cần đóng cửa sổ này lại.
echo =========================================================================
echo.

npm run dev
pause
