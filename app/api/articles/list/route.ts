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
    const articles = await prisma.article.findMany({
      include: { category: true },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json(articles);
  } catch (e) {
    console.error("Failed to load admin article list:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
