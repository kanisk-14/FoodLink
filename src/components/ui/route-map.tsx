import React from 'react';

interface RouteMapProps {
  originName: string;
  destinationName: string;
  currentLocationName: string;
  eta: string;
  progressPercent?: number;
}

export function RouteMap({
  originName,
  destinationName,
  currentLocationName,
  eta,
  progressPercent = 68,
}: RouteMapProps) {
  return (
    <div className="w-full bg-white border border-[#ddd9cf] rounded-xs p-5 font-mono text-xs text-[#1c1d1b]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#ddd9cf]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#536b4f]" />
          <span className="font-bold text-xs uppercase tracking-wider text-[#1c1d1b]">
            LOGISTICS TRANSIT CORRIDOR
          </span>
        </div>
        <div className="text-[11px] text-[#6f706a]">
          ESTIMATED INTAKE: <span className="text-[#536b4f] font-bold">{eta}</span>
        </div>
      </div>

      {/* Vector Schematic Map Canvas */}
      <div className="my-4 p-4 bg-[#f7f5ef] border border-[#ddd9cf] relative overflow-hidden rounded-xs">
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ddd9cf 1px, transparent 1px), linear-gradient(to bottom, #ddd9cf 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Schematic SVG Map */}
        <div className="relative py-6 px-4">
          <svg className="w-full h-32" viewBox="0 0 600 120" fill="none">
            {/* Base street grid lines */}
            <line x1="0" y1="30" x2="600" y2="30" stroke="#ddd9cf" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="90" x2="600" y2="90" stroke="#ddd9cf" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="150" y1="0" x2="150" y2="120" stroke="#ddd9cf" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="320" y1="0" x2="320" y2="120" stroke="#ddd9cf" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="480" y1="0" x2="480" y2="120" stroke="#ddd9cf" strokeWidth="1" strokeDasharray="4 4" />

            {/* Inactive planned route path */}
            <path
              d="M 60 60 L 220 60 L 320 60 L 420 60 L 540 60"
              stroke="#ddd9cf"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Active completed route path (Olive green) */}
            <path
              d="M 60 60 L 220 60 L 380 60"
              stroke="#536b4f"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Origin Waypoint (Square) */}
            <rect x="52" y="52" width="16" height="16" fill="#1c1d1b" />
            <text x="60" y="38" textAnchor="middle" fill="#1c1d1b" fontSize="10" fontFamily="monospace" fontWeight="bold">
              ORIGIN
            </text>

            {/* Current Active Vehicle Marker */}
            <circle cx="380" cy="60" r="8" fill="#536b4f" />
            <circle cx="380" cy="60" r="4" fill="#ffffff" />
            <text x="380" y="86" textAnchor="middle" fill="#536b4f" fontSize="10" fontFamily="monospace" fontWeight="bold">
              CURRENT (68%)
            </text>

            {/* Destination Waypoint (Diamond/Square) */}
            <rect x="532" y="52" width="16" height="16" fill="#ffffff" stroke="#1c1d1b" strokeWidth="2" />
            <text x="540" y="38" textAnchor="middle" fill="#1c1d1b" fontSize="10" fontFamily="monospace" fontWeight="bold">
              DESTINATION
            </text>
          </svg>
        </div>

        {/* Live coordinate / street indicator pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t border-[#ddd9cf] text-[11px] text-[#6f706a] gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#536b4f]" />
            <span className="text-[#1c1d1b] font-medium">LATEST POSITION:</span>
            <span>{currentLocationName}</span>
          </div>
          <div className="text-[10px] text-[#6f706a]">
            COORDINATES: 40.7188&deg; N, 74.0012&deg; W &bull; SPEED: 24 KM/H
          </div>
        </div>
      </div>

      {/* Route Legs Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf]">
          <div className="text-[10px] text-[#6f706a] uppercase">DEPARTURE POINT (A)</div>
          <div className="font-bold text-xs text-[#1c1d1b] mt-0.5">{originName}</div>
          <div className="text-[10px] text-[#536b4f] mt-1">Status: Dispatched &amp; Verified</div>
        </div>

        <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf]">
          <div className="text-[10px] text-[#6f706a] uppercase">RECEIVING TERMINAL (B)</div>
          <div className="font-bold text-xs text-[#1c1d1b] mt-0.5">{destinationName}</div>
          <div className="text-[10px] text-[#6f706a] mt-1">Intake Dock Open &bull; Awaiting Arrival</div>
        </div>
      </div>
    </div>
  );
}
