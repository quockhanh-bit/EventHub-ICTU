"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { login, switchDemoRole } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);
    if (res.success) {
      router.push("/");
    } else {
      setError(res.error || "Đăng nhập thất bại");
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Calendar className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Đăng Nhập EventHub</h1>
          <p className="text-xs text-slate-500">
            Hệ thống quản lý sự kiện và đặt vé điện tử có phân quyền
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email tài khoản
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@eventhub.vn"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Mật khẩu</label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Đang xác thực..." : "Đăng Nhập"}
          </button>
        </form>

        {/* Demo Accounts Quick-Fill Box (Designed for Project Defense) */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Đăng nhập nhanh với các tài khoản mẫu:
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <button
              type="button"
              onClick={() => handleFillDemo("admin@eventhub.vn", "admin123")}
              className="p-1.5 bg-white border border-slate-200 hover:border-purple-400 rounded-lg text-[10px] font-bold text-purple-700 transition-colors cursor-pointer"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("organizer@eventhub.vn", "organizer123")}
              className="p-1.5 bg-white border border-slate-200 hover:border-blue-400 rounded-lg text-[10px] font-bold text-blue-700 transition-colors cursor-pointer"
            >
              Ban Tổ Chức
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("attendee@eventhub.vn", "user123")}
              className="p-1.5 bg-white border border-slate-200 hover:border-emerald-400 rounded-lg text-[10px] font-bold text-emerald-700 transition-colors cursor-pointer"
            >
              Khán Giả
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-bold text-indigo-600 hover:underline">
            Đăng ký tài khoản mới
          </Link>
        </p>
      </div>
    </div>
  );
}
