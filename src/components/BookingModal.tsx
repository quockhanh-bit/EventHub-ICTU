"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import confetti from "canvas-confetti";
import { X, CheckCircle, Ticket, CreditCard, QrCode, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TicketTier {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  description?: string | null;
  benefits?: string | null;
}

interface EventInfo {
  id: string;
  title: string;
  startDate: string | Date;
  location: string;
  ticketTiers: TicketTier[];
}

export default function BookingModal({
  event,
  isOpen,
  onClose,
  onSuccess,
}: {
  event: EventInfo;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { user } = useAuth();
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    if (event.ticketTiers.length > 0) {
      initial[event.ticketTiers[0].id] = 1;
    }
    return initial;
  });

  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [paymentMethod, setPaymentMethod] = useState("MOMO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  if (!isOpen) return null;

  const totalAmount = event.ticketTiers.reduce((acc, tier) => {
    const qty = quantities[tier.id] || 0;
    return acc + tier.price * qty;
  }, 0);

  const totalTicketsSelected = Object.values(quantities).reduce((a, b) => a + b, 0);

  const handleQuantityChange = (tierId: string, delta: number, max: number) => {
    const current = quantities[tierId] || 0;
    const next = Math.max(0, Math.min(max, current + delta));
    setQuantities((prev) => ({ ...prev, [tierId]: next }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Vui lòng đăng nhập để tiến hành đặt vé");
      return;
    }

    if (totalTicketsSelected <= 0) {
      setError("Vui lòng chọn ít nhất 01 vé để tiếp tục");
      return;
    }

    if (!customerName || !customerEmail) {
      setError("Vui lòng nhập họ tên và email nhận vé");
      return;
    }

    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([ticketTierId, quantity]) => ({ ticketTierId, quantity }));

    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          customerName,
          customerEmail,
          customerPhone,
          paymentMethod: totalAmount === 0 ? "FREE" : paymentMethod,
          items,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Đặt vé thất bại");
        setLoading(false);
        return;
      }

      // Trigger Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setBookingSuccess(data.booking);
      if (onSuccess) onSuccess();
    } catch {
      setError("Lỗi kết nối máy chủ khi xử lý đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Ticket className="w-4 h-4" />
            <span>Đăng ký tham dự sự kiện</span>
          </div>
          <h2 className="text-xl font-bold mt-1 text-white line-clamp-1">{event.title}</h2>
        </div>

        {/* Success View */}
        {bookingSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Đặt Vé Thành Công!</h3>
              <p className="text-slate-600 text-sm mt-1">
                Mã đơn hàng:{" "}
                <span className="font-mono font-bold text-indigo-600">
                  {bookingSuccess.bookingCode}
                </span>
              </p>
              <p className="text-slate-500 text-xs mt-2">
                Thông tin vé điện tử cùng mã QR định danh đã được lưu vào hệ thống và gửi tới{" "}
                <strong className="text-slate-800">{bookingSuccess.customerEmail}</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Người nhận:</span>
                <span className="font-semibold text-slate-800">{bookingSuccess.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Số lượng vé:</span>
                <span className="font-semibold text-slate-800">
                  {bookingSuccess.tickets?.length || totalTicketsSelected} vé
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tổng thanh toán:</span>
                <span className="font-bold text-indigo-600 text-sm">
                  {bookingSuccess.totalAmount.toLocaleString("vi-VN")} ₫
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl text-sm transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <Link
                href="/my-tickets"
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Xem Vé Của Tôi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Select Ticket Tiers */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Chọn hạng vé & số lượng
              </label>

              <div className="space-y-2.5">
                {event.ticketTiers.map((tier) => {
                  const remaining = tier.quantity - tier.sold;
                  const isSoldOut = remaining <= 0;
                  const qty = quantities[tier.id] || 0;

                  return (
                    <div
                      key={tier.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        qty > 0
                          ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500/20"
                          : "border-slate-200 bg-white"
                      } ${isSoldOut ? "opacity-60 bg-slate-50" : ""}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{tier.name}</h4>
                          <span className="text-xs font-extrabold text-indigo-700">
                            {tier.price === 0 ? "Miễn phí" : `${tier.price.toLocaleString("vi-VN")} ₫`}
                          </span>
                        </div>
                        {tier.description && (
                          <p className="text-xs text-slate-500">{tier.description}</p>
                        )}
                        <span className="text-[11px] text-slate-400 block">
                          {isSoldOut ? "Hết vé" : `Còn lại: ${remaining} vé`}
                        </span>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(tier.id, -1, remaining)}
                          disabled={isSoldOut || qty <= 0}
                          className="w-8 h-8 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-slate-900 text-sm">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(tier.id, 1, remaining)}
                          disabled={isSoldOut || qty >= remaining}
                          className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold hover:bg-indigo-700 disabled:opacity-40 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Attendee Info */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Thông tin người nhận vé
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Email nhận vé điện tử *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method (if amount > 0) */}
            {totalAmount > 0 && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. Phương thức thanh toán (Giả lập Cổng thanh toán)
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("MOMO")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                      paymentMethod === "MOMO"
                        ? "border-pink-500 bg-pink-50/50 ring-1 ring-pink-500"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-600 text-white flex items-center justify-center font-black text-xs">
                      MoMo
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Ví MoMo</p>
                      <p className="text-[10px] text-slate-500">Quét mã QR</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("BANK_TRANSFER")}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                      paymentMethod === "BANK_TRANSFER"
                        ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">VietQR</p>
                      <p className="text-[10px] text-slate-500">Chuyển khoản</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Total Summary & Submit */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Tổng thanh toán ({totalTicketsSelected} vé):</p>
                <p className="text-xl font-black text-indigo-700">
                  {totalAmount === 0 ? "Miễn Phí" : `${totalAmount.toLocaleString("vi-VN")} ₫`}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || totalTicketsSelected <= 0}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:from-indigo-700 hover:to-blue-700 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Đang xử lý..." : totalAmount === 0 ? "Nhận Vé Miễn Phí" : "Xác Nhận & Thanh Toán"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
