import React from "react";
import { Phone, MessageSquare, HeartHandshake, ShieldAlert } from "lucide-react";

interface CrisisBoxProps {
  className?: string;
  compact?: boolean;
}

export default function CrisisBox({ className = "", compact = false }: CrisisBoxProps) {
  return (
    <div
      className={`rounded-2xl border border-rose-100 bg-rose-50/40 p-6 dark:border-rose-950/20 dark:bg-rose-950/5 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/45 dark:text-rose-400 shrink-0">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h3 className="font-serif text-lg font-semibold text-rose-900 dark:text-rose-200">
            You don&apos;t have to carry this alone
          </h3>
          <p className="text-sm leading-relaxed text-rose-800/80 dark:text-rose-300/80">
            If you are feeling overwhelmed, hopeless, or having thoughts of self-harm, please know there is support available right now. Reaching out is a sign of strength, and people who care are waiting to listen.
          </p>

          {!compact && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-white/80 dark:bg-slate-900/60 rounded-xl p-4 border border-rose-100/50 dark:border-rose-950/10 flex items-start gap-3">
                <Phone className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Call 988 (USA & Canada)
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Suicide & Crisis Lifeline
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                    Free, confidential, available 24/7.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/60 rounded-xl p-4 border border-rose-100/50 dark:border-rose-950/10 flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Text HOME to 741741
                  </h4>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Crisis Text Line
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                    Free crisis support via SMS.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!compact && (
            <div className="pt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-rose-800/60 dark:text-rose-400/60">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                International resources: <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="underline hover:text-rose-700">findahelpline.com</a>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
