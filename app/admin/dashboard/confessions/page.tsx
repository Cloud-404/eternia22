"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Loader2, HeartHandshake, Eye } from "lucide-react";

interface Confession {
  id: string;
  content: string;
  status: string;
  campus: string | null;
  createdAt: string;
}

export default function ConfessionsModerationPage() {
  const [pending, setPending] = useState<Confession[]>([]);
  const [approved, setApproved] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch approved list from public API
      const appRes = await fetch("/api/confessions");
      let appData: Confession[] = [];
      if (appRes.ok) {
        appData = await appRes.json();
      }

      // Fetch all to find pending (since it's a small app, we can write an admin API or just query)
      // For absolute correctness, let's query a dedicated endpoint or query the public one and fetch pending.
      // Wait, let's write an admin API to fetch pending confessions or fetch both.
      // Let's create an API route app/api/admin/confessions/list/route.ts or fetch both.
      // Wait! We can just fetch from an admin list route.
      const res = await fetch("/api/admin/confessions/list");
      if (res.ok) {
        const data = await res.json();
        setPending(data.pending || []);
        setApproved(data.approved || appData);
      } else {
        setApproved(appData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleModerate = async (id: string, action: "APPROVE" | "REJECT") => {
    try {
      setActionId(id);
      const res = await fetch("/api/admin/confessions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        // Refresh local lists
        setPending((prev) => prev.filter((c) => c.id !== id));
        if (action === "APPROVE") {
          const item = pending.find((c) => c.id === id);
          if (item) {
            setApproved((prev) => [
              { ...item, status: "APPROVED" },
              ...prev,
            ]);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-8 text-slate-100">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-bold text-white">Confession Moderation Queue</h1>
        <p className="text-sm text-slate-400 font-light">
          Review anonymous contributions for safety before publication. Avoid self-harm methodologies or names.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Pending Queue */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="font-serif text-lg font-bold text-white">Pending Review ({pending.length})</h3>

            {pending.length === 0 ? (
              <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl text-sm">
                Queue is empty. No pending confessions.
              </div>
            ) : (
              <div className="space-y-4">
                {pending.map((c) => (
                  <div
                    key={c.id}
                    className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4"
                  >
                    <p className="font-serif text-sm italic text-slate-350 leading-relaxed">
                      &ldquo;{c.content}&rdquo;
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-900">
                      <span className="text-[10px] text-slate-500">Campus: {c.campus || "Not specified"}</span>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleModerate(c.id, "REJECT")}
                          disabled={actionId !== null}
                          className="p-1.5 rounded-lg border border-rose-900/40 text-rose-500 hover:bg-rose-950/20 disabled:opacity-50 transition-colors"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleModerate(c.id, "APPROVE")}
                          disabled={actionId !== null}
                          className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-900/40 text-emerald-400 hover:bg-emerald-900/40 disabled:opacity-50 transition-colors flex items-center gap-1 text-xs font-semibold"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" /> Approve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Recently Approved List */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="font-serif text-lg font-bold text-white">Live Wall Archives ({approved.length})</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {approved.map((c) => (
                <div key={c.id} className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-2">
                  <p className="font-serif text-xs italic text-slate-400 leading-normal">
                    &ldquo;{c.content}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-slate-900">
                    <span>{c.campus || "Verified Student"}</span>
                    <span>Approved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
