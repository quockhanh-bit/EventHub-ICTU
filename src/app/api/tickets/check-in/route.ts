import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ORGANIZER" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Chỉ Ban Tổ Chức hoặc Admin mới có quyền thực hiện quét Check-in" },
        { status: 403 }
      );
    }

    const { code, eventId } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Vui lòng cung cấp mã vé hoặc dữ liệu QR" }, { status: 400 });
    }

    // Attempt parsing code if it's a JSON QR payload
    let targetTicketCode = code.trim();
    try {
      if (code.startsWith("{") && code.endsWith("}")) {
        const parsed = JSON.parse(code);
        if (parsed.ticketCode) {
          targetTicketCode = parsed.ticketCode;
        } else if (parsed.code) {
          targetTicketCode = parsed.code;
        }
      }
    } catch {
      // not json, use raw string
    }

    const ticket = await prisma.ticket.findFirst({
      where: {
        OR: [{ ticketCode: targetTicketCode }, { id: targetTicketCode }],
      },
      include: {
        ticketTier: true,
        booking: {
          include: {
            event: true,
            user: {
              select: { name: true, email: true, phone: true },
            },
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: `Không tìm thấy vé với mã "${targetTicketCode}". Vui lòng kiểm tra lại.` },
        { status: 404 }
      );
    }

    // Check if organizer owns this event (unless admin)
    if (user.role === "ORGANIZER" && ticket.booking.event.organizerId !== user.id) {
      return NextResponse.json(
        { error: `Vé này thuộc sự kiện "${ticket.booking.event.title}", không phải sự kiện do bạn tổ chức!` },
        { status: 403 }
      );
    }

    if (eventId && ticket.booking.eventId !== eventId) {
      return NextResponse.json(
        { error: `Vé này không thuộc sự kiện đang chọn!` },
        { status: 400 }
      );
    }

    // Check if already checked in
    if (ticket.isCheckedIn) {
      return NextResponse.json(
        {
          error: "CẢNH BÁO: Vé này ĐÃ ĐƯỢC CHECK-IN trước đó!",
          alreadyCheckedIn: true,
          ticket: {
            ticketCode: ticket.ticketCode,
            attendeeName: ticket.attendeeName,
            tierName: ticket.ticketTier.name,
            eventTitle: ticket.booking.event.title,
            checkedInAt: ticket.checkedInAt,
            checkedInBy: ticket.checkedInBy,
          },
        },
        { status: 400 }
      );
    }

    // Perform Check-in
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        isCheckedIn: true,
        checkedInAt: new Date(),
        checkedInBy: `${user.name} (${user.role})`,
      },
      include: {
        ticketTier: true,
        booking: {
          include: {
            event: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Check-in thành công! Vé hợp lệ.",
      ticket: {
        id: updatedTicket.id,
        ticketCode: updatedTicket.ticketCode,
        attendeeName: updatedTicket.attendeeName,
        attendeeEmail: updatedTicket.attendeeEmail,
        tierName: updatedTicket.ticketTier.name,
        price: updatedTicket.ticketTier.price,
        eventTitle: updatedTicket.booking.event.title,
        checkedInAt: updatedTicket.checkedInAt,
        checkedInBy: updatedTicket.checkedInBy,
      },
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ error: "Lỗi máy chủ khi xử lý Check-in" }, { status: 500 });
  }
}
