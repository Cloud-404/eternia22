import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

export async function GET(request: Request) {
  // Check authorization
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
    const pending = await prisma.confession.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });

    const approved = await prisma.confession.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ pending, approved });
  } catch (e) {
    console.error("Failed to load admin confession listings:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
