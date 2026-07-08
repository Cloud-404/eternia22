"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    readingTime: number;
    publishedAt: string | Date;
    featuredImage: string;
    isStory: boolean;
    category: {
      name: string;
      slug: string;
    };
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // Safe Date Formatting
  const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const detailLink = article.category.slug === "initiatives"
    ? `/publications/${article.slug}`
    : (article.isStory ? `/stories/${article.slug}` : `/articles/${article.slug}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-card hover:shadow-md transition-all duration-300 h-full"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        {/* Editorial Cover Placeholder Graphic */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-accent/5 to-secondary/15 flex items-center justify-center p-6 text-center select-none">
          <span className="font-serif text-3xl font-bold tracking-tight text-primary/30 opacity-70 group-hover:scale-105 transition-transform duration-500">
            {article.title.split(" ").slice(0, 3).join(" ")}...
          </span>
        </div>
        {/* Subtle cover overlay */}
        <div className="absolute inset-0 bg-primary/5 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-0" />
      </div>

      <div className="flex flex-col flex-1 p-6 space-y-4">
        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="text-accent">{article.category.name}</span>
          <span className="h-3 w-[1px] bg-border" />
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readingTime} min read
          </span>
        </div>

        {/* Title & Excerpt */}
        <div className="space-y-2 flex-1">
          <h3 className="font-serif text-xl md:text-2xl font-bold text-primary group-hover:text-accent transition-colors leading-tight">
            <Link href={detailLink}>
              {article.title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3 font-light">
            {article.excerpt}
          </p>
        </div>

        <hr className="border-border/40" />

        {/* Card Action Link */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground font-light">{formattedDate}</span>
          <Link
            href={detailLink}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary hover:text-accent group-hover:translate-x-1 transition-all duration-200"
          >
            Read Editorial <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
