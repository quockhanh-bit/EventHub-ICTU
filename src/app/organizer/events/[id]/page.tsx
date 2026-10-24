"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState, use } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  QrCode,
  Download,
  Search,
  CheckCircle,
  Clock,
  ArrowLeft,
  Calendar,
  Ticket,
} from "lucide-react";
import Link from "next/link";

interface TicketItem {
  id: string;
  ticketCode: string;
  attendeeName: string;
  attendeeEmail: string;
  isCheckedIn: boolean;
  checkedInAt?: string | null;
  checkedInBy?: string | null;
  ticketTier: {
    name: string;
    price: number;
  };
  booking: {
    bookingCode: string;
    customerPhone?: string | null;
    createdAt: string;
    paymentMethod: string;
  };
}

export default function EventAttendeesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { user } = useAuth();

  const [eventTitle, setEventTitle] = useState("");
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "CHECKED_IN" | "UNCHECKED">("ALL");

  const loadData = () => {
    fetch(`/api/organizer/events/${resolvedParams.id}/attendees`)
      .then((res) => res.json())
      .then((data) => {
        if (data.event) setEventTitle(data.event.title);
        if (data.tickets) setTickets(data.tickets);
      })
      .catch((err) => console.error("Attendees error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [resolvedParams.id]);

  const handleManualCheckIn = async (code: string) => {
    try {
      const res = await fetch("/api/tickets/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, eventId: resolvedParams.id }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Check-in thành công cho ${data.ticket.attendeeName}!`);
        loadData(); // reload table
      } else {
        alert(data.error || "Không thể check-in");
      }
    } catch {
      alert("Lỗi kết nối");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (tickets.length === 0) return;

    const headers = [
      "Mã Vé",
      "Mã Đơn",
      "Họ Tên",
      "Email",
      "Số Điện Thoại",
      "Hạng Vé",
      "Giá Vé (VNĐ)",
      "Trạng Thái Check-in",
      "Thời Gian Vào Cổng",
    ];

    const rows = tickets.map((t) => [
      `"${t.ticketCode}"`,
      `"${t.booking.bookingCode}"`,
      `"${t.attendeeName}"`,
      `"${t.attendeeEmail}"`,
      `"${t.booking.customerPhone || ""}"`,
      `"${t.ticketTier.name}"`,
      t.ticketTier.price,
      `"${t.isCheckedIn ? "Đã Check-in" : "Chưa Check-in"}"`,
      `"${t.checkedInAt ? new Date(t.checkedInAt).toLocaleString("vi-VN") : ""}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `DanhSach_ThamGia_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      !search ||
      t.attendeeName.toLowerCase().includes(search.toLowerCase()) ||
      t.attendeeEmail.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketCode.toLowerCase().includes(search.toLowerCase()) ||
      t.booking.bookingCode.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "CHECKED_IN" && t.isCheckedIn) ||
      (statusFilter === "UNCHECKED" && !t.isCheckedIn);

    return matchesSearch && matchesStatus;
  });

  const checkedInCount = tickets.filter((t) => t.isCheckedIn).length;
  const checkInRate = tickets.length > 0 ? Math.round((checkedInCount / tickets.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/organizer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Quản lý BTC</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 line-clamp-1">
            {eventTitle || "Danh Sách Khán Giả & Vé"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Theo dõi danh sách tham dự, xuất file báo cáo và thao tác điểm danh thủ công.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/organizer/check-in"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Mở Camera Quét QR</span>
          </Link>

          <button
            onClick={handleExportCSV}
            disabled={tickets.length === 0}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Xuất File Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Tổng Vé Đã Phát Hành</span>
          <p className="text-2xl font-black text-slate-900">{tickets.length} vé</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-emerald-600 uppercase">Đã Vào Cổng (Check-in)</span>
          <p className="text-2xl font-black text-emerald-600">{checkedInCount} người</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-blue-600 uppercase">Tỷ Lệ Tham Dự</span>
          <p className="text-2xl font-black text-blue-600">{checkInRate}%</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm tên, email, mã vé, mã đơn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              statusFilter === "ALL" ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600"
            }`}
          >
            Tất cả ({tickets.length})
          </button>
          <button
            onClick={() => setStatusFilter("CHECKED_IN")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              statusFilter === "CHECKED_IN"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Đã Check-in ({checkedInCount})
          </button>
          <button
            onClick={() => setStatusFilter("UNCHECKED")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              statusFilter === "UNCHECKED"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            Chưa Check-in ({tickets.length - checkedInCount})
          </button>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Đang tải danh sách người tham gia...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Không tìm thấy bản ghi người tham gia nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Mã Vé & Đơn Hàng</th>
                  <th className="px-5 py-3.5">Khán Giả</th>
                  <th className="px-5 py-3.5">Hạng Vé</th>
                  <th className="px-5 py-3.5">Trạng Thái Vào Cổng</th>
                  <th className="px-5 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-slate-900 block">
                        {t.ticketCode}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Đơn: {t.booking.bookingCode}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <strong className="text-slate-800 text-xs block">{t.attendeeName}</strong>
                      <span className="text-[11px] text-slate-500">{t.attendeeEmail}</span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-indigo-700 block">
                        {t.ticketTier.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {t.ticketTier.price === 0
                          ? "Miễn phí"
                          : `${t.ticketTier.price.toLocaleString("vi-VN")} ₫`}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center gap-1 ${
                          t.isCheckedIn
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {t.isCheckedIn ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Đã Check-in</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span>Chưa Check-in</span>
                          </>
                        )}
                      </span>
                      {t.checkedInAt && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {new Date(t.checkedInAt).toLocaleTimeString("vi-VN")}{" "}
                          {new Date(t.checkedInAt).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {!t.isCheckedIn && (
                        <button
                          onClick={() => handleManualCheckIn(t.ticketCode)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                        >
                          Check-in Ngay
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
