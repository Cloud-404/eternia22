"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, Shield, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress for article pages
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }

      // Check if scrolled for navbar background styling
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Stories", href: "/stories" },
    { name: "Mental Health", href: "/articles" },
    { name: "Confessions", href: "/confessions" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Surveys", href: "/surveys" },
    { name: "Publications", href: "/publications" },
    { name: "About", href: "/about" },
  ];

  const isArticleOrStory = pathname.includes("/stories/") || pathname.includes("/articles/");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm"
          : "bg-transparent"
      }`}
    >
      {/* Scroll Progress Bar for Articles */}
      {isArticleOrStory && (
        <div className="absolute top-0 left-0 w-full h-[3px] bg-muted/30">
          <div
            className="h-full bg-accent transition-all duration-75 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="p-1.5 rounded-lg bg-primary text-primary-foreground group-hover:bg-accent transition-colors duration-300">
            <Heart className="w-5 h-5 fill-current" />
          </span>
          <span className="font-serif text-2xl font-bold tracking-tight text-primary">
            Eternia
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-accent relative py-1 ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA & Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            title="Admin Dashboard"
          >
            <Lock className="w-4 h-4" />
          </Link>
          
          <Link
            href="/#waitlist"
            className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-accent transition-colors duration-300 shadow-sm"
          >
            Join Waitlist
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-border bg-background px-6 py-8 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-lg font-medium transition-colors ${
                      isActive ? "text-accent" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <hr className="border-border/60" />

            <div className="flex flex-col gap-4">
              <Link
                href="/#waitlist"
                className="w-full text-center py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:bg-accent transition-colors"
              >
                Join Waitlist
              </Link>
              
              <Link
                href="/admin/dashboard"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-muted-foreground text-sm hover:text-primary transition-colors"
              >
                <Lock className="w-4 h-4" /> Admin Portal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
