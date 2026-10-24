"use client";

import React, { useEffect, useState } from "react";
import { X, Printer, CheckCircle, Clock, MapPin, Calendar, QrCode } from "lucide-react";

interface TicketData {
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
    benefits?: string | null;
  };
  booking: {
    bookingCode: string;
    event: {
      title: string;
      startDate: string;
      endDate: string;
      location: string;
      bannerImage: string;
    };
  };
}

export default function TicketModal({
  ticketCode,
  isOpen,
  onClose,
}: {
  ticketCode: string | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticketCode || !isOpen) return;

    setLoading(true);
    fetch(`/api/tickets/${ticketCode}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ticket) {
          setTicket(data.ticket);
          setQrDataUrl(data.qrDataUrl);
        }
      })
      .catch((err) => console.error("Ticket fetch error:", err))
      .finally(() => setLoading(false));
  }, [ticketCode, isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 print:shadow-none print:border-none print:w-full print:max-w-none">
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors print:hidden"
        >
          <X className="w-4 h-4" />
        </button>

        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-500 font-medium">Đang tạo mã QR vé điện tử...</p>
          </div>
        ) : !ticket ? (
          <div className="p-10 text-center space-y-4">
            <p className="text-rose-600 font-semibold">Không tìm thấy thông tin vé</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-white text-xs rounded-xl"
            >
              Đóng
            </button>
          </div>
        ) : (
          <div className="printable-ticket">
            {/* Ticket Header Graphic */}
            <div className="relative aspect-[21/9] w-full bg-slate-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ticket.booking.event.bannerImage}
                alt={ticket.booking.event.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute bottom-3 left-5 right-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-700/50">
                  VÉ ĐIỆN TỬ CHÍNH THỨC
                </span>
                <h3 className="text-white font-extrabold text-base line-clamp-1 mt-1">
                  {ticket.booking.event.title}
                </h3>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-6 space-y-5">
              {/* Check-In Status Banner */}
              <div
                className={`p-3 rounded-2xl flex items-center justify-between border ${
                  ticket.isCheckedIn
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-blue-50 border-blue-200 text-blue-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {ticket.isCheckedIn ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-600 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-bold">
                      {ticket.isCheckedIn ? "VÉ ĐÃ CHECK-IN TẠI CỔNG" : "VÉ HỢP LỆ (SẴN SÀNG CHECK-IN)"}
                    </p>
                    {ticket.isCheckedIn && ticket.checkedInAt && (
                      <p className="text-[11px] text-emerald-600">
                        Vào cổng lúc: {new Date(ticket.checkedInAt).toLocaleString("vi-VN")}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold bg-white/80 px-2 py-1 rounded-md border border-slate-200">
                  {ticket.ticketTier.name}
                </span>
              </div>

              {/* QR Code Presentation */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center space-y-3">
                <p className="text-xs text-slate-500 font-medium">
                  Đưa mã QR này cho Ban Tổ Chức tại cổng để điểm danh check-in
                </p>

                <div className="inline-block p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt={`QR Code ${ticket.ticketCode}`}
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
                    Mã Vé Định Danh
                  </span>
                  <p className="font-mono text-lg font-black text-slate-900 tracking-wider">
                    {ticket.ticketCode}
                  </p>
                </div>
              </div>

              {/* Ticket Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Người tham gia</span>
                  <span className="font-bold text-slate-900 text-sm">{ticket.attendeeName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Hạng vé</span>
                  <span className="font-bold text-indigo-700 text-sm">{ticket.ticketTier.name}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-100 flex items-start gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    {new Date(ticket.booking.event.startDate).toLocaleString("vi-VN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="col-span-2 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-700">{ticket.booking.event.location}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions (Hidden on Print) */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In Vé / Lưu PDF</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
