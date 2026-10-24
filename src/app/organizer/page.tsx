"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Ticket,
  DollarSign,
  QrCode,
  PlusCircle,
  Users,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface OrganizerStats {
  totalMyEvents: number;
  totalBookings: number;
  totalRevenue: number;
  totalTickets: number;
  checkedInTickets: number;
  checkInRate: number;
}

interface TicketTier {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
}

interface MyEvent {
  id: string;
  title: string;
  slug: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  location: string;
  status: string;
  category?: { name: string; color?: string };
  ticketTiers: TicketTier[];
  _count: { bookings: number; reviews: number };
}

export default function OrganizerDashboard() {
  const { user, loading: authLoading, switchDemoRole } = useAuth();
  const [stats, setStats] = useState<OrganizerStats | null>(null);
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("/api/organizer/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
        if (data.events) setEvents(data.events);
      })
      .catch((err) => console.error("Organizer stats error:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Đang kiểm tra quyền hạn...</p>
      </div>
    );
  }

  const isOrganizerOrAdmin = user?.role === "ORGANIZER" || user?.role === "ADMIN";

  if (!isOrganizerOrAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Khu Vực Ban Tổ Chức</h2>
          <p className="text-sm text-slate-500">
            Bạn cần đăng nhập với vai trò <strong>Ban Tổ Chức (Organizer)</strong> hoặc <strong>Admin</strong> để truy cập bảng điều khiển này.
          </p>
        </div>

        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-2">
          <p className="font-semibold">Chuyển nhanh sang tài khoản Ban Tổ Chức:</p>
          <button
            onClick={() => switchDemoRole("ORGANIZER")}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow cursor-pointer transition-all"
          >
            Đăng nhập Ban Tổ Chức (Đoàn Hội ICTU)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Bảng Điều Khiển Quản Lý
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Ban Tổ Chức Sự Kiện
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đơn vị: <strong className="text-slate-800">{user.organization || user.name}</strong> • Tài khoản: {user.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/organizer/check-in"
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <QrCode className="w-4 h-4 text-blue-600" />
            <span>Mở Quét QR Check-in</span>
          </Link>

          <Link
            href="/organizer/events/new"
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Tạo Sự Kiện Mới</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Sự Kiện Của Tôi</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats?.totalMyEvents || 0}
          </p>
          <span className="text-xs text-slate-500 block">Chương trình đã tạo</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Số Vé Đã Bán</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">
            {stats?.totalTickets || 0}
          </p>
          <span className="text-xs text-emerald-600 font-semibold block">
            {stats?.totalBookings || 0} đơn đặt vé
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Tổng Doanh Thu</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-700">
            {(stats?.totalRevenue || 0).toLocaleString("vi-VN")} ₫
          </p>
          <span className="text-xs text-slate-500 block">Thanh toán hoàn tất</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Tỷ Lệ Check-in</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-700">
            {stats?.checkInRate || 0}%
          </p>
          <span className="text-xs text-slate-500 block">
            {stats?.checkedInTickets || 0}/{stats?.totalTickets || 0} vé đã vào cổng
          </span>
        </div>
      </div>

      {/* Events Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Danh Sách Sự Kiện</h3>
            <p className="text-xs text-slate-500">
              Quản lý tiến độ bán vé, phê duyệt và người tham gia
            </p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
            {events.length} sự kiện
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Đang tải dữ liệu...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-slate-500 text-sm">Bạn chưa tạo sự kiện nào trên hệ thống.</p>
            <Link
              href="/organizer/events/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tạo sự kiện đầu tiên</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Tên Sự Kiện</th>
                  <th className="px-6 py-4">Thời Gian</th>
                  <th className="px-6 py-4">Vé Đã Bán</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => {
                  const totalCapacity = ev.ticketTiers.reduce((a, b) => a + b.quantity, 0);
                  const totalSold = ev.ticketTiers.reduce((a, b) => a + b.sold, 0);

                  return (
                    <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={ev.bannerImage}
                              alt={ev.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/events/${ev.slug || ev.id}`}
                              className="font-bold text-slate-900 hover:text-blue-600 line-clamp-1 max-w-[260px]"
                            >
                              {ev.title}
                            </Link>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {ev.category?.name || "Chưa phân loại"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">
                          {new Date(ev.startDate).toLocaleDateString("vi-VN")}
                        </span>
                        <span className="text-slate-400 block text-[11px]">
                          {new Date(ev.startDate).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-800">
                            {totalSold} / {totalCapacity} vé
                          </span>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{
                                width: `${
                                  totalCapacity > 0
                                    ? Math.min(100, (totalSold / totalCapacity) * 100)
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            ev.status === "PUBLISHED"
                              ? "bg-emerald-100 text-emerald-800"
                              : ev.status === "PENDING_APPROVAL"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {ev.status === "PUBLISHED" && <CheckCircle2 className="w-3 h-3" />}
                          {ev.status === "PENDING_APPROVAL" && <Clock className="w-3 h-3" />}
                          <span>
                            {ev.status === "PUBLISHED"
                              ? "Đã Xuất Bản"
                              : ev.status === "PENDING_APPROVAL"
                              ? "Chờ Admin Duyệt"
                              : ev.status}
                          </span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/organizer/events/${ev.id}`}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold text-[11px] transition-colors"
                          >
                            Người Dự & Xuất File
                          </Link>
                          <Link
                            href={`/events/${ev.slug || ev.id}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Xem trang công khai"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
