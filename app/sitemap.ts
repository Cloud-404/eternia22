import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eternia-blogs.vercel.app";

  try {
    // Fetch all published articles
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { 
        slug: true, 
        publishedAt: true, 
        isStory: true,
        category: {
          select: { slug: true }
        }
      },
    });

    const articleUrls = articles.map((art) => {
      let route = art.isStory ? "stories" : "articles";
      if (art.category.slug === "initiatives") {
        route = "publications";
      }
      return {
        url: `${baseUrl}/${route}/${art.slug}`,
        lastModified: art.publishedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });

    const staticUrls = [
      "",
      "/stories",
      "/articles",
      "/confessions",
      "/surveys",
      "/publications",
      "/about",
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1.0 : 0.8,
    }));

    return [...staticUrls, ...articleUrls];
  } catch (e) {
    console.error("Sitemap generation failed, returning base static paths:", e);
    return [
      { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 }
    ];
  }
}
