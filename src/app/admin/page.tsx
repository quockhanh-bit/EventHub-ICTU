"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  Users,
  Calendar,
  Ticket,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Lock,
  Unlock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  pendingEvents: number;
  totalBookings: number;
  totalRevenue: number;
  totalTickets: number;
  checkedInTickets: number;
  checkInRate: number;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
  status: "ACTIVE" | "BANNED";
  organization?: string | null;
  createdAt: string;
  _count: {
    events: number;
    bookings: number;
  };
}

interface PendingEvent {
  id: string;
  title: string;
  slug: string;
  bannerImage: string;
  shortDesc: string;
  startDate: string;
  location: string;
  status: string;
  organizer: {
    name: string;
    organization?: string | null;
  };
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading, switchDemoRole } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "APPROVALS" | "USERS">("OVERVIEW");

  const loadAdminData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
      fetch("/api/events?status=PENDING_APPROVAL").then((r) => r.json()),
    ])
      .then(([statsData, usersData, eventsData]) => {
        if (statsData.stats) setStats(statsData.stats);
        if (usersData.users) setUsersList(usersData.users);
        if (eventsData.events) setPendingEvents(eventsData.events);
      })
      .catch((err) => console.error("Admin data load error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleApproveEvent = async (eventId: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/admin/events/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, action }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        loadAdminData();
      } else {
        alert(data.error || "Lỗi xử lý duyệt");
      }
    } catch {
      alert("Lỗi kết nối máy chủ");
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch {
      alert("Lỗi cập nhật vai trò");
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch {
      alert("Lỗi cập nhật trạng thái");
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Đang xác thực quyền Quản trị viên...</p>
      </div>
    );
  }

  if (user?.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-3xl flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Khu Vực Quản Trị Hệ Thống (Admin)</h2>
          <p className="text-sm text-slate-500">
            Bạn cần quyền <strong>Quản Trị Viên (Admin)</strong> để truy cập chức năng này.
          </p>
        </div>

        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 space-y-2">
          <p className="font-semibold">Chuyển nhanh sang tài khoản Quản trị viên:</p>
          <button
            onClick={() => switchDemoRole("ADMIN")}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow cursor-pointer transition-all"
          >
            Đăng nhập tài khoản Admin (Lô Quốc Khánh)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Trung Tâm Quản Trị Hệ Thống Toàn Quyền</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Admin Management Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Xin chào, <strong className="text-slate-800">{user.name}</strong> • Giám sát dữ liệu, duyệt sự kiện và phân quyền thành viên.
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("OVERVIEW")}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "OVERVIEW"
                ? "bg-white text-purple-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tổng Quan
          </button>
          <button
            onClick={() => setActiveTab("APPROVALS")}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "APPROVALS"
                ? "bg-white text-purple-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Duyệt Sự Kiện</span>
            {pendingEvents.length > 0 && (
              <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px]">
                {pendingEvents.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("USERS")}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === "USERS"
                ? "bg-white text-purple-800 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Người Dùng ({usersList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Tổng Thành Viên</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats?.totalUsers || 0}
              </p>
              <span className="text-xs text-slate-500 block">Đang hoạt động trên CSDL</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Sự Kiện Toàn Sàn</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats?.totalEvents || 0}
              </p>
              <span className="text-xs text-amber-600 font-bold block">
                {stats?.pendingEvents || 0} sự kiện đang chờ duyệt
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Tổng Doanh Thu</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700">
                {(stats?.totalRevenue || 0).toLocaleString("vi-VN")} ₫
              </p>
              <span className="text-xs text-slate-500 block">
                {stats?.totalBookings || 0} đơn thanh toán
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Vé & Tỷ Lệ Check-in</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Ticket className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-indigo-700">
                {stats?.checkInRate || 0}%
              </p>
              <span className="text-xs text-slate-500 block">
                {stats?.checkedInTickets || 0}/{stats?.totalTickets || 0} vé đã quét QR
              </span>
            </div>
          </div>

          {/* Pending Events Quick Banner if any */}
          {pendingEvents.length > 0 && (
            <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Clock className="w-5 h-5" />
                  <span>Có {pendingEvents.length} sự kiện mới đang chờ bạn kiểm duyệt!</span>
                </div>
                <p className="text-xs text-white/90">
                  Xem nội dung và phê duyệt để sự kiện hiển thị công khai trên cổng thông tin người dùng.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("APPROVALS")}
                className="px-5 py-2.5 bg-white text-amber-900 rounded-xl font-bold text-xs shadow cursor-pointer transition-all hover:bg-amber-50 whitespace-nowrap"
              >
                Chuyển Đến Mục Duyệt Ngay ↗
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPROVALS */}
      {activeTab === "APPROVALS" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Danh Sách Sự Kiện Chờ Phê Duyệt ({pendingEvents.length})
              </h3>
              <p className="text-xs text-slate-500">
                Ban Quản trị xem xét nội dung, địa điểm và hình ảnh trước khi cho phép mở bán
              </p>
            </div>
          </div>

          {pendingEvents.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Tuyệt vời! Không còn sự kiện nào đang chờ duyệt.
              </p>
              <p className="text-xs text-slate-400">
                Tất cả các sự kiện gửi lên đã được xử lý xong.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingEvents.map((pe) => (
                <div key={pe.id} className="p-6 flex flex-col md:flex-row gap-6 items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pe.bannerImage}
                        alt={pe.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Chờ Kiểm Duyệt
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{pe.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 max-w-xl">{pe.shortDesc}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                        <span>
                          Đơn vị: <strong>{pe.organizer.organization || pe.organizer.name}</strong>
                        </span>
                        <span>
                          Thời gian: <strong>{new Date(pe.startDate).toLocaleDateString("vi-VN")}</strong>
                        </span>
                        <span>Địa điểm: {pe.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleApproveEvent(pe.id, "APPROVE")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Phê Duyệt Sự Kiện</span>
                    </button>
                    <button
                      onClick={() => handleApproveEvent(pe.id, "REJECT")}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Từ Chối</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USERS & RBAC */}
      {activeTab === "USERS" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Quản Lý Người Dùng & Phân Quyền (RBAC)
              </h3>
              <p className="text-xs text-slate-500">
                Trao quyền Admin, Ban Tổ Chức (Organizer) hoặc Khán Giả (Attendee), kèm tính năng khóa tài khoản
              </p>
            </div>
            <span className="text-xs font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
              {usersList.length} tài khoản
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Người Dùng</th>
                  <th className="px-6 py-4">Đơn Vị / Tổ Chức</th>
                  <th className="px-6 py-4">Vai Trò (Role)</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <strong className="text-slate-900 font-bold text-xs block">{u.name}</strong>
                      <span className="text-slate-400 text-[11px]">{u.email}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-slate-700 font-medium">
                        {u.organization || "Cá nhân"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className={`font-bold text-xs px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800 border-purple-200"
                            : u.role === "ORGANIZER"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-emerald-100 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="ORGANIZER">ORGANIZER</option>
                        <option value="ATTENDEE">ATTENDEE</option>
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {u.status === "ACTIVE" ? "HOẠT ĐỘNG" : "ĐÃ KHÓA"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleToggleStatus(u.id, u.status)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer inline-flex items-center gap-1 ${
                            u.status === "ACTIVE"
                              ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {u.status === "ACTIVE" ? (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>Khóa</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3" />
                              <span>Mở Khóa</span>
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
