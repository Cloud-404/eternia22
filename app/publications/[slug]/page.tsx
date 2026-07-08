import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, ArrowLeft, Check } from "lucide-react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicationDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch article
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true, tags: true },
  });

  // Verify that the article exists, is not a story, and belongs to 'initiatives' category
  if (!article || article.category.slug !== "initiatives" || article.status !== "PUBLISHED") {
    notFound();
  }

  // Fetch related publications (same category, excluding current)
  const relatedPublications = await prisma.article.findMany({
    where: {
      categoryId: article.categoryId,
      id: { not: article.id },
      status: "PUBLISHED",
    },
    include: { category: true },
    take: 2,
  });

  // Safe JSON Parsing for FAQ
  const faqList: { q: string; a: string }[] = article.faqSchema
    ? JSON.parse(article.faqSchema)
    : [];

  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.excerpt,
    "datePublished": article.publishedAt.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Eternia Editorial Board",
      "url": "https://eternia-blogs.vercel.app",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Eternia",
      "logo": {
        "@type": "ImageObject",
        "url": "https://eternia-blogs.vercel.app/logo.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://eternia-blogs.vercel.app/publications/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld-json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-grow pt-32 pb-24 bg-background animate-fade-in">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {/* Back button */}
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Publications
          </Link>

          {/* Title and metadata */}
          <div className="space-y-6">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground border-b border-border/40 pb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTime} min read
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-accent/5 border border-accent/10 text-accent font-semibold">
                {article.category.name}
              </span>
            </div>
          </div>

          {/* Layout: Narrow single-column for distraction-free reading */}
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="border-l-2 border-accent/80 pl-4 py-1 italic font-serif text-lg text-muted-foreground">
              &ldquo;{article.excerpt}&rdquo;
            </div>

            {/* Editorial Body */}
            <article className="editorial-body">
              {article.content.split("\n\n").map((para, i) => {
                if (para.startsWith("### ")) {
                  return <h3 key={i}>{para.replace("### ", "")}</h3>;
                }
                if (para.startsWith("## ")) {
                  return <h2 key={i}>{para.replace("## ", "")}</h2>;
                }
                if (para.startsWith("- ") || para.startsWith("* ")) {
                  return (
                    <ul key={i}>
                      {para.split("\n").map((li, idx) => {
                        const cleanLi = li.replace(/^[-\*]\s+/, "");
                        // Support nested lists/descriptions if they start with spaces
                        const isMainItem = li.startsWith("- ") || li.startsWith("* ");
                        return (
                          <li key={idx} className={`flex items-start gap-2 mb-2 ${isMainItem ? "" : "pl-6 text-muted-foreground text-sm font-light"}`}>
                            {isMainItem && <Check className="w-4 h-4 text-accent shrink-0 mt-1" />}
                            <span>{cleanLi}</span>
                          </li>
                        );
                      })}
                    </ul>
                  );
                }
                return <p key={i} className={i === 0 ? "dropcap" : ""}>{para}</p>;
              })}
            </article>

            {/* Structured FAQ Accordions */}
            {faqList.length > 0 && (
              <div className="pt-10 border-t border-border/40 space-y-6">
                <h3 className="font-serif text-xl font-bold text-primary">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqList.map((faq, idx) => (
                    <div
                      key={idx}
                      className="border border-border/40 rounded-xl p-4 bg-muted/20 space-y-2"
                    >
                      <h4 className="font-bold text-sm text-primary">
                        {faq.q}
                      </h4>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-border/40" />

            {/* Dynamic Waitlist CTA */}
            <div className="bg-muted/30 border border-border/40 rounded-2xl p-6 text-center space-y-4">
              <h3 className="font-serif text-lg font-bold text-primary">
                Join the private launch waitlist
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Secure your spot and demonstrate student demand for private, zero-knowledge support networks on campus.
              </p>
              <div className="pt-2">
                <Link
                  href="/#waitlist"
                  className="px-6 py-3 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-accent transition-colors shadow-sm inline-block"
                >
                  Join Waitlist
                </Link>
              </div>
            </div>
          </div>

          {/* Related Articles Section */}
          {relatedPublications.length > 0 && (
            <div className="space-y-6 pt-12 border-t border-border/40">
              <h3 className="font-serif text-2xl font-bold text-primary">
                More Campus Publications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPublications.map((art) => (
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
