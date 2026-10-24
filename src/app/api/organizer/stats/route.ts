export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ORGANIZER" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Yêu cầu quyền Ban Tổ Chức" }, { status: 403 });
    }

    const myEvents = await prisma.event.findMany({
      where: user.role === "ADMIN" ? {} : { organizerId: user.id },
      include: {
        category: true,
        ticketTiers: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const eventIds = myEvents.map((e) => e.id);

    const [totalBookings, revenueAgg, totalTickets, checkedInTickets] = await Promise.all([
      prisma.booking.count({
        where: { eventId: { in: eventIds }, status: "PAID" },
      }),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { eventId: { in: eventIds }, status: "PAID" },
      }),
      prisma.ticket.count({
        where: { booking: { eventId: { in: eventIds } } },
      }),
      prisma.ticket.count({
        where: { booking: { eventId: { in: eventIds } }, isCheckedIn: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalMyEvents: myEvents.length,
        totalBookings,
        totalRevenue: revenueAgg._sum.totalAmount || 0,
        totalTickets,
        checkedInTickets,
        checkInRate: totalTickets > 0 ? Math.round((checkedInTickets / totalTickets) * 100) : 0,
      },
      events: myEvents,
    });
  } catch (error) {
    console.error("Organizer stats error:", error);
    return NextResponse.json({ error: "Lỗi tải dữ liệu ban tổ chức" }, { status: 500 });
  }
}
