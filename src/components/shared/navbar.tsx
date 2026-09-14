'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [activeSection, setActiveSection] = useState<string>('product');

  useEffect(() => {
    if (!isHomePage) return;

    const sections = ['product', 'how-it-works', 'hardware', 'operations'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const sectionId of [...sections].reverse()) {
        const el = document.getElementById(sectionId);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (isHomePage) {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${id}`);
        setActiveSection(id);
      }
    }
  };

  const navItems = [
    { id: 'product', label: 'Product', href: '/#product' },
    { id: 'how-it-works', label: 'How it works', href: '/#how-it-works' },
    { id: 'hardware', label: 'Hardware', href: '/#hardware' },
    { id: 'operations', label: 'Operations', href: '/#operations' },
  ];

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
          {navItems.map((item) => {
            const isActive = isHomePage && activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-[#536b4f] font-semibold'
                    : 'text-[#6f706a] hover:text-[#1c1d1b]'
                }`}
              >
                <span>{item.label}</span>
              </a>
            );
          })}
          <Link
            href="/presentation"
            className={`transition-colors cursor-pointer ${
              pathname === '/presentation'
                ? 'text-[#536b4f] font-semibold'
                : 'text-[#6f706a] hover:text-[#1c1d1b]'
            }`}
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
