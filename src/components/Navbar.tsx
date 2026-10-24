"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Calendar,
  Ticket,
  PlusCircle,
  QrCode,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Shield,
  Layers,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-9 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black bg-gradient-to-r from-indigo-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent tracking-tight">
                  EventHub
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide -mt-1 uppercase">
                  Event Management System
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                }`}
              >
                Khám Phá
              </Link>

              {user && (
                <Link
                  href="/my-tickets"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    isActive("/my-tickets")
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                  }`}
                >
                  <Ticket className="w-4 h-4 text-emerald-600" />
                  <span>Vé Của Tôi</span>
                </Link>
              )}

              {(user?.role === "ORGANIZER" || user?.role === "ADMIN") && (
                <>
                  <Link
                    href="/organizer"
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                      pathname.startsWith("/organizer") && !pathname.includes("/check-in") && !pathname.includes("/new")
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                    }`}
                  >
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Quản Lý BTC</span>
                  </Link>

                  <Link
                    href="/organizer/check-in"
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                      isActive("/organizer/check-in")
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-blue-600" />
                    <span>Quét QR Check-in</span>
                  </Link>
                </>
              )}

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                    isActive("/admin")
                      ? "bg-purple-50 text-purple-700 font-semibold"
                      : "text-slate-600 hover:text-purple-600 hover:bg-slate-50"
                  }`}
                >
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Admin Portal</span>
                </Link>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {(user?.role === "ORGANIZER" || user?.role === "ADMIN") && (
              <Link
                href="/organizer/events/new"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-3.5 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow hover:from-indigo-700 hover:to-blue-700 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tạo Sự Kiện Mới</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-indigo-400/30 overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[130px]">
                      {user.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded w-fit ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "ORGANIZER"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {user.role === "ADMIN"
                        ? "Admin"
                        : user.role === "ORGANIZER"
                        ? "Ban Tổ Chức"
                        : "Khán Giả"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Đăng xuất"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Đăng Nhập
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
                >
                  Đăng Ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50"
          >
            Khám Phá Sự Kiện
          </Link>
          {user && (
            <Link
              href="/my-tickets"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50"
            >
              Vé Của Tôi
            </Link>
          )}
          {(user?.role === "ORGANIZER" || user?.role === "ADMIN") && (
            <>
              <Link
                href="/organizer"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50"
              >
                Quản Lý Ban Tổ Chức
              </Link>
              <Link
                href="/organizer/check-in"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-indigo-50"
              >
                Quét QR Check-in
              </Link>
              <Link
                href="/organizer/events/new"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-600 font-semibold hover:bg-indigo-50"
              >
                + Tạo Sự Kiện Mới
              </Link>
            </>
          )}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-purple-700 font-semibold hover:bg-purple-50"
            >
              Bảng Điều Khiển Admin
            </Link>
          )}

          <div className="pt-4 border-t border-slate-200">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs text-rose-600 font-semibold bg-rose-50 rounded-lg"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-1/2 text-center py-2 text-sm font-medium border border-slate-300 rounded-xl"
                >
                  Đăng Nhập
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-1/2 text-center py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl"
                >
                  Đăng Ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
