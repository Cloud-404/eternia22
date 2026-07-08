import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eternia-blogs.vercel.app";

  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });

    const rssItems = articles
      .map((art) => {
        const link = `${baseUrl}/${art.isStory ? "stories" : "articles"}/${art.slug}`;
        return `
        <item>
          <title><![CDATA[${art.title}]]></title>
          <link>${link}</link>
          <guid isPermaLink="true">${link}</guid>
          <description><![CDATA[${art.excerpt}]]></description>
          <pubDate>${art.publishedAt.toUTCString()}</pubDate>
        </item>`;
      })
      .join("");

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Eternia Feed</title>
    <link>${baseUrl}</link>
    <description>Empathetic stories and academic neuroscience backing student mental wellness.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=18000",
      },
    });
  } catch (e) {
    console.error("RSS compilation error:", e);
    return NextResponse.json({ error: "Failed to generate RSS" }, { status: 500 });
  }
}
