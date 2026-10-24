import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role = "ATTENDEE", phone, organization } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Vui lòng điền họ tên, email và mật khẩu" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Mật khẩu phải chứa ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác." },
        { status: 400 }
      );
    }

    const validRole = ["ATTENDEE", "ORGANIZER"].includes(role) ? role : "ATTENDEE";
    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        password: hashedPassword,
        name: name.trim(),
        role: validRole,
        phone: phone || null,
        organization: organization || null,
        status: "ACTIVE",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
      },
    });

    await setAuthCookie({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        avatar: newUser.avatar,
        organization: newUser.organization,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo tài khoản" },
      { status: 500 }
    );
  }
}
