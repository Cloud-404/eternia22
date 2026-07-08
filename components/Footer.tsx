"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShieldCheck, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary/20">
      {/* Newsletter & Privacy Banner */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-primary-foreground/10">
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1.5 rounded-lg bg-accent text-accent-foreground">
                <Heart className="w-5 h-5 fill-current" />
              </span>
              <span className="font-serif text-2xl font-bold tracking-tight">
                Eternia
              </span>
            </div>
            <p className="text-primary-foreground/80 max-w-lg text-base font-light leading-relaxed mb-6 font-serif">
              An editorial journal designed to support and validate the student experience. Through authentic storytelling and psychological framework analysis, we help students transition from isolation to active mental wellness.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-4 max-w-md">
            <ShieldCheck className="w-6 h-6 text-accent shrink-0" />
            <p className="text-xs text-primary-foreground/75 leading-normal">
              <strong>Privacy First:</strong> Eternia is a secure space. Our journal, assessments, and confession systems are private by design. Your identity is protected.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="bg-primary-foreground/5 rounded-2xl p-8 border border-primary-foreground/10">
            <h4 className="font-serif text-lg font-semibold mb-2">Subscribe to Letters from Eternia</h4>
            <p className="text-sm text-primary-foreground/70 mb-6 leading-relaxed">
              Muted thoughts, stories of resilience, and supportive psychology directly to your inbox. No spam. Only validation.
            </p>
            <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
              <div className="absolute left-4 text-primary-foreground/45">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="Enter your university email..."
                required
                className="w-full bg-primary-foreground/10 border border-primary-foreground/10 rounded-full py-3.5 pl-12 pr-16 text-sm placeholder:text-primary-foreground/40 text-primary-foreground focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 p-2 rounded-full bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Links Area */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
        <div>
          <h5 className="text-xs uppercase tracking-widest text-primary-foreground/50 font-bold mb-4">Read</h5>
          <ul className="space-y-2.5 text-sm text-primary-foreground/85 font-light">
            <li><Link href="/stories" className="hover:text-accent transition-colors">Student Stories</Link></li>
            <li><Link href="/articles" className="hover:text-accent transition-colors">Mental Health Articles</Link></li>
            <li><Link href="/confessions" className="hover:text-accent transition-colors">Anonymous Confessions</Link></li>
            <li><Link href="/testimonials" className="hover:text-accent transition-colors">Student Testimonials</Link></li>
            <li><Link href="/publications" className="hover:text-accent transition-colors">Publications</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-widest text-primary-foreground/50 font-bold mb-4">Interact</h5>
          <ul className="space-y-2.5 text-sm text-primary-foreground/85 font-light">
            <li><Link href="/surveys" className="hover:text-accent transition-colors">Student Surveys</Link></li>
            <li><Link href="/blackroom" className="hover:text-accent transition-colors">BlackRoom Project</Link></li>
            <li><Link href="/#waitlist" className="hover:text-accent transition-colors">Join Waitlist</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-widest text-primary-foreground/50 font-bold mb-4">Eternia</h5>
          <ul className="space-y-2.5 text-sm text-primary-foreground/85 font-light">
            <li><Link href="/about" className="hover:text-accent transition-colors">Our Mission</Link></li>
            <li><Link href="/publications" className="hover:text-accent transition-colors">Achievements</Link></li>
            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Team</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-widest text-primary-foreground/50 font-bold mb-4">Contact</h5>
          <ul className="space-y-2.5 text-sm text-primary-foreground/85 font-light">
            <li className="font-semibold text-primary-foreground">Aurenity Innovations Pvt Ltd</li>
            <li>Ph: <a href="tel:9327949245" className="hover:text-accent transition-colors">9327949245</a></li>
            <li>Email: <a href="mailto:outreachteam@aurenity.in" className="hover:text-accent transition-colors">outreachteam@aurenity.in</a></li>
            <li>Founder: <a href="mailto:founder@aurenity.in" className="hover:text-accent transition-colors">founder@aurenity.in</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright & Legal */}
      <div className="bg-primary/95 border-t border-primary-foreground/5 py-8 text-center text-xs text-primary-foreground/45">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Eternia. All rights reserved. Made with compassion for university students.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
            <Link href="/editorial" className="hover:text-primary-foreground transition-colors">Editorial Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
