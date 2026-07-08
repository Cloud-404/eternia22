"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, HeartHandshake, BarChart3, LogOut, ArrowLeft, Heart } from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Articles", href: "/admin/dashboard/articles", icon: FileText },
    { name: "Confessions", href: "/admin/dashboard/confessions", icon: HeartHandshake },
    { name: "Surveys", href: "/admin/dashboard/surveys", icon: BarChart3 },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
      }
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-150">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="h-20 border-b border-slate-800 px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="p-1 rounded-md bg-accent text-accent-foreground">
                <Heart className="w-4 h-4 fill-current" />
              </span>
              <span className="font-serif text-lg font-bold text-white">Eternia</span>
            </Link>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
              Admin
            </span>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            Frontpage
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen bg-slate-950 overflow-y-auto">
        {/* Top Header info */}
        <header className="h-20 border-b border-slate-800 px-8 flex items-center justify-between shrink-0">
          <h2 className="font-serif text-lg font-bold text-white">
            Journal Editorial Control Panel
          </h2>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Live Connection
            </span>
          </div>
        </header>

        {/* Child pages container */}
        <div className="flex-grow p-8">{children}</div>
      </main>
    </div>
  );
}
