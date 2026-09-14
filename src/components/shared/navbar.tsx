'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#ddd9cf] bg-[#f7f5ef]/95 backdrop-blur-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Small Product Descriptor */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-baseline gap-2.5 group">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-[#1c1d1b]">
                FOODLINK
              </span>
              {/* Subtle muted olive indicator mark */}
              <span className="w-1.5 h-1.5 bg-[#536b4f] rounded-none inline-block align-middle" />
            </div>
            <span className="text-[11px] text-[#6f706a] font-mono tracking-normal hidden sm:inline">
              / surplus food tracking system
            </span>
          </Link>
        </div>

        {/* Center Public Navigation with muted olive active highlight */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#6f706a]">
          <a
            href="#product"
            className="hover:text-[#1c1d1b] text-[#536b4f] font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>Product</span>
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#1c1d1b] transition-colors"
          >
            How it works
          </a>
          <Link
            href="/devices"
            className="hover:text-[#1c1d1b] transition-colors"
          >
            Hardware
          </Link>
          <a
            href="#operations"
            className="hover:text-[#1c1d1b] transition-colors"
          >
            Operations
          </a>
          <Link
            href="/presentation"
            className="hover:text-[#1c1d1b] transition-colors"
          >
            Presentation
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/app">
            <Button variant="primary" size="sm">
              Open dashboard
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
