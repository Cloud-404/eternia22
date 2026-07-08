import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

export default async function ArticlesHubPage() {
  // Query all articles (isStory = false)
  const articles = await prisma.article.findMany({
    where: {
      isStory: false,
      status: "PUBLISHED",
      category: {
        slug: "psychology",
      },
    },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <Navbar />

      <main className="flex-grow min-h-screen bg-background pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Header section */}
          <div className="max-w-3xl space-y-4">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-primary">
              Psychology Explained
            </h1>
            <p className="font-serif text-lg font-light text-muted-foreground leading-relaxed">
              Scientific, peer-reviewed framework explanations of the biological processes behind stress, anxiety, and performance burnout. Knowledge is early intervention.
            </p>
          </div>

          <hr className="border-border/40" />

          {/* Grid list of articles */}
          {articles.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground border border-dashed rounded-2xl">
              No science articles published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((art) => (
                <ArticleCard key={art.id} article={art} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
