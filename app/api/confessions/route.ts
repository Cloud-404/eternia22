import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const confessions = await prisma.confession.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(confessions);
  } catch (e) {
    console.error("Failed to fetch confessions:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, campus } = body;

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: "Confession must be at least 10 characters long." },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: "Confession cannot exceed 500 characters." },
        { status: 400 }
      );
    }

    const confession = await prisma.confession.create({
      data: {
        content: content.trim(),
        campus: campus ? campus.trim() : null,
        status: "PENDING", // Moderated by default
      },
    });

    return NextResponse.json({ success: true, id: confession.id });
  } catch (e) {
    console.error("Failed to submit confession:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
