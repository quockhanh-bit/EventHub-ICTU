import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ORGANIZER" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Yêu cầu quyền Ban Tổ Chức" }, { status: 403 });
    }

    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json({ error: "Sự kiện không tồn tại" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && event.organizerId !== user.id) {
      return NextResponse.json({ error: "Không có quyền xem sự kiện này" }, { status: 403 });
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        booking: {
          eventId: id,
        },
      },
      include: {
        ticketTier: true,
        booking: {
          select: {
            bookingCode: true,
            customerPhone: true,
            createdAt: true,
            paymentMethod: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      event: { id: event.id, title: event.title },
      totalTickets: tickets.length,
      checkedInCount: tickets.filter((t) => t.isCheckedIn).length,
      tickets,
    });
  } catch (error) {
    console.error("Attendees fetch error:", error);
    return NextResponse.json({ error: "Lỗi tải danh sách người tham gia" }, { status: 500 });
  }
}
