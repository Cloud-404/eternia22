import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, Heart, Shield, ArrowLeft, Share2, ClipboardCheck } from "lucide-react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryTimeline from "@/components/StoryTimeline";
import ArticleCard from "@/components/ArticleCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch story
  const story = await prisma.article.findUnique({
    where: { slug },
    include: { category: true, tags: true },
  });

  if (!story || !story.isStory || story.status !== "PUBLISHED") {
    notFound();
  }

  // Fetch related articles (same category, excluding current)
  const relatedArticles = await prisma.article.findMany({
    where: {
      categoryId: story.categoryId,
      id: { not: story.id },
      status: "PUBLISHED",
    },
    include: { category: true },
    take: 2,
  });

  // Safe JSON Parsing for Coping Strategies
  const copingList: { title: string; text: string }[] = story.copingStrategies
    ? JSON.parse(story.copingStrategies)
    : [];

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-32 pb-24 bg-background">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {/* Back button */}
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Stories
          </Link>

          {/* Heading block */}
          <div className="space-y-6">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
              {story.title}
            </h1>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground border-b border-border/40 pb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(story.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {story.readingTime} min read
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-accent/5 border border-accent/10 text-accent font-semibold">
                {story.category.name}
              </span>
            </div>
          </div>

          {/* Main layout grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Story content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Premium lead-in Hook */}
              <div className="border-l-2 border-accent/80 pl-4 py-1 italic font-serif text-lg text-muted-foreground">
                &ldquo;{story.excerpt}&rdquo;
              </div>

              {/* Editorial Body (renders with Lora font and custom styles) */}
              <article className="editorial-body dropcap">
                {story.content.split("\n\n").map((para, i) => {
                  if (para.startsWith("### ")) {
                    return <h3 key={i}>{para.replace("### ", "")}</h3>;
                  }
                  if (para.startsWith("## ")) {
                    return <h2 key={i}>{para.replace("## ", "")}</h2>;
                  }
                  if (para.startsWith("* ")) {
                    return (
                      <ul key={i}>
                        {para.split("\n").map((li, idx) => (
                          <li key={idx}>{li.replace("* ", "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={i} className={i === 0 ? "dropcap" : ""}>{para}</p>;
                })}
              </article>

              {/* Practical Coping Strategies */}
              {copingList.length > 0 && (
                <div className="bg-muted/30 border border-border/40 rounded-2xl p-6 space-y-6">
                  <h3 className="font-serif text-lg font-bold text-primary border-b border-border/40 pb-2">
                    Practical Coping Strategies
                  </h3>
                  <div className="space-y-4">
                    {copingList.map((strategy, idx) => (
                      <div key={idx} className="space-y-1">
                        <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                            {idx + 1}
                          </span>
                          {strategy.title}
                        </h4>
                        <p className="text-sm text-muted-foreground font-light pl-7 leading-relaxed">
                          {strategy.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Side column: Timeline & Explanation */}
            <div className="lg:col-span-4 space-y-8">
              {/* Story Timeline */}
              {story.timeline && (
                <div className="bg-card border border-border/30 rounded-2xl p-6 shadow-sm">
                  <StoryTimeline timelineJson={story.timeline as string} />
                </div>
              )}

              {/* Psychological Escalation Analysis */}
              {story.escalationExplanation && (
                <div className="bg-accent/5 border border-accent/10 rounded-2xl p-6 space-y-3">
                  <h4 className="font-serif text-base font-bold text-accent">
                    Why it Escalated
                  </h4>
                  <p className="text-xs md:text-sm leading-relaxed text-muted-foreground font-light">
                    {story.escalationExplanation}
                  </p>
                </div>
              )}

              {/* Share & Actions */}
              <div className="border border-border/40 rounded-2xl p-6 text-center space-y-4 bg-card">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Help Validate Others
                </h4>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  Sharing student narratives reduces isolation. Your identity remains private.
                </p>
                <div className="flex justify-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-xs font-semibold hover:bg-muted transition-colors">
                    <Share2 className="w-3.5 h-3.5" /> Share Story
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-border/40" />
          {/* Dynamic Waitlist CTA */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-serif text-2xl font-bold tracking-tight">
                Empower your campus wellness journey.
              </h3>
              <p className="text-sm text-primary-foreground/80 font-light leading-relaxed">
                Join over 200+ students on the waitlist to launch our secure, decentralized support network. Show student demand for private, zero-knowledge wellness networks.
              </p>
              <div className="flex items-center gap-2 text-xs text-primary-foreground/60 font-light">
                <Shield className="w-3.5 h-3.5 text-accent" /> Zero-knowledge architecture. Fully private.
              </div>
            </div>
            <Link
              href="/#waitlist"
              className="px-6 py-3 bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity shrink-0 flex items-center gap-2 shadow-sm"
            >
              <ClipboardCheck className="w-4 h-4" /> Join the Waitlist
            </Link>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="space-y-6 pt-6">
              <h3 className="font-serif text-2xl font-bold text-primary">
                Related Student Stories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedArticles.map((art) => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
