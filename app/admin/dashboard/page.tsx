import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FileText, HeartHandshake, BarChart3, AlertCircle, ShieldAlert, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverview() {
  // Query counts
  const totalArticles = await prisma.article.count();
  const pendingConfessions = await prisma.confession.count({ where: { status: "PENDING" } });
  const approvedConfessions = await prisma.confession.count({ where: { status: "APPROVED" } });
  const totalResponses = await prisma.surveyResponse.count();

  // Query latest pending confessions
  const latestPending = await prisma.confession.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="space-y-8 text-slate-100">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Publications</span>
            <FileText className="w-5 h-5 text-accent" />
          </div>
          <div className="text-3xl font-bold font-serif text-white">{totalArticles}</div>
          <div className="text-[10px] text-slate-500">Stories & Science articles</div>
        </div>

        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-2 relative overflow-hidden">
          {pendingConfessions > 0 && (
            <div className="absolute top-0 right-0 h-1.5 w-full bg-amber-500 animate-pulse" />
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending Review</span>
            <ShieldAlert className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-bold font-serif text-white">{pendingConfessions}</div>
          <div className="text-[10px] text-slate-500">Confessions needing moderation</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Approved Confessions</span>
            <HeartHandshake className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold font-serif text-white">{approvedConfessions}</div>
          <div className="text-[10px] text-slate-500">Active on confessions wall</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Survey Answers</span>
            <BarChart3 className="w-5 h-5 text-sky-500" />
          </div>
          <div className="text-3xl font-bold font-serif text-white">{totalResponses}</div>
          <div className="text-[10px] text-slate-500">Contributions registered</div>
        </div>
      </div>

      {/* Moderation Warning & Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Pending Queue */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-white">Pending Confessions Queue</h3>
            <Link
              href="/admin/dashboard/confessions"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              All Confessions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {latestPending.length === 0 ? (
            <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl text-sm">
              All clear. No confessions pending review.
            </div>
          ) : (
            <div className="space-y-4">
              {latestPending.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-3"
                >
                  <p className="font-serif text-sm italic text-slate-300 leading-relaxed">
                    &ldquo;{c.content}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    <span>Campus: {c.campus || "Not Specified"}</span>
                    <span>Received: {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick actions panel */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="font-serif text-lg font-bold text-white">Editorial Shortcuts</h3>
          
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/dashboard/articles?action=new"
              className="w-full text-center py-3 rounded-xl bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Write New Article
            </Link>
            <Link
              href="/admin/dashboard/surveys?action=new"
              className="w-full text-center py-3 rounded-xl border border-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider hover:bg-slate-850 transition-colors"
            >
              Manage Live Surveys
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
