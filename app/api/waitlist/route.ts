import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const BASE_COUNT = 243;

export async function GET() {
  try {
    const dbCount = await prisma.waitlist.count();
    return NextResponse.json({ count: BASE_COUNT + dbCount });
  } catch (e) {
    console.error("Failed to get waitlist count:", e);
    return NextResponse.json({ count: BASE_COUNT }); // Fallback to base count
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if email already exists
    const existing = await prisma.waitlist.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: "You are already on the waitlist!" }, { status: 409 });
    }

    // Add to waitlist
    await prisma.waitlist.create({
      data: {
        email,
        name: name || null,
      },
    });

    // Return the updated count
    const dbCount = await prisma.waitlist.count();
    return NextResponse.json({
      success: true,
      message: "Successfully joined waitlist!",
      count: BASE_COUNT + dbCount,
    });
  } catch (e) {
    console.error("Failed to register waitlist email:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
