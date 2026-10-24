import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        organizer: {
          select: {
            id: true,
            name: true,
            avatar: true,
            organization: true,
            phone: true,
            email: true,
          },
        },
        ticketTiers: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                organization: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Không tìm thấy sự kiện" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Get event detail error:", error);
    return NextResponse.json({ error: "Lỗi tải chi tiết sự kiện" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Sự kiện không tồn tại" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && existing.organizerId !== user.id) {
      return NextResponse.json(
        { error: "Bạn không có quyền chỉnh sửa sự kiện này" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : existing.title,
        shortDesc: body.shortDesc !== undefined ? body.shortDesc : existing.shortDesc,
        description: body.description !== undefined ? body.description : existing.description,
        bannerImage: body.bannerImage !== undefined ? body.bannerImage : existing.bannerImage,
        startDate: body.startDate ? new Date(body.startDate) : existing.startDate,
        endDate: body.endDate ? new Date(body.endDate) : existing.endDate,
        location: body.location !== undefined ? body.location : existing.location,
        locationType: body.locationType !== undefined ? body.locationType : existing.locationType,
        onlineLink: body.onlineLink !== undefined ? body.onlineLink : existing.onlineLink,
        status: body.status !== undefined ? body.status : existing.status,
        isFeatured: body.isFeatured !== undefined ? body.isFeatured : existing.isFeatured,
        categoryId: body.categoryId !== undefined ? body.categoryId : existing.categoryId,
      },
      include: {
        category: true,
        ticketTiers: true,
      },
    });

    return NextResponse.json({ success: true, event: updated });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json({ error: "Lỗi cập nhật sự kiện" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Sự kiện không tồn tại" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && existing.organizerId !== user.id) {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa sự kiện này" },
        { status: 403 }
      );
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Đã xóa sự kiện thành công" });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json({ error: "Lỗi xóa sự kiện" }, { status: 500 });
  }
}
