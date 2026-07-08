import React from "react";
import Link from "next/link";
import { Heart, ArrowRight, ShieldCheck, ShieldAlert, Sparkles, BookOpen } from "lucide-react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import WaitlistForm from "@/components/WaitlistForm";

// Force Dynamic Rendering to ensure live surveys and confessions update
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 1. Fetch data from Prisma
  const recentArticles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  const confessions = await prisma.confession.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const achievements = await prisma.achievement.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { approved: true },
    take: 2,
  });

  return (
    <>

      <Navbar />

      <main className="flex-grow pt-20">
        {/* 1. Hero / Emotional Opening Statement */}
        <section className="relative bg-background overflow-hidden py-24 md:py-32 border-b border-border/40">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 text-xs font-semibold uppercase tracking-widest text-accent mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Introducing Eternia
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-primary leading-tight">
              You are not an outlier. <br className="hidden sm:inline" />
              Your feelings are real.
            </h1>
            
            <p className="font-serif text-lg md:text-xl font-light text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Eternia is a privacy-first mental wellbeing platform designed specifically for students in schools and universities. We provide a two way safe, anonymous, yet verified ecosystem where students can seek emotional support, connect with trained peer listeners, access mental health professionals, and engage with self-help wellness tools without fear of stigma or judgment.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/stories"
                className="px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-accent transition-colors shadow-sm"
              >
                Read Student Stories
              </Link>
              <Link
                href="#waitlist"
                className="px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                Join Waitlist
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Student Struggles: Empathy Banner */}
        <section className="py-20 bg-muted/30 border-b border-border/40">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <span className="font-serif text-3xl font-extrabold text-accent/25">01</span>
              <h3 className="font-serif text-lg font-bold text-primary">Academic & Family Pressure</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                When the expectation of a perfect grade is compounded by family expectations and the internal panic of failing. We look behind the numbers to validate the exhausting weight of performance and parental pressure.
              </p>
            </div>
            <div className="space-y-3">
              <span className="font-serif text-3xl font-extrabold text-accent/25">02</span>
              <h3 className="font-serif text-lg font-bold text-primary">Fear of Stigma & Judgment</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Worrying about what peers, roommates, or teachers will think if they see you struggle. We address the silent stress of imposter syndrome and the constant pressure to look perfect on the outside.
              </p>
            </div>
            <div className="space-y-3">
              <span className="font-serif text-3xl font-extrabold text-accent/25">03</span>
              <h3 className="font-serif text-lg font-bold text-primary">Emotional & Exam Anxiety</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                Understanding that exam panic and daily overwhelm are physiological stress responses, not personal failures. We break down nervous system overdrive and offer self-help tools to navigate daily stress.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Join Waitlist */}
        <section id="waitlist" className="py-20 bg-background border-b border-border/40 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-primary leading-tight">
                Empowering students to take control of their wellness.
              </h2>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                Universities often measure success by completion rates, and counseling programs by months-long waitlists. We believe the real solution is a secure, decentralized support network.
              </p>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                By joining our early-access waitlist, you help demonstrate the student demand for private, zero-knowledge support tools. You will receive exclusive early access to the platform and updates on our encrypted peer-network rollout.
              </p>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Fully secure registration with zero-knowledge data handling.
              </div>
            </div>

            <div className="lg:col-span-6">
              <WaitlistForm />
            </div>
          </div>
        </section>

        {/* 4. Anonymous Student Confessions Wall */}
        <section className="py-20 bg-muted/20 border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-primary">
                Anonymous Confessions
              </h2>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                A private outlet for thoughts too heavy to carry, showing every student they are not alone in their silent battles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {confessions.map((c) => (
                <div
                  key={c.id}
                  className="bg-card border border-border/30 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
                >
                  <p className="font-serif text-base italic text-primary/90 leading-relaxed mb-6">
                    &ldquo;{c.content}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold">{c.campus || "Verified Student"}</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <Link
                href="/confessions"
                className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-accent hover:text-primary transition-colors"
              >
                View Confessions Wall & Share Yours <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Recent Stories & Expert Insights */}
        <section className="py-20 bg-background border-b border-border/40">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-3">
                <Link href="/publications" className="group inline-flex items-center gap-2 hover:text-accent transition-colors">
                  <h2 className="font-serif text-3xl font-bold tracking-tight text-primary group-hover:text-accent transition-colors">
                    Recent Publications
                  </h2>
                  <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 text-accent" />
                </Link>
                <p className="text-sm text-muted-foreground font-light">
                  Stories of resilience and academic psychology explained.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/stories"
                  className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-border hover:bg-muted transition-colors"
                >
                  All Student Stories
                </Link>
                <Link
                  href="/articles"
                  className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-border hover:bg-muted transition-colors"
                >
                  All Psychology Articles
                </Link>
                <Link
                  href="/publications"
                  className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-accent transition-colors shadow-sm"
                >
                  All Publications
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>


        {/* 7. Eternia's Mission / Approach */}
        <section className="py-20 bg-background border-b border-border/40">
          <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
            <div className="p-3 bg-accent/5 text-accent rounded-full w-fit mx-auto border border-accent/10">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            
            <h2 className="font-serif text-3xl font-bold tracking-tight text-primary max-w-xl mx-auto">
              Our Vision: Privacy-First Mental Wellness
            </h2>
            
            <p className="text-base text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              Eternia is a mission to build military-grade, encrypted support networks for university students. We believe that seeking help should never be recorded on institutional systems, tracked by advertisers, or disclosed without absolute consent.
            </p>

            <div className="pt-4">
              <Link
                href="/about"
                className="px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-accent transition-colors shadow-sm"
              >
                Learn More About Our Mission
              </Link>
            </div>
          </div>
        </section>

        {/* 8. Achievements & Partnerships */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-3">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-primary">
                Community Impact
              </h2>
              <p className="text-sm text-muted-foreground font-light">
                Milestones in our journey to build private student support networks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className="bg-card border border-border/30 rounded-2xl p-6 shadow-sm space-y-3"
                >
                  <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                    {a.date}
                  </span>
                  <div className="text-2xl font-serif font-bold text-primary">
                    {a.metric}
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-primary">{a.title}</h4>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {a.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <div className="pt-12 border-t border-border/40 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((t) => (
                  <div key={t.id} className="space-y-4">
                    <p className="font-serif text-lg italic text-primary/80 leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="text-xs text-muted-foreground font-medium">
                      — {t.authorName}, <span className="font-light">{t.authorRole}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
