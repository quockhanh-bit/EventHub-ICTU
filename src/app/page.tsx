"use client";

import React, { useEffect, useState, useMemo } from "react";
import EventCard, { EventData } from "@/components/EventCard";
import {
  Search,
  Filter,
  Sparkles,
  Calendar,
  Ticket,
  ShieldCheck,
  CheckCircle2,
  Users,
  ArrowRight,
  Flame,
  Globe,
} from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  _count?: {
    events: number;
  };
}

export default function HomePage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "FREE" | "ONLINE">("ALL");

  useEffect(() => {
    Promise.all([
      fetch("/api/events?status=PUBLISHED").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ])
      .then(([eventsData, categoriesData]) => {
        if (eventsData.events) setEvents(eventsData.events);
        if (categoriesData.categories) setCategories(categoriesData.categories);
      })
      .catch((err) => console.error("Home fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Search query
      const matchesSearch =
        !searchQuery ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCat =
        selectedCategory === "ALL" || event.category?.slug === selectedCategory;

      // Tab filter
      let matchesTab = true;
      if (activeTab === "FREE") {
        matchesTab =
          event.ticketTiers?.some((tier) => tier.price === 0) || false;
      } else if (activeTab === "ONLINE") {
        matchesTab = event.locationType === "ONLINE" || event.locationType === "HYBRID";
      } else if (activeTab === "UPCOMING") {
        matchesTab = new Date(event.startDate).getTime() > Date.now();
      }

      return matchesSearch && matchesCat && matchesTab;
    });
  }, [events, searchQuery, selectedCategory, activeTab]);

  const featuredEvents = useMemo(() => {
    return events.filter((e) => e.isFeatured);
  }, [events]);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-indigo-950">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Hệ thống Quản lý Sự kiện & Vé Điện tử Toàn diện 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Khám phá & Tổ chức <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Những Sự Kiện Đáng Nhớ
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
            Hỗ trợ phân quyền chặt chẽ giữa Quản trị viên (Admin), Ban Tổ Chức và Khán Giả.
            Cung cấp mã QR định danh độc nhất cho từng vé và tính năng quét check-in thời gian thực.
          </p>

          {/* Search Box Card */}
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col sm:flex-row gap-2 mt-8">
            <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 focus-within:border-indigo-400 transition-colors">
              <Search className="w-5 h-5 text-indigo-300 shrink-0" />
              <input
                type="text"
                placeholder="Tìm tên sự kiện, chủ đề, địa điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900/90 text-white border border-white/15 px-3 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-400 cursor-pointer"
              >
                <option value="ALL">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                Tìm Kiếm
              </button>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span><strong>1,500+</strong> Sự kiện tổ chức</span>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-cyan-400" />
              <span><strong>50,000+</strong> Vé điện tử phát hành</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span><strong>100%</strong> Phân quyền bảo mật RBAC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 -mt-8">
        {/* Category Pills Bar */}
        <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              selectedCategory === "ALL"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất Cả Thể Loại
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.slug
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{cat.name}</span>
              {cat._count?.events !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                  {cat._count.events}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Featured Events Section */}
        {featuredEvents.length > 0 && selectedCategory === "ALL" && !searchQuery && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    Sự Kiện Nổi Bật & Tiêu Điểm
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Các chương trình quy mô lớn được quan tâm nhiều nhất trong tháng
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* All Events Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Danh Sách Sự Kiện ({filteredEvents.length})
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Khám phá và đăng ký tham gia các hoạt động phù hợp với bạn
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "ALL"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveTab("UPCOMING")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "UPCOMING"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sắp diễn ra
              </button>
              <button
                onClick={() => setActiveTab("FREE")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "FREE"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Vé Miễn Phí
              </button>
              <button
                onClick={() => setActiveTab("ONLINE")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "ONLINE"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Online / Hybrid
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 bg-slate-200/60 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Không tìm thấy sự kiện nào phù hợp
              </h3>
              <p className="text-xs text-slate-500">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc danh mục khác
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                  setActiveTab("ALL");
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* How It Works Section */}
        <section className="bg-gradient-to-tr from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white space-y-8 shadow-xl">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Quy Trình Tiện Lợi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              Tham gia sự kiện dễ dàng chỉ với 3 bước
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="text-lg font-bold">Khám phá & Đặt Vé</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Duyệt qua danh mục sự kiện phong phú từ công nghệ, âm nhạc, học thuật đến thể thao.
                Chọn hạng vé phù hợp và hoàn tất đăng ký trong 30 giây.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="text-lg font-bold">Nhận Mã Vé QR</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vé điện tử kèm mã QR Code định danh độc nhất sẽ được lưu trữ an toàn trong mục “Vé Của Tôi”
                và sẵn sàng để bạn tải về máy hoặc in ấn bất kỳ lúc nào.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500 text-white flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="text-lg font-bold">Quét Check-in Tức Thì</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tại cổng vào sự kiện, nhân viên Ban Tổ Chức chỉ cần quét mã QR bằng camera để xác thực và điểm danh
                vào cổng nhanh chóng, không lo trùng lặp.
              </p>
            </div>
          </div>
        </section>

        {/* Organizer Call To Action Banner */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Dành Cho Ban Tổ Chức & Câu Lạc Bộ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Bạn muốn tổ chức sự kiện chuyên nghiệp ngay hôm nay?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tạo sự kiện, thiết lập nhiều hạng vé (VIP, Tiêu chuẩn, Miễn phí), theo dõi doanh thu
              và kiểm soát check-in bằng camera mã QR trên hệ thống EventHub.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/organizer/events/new"
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>+ Đăng Ký Tạo Sự Kiện</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/organizer/check-in"
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm transition-colors text-center"
            >
              Trải Nghiệm Quét Check-in
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
