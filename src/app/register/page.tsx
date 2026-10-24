"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Lock, Mail, User, Phone, Building, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ATTENDEE");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await register({
      name,
      email,
      password,
      role,
      phone,
      organization: role === "ORGANIZER" ? organization : undefined,
    });

    if (res.success) {
      if (role === "ORGANIZER") {
        router.push("/organizer");
      } else {
        router.push("/");
      }
    } else {
      setError(res.error || "Đăng ký thất bại");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Calendar className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Tạo Tài Khoản Mới</h1>
          <p className="text-xs text-slate-500">
            Trở thành Khán giả mua vé hoặc Ban Tổ chức phát hành sự kiện
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Bạn tham gia với vai trò</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("ATTENDEE")}
                className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  role === "ATTENDEE"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Khán Giả / Sinh Viên
              </button>
              <button
                type="button"
                onClick={() => setRole("ORGANIZER")}
                className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  role === "ORGANIZER"
                    ? "bg-blue-50 border-blue-500 text-blue-800 ring-1 ring-blue-500"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Ban Tổ Chức (CLB / BTC)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mật khẩu (tối thiểu 6 ký tự) *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912345678"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {role === "ORGANIZER" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên tổ chức / CLB *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required={role === "ORGANIZER"}
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="CLB Tin Học..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? "Đang tạo tài khoản..." : "Hoàn Tất Đăng Ký"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-bold text-indigo-600 hover:underline">
            Đăng nhập tại đây
          </Link>
        </p>
      </div>
    </div>
  );
}
