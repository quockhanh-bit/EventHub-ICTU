import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
import DemoSwitcherBar from "@/components/DemoSwitcherBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventHub - Hệ Thống Quản Lý Sự Kiện & Phân Phối Vé Điện Tử",
  description:
    "Hệ thống quản lý sự kiện toàn diện: Phân quyền đa vai trò (Admin, Ban Tổ Chức, Khán Giả), tạo sự kiện, đặt vé trực tuyến, mã QR định danh và quét Check-in thời gian thực.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <AuthProvider>
          <Suspense fallback={<div className="h-9 bg-slate-900" />}>
            <DemoSwitcherBar />
          </Suspense>
          <Suspense fallback={<div className="h-16 bg-white" />}>
            <Navbar />
          </Suspense>
          <Suspense fallback={<div className="min-h-[50vh] p-8" />}>
            <main className="flex-1">{children}</main>
          </Suspense>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
