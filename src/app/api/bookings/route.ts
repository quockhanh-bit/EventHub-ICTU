export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    if (user.role === "ATTENDEE") {
      whereClause.userId = user.id;
    } else if (user.role === "ORGANIZER") {
      if (eventId) {
        whereClause.eventId = eventId;
      } else {
        whereClause.event = { organizerId: user.id };
      }
    } else if (user.role === "ADMIN") {
      if (eventId) {
        whereClause.eventId = eventId;
      }
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            bannerImage: true,
            startDate: true,
            endDate: true,
            location: true,
          },
        },
        tickets: {
          include: {
            ticketTier: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json({ error: "Lỗi tải danh sách đơn đặt vé" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để tiến hành đặt vé sự kiện" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      eventId,
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod = "FREE",
      items = [], // [{ ticketTierId: string, quantity: number }]
    } = body;

    if (!eventId || !items.length || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp đầy đủ thông tin đặt vé" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { ticketTiers: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Sự kiện không tồn tại" }, { status: 404 });
    }

    if (event.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Sự kiện hiện chưa mở bán hoặc đã kết thúc" },
        { status: 400 }
      );
    }

    // Verify inventory and calculate total
    let totalAmount = 0;
    const tierMap = new Map(event.ticketTiers.map((t) => [t.id, t]));
    const ticketsToCreate: Array<{
      ticketTierId: string;
      tierName: string;
    }> = [];

    for (const item of items) {
      const tier = tierMap.get(item.ticketTierId);
      if (!tier) {
        return NextResponse.json(
          { error: `Hạng vé không tồn tại trong sự kiện` },
          { status: 400 }
        );
      }

      const requestedQty = Math.max(1, Number(item.quantity) || 1);
      const remaining = tier.quantity - tier.sold;
      if (requestedQty > remaining) {
        return NextResponse.json(
          { error: `Hạng vé "${tier.name}" chỉ còn lại ${remaining} vé` },
          { status: 400 }
        );
      }

      totalAmount += tier.price * requestedQty;
      for (let i = 0; i < requestedQty; i++) {
        ticketsToCreate.push({
          ticketTierId: tier.id,
          tierName: tier.name,
        });
      }
    }

    const bookingCode = `EVH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Execute transaction: create booking, update sold count, create tickets
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Booking
      const booking = await tx.booking.create({
        data: {
          bookingCode,
          userId: user.id,
          eventId: event.id,
          totalAmount,
          status: "PAID",
          paymentMethod,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: (customerPhone || "").trim(),
        },
      });

      // 2. Increment sold counters
      for (const item of items) {
        await tx.ticketTier.update({
          where: { id: item.ticketTierId },
          data: {
            sold: { increment: Math.max(1, Number(item.quantity) || 1) },
          },
        });
      }

      // 3. Create Tickets with unique QR data
      for (let i = 0; i < ticketsToCreate.length; i++) {
        const tInfo = ticketsToCreate[i];
        const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
        const ticketCode = `TCK-${Date.now().toString().slice(-4)}-${randomCode}`;

        const qrPayload = JSON.stringify({
          ticketCode,
          bookingCode,
          eventId: event.id,
          eventTitle: event.title,
          tier: tInfo.tierName,
          holder: customerName,
          email: customerEmail,
        });

        await tx.ticket.create({
          data: {
            ticketCode,
            qrCodeData: qrPayload,
            bookingId: booking.id,
            ticketTierId: tInfo.ticketTierId,
            attendeeName: customerName,
            attendeeEmail: customerEmail,
            isCheckedIn: false,
          },
        });
      }

      // 4. Create Notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Đặt vé thành công!",
          message: `Bạn đã mua thành công ${ticketsToCreate.length} vé cho "${event.title}". Mã đơn: ${bookingCode}`,
          link: "/my-tickets",
        },
      });

      return booking;
    });

    const fullBooking = await prisma.booking.findUnique({
      where: { id: result.id },
      include: {
        event: true,
        tickets: {
          include: { ticketTier: true },
        },
      },
    });

    return NextResponse.json({ success: true, booking: fullBooking });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Lỗi xử lý đặt vé" }, { status: 500 });
  }
}
