"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowUpRight, Compass, Layers, Zap } from "lucide-react";

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg text-white">Novasco</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hidden sm:inline-block">
            Studio
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <a href="#tools" className="hover:text-white transition-colors">
            AI Tools
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Fitur Studio
          </a>
          <a href="#architecture" className="hover:text-white transition-colors">
            Edge Stack
          </a>
        </nav>

        {/* Action Button (Public - no conspicuous admin button) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#tools"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)] transition-all"
          >
            <span>Eksplorasi Tools</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-white/10 bg-slate-950/95 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            <a
              href="#tools"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Katalog Tools AI
            </a>
            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Fitur Studio
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              Teknologi Edge
            </a>
          </nav>
          <div className="pt-2 border-t border-white/10">
            <a
              href="#tools"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg"
            >
              <span>Eksplorasi Katalog</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
