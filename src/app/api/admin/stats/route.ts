export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yêu cầu quyền Quản trị viên" }, { status: 403 });
    }

    const [
      totalUsers,
      totalEvents,
      pendingEvents,
      totalBookings,
      revenueAgg,
      totalTickets,
      checkedInTickets,
      recentBookings,
      categoriesBreakdown,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.event.count({ where: { status: "PENDING_APPROVAL" } }),
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: "PAID" },
      }),
      prisma.ticket.count(),
      prisma.ticket.count({ where: { isCheckedIn: true } }),
      prisma.booking.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          event: { select: { title: true } },
        },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { events: true } },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalEvents,
        pendingEvents,
        totalBookings,
        totalRevenue: revenueAgg._sum.totalAmount || 0,
        totalTickets,
        checkedInTickets,
        checkInRate: totalTickets > 0 ? Math.round((checkedInTickets / totalTickets) * 100) : 0,
      },
      recentBookings,
      categoriesBreakdown: categoriesBreakdown.map((c) => ({
        name: c.name,
        count: c._count.events,
        color: c.color,
      })),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Lỗi tải thống kê quản trị" }, { status: 500 });
  }
}
