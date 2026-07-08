"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SurveyPollProps {
  survey: {
    id: string;
    title: string;
    description: string | null;
    options: string; // JSON String of options
  };
}

export default function SurveyPoll({ survey }: SurveyPollProps) {
  const optionsList: string[] = JSON.parse(survey.options);
  const [selected, setSelected] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState<{ [key: string]: number }>({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  // Check if voted previously
  useEffect(() => {
    const votedVal = localStorage.getItem(`survey_voted_${survey.id}`);
    if (votedVal) {
      setHasVoted(true);
      setSelected(votedVal);
      fetchResults();
    } else {
      setStatsLoading(false);
    }
  }, [survey.id]);

  const fetchResults = async () => {
    try {
      setStatsLoading(true);
      const res = await fetch(`/api/surveys?id=${survey.id}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.percentages || {});
        setTotalVotes(data.total || 0);
      }
    } catch (e) {
      console.error("Error loading survey details:", e);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selected || loading) return;

    try {
      setLoading(true);
      const res = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyId: survey.id, selectedOption: selected }),
      });

      if (res.ok) {
        localStorage.setItem(`survey_voted_${survey.id}`, selected);
        setHasVoted(true);
        await fetchResults();
      }
    } catch (e) {
      console.error("Error sending vote:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-8 max-w-xl mx-auto shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
        <BarChart3 className="w-4 h-4" /> Live Student Opinion Poll
      </div>

      <h3 className="font-serif text-xl md:text-2xl font-bold text-primary mb-2">
        {survey.title}
      </h3>
      {survey.description && (
        <p className="text-sm text-muted-foreground font-light mb-6 leading-relaxed">
          {survey.description}
        </p>
      )}

      {statsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {!hasVoted ? (
              <motion.div
                key="voting-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {optionsList.map((option) => {
                  const isSelected = selected === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setSelected(option)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? "bg-accent/5 border-accent text-accent ring-2 ring-accent/10"
                          : "bg-background border-border/50 text-muted-foreground hover:border-accent/40 hover:text-primary"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}

                <button
                  onClick={handleVote}
                  disabled={!selected || loading}
                  className="w-full mt-2 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-accent transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />} Submit Anonymous Response
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="results-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 rounded-xl flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-100/50 dark:border-emerald-950/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Response saved anonymously.
                </div>

                <div className="space-y-4">
                  {optionsList.map((option) => {
                    const percentage = results[option] || 0;
                    const isSelected = selected === option;
                    return (
                      <div key={option} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className={isSelected ? "font-semibold text-primary" : "text-muted-foreground font-light"}>
                            {option} {isSelected && <span className="text-xs text-accent">(Your vote)</span>}
                          </span>
                          <span className="font-semibold text-primary">{percentage.toFixed(0)}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-muted/40 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${isSelected ? "bg-accent" : "bg-primary/50"}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center pt-2 border-t border-border/40 text-xs text-muted-foreground font-light">
                  Total respondents: {totalVotes.toLocaleString()} student contributions
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
