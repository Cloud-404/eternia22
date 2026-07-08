"use client";

import React, { useState, useEffect } from "react";
import { Plus, Loader2, BarChart3, ToggleLeft, ToggleRight, CheckCircle2, AlertCircle } from "lucide-react";

interface Survey {
  id: string;
  title: string;
  description: string | null;
  options: string;
  isActive: boolean;
  createdAt: string;
  responses: any[];
}

export default function AdminSurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [optionsRaw, setOptionsRaw] = useState(""); // Comma separated

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/surveys");
      if (res.ok) {
        const data = await res.json();
        setSurveys(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      setActionId(id);
      const nextStatus = !currentStatus;
      const res = await fetch("/api/admin/surveys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: nextStatus }),
      });

      if (res.ok) {
        // Refresh listings (since toggling one active deactivates others)
        await fetchSurveys();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !optionsRaw) {
      setError("Title and options are required.");
      return;
    }

    const options = optionsRaw
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);

    if (options.length < 2) {
      setError("Please provide at least 2 options (separated by commas).");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const res = await fetch("/api/admin/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, options }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setOptionsRaw("");
        await fetchSurveys();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create survey.");
      }
    } catch (err) {
      console.error(err);
      setError("Connection error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-100">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl font-bold text-white">Campus Surveys Controller</h1>
        <p className="text-sm text-slate-400 font-light">
          Create, schedule, and aggregate live opinion surveys on campus mental health. Note: only one survey can be active at a time.
        </p>
      </div>

      {error && (
        <div className="bg-rose-950/40 text-rose-300 border border-rose-900/50 p-4 rounded-xl text-xs flex items-start gap-2 max-w-2xl">
          <AlertCircle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Surveys list */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="font-serif text-lg font-bold text-white">Survey Catalogue ({surveys.length})</h3>

            {surveys.length === 0 ? (
              <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl text-sm">
                No surveys created.
              </div>
            ) : (
              <div className="space-y-4">
                {surveys.map((survey) => {
                  const opts: string[] = JSON.parse(survey.options);
                  return (
                    <div
                      key={survey.id}
                      className="bg-slate-950 border border-slate-850 p-5 rounded-xl space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="font-serif text-base font-bold text-white leading-snug">
                            {survey.title}
                          </h4>
                          {survey.description && (
                            <p className="text-xs text-slate-400 font-light">
                              {survey.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleToggle(survey.id, survey.isActive)}
                          disabled={actionId !== null}
                          className="shrink-0 text-slate-400 hover:text-white"
                        >
                          {survey.isActive ? (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-450 font-bold bg-emerald-950/30 border border-emerald-900/40 px-2.5 py-1 rounded-full">
                              <ToggleRight className="w-5 h-5 text-emerald-500" /> Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-800/30 border border-slate-800 px-2.5 py-1 rounded-full">
                              <ToggleLeft className="w-5 h-5" /> Off
                            </div>
                          )}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xxs font-semibold tracking-wider text-slate-500">
                        {opts.map((opt) => (
                          <span key={opt} className="bg-slate-900 border border-slate-850 px-2.5 py-1 rounded-lg">
                            {opt}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-slate-900">
                        <span>Total Responses: {survey.responses.length}</span>
                        <span>Created: {new Date(survey.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Creator Form */}
          <div className="lg:col-span-5">
            <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl sticky top-24">
              <h3 className="font-serif text-lg font-bold text-white border-b border-slate-800 pb-2">
                Create New Survey
              </h3>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Survey Question</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Have you experienced academic burnout?"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Context (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide supporting details..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Options (Comma separated)</label>
                <input
                  type="text"
                  value={optionsRaw}
                  onChange={(e) => setOptionsRaw(e.target.value)}
                  placeholder="e.g. Frequently, Sometimes, Rarely, Never"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm focus:outline-none focus:border-accent"
                />
                <span className="text-[10px] text-slate-500 font-light block pt-1">
                  Separate each option with a comma. Need at least 2 choices.
                </span>
              </div>

              <button
                type="submit"
                disabled={saving || !title || !optionsRaw}
                className="w-full py-3.5 bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1 shadow-lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4.5 h-4.5" /> Publish Survey
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
