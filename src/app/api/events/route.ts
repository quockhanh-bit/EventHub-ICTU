export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const locationType = searchParams.get("locationType") || "";
    const status = searchParams.get("status") || "PUBLISHED";
    const featured = searchParams.get("featured");
    const organizerId = searchParams.get("organizerId");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    if (category) {
      whereClause.category = {
        slug: category,
      };
    }

    if (locationType && locationType !== "ALL") {
      whereClause.locationType = locationType;
    }

    if (featured === "true") {
      whereClause.isFeatured = true;
    }

    if (organizerId) {
      whereClause.organizerId = organizerId;
    }

    if (q) {
      whereClause.OR = [
        { title: { contains: q } },
        { shortDesc: { contains: q } },
        { location: { contains: q } },
      ];
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        category: true,
        organizer: {
          select: {
            id: true,
            name: true,
            avatar: true,
            organization: true,
          },
        },
        ticketTiers: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Events fetch error:", error);
    return NextResponse.json({ error: "Lỗi tải sự kiện" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "ORGANIZER" && user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Bạn không có quyền tạo sự kiện (Yêu cầu vai trò Ban Tổ Chức hoặc Admin)" },
        { status: 403 }
      );
    }

    const data = await req.json();
    const {
      title,
      shortDesc,
      description,
      bannerImage,
      startDate,
      endDate,
      location,
      locationType = "OFFLINE",
      onlineLink,
      categoryId,
      ticketTiers = [],
      status = user.role === "ADMIN" ? "PUBLISHED" : "PENDING_APPROVAL",
    } = data;

    if (!title || !shortDesc || !startDate || !endDate || !location || !categoryId) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ các thông tin bắt buộc của sự kiện" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newEvent = await prisma.event.create({
      data: {
        title: title.trim(),
        slug: uniqueSlug,
        shortDesc: shortDesc.trim(),
        description: description || shortDesc,
        bannerImage:
          bannerImage ||
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location: location.trim(),
        locationType,
        onlineLink: onlineLink || null,
        status: status,
        isFeatured: false,
        organizerId: user.id,
        categoryId,
        ticketTiers: {
          create: ticketTiers.length > 0
            ? ticketTiers.map((t: { name: string; price: number; quantity: number; description?: string; benefits?: string }) => ({
                name: t.name || "Vé Tiêu Chuẩn",
                price: Number(t.price) || 0,
                quantity: Number(t.quantity) || 100,
                description: t.description || null,
                benefits: t.benefits || null,
              }))
            : [
                {
                  name: "Vé Tiêu Chuẩn",
                  price: 0,
                  quantity: 100,
                  description: "Vé miễn phí tham dự",
                },
              ],
        },
      },
      include: {
        ticketTiers: true,
        category: true,
      },
    });

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "Lỗi máy chủ khi tạo sự kiện" }, { status: 500 });
  }
}
