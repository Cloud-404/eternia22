import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConfessionForm from "@/components/ConfessionForm";
import { ShieldCheck, HeartHandshake } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ConfessionsPage() {
  // Query all approved confessions
  const confessions = await prisma.confession.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />

      <main className="flex-grow min-h-screen bg-background pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Header block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-border/40 pb-12">
            <div className="lg:col-span-6 space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-primary">
                Anonymous Confessions
              </h1>
              <p className="font-serif text-lg font-light text-muted-foreground leading-relaxed">
                A secure space for university students to share their hidden thoughts, anxiety, and struggles. Reading others&apos; raw words breaks the isolation loop. Sharing your own lightens the load.
              </p>
              
              <div className="flex flex-col gap-3 pt-4">
                <div className="flex items-start gap-2 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 p-4 rounded-xl border border-emerald-100/50 dark:border-emerald-950/25">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs leading-normal">
                    <strong>Zero Tracking:</strong> We do not log IP addresses, browser agents, or session IDs. Your submission is 100% anonymous.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-slate-50 text-slate-800 dark:bg-slate-900/60 dark:text-slate-300 p-4 rounded-xl border border-border/40">
                  <HeartHandshake className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs leading-normal">
                    <strong>Editorial Review:</strong> Every confession is reviewed before publishing to filter out self-harm details, hate speech, or identifiable student information.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              {/* Form container */}
              <ConfessionForm />
            </div>
          </div>

          {/* Animated Image Belt */}
          <div className="w-full overflow-hidden py-6 bg-muted/10 border-t border-b border-border/40 my-8">
            <div className="relative w-full flex items-center">
              <div className="animate-marquee flex gap-6 items-center">
                {/* Belt item set 1 */}
                <div className="w-48 h-32 rounded-xl bg-gradient-to-tr from-accent/20 to-secondary/30 border border-accent/15 flex items-center justify-center font-serif text-sm italic text-primary/70 px-4 text-center shrink-0">"Feeling overwhelmed is normal"</div>
                <div className="w-64 h-32 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border/40 flex items-center justify-center font-serif text-sm italic text-primary/70 px-4 text-center shrink-0">"It's okay to step back"</div>
                <div className="w-32 h-32 rounded-xl bg-gradient-to-tr from-slate-100 to-amber-50 dark:from-slate-900 dark:to-slate-800 border border-border/40 flex items-center justify-center font-serif text-sm italic text-primary/70 px-4 text-center shrink-0">"Just breathe."</div>
                <div className="w-56 h-32 rounded-xl bg-gradient-to-tr from-rose-50 to-primary/10 dark:from-rose-950/20 dark:to-primary/15 border border-border/40 flex items-center justify-center font-serif text-sm italic text-primary/70 px-4 text-center shrink-0">"You are not your grades"</div>
                <div className="w-40 h-32 rounded-xl bg-gradient-to-br from-teal-50 to-secondary/30 dark:from-teal-950/15 dark:to-secondary/20 border border-border/40 flex items-center justify-center font-serif text-sm italic text-primary/70 px-4 text-center shrink-0">"Take it day by day"</div>
                <div className="w-60 h-32 rounded-xl bg-gradient-to-tr from-accent/15 to-primary/10 border border-border/40 flex items-center justify-center font-serif text-sm italic text-primary/70 px-4 text-center shrink-0">"Your struggles are valid"</div>

                {/* Belt item set 2 (duplicate to ensure continuous looping) */}
                <div className="w-48 h-32 rounded-xl bg-gradient-to-tr from-accent/20 to-secondary/30 border border-accent/15 flex items-center justify-center font-serif text-sm italic text-primary/70 px-4 text-center shrink-0">"Feeling overwhelmed is normal"</div>
                <div className="w-64 h-32 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border/40 flex items-center justify-center font-serif text-sm italic text-primary/70 px-4 text-center shrink-0">"It's okay to step back"</div>
                <div className="w-32 h-32 rounded-xl bg-gradient-to-tr from-slate-100 to-amber-50 dark:from-slate-900 dark:to-slate-800 border border-border/40 flex items-center justify-center font-serif text-sm italic text-primary/70 px-4 text-center shrink-0">"Just breathe."</div>
                <div className="w-56 h-32 rounded-xl bg-gradient-to-tr from-rose-50 to-primary/10 dark:from-rose-950/20 dark:to-primary/15 border border-border/40 flex items-center justify-center font-serif text-sm italic text-primary/70 px-4 text-center shrink-0">"You are not your grades"</div>
                <div className="w-40 h-32 rounded-xl bg-gradient-to-br from-teal-50 to-secondary/30 dark:from-teal-950/15 dark:to-secondary/20 border border-border/40 flex items-center justify-center font-serif text-sm italic text-primary/70 px-4 text-center shrink-0">"Take it day by day"</div>
                <div className="w-60 h-32 rounded-xl bg-gradient-to-tr from-accent/15 to-primary/10 border border-border/40 flex items-center justify-center font-serif text-sm italic text-primary/70 px-4 text-center shrink-0">"Your struggles are valid"</div>
              </div>
            </div>
          </div>

          {/* Grid display */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-primary">
              Student Contributions ({confessions.length})
            </h2>

            {confessions.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground border border-dashed rounded-2xl">
                No approved confessions on the wall yet. Be the first to share.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {confessions.map((c) => (
                  <div
                    key={c.id}
                    className="bg-card border border-border/30 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-accent/40 transition-colors"
                  >
                    <p className="font-serif text-base italic text-primary/95 leading-relaxed mb-6">
                      &ldquo;{c.content}&rdquo;
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-semibold">{c.campus || "Verified Student"}</span>
                      <span>
                        {new Date(c.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
