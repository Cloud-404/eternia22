"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mail, Loader2, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, increment } from "firebase/firestore";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(243);
  const [displayCount, setDisplayCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch count on component mount
  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/waitlist");
        if (res.ok) {
          const data = await res.json();
          if (data.count) {
            setCount(data.count);
          }
        }
      } catch (e) {
        console.error("Failed to load waitlist count", e);
      }
    }
    fetchCount();
  }, []);

  // Listen to Firestore real-time updates
  useEffect(() => {
    if (!db) return;

    try {
      const docRef = doc(db, "waitlist", "counter");
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && typeof data.count === "number") {
              setCount(data.count);
              if (hasAnimated) {
                setDisplayCount(data.count);
              }
            }
          } else {
            console.warn("Firestore document waitlist/counter does not exist.");
          }
        },
        (error) => {
          console.error("Firestore onSnapshot error:", error);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.error("Failed to set up Firestore snapshot listener:", e);
    }
  }, [hasAnimated]);

  // Scroll count-up animation when visible
  useEffect(() => {
    const currentRef = containerRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startValue = 0;
          const endValue = count;
          const duration = 1200; // Animation duration in ms
          const increment = endValue > 100 ? Math.ceil(endValue / 60) : 1;
          const stepTime = Math.abs(Math.floor(duration / (endValue / increment)));

          const timer = setInterval(() => {
            startValue += increment;
            if (startValue >= endValue) {
              setDisplayCount(endValue);
              clearInterval(timer);
            } else {
              setDisplayCount(startValue);
            }
          }, stepTime);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [count, hasAnimated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setStatus("idle");
    setMessage("");

    // Generate unique placeholder email if empty to pass database constraints
    const isAnonymous = !email.trim();
    const finalEmail = isAnonymous
      ? `anonymous_${Date.now()}_${Math.floor(Math.random() * 10000)}@eternia.internal`
      : email.trim();

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: finalEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        // Increment Firestore count atomically if initialized
        if (db) {
          try {
            const docRef = doc(db, "waitlist", "counter");
            await updateDoc(docRef, {
              count: increment(1),
            });
          } catch (fireErr) {
            console.error("Failed to increment waitlist counter in Firestore:", fireErr);
            // Fallback to SQLite count if Firestore update fails
            if (data.count) {
              setCount(data.count);
              setDisplayCount(data.count);
            }
          }
        } else {
          // Fallback to SQLite count if Firebase is not configured
          if (data.count) {
            setCount(data.count);
            setDisplayCount(data.count);
          }
        }

        setStatus("success");
        setMessage(
          isAnonymous
            ? "Welcome! You've joined the waitlist anonymously."
            : "Welcome! You've been added to the waitlist."
        );
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Connection error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-card border border-border/40 rounded-2xl p-8 max-w-xl mx-auto shadow-sm relative overflow-hidden"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
        <Sparkles className="w-4 h-4" /> Exclusive Waitlist Access
      </div>

      <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary mb-2">
        Join the Eternia Waitlist
      </h3>
      
      <p className="text-sm text-muted-foreground font-light mb-6 leading-relaxed">
        Be the first to know when we launch our secure, military-grade encrypted peer-support network for university students. 
      </p>

      {/* Large Highlighted Counter Block */}
      <div className="flex flex-col items-center justify-center p-6 bg-accent/5 border border-accent/15 rounded-2xl text-center mb-6">
        <span className="text-5xl md:text-6xl font-bold font-serif text-accent tracking-tight">
          {displayCount}+
        </span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mt-2.5">
          Students already joined the waitlist
        </span>
      </div>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-5 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 rounded-xl border border-emerald-100/50 dark:border-emerald-950/20 space-y-2 mb-2"
          >
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Subscription Confirmed
            </div>
            <p className="text-xs font-light leading-relaxed">
              {message} We&apos;ve reserved your spot. We will reach out anonymously when early-access slots open.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="waitlist-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label htmlFor="waitlist-email" className="text-xxs font-semibold uppercase tracking-wider text-muted-foreground">
                University Email (Optional)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-muted-foreground/50">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="waitlist-email"
                  type="email"
                  placeholder="student@university.edu (or leave blank to join anonymously)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border/60 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors text-primary"
                />
              </div>
            </div>

            {status === "error" && (
              <p className="text-xs text-rose-500 font-medium">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Secure Your Spot
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xxs text-muted-foreground/80 font-light pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>We never share your email. Zero-knowledge data handling.</span>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
