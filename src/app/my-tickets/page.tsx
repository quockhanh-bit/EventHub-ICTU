"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import TicketModal from "@/components/TicketModal";
import {
  Ticket,
  QrCode,
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  Printer,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

interface TicketItem {
  id: string;
  ticketCode: string;
  attendeeName: string;
  attendeeEmail: string;
  isCheckedIn: boolean;
  checkedInAt?: string | null;
  ticketTier: {
    name: string;
    price: number;
  };
}

interface BookingItem {
  id: string;
  bookingCode: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
    slug: string;
    bannerImage: string;
    startDate: string;
    endDate: string;
    location: string;
  };
  tickets: TicketItem[];
}

export default function MyTicketsPage() {
  const { user, loading: authLoading, switchDemoRole } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicketCode, setSelectedTicketCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "CHECKED_IN" | "UNCHECKED">("ALL");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.bookings) {
          setBookings(data.bookings);
        }
      })
      .catch((err) => console.error("Bookings fetch error:", err))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Đang kiểm tra thông tin tài khoản...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
          <Ticket className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Vé Điện Tử Của Bạn</h2>
          <p className="text-sm text-slate-500">
            Vui lòng đăng nhập để xem danh sách vé sự kiện và mã QR Check-in bạn đã đặt.
          </p>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
          <p className="font-semibold">Đăng nhập nhanh để trải nghiệm:</p>
          <button
            onClick={() => switchDemoRole("ATTENDEE")}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow cursor-pointer transition-all"
          >
            Đăng nhập tài khoản Khán Giả mẫu (Nguyễn Văn An)
          </button>
        </div>

        <div className="flex justify-center gap-3">
          <Link
            href="/login"
            className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
          >
            Đăng Nhập
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
          >
            Đăng Ký Mới
          </Link>
        </div>
      </div>
    );
  }

  // Flatten tickets with booking and event context
  const allTickets = bookings.flatMap((b) =>
    b.tickets.map((t) => ({
      ...t,
      bookingCode: b.bookingCode,
      bookingCreatedAt: b.createdAt,
      paymentMethod: b.paymentMethod,
      event: b.event,
    }))
  );

  const filteredTickets = allTickets.filter((t) => {
    if (filter === "CHECKED_IN") return t.isCheckedIn;
    if (filter === "UNCHECKED") return !t.isCheckedIn;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Vé Điện Tử & Điểm Danh
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Vé Sự Kiện Của Tôi ({allTickets.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tài khoản: <strong className="text-slate-800">{user.name}</strong> ({user.email})
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            }`}
          >
            Tất cả ({allTickets.length})
          </button>
          <button
            onClick={() => setFilter("UNCHECKED")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === "UNCHECKED" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"
            }`}
          >
            Sẵn sàng ({allTickets.filter((t) => !t.isCheckedIn).length})
          </button>
          <button
            onClick={() => setFilter("CHECKED_IN")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === "CHECKED_IN" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
            }`}
          >
            Đã Check-in ({allTickets.filter((t) => t.isCheckedIn).length})
          </button>
        </div>
      </div>

      {/* Ticket List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-200/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {filter === "ALL"
              ? "Bạn chưa có vé sự kiện nào"
              : "Không có vé nào trong trạng thái này"}
          </h3>
          <p className="text-xs text-slate-500">
            Hãy khám phá các sự kiện thú vị và đặt vé ngay hôm nay!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-md"
          >
            <span>Khám phá sự kiện ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredTickets.map((t) => {
            const startDate = new Date(t.event.startDate);

            return (
              <div
                key={t.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between"
              >
                {/* Event Thumbnail & Basic Info */}
                <div className="flex flex-col sm:flex-row gap-5 p-5 md:p-6 flex-1">
                  <div className="w-full sm:w-44 h-36 rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.event.bannerImage}
                      alt={t.event.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-md">
                      {t.ticketTier.name}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
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
                            <span>Sẵn sàng Check-in</span>
                          </>
                        )}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Đơn: {t.bookingCode}
                      </span>
                    </div>

                    <Link href={`/events/${t.event.slug || t.event.id}`}>
                      <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2">
                        {t.event.title}
                      </h3>
                    </Link>

                    <div className="space-y-1 text-xs text-slate-500 pt-1">
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {startDate.toLocaleDateString("vi-VN", {
                            weekday: "short",
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          })}{" "}
                          • {startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="line-clamp-1">{t.event.location}</span>
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-3 text-xs">
                      <span className="text-slate-400">Người dự:</span>
                      <strong className="text-slate-800">{t.attendeeName}</strong>
                    </div>
                  </div>
                </div>

                {/* Right Action Block: QR Code Preview & Buttons */}
                <div className="bg-slate-50 p-5 md:p-6 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col justify-between items-center sm:items-end gap-4 min-w-[220px]">
                  <div className="text-center sm:text-right w-full">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Mã Vé Cá Nhân
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      {t.ticketCode}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={() => setSelectedTicketCode(t.ticketCode)}
                      className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Xem Mã QR Vào Cổng</span>
                    </button>
                    <button
                      onClick={() => setSelectedTicketCode(t.ticketCode)}
                      className="w-full py-2 px-4 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>In / Tải Vé</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal */}
      <TicketModal
        ticketCode={selectedTicketCode}
        isOpen={Boolean(selectedTicketCode)}
        onClose={() => setSelectedTicketCode(null)}
      />
    </div>
  );
}
