import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để gửi đánh giá" }, { status: 401 });
    }

    const { id } = await params;
    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json(
        { error: "Vui lòng chọn số sao và nhập nội dung đánh giá" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!event) {
      return NextResponse.json({ error: "Sự kiện không tồn tại" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        eventId: event.id,
        userId: user.id,
        rating: Math.min(5, Math.max(1, Number(rating))),
        comment: comment.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Lỗi gửi đánh giá" }, { status: 500 });
  }
}
