import React from 'react';
import { Wifi, Disc } from 'lucide-react';

interface OledScreenProps {
  deviceId: string;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  tempStatus?: 'safe' | 'warning' | 'breach';
  isOnline?: boolean;
}

export function OledScreen({
  deviceId,
  line1,
  line2,
  line3,
  line4,
  tempStatus = 'safe',
  isOnline = true,
}: OledScreenProps) {
  return (
    <div className="relative inline-block w-full max-w-sm rounded-lg bg-zinc-950 p-3 shadow-xl border border-zinc-800">
      {/* Hardware Container Frame Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 text-[10px] font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="tracking-wider text-zinc-300 font-semibold">{deviceId}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-zinc-400">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>ESP32</span>
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">0.96&quot; I2C OLED</span>
        </div>
      </div>

      {/* OLED Screen Bezel & Display Area */}
      <div className="mt-2.5 p-3 rounded bg-black border border-zinc-800 shadow-inner relative overflow-hidden">
        {/* Subtle OLED scanline texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"
        />

        {/* Screen Text */}
        <div className="relative font-mono text-[12px] leading-relaxed tracking-wider select-none">
          <div className="flex justify-between text-cyan-400/90 border-b border-cyan-950/60 pb-1 mb-1 font-semibold">
            <span>{line1}</span>
            <span className="text-[10px] text-cyan-500/70">{isOnline ? 'LIVE' : 'OFFLINE'}</span>
          </div>
          <div className="text-cyan-200 font-medium">{line2}</div>
          <div
            className={`font-bold transition-colors ${
              tempStatus === 'safe'
                ? 'text-emerald-400'
                : tempStatus === 'warning'
                ? 'text-amber-400'
                : 'text-rose-400'
            }`}
          >
            {line3}
          </div>
          <div className="text-cyan-300/90 text-[11px] pt-0.5">{line4}</div>
        </div>
      </div>

      {/* Hardware Status Pins / Status LEDs */}
      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-zinc-400">PWR</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
            <span className="text-zinc-400">TX/RX</span>
          </span>
          <span className="flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                tempStatus === 'safe' ? 'bg-zinc-700' : 'bg-rose-500 animate-pulse'
              }`}
            />
            <span className="text-zinc-400">ALERT</span>
          </span>
        </div>
        <span className="text-zinc-400 text-[9px]">SSD1306 • 128x64</span>
      </div>
    </div>
  );
}
