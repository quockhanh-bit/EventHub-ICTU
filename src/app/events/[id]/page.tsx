"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState, use } from "react";
import { useAuth } from "@/context/AuthContext";
import BookingModal from "@/components/BookingModal";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Star,
  Share2,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Send,
  AlertCircle,
} from "lucide-react";
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

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    avatar?: string | null;
    organization?: string | null;
  };
}

interface EventDetail {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  location: string;
  locationType: string;
  onlineLink?: string | null;
  status: string;
  isFeatured: boolean;
  category?: {
    name: string;
    slug: string;
    color?: string | null;
  };
  organizer?: {
    id: string;
    name: string;
    avatar?: string | null;
    organization?: string | null;
    phone?: string | null;
    email?: string | null;
  };
  ticketTiers: TicketTier[];
  reviews: ReviewItem[];
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { user } = useAuth();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Review Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");

  const fetchEvent = () => {
    fetch(`/api/events/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.event) {
          setEvent(data.event);
        }
      })
      .catch((err) => console.error("Event fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvent();
  }, [resolvedParams.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingReview(true);
    setReviewMsg("");

    try {
      const res = await fetch(`/api/events/${event?.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviewMsg("Cảm ơn bạn đã gửi đánh giá!");
        setComment("");
        fetchEvent(); // reload reviews
      } else {
        setReviewMsg(data.error || "Không thể gửi đánh giá");
      }
    } catch {
      setReviewMsg("Lỗi kết nối máy chủ");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-medium">Đang tải thông tin sự kiện...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy sự kiện</h2>
        <p className="text-sm text-slate-500">Sự kiện có thể đã bị xóa hoặc đường dẫn không đúng.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>
      </div>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  const avgRating =
    event.reviews.length > 0
      ? (
          event.reviews.reduce((acc, r) => acc + r.rating, 0) /
          event.reviews.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="pb-24">
      {/* Top Breadcrumb & Back */}
      <div className="bg-slate-900 text-white py-3 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Khám phá</span>
          </Link>
          <span className="text-slate-400">
            {event.category?.name} / <strong className="text-slate-200">{event.title}</strong>
          </span>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative aspect-[21/9] max-h-[460px] w-full bg-slate-950 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {event.category && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full text-white shadow-sm"
                style={{ backgroundColor: event.category.color || "#4F46E5" }}
              >
                {event.category.name}
              </span>
            )}
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/20 text-white backdrop-blur-md">
              {event.locationType === "ONLINE"
                ? "🌐 Sự kiện Trực tuyến"
                : event.locationType === "HYBRID"
                ? "⚡ Sự kiện Hybrid"
                : "📍 Sự kiện Trực tiếp"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight max-w-4xl">
            {event.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-3xl line-clamp-2">
            {event.shortDesc}
          </p>
        </div>
      </div>

      {/* Main Content & Sticky Ticket Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Event Details, Schedule, Reviews (col-span-2) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Metadata Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Thời gian diễn ra</h4>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {startDate.toLocaleDateString("vi-VN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
                    {startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    {" - "}
                    {endDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Địa điểm tổ chức</h4>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{event.location}</p>
                  {event.onlineLink && (
                    <a
                      href={event.onlineLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-600 hover:underline block mt-0.5"
                    >
                      Đường link phòng họp online ↗
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Organizer Profile Card */}
            {event.organizer && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-indigo-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        event.organizer.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          event.organizer.name
                        )}`
                      }
                      alt={event.organizer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                      Đơn vị tổ chức
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {event.organizer.organization || event.organizer.name}
                    </h3>
                    <p className="text-xs text-slate-500">{event.organizer.name}</p>
                  </div>
                </div>

                <div className="text-right text-xs text-slate-500 hidden sm:block">
                  <p>Liên hệ ban tổ chức:</p>
                  <strong className="text-slate-800">{event.organizer.phone || event.organizer.email || "Đang cập nhật"}</strong>
                </div>
              </div>
            )}

            {/* Event Description Content */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                Giới Thiệu Chi Tiết Sự Kiện
              </h2>
              <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Đánh Giá & Nhận Xét</h3>
                  <p className="text-xs text-slate-500">
                    Phản hồi từ các bạn sinh viên và khán giả đã tham gia
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="font-black text-slate-900 text-sm">{avgRating} / 5</span>
                  <span className="text-slate-400 text-xs">({event.reviews.length})</span>
                </div>
              </div>

              {/* Review Submit Form */}
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Viết đánh giá của bạn:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    user
                      ? "Chia sẻ cảm nhận về công tác tổ chức, nội dung chương trình..."
                      : "Vui lòng đăng nhập để gửi đánh giá..."
                  }
                  disabled={!user || submittingReview}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />

                {reviewMsg && (
                  <p className="text-xs font-medium text-indigo-600">{reviewMsg}</p>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!user || !comment.trim() || submittingReview}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? "Đang gửi..." : "Gửi Đánh Giá"}</span>
                  </button>
                </div>
              </form>

              {/* Review List */}
              <div className="space-y-4">
                {event.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              rev.user.avatar ||
                              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                rev.user.name
                              )}`
                            }
                            alt={rev.user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{rev.user.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-10">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Ticket Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sticky top-28 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Thông Tin Hạng Vé
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Đăng Ký Tham Gia Sự Kiện
                </h3>
              </div>

              {/* Ticket Tiers Preview */}
              <div className="space-y-3">
                {event.ticketTiers.map((tier) => {
                  const remaining = tier.quantity - tier.sold;
                  const isSoldOut = remaining <= 0;

                  return (
                    <div
                      key={tier.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{tier.name}</span>
                        <span className="font-black text-indigo-700 text-sm">
                          {tier.price === 0
                            ? "Miễn phí"
                            : `${tier.price.toLocaleString("vi-VN")} ₫`}
                        </span>
                      </div>
                      {tier.description && (
                        <p className="text-xs text-slate-500">{tier.description}</p>
                      )}
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-400">
                          {isSoldOut ? "Đã bán hết" : `Còn lại: ${remaining}/${tier.quantity} vé`}
                        </span>
                        {isSoldOut ? (
                          <span className="text-rose-500 font-bold">Hết vé</span>
                        ) : (
                          <span className="text-emerald-600 font-bold">Đang mở bán</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Booking Button */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket className="w-5 h-5" />
                <span>Chọn Vé & Đặt Chỗ Ngay</span>
              </button>

              <div className="text-center text-xs text-slate-400 space-y-1">
                <p>✓ Cấp vé điện tử kèm mã QR Code ngay sau khi đăng ký</p>
                <p>✓ Hỗ trợ hủy vé trước giờ bắt đầu sự kiện</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Checkout Modal */}
      <BookingModal
        event={event}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={() => {
          fetchEvent(); // refresh remaining counts
        }}
      />
    </div>
  );
}
