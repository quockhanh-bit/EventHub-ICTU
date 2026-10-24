import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Yêu cầu quyền Quản trị viên" }, { status: 403 });
    }

    const { eventId, action } = await req.json();

    if (!eventId || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Tham số không hợp lệ" }, { status: 400 });
    }

    const targetStatus = action === "APPROVE" ? "PUBLISHED" : "REJECTED";

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: { status: targetStatus },
      include: {
        organizer: true,
      },
    });

    // Send notification to organizer
    await prisma.notification.create({
      data: {
        userId: updated.organizerId,
        title: action === "APPROVE" ? "Sự kiện đã được phê duyệt!" : "Sự kiện bị từ chối duyệt",
        message:
          action === "APPROVE"
            ? `Sự kiện "${updated.title}" đã được duyệt thành công và đang hiển thị công khai trên hệ thống.`
            : `Sự kiện "${updated.title}" chưa đạt tiêu chuẩn kiểm duyệt nội dung của ban quản trị.`,
        link: `/events/${updated.slug}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: action === "APPROVE" ? "Đã phê duyệt sự kiện thành công" : "Đã từ chối duyệt sự kiện",
      event: updated,
    });
  } catch (error) {
    console.error("Approve event error:", error);
    return NextResponse.json({ error: "Lỗi xử lý duyệt sự kiện" }, { status: 500 });
  }
}
