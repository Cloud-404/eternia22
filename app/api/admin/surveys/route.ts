import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

export async function GET(request: Request) {
  // Check auth
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
    const surveys = await prisma.survey.findMany({
      include: { responses: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(surveys);
  } catch (e) {
    console.error("Failed to query surveys:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Check auth
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
    const { title, description, options } = body;

    if (!title || !options || options.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create survey (default active = false, they can toggle)
    const survey = await prisma.survey.create({
      data: {
        title,
        description: description || null,
        options: JSON.stringify(options),
        isActive: false,
      },
    });

    return NextResponse.json({ success: true, id: survey.id });
  } catch (e) {
    console.error("Failed to create survey:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  // Check auth
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
    const { id, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing survey ID" }, { status: 400 });
    }

    if (isActive) {
      // Deactivate all other surveys atomic check
      await prisma.survey.updateMany({
        where: { id: { not: id } },
        data: { isActive: false },
      });
    }

    const updated = await prisma.survey.update({
      where: { id },
      data: { isActive: !!isActive },
    });

    return NextResponse.json({ success: true, id: updated.id, isActive: updated.isActive });
  } catch (e) {
    console.error("Failed to toggle survey state:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
