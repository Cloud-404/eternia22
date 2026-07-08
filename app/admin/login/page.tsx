"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Lock, User, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "session_expired") {
      setError("Your session has expired. Please log in again.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      setError("A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
      {/* Subtle blur background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="text-center space-y-3">
        <Link href="/" className="inline-flex items-center justify-center gap-2 group">
          <span className="p-1.5 rounded-lg bg-accent text-accent-foreground">
            <Heart className="w-5 h-5 fill-current animate-pulse" />
          </span>
          <span className="font-serif text-2xl font-bold tracking-tight text-white">
            Eternia
          </span>
        </Link>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 pt-2">
          Admin Journal Portal
        </h2>
      </div>

      {error && (
        <div className="bg-rose-950/40 text-rose-300 border border-rose-900/50 p-4 rounded-xl text-xs flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Username
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider bg-accent text-accent-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Authorizing...
            </>
          ) : (
            "Log In"
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
          &larr; Return to Journal Frontpage
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex-grow min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-150">
      <Suspense fallback={<div className="text-center text-slate-400">Loading admin portal...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
