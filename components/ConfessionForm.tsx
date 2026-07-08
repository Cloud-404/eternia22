"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ConfessionForm() {
  const [content, setContent] = useState("");
  const [campus, setCampus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 10) {
      setError("Confession must be at least 10 characters long.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, campus }),
      });

      if (res.ok) {
        setSuccess(true);
        setContent("");
        setCampus("");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-card border border-border/40 rounded-2xl p-8 text-center space-y-4 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl font-bold text-primary">Confession Submitted</h3>
        <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-sm mx-auto">
          Thank you for sharing your thoughts. Your confession has been sent to our moderation queue. Once reviewed for safety guidelines, it will appear on the wall.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-border hover:bg-muted transition-colors"
        >
          Share Another Thought
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm"
    >
      <h3 className="font-serif text-lg md:text-xl font-bold text-primary border-b border-border/40 pb-2">
        Share Your Confession
      </h3>

      {error && (
        <div className="bg-rose-50 text-rose-800 dark:bg-rose-950/25 dark:text-rose-400 p-4 rounded-xl border border-rose-100 dark:border-rose-950/25 text-xs flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="confession-text" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your thoughts (Max 500 characters)
        </label>
        <textarea
          id="confession-text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          placeholder="I feel like everyone around me is thriving, and I'm just..."
          rows={4}
          required
          className="w-full bg-background border border-border/60 rounded-xl p-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors"
        />
        <div className="text-right text-xs text-muted-foreground font-light">
          {content.length}/500 characters
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="campus-select" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          University Campus (Optional)
        </label>
        <input
          id="campus-select"
          type="text"
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          placeholder="e.g. Northeastern University"
          className="w-full bg-background border border-border/60 rounded-xl p-3.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading || content.trim().length < 10}
        className="w-full py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> Submit Confession
          </>
        )}
      </button>
    </form>
  );
}
