"use client";

import React from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineItem {
  time: string;
  text: string;
}

interface StoryTimelineProps {
  timelineJson: string; // JSON string of TimelineItem[]
}

export default function StoryTimeline({ timelineJson }: StoryTimelineProps) {
  let timeline: TimelineItem[] = [];
  try {
    timeline = JSON.parse(timelineJson);
  } catch (e) {
    console.error("Failed to parse timeline JSON:", e);
    return null;
  }

  if (timeline.length === 0) return null;

  return (
    <div className="space-y-8 my-10">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent border-b border-border/40 pb-2">
        <Clock className="w-4 h-4" /> Story Progression Timeline
      </div>

      <div className="relative border-l border-border/80 ml-3 pl-6 space-y-8">
        {timeline.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative"
          >
            {/* Dotted Marker */}
            <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            </span>

            {/* Time Stamp & Content */}
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                {item.time}
              </span>
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground font-light">
                {item.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
