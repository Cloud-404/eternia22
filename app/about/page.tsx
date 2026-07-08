import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Sparkles, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Eternia | Our Mission & Core Pillars",
  description: "Learn about Eternia's mission, early intervention strategies, and our dedication to building private, military-grade student peer networks.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="flex-grow min-h-screen bg-background pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          
          {/* Mission & Vision Section */}
          <section className="space-y-6">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Our Foundation
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-primary">
                About Eternia
              </h1>
              <p className="font-serif text-lg font-light text-muted-foreground leading-relaxed">
                Eternia is a privacy-first mental wellbeing platform designed specifically for students in schools and universities. We provide a two way safe, anonymous, yet verified ecosystem where students can seek emotional support, connect with trained peer listeners, access mental health professionals, and engage with self-help wellness tools without fear of stigma or judgment.
              </p>
            </div>

            <hr className="border-border/40" />

            {/* Technical Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
              <div className="space-y-3 p-6 bg-card border border-border/30 rounded-2xl shadow-sm">
                <Shield className="w-6 h-6 text-accent" />
                <h3 className="font-serif text-base font-bold text-primary">Military-Grade Privacy</h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  We use zero-knowledge architecture. No IP logs. No student IDs. Your answers and inquiries belong entirely to you, and cannot be accessed by campus systems.
                </p>
              </div>
              <div className="space-y-3 p-6 bg-card border border-border/30 rounded-2xl shadow-sm">
                <Heart className="w-6 h-6 text-accent" />
                <h3 className="font-serif text-base font-bold text-primary">Trauma-Informed</h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  We design with clinical empathy. No clinical jargon. No scare tactics. We focus on warning signs, systemic causes, and biological normalization.
                </p>
              </div>
              <div className="space-y-3 p-6 bg-card border border-border/30 rounded-2xl shadow-sm">
                <Sparkles className="w-6 h-6 text-accent" />
                <h3 className="font-serif text-base font-bold text-primary">Early Intervention</h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  By validating student struggles through authentic storytelling before crises escalate, we encourage early, voluntary, self-guided wellness exploration.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-border/40" />

          {/* Call to action panel */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-3 max-w-xl">
              <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                Help Us Build Safe Campus Networks
              </h3>
              <p className="text-sm text-primary-foreground/80 font-light leading-relaxed">
                Join over 200+ students on the waitlist for the launching of our secure support network. Safe. Anonymous. Built for you.
              </p>
            </div>
            
            <Link
              href="/#waitlist"
              className="px-8 py-4 bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity shrink-0 flex items-center gap-2 shadow-md cursor-pointer"
            >
              Join the Waitlist <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
