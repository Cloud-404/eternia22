import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

export async function PUT(request: Request) {
  // Verify token cookie for authorization
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const status = action === "APPROVE" ? "APPROVED" : "REJECTED";

    const updated = await prisma.confession.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, status: updated.status });
  } catch (e) {
    console.error("Failed to moderate confession:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
