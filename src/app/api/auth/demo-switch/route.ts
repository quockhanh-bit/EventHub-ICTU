import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { role } = await req.json();

    let targetEmail = "admin@eventhub.vn";
    if (role === "ORGANIZER") {
      targetEmail = "organizer@eventhub.vn";
    } else if (role === "ATTENDEE") {
      targetEmail = "attendee@eventhub.vn";
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: `Tài khoản demo cho vai trò ${role} chưa được khởi tạo trong CSDL` },
        { status: 404 }
      );
    }

    await setAuthCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        organization: user.organization,
      },
    });
  } catch (error) {
    console.error("Demo switch error:", error);
    return NextResponse.json(
      { error: "Không thể chuyển tài khoản demo" },
      { status: 500 }
    );
  }
}
