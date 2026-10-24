"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, CalendarCheck, Ticket, Sparkles } from "lucide-react";

export default function DemoSwitcherBar() {
  const { user, switchDemoRole, loading } = useAuth();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-500/30 text-white text-xs sm:text-sm py-2 px-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-indigo-200">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            PHÂN QUYỀN HỆ THỐNG:
          </span>
          <span className="hidden sm:inline text-slate-300">
            Chuyển nhanh vai trò (RBAC):
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {/* Admin Button */}
          <button
            onClick={() => switchDemoRole("ADMIN")}
            disabled={loading}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              user?.role === "ADMIN"
                ? "bg-purple-600 text-white shadow-sm shadow-purple-500/50 ring-1 ring-purple-300"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Admin (Lô Quốc Khánh)</span>
          </button>

          {/* Organizer Button */}
          <button
            onClick={() => switchDemoRole("ORGANIZER")}
            disabled={loading}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              user?.role === "ORGANIZER"
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/50 ring-1 ring-blue-300"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Ban Tổ Chức (Đoàn Hội ICTU)</span>
          </button>

          {/* Attendee Button */}
          <button
            onClick={() => switchDemoRole("ATTENDEE")}
            disabled={loading}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              user?.role === "ATTENDEE"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/50 ring-1 ring-emerald-300"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-emerald-300" />
            <span>Khán Giả (Nguyễn Văn An)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
