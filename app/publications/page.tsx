import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, FileText, Landmark, Newspaper } from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PublicationsPage() {
  // Fetch publications from database (category: initiatives)
  let dbPublications: any[] = [];
  try {
    dbPublications = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        category: {
          slug: "initiatives",
        },
      },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch publications from database:", error);
  }

  const papers = [
    {
      title: "The Stigma of Distress: Why High-Performing Students Avoid Campus Counseling",
      author: "Journal of College Student Development, 2024",
      description: "A qualitative study mapping the psychological barriers that prevent high-achieving undergraduates from visiting physical counseling buildings.",
      url: "#",
    },
    {
      title: "Somatic Symptoms of Academic Stress: Cortisol Spikes and Memory Blockages",
      author: "Cognitive Neuroscience Review, 2023",
      description: "Investigating the biological impact of chronic study stress on the prefrontal cortex during testing environments.",
      url: "#",
    },
    {
      title: "Zero-Knowledge Architectures in Mental Health Technology: A Student Perspective",
      author: "International Journal of Privacy Research, 2025",
      description: "Evaluating how anonymized and decentralized networks increase voluntary participation in mental wellness screenings.",
      url: "#",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-grow min-h-screen bg-background pt-32 pb-24 animate-fade-in">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-primary">
              Publications
            </h1>
            <p className="font-serif text-lg font-light text-muted-foreground leading-relaxed">
              We compile peer-reviewed literature, university policy reviews, and technical briefs investigating the intersections of academic stress, clinical diagnostics, and technical privacy.
            </p>
          </div>

          <hr className="border-border/40" />

          {/* Eternia Press & Publications */}
          {dbPublications.length > 0 && (
            <div className="space-y-8">
              <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-accent" /> Announcements & Press Releases
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {dbPublications.map((pub) => (
                  <Link
                    href={`/publications/${pub.slug}`}
                    key={pub.id}
                    className="block bg-card border border-border/40 rounded-2xl p-6 space-y-3 shadow-sm hover:border-accent/40 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="space-y-1">
                      <span className="text-xxs font-bold uppercase tracking-wider text-accent">
                        {pub.category.name} • {new Date(pub.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-primary group-hover:text-accent transition-colors">
                        {pub.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                      {pub.excerpt}
                    </p>
                    <div className="text-xs font-semibold text-primary/80 group-hover:text-accent transition-colors uppercase tracking-widest pt-1 flex items-center gap-1">
                      Read Announcement &rarr;
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Publications List */}
          <div className="space-y-8">
            <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" /> Peer-Reviewed Publications
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {papers.map((paper, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border/40 rounded-2xl p-6 space-y-3 shadow-sm hover:border-accent/40 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-xxs font-bold uppercase tracking-wider text-accent">
                      {paper.author}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-primary">
                      {paper.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {paper.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Reports Section */}
          <div className="space-y-8 pt-8">
            <h2 className="font-serif text-2xl font-bold text-primary flex items-center gap-2">
              <Landmark className="w-5 h-5 text-accent" /> Campus Reports & Policy Briefs
            </h2>

            <div className="bg-muted/30 border border-border/40 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-accent/5 text-accent shrink-0 border border-accent/10">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-primary">
                    Boston Campus Wellness Audit (AY 2025-2026)
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    A collaborative review evaluating counseling accessibility, intake times, and enrollment data across select northeastern universities. Finding: average counselor-to-student ratios exceed 1:1,500, prompting a critical need for low-friction peer support channels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
