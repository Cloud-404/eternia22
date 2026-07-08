import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { MessageSquare, ArrowRight, ShieldCheck, Video } from "lucide-react";

export const metadata = {
  title: "Eternia | Student Testimonials & Experiences",
  description: "Read real stories and experiences from university students who found validation, relief, and coping strategies through Eternia's private peer support network.",
};

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  highlightText: string;
  videoUrl: string;
  posterUrl: string;
}

const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "testimonial-1",
    name: "Sarah Jenkins",
    role: "Junior, Boston University",
    quote: "Eternia is the first space where I didn't feel pressured to present a perfect version of myself. Recognizing that my academic panic was a biological fight-or-flight trigger—and not a personal deficiency—completely shifted how I handle stress.",
    highlightText: "Academic panic is a biological survival trigger, not a personal failure.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-student-studying-in-a-classroom-41662-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "testimonial-2",
    name: "David Chen",
    role: "Senior, Stanford University",
    quote: "The zero-knowledge architecture gave me the confidence to share confessions I had bottled up for semesters. Seeing other high-achieving students post similar stories made me realize my imposter syndrome was a systemic issue.",
    highlightText: "Seeing other students' raw words broke my silent isolation cycle.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-writing-in-a-notebook-42289-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "testimonial-3",
    name: "Maya Patel",
    role: "Sophomore, UT Austin",
    quote: "I used to sit in my dorm room thinking I was the only one struggling behind a 3.9 GPA. Reading Eternia's stories made me feel heard. The coping guidelines are practical and don't feel like institutional lectures.",
    highlightText: "A safe space that values validation over corporate metric reports.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-in-a-coffee-shop-42323-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "testimonial-4",
    name: "Marcus Vance",
    role: "Graduate Student, Columbia University",
    quote: "Having an independent editorial space that doesn't share data with administrative offices is a game-changer. It bridges the gap between feeling completely overwhelmed and taking early wellness actions.",
    highlightText: "Military-grade data privacy is a non-negotiable for student support.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-student-walking-on-campus-41655-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
  },
];

export default function TestimonialsPage() {
  return (
    <>
      <Navbar />

      <main className="flex-grow min-h-screen bg-background pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {/* Page Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 text-xs font-semibold uppercase tracking-widest text-accent mb-2">
              <MessageSquare className="w-3.5 h-3.5" /> Shared Voices
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-primary">
              Student Experiences
            </h1>
            <p className="font-serif text-lg font-light text-muted-foreground leading-relaxed">
              Read how members of our community transitioned from silent, high-performance isolation to active, self-guided mental wellness.
            </p>
          </div>

          <hr className="border-border/40" />

          {/* Symmetrical Testimonial Rows */}
          <div className="space-y-20">
            {TESTIMONIALS_DATA.map((item, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={item.id}
                  id={item.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center`}
                >
                  {/* Video Block (Odd -> Left, Even -> Right) */}
                  <div
                    className={`lg:col-span-6 relative rounded-2xl overflow-hidden aspect-video border border-border/40 bg-muted/30 shadow-md group ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <video
                      src={item.videoUrl}
                      poster={item.posterUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xxs font-semibold uppercase tracking-widest text-primary flex items-center gap-1.5 border border-border/40">
                      <Video className="w-3.5 h-3.5 text-accent animate-pulse" /> Student Story
                    </div>
                  </div>

                  {/* Text Block (Odd -> Right, Even -> Left) */}
                  <div
                    className={`lg:col-span-6 space-y-6 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    {/* Abstract highlighted line */}
                    <div className="font-serif text-xl md:text-2xl font-bold text-accent leading-relaxed relative pl-4 border-l-2 border-accent">
                      &ldquo;{item.highlightText}&rdquo;
                    </div>

                    {/* Paragraph block */}
                    <p className="font-serif text-base font-light text-muted-foreground leading-relaxed italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>

                    {/* Author credit details */}
                    <div className="space-y-1.5 pt-2 border-t border-border/40">
                      <h4 className="font-sans text-sm font-semibold text-primary">
                        {item.name}
                      </h4>
                      <p className="font-sans text-xs text-muted-foreground font-light">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <hr className="border-border/40" />

          {/* Call to action panel */}
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-3 max-w-xl">
              <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight">
                Your privacy is our priority.
              </h3>
              <p className="text-sm text-primary-foreground/80 font-light leading-relaxed">
                Join over 200+ students on the waitlist for the launching of our secure support network. Safe. Anonymous. Built for you.
              </p>
              <div className="flex items-center gap-2 text-xs text-primary-foreground/60 font-light pt-2">
                <ShieldCheck className="w-4.5 h-4.5 text-accent shrink-0" />
                <span>Encrypted architecture. Zero university system integration.</span>
              </div>
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
