import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticketCode: string }> }
) {
  try {
    const { ticketCode } = await params;

    const ticket = await prisma.ticket.findFirst({
      where: {
        OR: [{ ticketCode }, { id: ticketCode }],
      },
      include: {
        ticketTier: true,
        booking: {
          include: {
            event: {
              include: {
                category: true,
                organizer: {
                  select: { name: true, organization: true, phone: true },
                },
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Không tìm thấy vé" }, { status: 404 });
    }

    // Generate high-resolution QR Code Data URL
    const qrDataUrl = await QRCode.toDataURL(ticket.qrCodeData, {
      width: 320,
      margin: 2,
      color: {
        dark: "#1e1b4b",
        light: "#ffffff",
      },
    });

    return NextResponse.json({
      ticket,
      qrDataUrl,
    });
  } catch (error) {
    console.error("Fetch ticket error:", error);
    return NextResponse.json({ error: "Lỗi tạo vé điện tử" }, { status: 500 });
  }
}
