"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  QrCode,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  Sparkles,
  Users,
  Calendar,
  Clock,
  RotateCcw,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface CheckInLog {
  id: string;
  ticketCode: string;
  attendeeName: string;
  tierName: string;
  eventTitle: string;
  timestamp: string;
  status: "SUCCESS" | "ALREADY_CHECKED_IN" | "INVALID";
  message: string;
}

export default function CheckInPage() {
  const { user, switchDemoRole } = useAuth();
  const [ticketInput, setTicketInput] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [logs, setLogs] = useState<CheckInLog[]>([]);

  // Demo tickets ready for testing (ICTU Events)
  const demoTickets = [
    {
      code: "TCK-ICTU-MUSIC-088",
      label: "Vé Nhạc Hội Chào Tân SV (Chưa Check-in)",
      holder: "Nguyễn Văn An",
    },
    {
      code: "TCK-ICTU-MUSIC-089",
      label: "Vé Nhạc Hội Chào Tân SV 089 (Chưa Check-in)",
      holder: "Bạn Cùng Lớp",
    },
    {
      code: "TCK-ICTU-TECHFEST-001",
      label: "Vé ICTU TechFest (Đã Check-in trước đó)",
      holder: "Nguyễn Văn An",
    },
    {
      code: "TCK-ICTU-ESPORTS-012",
      label: "Vé E-Sports Chung Kết (Chưa Check-in)",
      holder: "Trần Thị Mai Linh",
    },
    {
      code: "TCK-INVALID-9999",
      label: "Vé Giả Mạo / Không Tồn Tại (Test Cảnh Báo Lỗi)",
      holder: "Người Lạ",
    },
  ];

  const handleCheckIn = async (codeToVerify?: string) => {
    const code = (codeToVerify || ticketInput).trim();
    if (!code) return;

    setLoading(true);
    setScanResult(null);

    try {
      const res = await fetch("/api/tickets/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok) {
        setScanResult({
          type: "SUCCESS",
          message: data.message,
          ticket: data.ticket,
        });

        setLogs((prev) => [
          {
            id: Date.now().toString(),
            ticketCode: data.ticket.ticketCode,
            attendeeName: data.ticket.attendeeName,
            tierName: data.ticket.tierName,
            eventTitle: data.ticket.eventTitle,
            timestamp: new Date().toLocaleTimeString("vi-VN"),
            status: "SUCCESS",
            message: "Hợp lệ - Cho phép vào cổng",
          },
          ...prev,
        ]);
        setTicketInput("");
      } else {
        if (data.alreadyCheckedIn) {
          setScanResult({
            type: "ALREADY_CHECKED_IN",
            message: data.error,
            ticket: data.ticket,
          });

          setLogs((prev) => [
            {
              id: Date.now().toString(),
              ticketCode: data.ticket?.ticketCode || code,
              attendeeName: data.ticket?.attendeeName || "Không rõ",
              tierName: data.ticket?.tierName || "Hạng vé",
              eventTitle: data.ticket?.eventTitle || "Sự kiện",
              timestamp: new Date().toLocaleTimeString("vi-VN"),
              status: "ALREADY_CHECKED_IN",
              message: "CẢNH BÁO: Đã check-in trước đó!",
            },
            ...prev,
          ]);
        } else {
          setScanResult({
            type: "INVALID",
            message: data.error || "Mã vé không hợp lệ",
          });

          setLogs((prev) => [
            {
              id: Date.now().toString(),
              ticketCode: code,
              attendeeName: "N/A",
              tierName: "N/A",
              eventTitle: "N/A",
              timestamp: new Date().toLocaleTimeString("vi-VN"),
              status: "INVALID",
              message: data.error || "Mã không hợp lệ",
            },
            ...prev,
          ]);
        }
      }
    } catch {
      setScanResult({
        type: "INVALID",
        message: "Lỗi kết nối máy chủ",
      });
    } finally {
      setLoading(false);
    }
  };

  const isAuthorized = user?.role === "ORGANIZER" || user?.role === "ADMIN";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <QrCode className="w-4 h-4" />
            <span>Cổng Soát Vé Trực Tuyến</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Quét & Xác Thực Vé Check-in
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hệ thống nhận diện mã QR độc nhất của từng vé, ngăn chặn vé giả và vé sử dụng lại nhiều lần.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/organizer"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Về Dashboard BTC
          </Link>
        </div>
      </div>

      {/* Permission Warning if not logged in as Organizer/Admin */}
      {!isAuthorized && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              Bạn đang ở tài khoản <strong>{user ? user.role : "Khách"}</strong>. Tính năng Quét Check-in yêu cầu quyền <strong>Ban Tổ Chức</strong> hoặc <strong>Admin</strong>.
            </span>
          </div>
          <button
            onClick={() => switchDemoRole("ORGANIZER")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl whitespace-nowrap cursor-pointer transition-colors"
          >
            Chuyển nhanh sang Ban Tổ Chức
          </button>
        </div>
      )}

      {/* Grid: Scanner Area & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Scanner & Test Triggers (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Scanner Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span>Nhập mã vé hoặc dữ liệu từ Camera Scanner</span>
              </h2>
            </div>

            {/* Input & Scan Button */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckIn();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nhập mã vé (VD: TCK-ICTU-MUSIC-088)..."
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <QrCode className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              <button
                type="submit"
                disabled={loading || !ticketInput.trim()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all disabled:opacity-40 cursor-pointer shrink-0"
              >
                {loading ? "Đang quét..." : "Xác Thực"}
              </button>
            </form>

            {/* Simulated QR Camera Frame graphic */}
            <div className="relative aspect-[16/9] bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-indigo-400/40">
              {/* Scan Line Animation */}
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

              <div className="w-32 h-32 border-2 border-cyan-400 rounded-2xl relative flex items-center justify-center">
                <QrCode className="w-16 h-16 text-cyan-400/80 animate-pulse" />
                {/* Corners */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white -translate-x-1 -translate-y-1" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white translate-x-1 -translate-y-1" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white -translate-x-1 translate-y-1" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white translate-x-1 translate-y-1" />
              </div>

              <p className="text-xs text-slate-400 mt-4">
                Camera Simulator: Hướng mã QR trên vé điện tử vào ô nhận diện hoặc click vé mẫu bên dưới
              </p>
            </div>

            {/* Quick Test Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                ⭐ Vé mẫu kiểm tra nhanh tính năng quét (Quick Test):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {demoTickets.map((d, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTicketInput(d.code);
                      handleCheckIn(d.code);
                    }}
                    className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                      {d.label}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Mã: {d.code} • {d.holder}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scan Result Feedback Card */}
          {scanResult && (
            <div
              className={`rounded-3xl p-6 border shadow-lg transition-all animate-in fade-in zoom-in-95 ${
                scanResult.type === "SUCCESS"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                  : scanResult.type === "ALREADY_CHECKED_IN"
                  ? "bg-amber-50 border-amber-300 text-amber-950"
                  : "bg-rose-50 border-rose-300 text-rose-950"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-0.5">
                  {scanResult.type === "SUCCESS" && (
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  )}
                  {scanResult.type === "ALREADY_CHECKED_IN" && (
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                  )}
                  {scanResult.type === "INVALID" && (
                    <XCircle className="w-8 h-8 text-rose-600" />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-black">{scanResult.message}</h3>

                  {scanResult.ticket && (
                    <div className="p-4 bg-white/80 rounded-2xl text-xs space-y-1.5 border border-black/5 text-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Khán giả:</span>
                        <strong className="text-sm">{scanResult.ticket.attendeeName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Hạng vé:</span>
                        <strong className="text-indigo-600">{scanResult.ticket.tierName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sự kiện:</span>
                        <span className="line-clamp-1 max-w-[280px]">
                          {scanResult.ticket.eventTitle}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mã vé:</span>
                        <span className="font-mono font-bold">{scanResult.ticket.ticketCode}</span>
                      </div>
                      {scanResult.ticket.checkedInAt && (
                        <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                          <span>Thời gian vào:</span>
                          <span>{new Date(scanResult.ticket.checkedInAt).toLocaleString("vi-VN")}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Session Activity Log (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Nhật Ký Quét Vé Phiên Này</span>
              </h3>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                {logs.length} lượt quét
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <QrCode className="w-8 h-8 mx-auto text-slate-300" />
                <p>Chưa có lượt quét nào trong phiên hiện tại.</p>
                <p>Mỗi khi quét vé thành công hoặc lỗi, thông tin sẽ hiển thị tức thì tại đây.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-2xl border text-xs space-y-1 ${
                      log.status === "SUCCESS"
                        ? "bg-emerald-50/60 border-emerald-200"
                        : log.status === "ALREADY_CHECKED_IN"
                        ? "bg-amber-50/60 border-amber-200"
                        : "bg-rose-50/60 border-rose-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 font-bold">{log.attendeeName}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-1">{log.eventTitle}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-black/5">
                      <span className="font-mono text-[10px] text-slate-500">{log.ticketCode}</span>
                      <span
                        className={`text-[10px] font-bold ${
                          log.status === "SUCCESS"
                            ? "text-emerald-700"
                            : log.status === "ALREADY_CHECKED_IN"
                            ? "text-amber-700"
                            : "text-rose-700"
                        }`}
                      >
                        {log.message}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
