"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  PlusCircle,
  Trash2,
  Image,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface NewTier {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
}

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form States
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [bannerImage, setBannerImage] = useState(
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"
  );
  const [startDate, setStartDate] = useState("2026-11-20T09:00");
  const [endDate, setEndDate] = useState("2026-11-20T17:00");
  const [locationType, setLocationType] = useState("OFFLINE");
  const [location, setLocation] = useState("Hội trường Lớn A1, Đại học Bách Khoa Hà Nội");
  const [onlineLink, setOnlineLink] = useState("");

  // Ticket Tiers State
  const [ticketTiers, setTicketTiers] = useState<NewTier[]>([
    {
      id: "1",
      name: "Vé Sinh Viên (Miễn phí)",
      price: 0,
      quantity: 150,
      description: "Dành cho sinh viên mang thẻ SV hợp lệ",
    },
    {
      id: "2",
      name: "Vé Tiêu Chuẩn (Standard)",
      price: 99000,
      quantity: 100,
      description: "Bao gồm teabreak bánh trà và tài liệu",
    },
    {
      id: "3",
      name: "Vé VIP Hàng Đầu",
      price: 250000,
      quantity: 30,
      description: "Ghế VIP hàng đầu, tiệc networking trưa cùng diễn giả",
    },
  ]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          setCategoryId(data.categories[0].id);
        }
      })
      .catch((err) => console.error("Categories error:", err));
  }, []);

  const sampleBanners = [
    {
      label: "Công nghệ / AI",
      url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    },
    {
      label: "Âm nhạc / Acoustic",
      url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    },
    {
      label: "Hội thảo / Tuyển dụng",
      url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      label: "Thể thao / Marathon",
      url: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const handleAddTier = () => {
    const newId = Date.now().toString();
    setTicketTiers((prev) => [
      ...prev,
      {
        id: newId,
        name: "Hạng Vé Mới",
        price: 50000,
        quantity: 50,
        description: "Mô tả quyền lợi của hạng vé này",
      },
    ]);
  };

  const handleRemoveTier = (id: string) => {
    if (ticketTiers.length <= 1) {
      alert("Sự kiện cần tối thiểu 01 hạng vé để người tham dự đăng ký!");
      return;
    }
    setTicketTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTierChange = (
    id: string,
    field: keyof NewTier,
    value: string | number
  ) => {
    setTicketTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !shortDesc.trim() || !location.trim()) {
      setError("Vui lòng điền đầy đủ các thông tin sự kiện bắt buộc");
      return;
    }

    if (ticketTiers.length === 0) {
      setError("Vui lòng cấu hình ít nhất 01 hạng vé");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          shortDesc: shortDesc.trim(),
          description: description.trim() || shortDesc.trim(),
          bannerImage,
          startDate,
          endDate,
          location: location.trim(),
          locationType,
          onlineLink: onlineLink || null,
          categoryId,
          ticketTiers,
          status: user?.role === "ADMIN" ? "PUBLISHED" : "PENDING_APPROVAL",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Không thể tạo sự kiện");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/organizer");
      }, 1500);
    } catch {
      setError("Lỗi kết nối máy chủ");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Nav */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          href="/organizer"
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về bảng điều khiển BTC</span>
        </Link>
        <span className="text-xs text-slate-400">Đăng sự kiện mới vào hệ thống</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Thiết Lập Sự Kiện Mới
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Điền thông tin chi tiết, lịch trình và các hạng vé để mở bán trên cổng thông tin EventHub.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Tạo sự kiện thành công! Đang chuyển hướng về Bảng điều khiển...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            1. Thông Tin Cơ Bản
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên Sự Kiện *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Hội Thảo Khoa Học Công Nghệ Sinh Viên 2026..."
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Danh Mục Phân Loại *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hình Thức Tổ Chức *
                </label>
                <select
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white cursor-pointer"
                >
                  <option value="OFFLINE">Trực tiếp tại địa điểm (Offline)</option>
                  <option value="ONLINE">Trực tuyến qua Zoom / Meet (Online)</option>
                  <option value="HYBRID">Kết hợp Trực tiếp & Trực tuyến (Hybrid)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mô Tả Ngắn (Hiển thị ngoài trang chủ) *
              </label>
              <textarea
                rows={2}
                required
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Tóm tắt ngắn gọn 1-2 câu về điểm đặc sắc của sự kiện..."
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nội Dung Giới Thiệu Chi Tiết
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Lịch trình chi tiết các phiên, thông tin diễn giả, quyền lợi người tham gia..."
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Banner Image */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>2. Hình Ảnh Banner Sự Kiện</span>
            <Image className="w-4 h-4 text-slate-400" />
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Đường dẫn ảnh bìa (URL)
              </label>
              <input
                type="url"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-xs"
              />
            </div>

            {/* Quick Banner Presets */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 font-semibold">Gợi ý mẫu ảnh đẹp:</span>
              {sampleBanners.map((sb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setBannerImage(sb.url)}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
                >
                  {sb.label}
                </button>
              ))}
            </div>

            {/* Preview Banner */}
            {bannerImage && (
              <div className="aspect-[21/9] max-h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bannerImage}
                  alt="Preview Banner"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Time & Location */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            3. Thời Gian & Địa Điểm
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Thời Gian Bắt Đầu *
              </label>
              <input
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Thời Gian Kết Thúc *
              </label>
              <input
                type="datetime-local"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Địa Điểm Tổ Chức (hoặc phòng thi/lab) *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="VD: Hội trường A1, ĐH Bách Khoa..."
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {(locationType === "ONLINE" || locationType === "HYBRID") && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đường dẫn phòng họp Trực tuyến (Zoom / Google Meet)
                </label>
                <input
                  type="url"
                  value={onlineLink}
                  onChange={(e) => setOnlineLink(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Dynamic Ticket Tiers Builder */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                4. Cấu Hình Các Hạng Vé (Ticket Tiers)
              </h2>
              <p className="text-xs text-slate-500">
                Thiết lập mức giá (0đ = Miễn phí) và số lượng vé phát hành cho từng nhóm
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddTier}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Thêm Hạng Vé</span>
            </button>
          </div>

          <div className="space-y-4">
            {ticketTiers.map((tier, idx) => (
              <div
                key={tier.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700">
                    Hạng Vé #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTier(tier.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Tên hạng vé *
                    </label>
                    <input
                      type="text"
                      required
                      value={tier.name}
                      onChange={(e) => handleTierChange(tier.id, "name", e.target.value)}
                      placeholder="Vé VIP / Vé Thường..."
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Giá vé (VNĐ, 0 = Miễn phí) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={5000}
                      required
                      value={tier.price}
                      onChange={(e) =>
                        handleTierChange(tier.id, "price", Number(e.target.value))
                      }
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Số lượng vé tối đa *
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={tier.quantity}
                      onChange={(e) =>
                        handleTierChange(tier.id, "quantity", Number(e.target.value))
                      }
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white font-mono"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Mô tả quyền lợi
                    </label>
                    <input
                      type="text"
                      value={tier.description}
                      onChange={(e) =>
                        handleTierChange(tier.id, "description", e.target.value)
                      }
                      placeholder="Ghế ngồi hàng đầu, kèm teabreak, nhận áo lưu niệm..."
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            href="/organizer"
            className="px-5 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Hủy Bỏ
          </Link>

          <button
            type="submit"
            disabled={loading || success}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Đang xử lý lưu vào CSDL..." : "Lưu & Xuất Bản Sự Kiện"}
          </button>
        </div>
      </form>
    </div>
  );
}
