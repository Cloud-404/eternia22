import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

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
    const {
      title,
      slug,
      excerpt,
      content,
      readingTime,
      status,
      featuredImage,
      isStory,
      timeline,
      copingStrategies,
      escalationExplanation,
      seoTitle,
      seoDescription,
      seoKeywords,
      faqSchema,
      categoryId,
    } = body;

    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }

    // Check slug collision
    const existing = await prisma.article.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        readingTime: parseInt(readingTime) || 5,
        status: status || "DRAFT",
        featuredImage: featuredImage || "/images/editorial_science.jpg",
        isStory: !!isStory,
        timeline: timeline ? JSON.stringify(timeline) : null,
        copingStrategies: copingStrategies ? JSON.stringify(copingStrategies) : null,
        escalationExplanation: escalationExplanation || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null,
        faqSchema: faqSchema ? JSON.stringify(faqSchema) : null,
        categoryId,
      },
    });

    return NextResponse.json({ success: true, id: article.id });
  } catch (e) {
    console.error("Failed to create article:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
