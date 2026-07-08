import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

export default async function StoriesHubPage() {
  // Query all stories (isStory = true)
  const stories = await prisma.article.findMany({
    where: {
      isStory: true,
      status: "PUBLISHED",
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
              Student Stories
            </h1>
            <p className="font-serif text-lg font-light text-muted-foreground leading-relaxed">
              Real stories written by university students navigating high pressure, burnout, and loneliness. These are stories of recognition, validation, and ultimate recovery.
            </p>
          </div>

          <hr className="border-border/40" />

          {/* Grid list of stories */}
          {stories.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground border border-dashed rounded-2xl">
              No student stories published yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <ArticleCard key={story.id} article={story} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
