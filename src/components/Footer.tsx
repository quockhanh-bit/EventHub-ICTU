import React from "react";
import Link from "next/link";
import { Calendar, Database, ShieldCheck, QrCode, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: System Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">EventHub</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Hệ thống quản lý, tổ chức và phân phối vé sự kiện toàn diện với công nghệ mã QR Check-in thời gian thực và phân quyền đa cấp.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SQLite CSDL Kết Nối Sẵn Sàng
            </div>
          </div>

          {/* Col 2: Course Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Thông Tin Đơn Vị</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-slate-300 font-medium">Hệ Thống Quản Lý Sự Kiện & Vé Điện Tử</li>
              <li className="text-slate-400">Đơn vị: <span className="text-cyan-400 font-medium">ĐH CNTT & Truyền Thông Thái Nguyên (ICTU)</span></li>
              <li className="text-slate-400">Quản trị viên: <span className="text-emerald-400 font-bold">Lô Quốc Khánh</span></li>
              <li className="text-slate-400">Cố vấn chuyên môn: <span className="text-amber-300 font-semibold">TS. Vũ Việt Dũng</span></li>
              <li className="text-slate-400">Cơ sở dữ liệu: <span className="text-indigo-400">SQLite (dev.db)</span></li>
            </ul>
          </div>

          {/* Col 3: Role Capabilities */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Phân Quyền Hệ Thống</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Admin: Quản trị, duyệt sự kiện, báo cáo</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Ban Tổ Chức: Tạo sự kiện, quản lý vé</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Camera: Quét mã QR Check-in thời gian thực</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Khán Giả: Đặt vé, tải vé QR, đánh giá sao</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Công Nghệ Xây Dựng</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded-md text-slate-300">Next.js 16 (App Router)</span>
              <span className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded-md text-slate-300">Prisma ORM</span>
              <span className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded-md text-slate-300">SQLite Database</span>
              <span className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded-md text-slate-300">Tailwind CSS</span>
              <span className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded-md text-slate-300">TypeScript</span>
              <span className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-800 rounded-md text-slate-300">JWT / Bcrypt</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 EventHub - Nền Tảng Quản Lý Sự Kiện Trường ĐH CNTT & Truyền Thông Thái Nguyên (ICTU).</p>
          <div className="flex items-center gap-1">
            <span>Ứng dụng Web Fullstack chuẩn mực</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>Chạy độc lập kèm CSDL nội bộ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
