"use client";

import React, { useState, useEffect } from "react";
import { Plus, Loader2, Save, FileText, Check, AlertCircle, X, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  isStory: boolean;
  publishedAt: string;
  category: {
    name: string;
  };
}

export default function AdminArticlesPage() {
  const [view, setView] = useState<"list" | "new">("list");
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [readingTime, setReadingTime] = useState("5");
  const [status, setStatus] = useState("DRAFT");
  const [categoryId, setCategoryId] = useState("");
  const [isStory, setIsStory] = useState(false);
  const [escalation, setEscalation] = useState("");

  // Timeline & Coping strategies dynamic arrays
  const [timeline, setTimeline] = useState<{ time: string; text: string }[]>([]);
  const [coping, setCoping] = useState<{ title: string; text: string }[]>([]);
  
  // FAQ SEO builder
  const [faq, setFaq] = useState<{ q: string; a: string }[]>([]);

  // Fetch listings
  const fetchData = async () => {
    try {
      setLoading(true);
      const artRes = await fetch("/api/articles/list"); // we'll write this endpoint next
      if (artRes.ok) {
        const data = await artRes.json();
        setArticles(data);
      }
      
      const catRes = await fetch("/api/categories");
      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
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

  // Sync Slug automatically with title in draft view
  useEffect(() => {
    if (view === "new" && title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    }
  }, [title, view]);

  const handleAddTimeline = () => {
    setTimeline([...timeline, { time: "", text: "" }]);
  };

  const handleRemoveTimeline = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  const handleTimelineChange = (index: number, field: "time" | "text", val: string) => {
    const updated = [...timeline];
    updated[index][field] = val;
    setTimeline(updated);
  };

  const handleAddCoping = () => {
    setCoping([...coping, { title: "", text: "" }]);
  };

  const handleRemoveCoping = (index: number) => {
    setCoping(coping.filter((_, i) => i !== index));
  };

  const handleCopingChange = (index: number, field: "title" | "text", val: string) => {
    const updated = [...coping];
    updated[index][field] = val;
    setCoping(updated);
  };

  const handleAddFaq = () => {
    setFaq([...faq, { q: "", a: "" }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaq(faq.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: "q" | "a", val: string) => {
    const updated = [...faq];
    updated[index][field] = val;
    setFaq(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content || !categoryId) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          readingTime,
          status,
          isStory,
          categoryId,
          timeline: isStory ? timeline : null,
          copingStrategies: coping.length > 0 ? coping : null,
          escalationExplanation: isStory ? escalation : null,
          faqSchema: faq.length > 0 ? faq : null,
        }),
      });

      if (res.ok) {
        // Reset form & list view
        setTitle("");
        setExcerpt("");
        setContent("");
        setIsStory(false);
        setTimeline([]);
        setCoping([]);
        setFaq([]);
        setEscalation("");
        setView("list");
        await fetchData();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save article.");
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold text-white">Articles Directory</h1>
          <p className="text-sm text-slate-400 font-light">
            Compose student stories, academic research briefs, or psychology deep-dives.
          </p>
        </div>
        {view === "list" && (
          <button
            onClick={() => setView("new")}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg"
          >
            <Plus className="w-4.5 h-4.5" /> Write New Article
          </button>
        )}
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
      ) : view === "list" ? (
        /* LIST VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-850 bg-slate-950/40 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-sm">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-850/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-white max-w-sm truncate">{art.title}</td>
                  <td className="px-6 py-4 text-slate-400">{art.category.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xxs font-semibold ${art.isStory ? "bg-accent/15 text-accent" : "bg-sky-950 text-sky-400"}`}>
                      {art.isStory ? "Student Story" : "Psychology"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xxs font-semibold ${art.status === "PUBLISHED" ? "bg-emerald-950 text-emerald-450" : "bg-slate-800 text-slate-400"}`}>
                      {art.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{new Date(art.publishedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500 font-light text-sm">
                    No articles found. Write your first article today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* EDITOR VIEW */
        <form onSubmit={handleSave} className="space-y-8 max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-serif text-lg font-bold text-white">Write Publication Draft</h3>
            <button
              type="button"
              onClick={() => setView("list")}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Navigating High-Functioning Anxiety"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="navigating-high-functioning-anxiety"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Excerpt / Summary Hook</label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Provide a brief, compelling emotional hook..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Editorial Content (MDX / Text)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Use standard markdown formatting for sections, headings (### Heading), or lists..."
              rows={8}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:outline-none focus:border-accent font-sans"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-accent"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Est. Reading Time (Min)</label>
              <input
                type="number"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-accent"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isStory-check"
                checked={isStory}
                onChange={(e) => setIsStory(e.target.checked)}
                className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-accent focus:ring-0"
              />
              <label htmlFor="isStory-check" className="text-xs font-semibold uppercase tracking-wider text-slate-350 cursor-pointer">
                Student Story Format
              </label>
            </div>
          </div>

          {/* DYNAMIC STORY MODULES */}
          {isStory && (
            <div className="space-y-6 pt-6 border-t border-slate-850">
              <h4 className="font-serif text-base font-bold text-accent">Student Story Modules</h4>
              
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Why it Escalated (Psychological explanation)</label>
                <textarea
                  value={escalation}
                  onChange={(e) => setEscalation(e.target.value)}
                  placeholder="Provide clinical context detailing why the student reached somatic crisis limits..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              {/* Timeline builder */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Story Timeline Checklist</label>
                  <button
                    type="button"
                    onClick={handleAddTimeline}
                    className="text-xxs font-bold uppercase text-accent hover:underline"
                  >
                    + Add Event
                  </button>
                </div>

                <div className="space-y-2">
                  {timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <input
                        type="text"
                        placeholder="Time stamp (e.g. Fall 2025)"
                        value={event.time}
                        onChange={(e) => handleTimelineChange(idx, "time", e.target.value)}
                        className="bg-slate-955 border border-slate-800 rounded-lg p-2 text-xs w-1/3 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={event.text}
                        onChange={(e) => handleTimelineChange(idx, "text", e.target.value)}
                        className="bg-slate-955 border border-slate-800 rounded-lg p-2 text-xs flex-1 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTimeline(idx)}
                        className="p-1 text-slate-500 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC COPING STRATEGIES */}
          <div className="space-y-4 pt-6 border-t border-slate-850">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Coping Strategies</label>
              <button
                type="button"
                onClick={handleAddCoping}
                className="text-xxs font-bold uppercase text-accent hover:underline"
              >
                + Add Strategy
              </button>
            </div>
            
            <div className="space-y-2">
              {coping.map((strategy, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Strategy title (e.g. Box Breathing)"
                    value={strategy.title}
                    onChange={(e) => handleCopingChange(idx, "title", e.target.value)}
                    className="bg-slate-955 border border-slate-800 rounded-lg p-2 text-xs w-1/3 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Instructions..."
                    value={strategy.text}
                    onChange={(e) => handleCopingChange(idx, "text", e.target.value)}
                    className="bg-slate-955 border border-slate-800 rounded-lg p-2 text-xs flex-1 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCoping(idx)}
                    className="p-1 text-slate-500 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SEO FAQ BUILDER */}
          <div className="space-y-4 pt-6 border-t border-slate-850">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">SEO FAQ Schema</label>
              <button
                type="button"
                onClick={handleAddFaq}
                className="text-xxs font-bold uppercase text-accent hover:underline"
              >
                + Add FAQ
              </button>
            </div>

            <div className="space-y-2">
              {faq.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Question"
                    value={item.q}
                    onChange={(e) => handleFaqChange(idx, "q", e.target.value)}
                    className="bg-slate-955 border border-slate-800 rounded-lg p-2 text-xs w-1/3 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Answer"
                    value={item.a}
                    onChange={(e) => handleFaqChange(idx, "a", e.target.value)}
                    className="bg-slate-955 border border-slate-800 rounded-lg p-2 text-xs flex-1 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="p-1 text-slate-500 hover:text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Draft...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Publication
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
