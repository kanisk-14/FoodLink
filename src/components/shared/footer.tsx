import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[#ddd9cf] py-10 bg-[#f2efe7] text-xs font-mono text-[#6f706a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1c1d1b]">FOODLINK</span>
          <span className="w-1.5 h-1.5 bg-[#536b4f]" />
          <span>Surplus food tracking prototype</span>
        </div>
        <div className="flex items-center gap-6 text-[11px]">
          <span>ESP32 Hardware + Web Interface</span>
          <span>Document Ref: FL-2026-V1</span>
        </div>
      </div>
    </footer>
  );
}
