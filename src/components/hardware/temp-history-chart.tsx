'use client';

import React from 'react';
import { TelemetryRecord } from '@/lib/store/telemetry-store';

interface TempHistoryChartProps {
  data: TelemetryRecord[];
  minThreshold?: number; // e.g. 2.0 °C
  maxThreshold?: number; // e.g. 8.0 °C
  categoryLabel?: string;
}

export function TempHistoryChart({
  data,
  minThreshold = 2.0,
  maxThreshold = 8.0,
  categoryLabel = 'Chilled Distribution',
}: TempHistoryChartProps) {
  // Sort chronological
  const sorted = [...data].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="p-6 text-center font-mono text-xs text-[#6f706a] border border-[#ddd9cf] bg-white">
        No temperature logs recorded for this shipment.
      </div>
    );
  }

  // Chart coordinate space
  const width = 640;
  const height = 220;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 25;
  const padBottom = 35;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  // Find min and max for Y scale with padding
  const temps = sorted.map((d) => d.temperature);
  const minTemp = Math.min(minThreshold - 2, Math.floor(Math.min(...temps) - 1));
  const maxTemp = Math.max(maxThreshold + 2, Math.ceil(Math.max(...temps) + 1));
  const tempRange = maxTemp - minTemp || 1;

  const getY = (temp: number) => {
    return padTop + chartHeight - ((temp - minTemp) / tempRange) * chartHeight;
  };

  const getX = (index: number) => {
    if (sorted.length === 1) return padLeft + chartWidth / 2;
    return padLeft + (index / (sorted.length - 1)) * chartWidth;
  };

  // Generate SVG path string
  const points = sorted.map((d, i) => `${getX(i)},${getY(d.temperature)}`);
  const pathD = `M ${points.join(' L ')}`;

  // Threshold Y positions
  const yMaxThresh = getY(maxThreshold);
  const yMinThresh = getY(minThreshold);

  // Grid steps (e.g. 4 ticks)
  const yTicks = [minTemp, (minTemp + maxTemp) / 2, maxTemp].map((t) => Number(t.toFixed(1)));

  return (
    <div className="bg-white border border-[#ddd9cf] p-5 font-mono text-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#ece9df] pb-3">
        <div>
          <span className="text-[10px] text-[#536b4f] uppercase tracking-wider font-bold">
            TEMPERATURE TELEMETRY HISTORY
          </span>
          <h3 className="text-sm font-bold text-[#1c1d1b]">
            Continuous Probe Readings &bull; Operations Log
          </h3>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#6f706a]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#536b4f]" />
            <span>Recorded Probe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-dashed border-[#b66a4e]" />
            <span>Configured Limit [{minThreshold}&deg;–{maxThreshold}&deg;C]</span>
          </div>
        </div>
      </div>

      {/* SVG Operations Graph */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-w-full block"
          style={{ minWidth: '480px' }}
        >
          {/* Background safe band */}
          <rect
            x={padLeft}
            y={Math.min(yMaxThresh, yMinThresh)}
            width={chartWidth}
            height={Math.abs(yMinThresh - yMaxThresh)}
            fill="#e8eee5"
            opacity="0.5"
          />

          {/* Grid lines & Y-axis labels */}
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#ece9df"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#6f706a"
                  fontFamily="monospace"
                >
                  {tick}&deg;C
                </text>
              </g>
            );
          })}

          {/* Upper Threshold Line */}
          <line
            x1={padLeft}
            y1={yMaxThresh}
            x2={width - padRight}
            y2={yMaxThresh}
            stroke="#b66a4e"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <text
            x={width - padRight}
            y={yMaxThresh - 4}
            textAnchor="end"
            fontSize="9"
            fill="#b66a4e"
            fontFamily="monospace"
          >
            MAX THRESHOLD ({maxThreshold}&deg;C)
          </text>

          {/* Lower Threshold Line */}
          <line
            x1={padLeft}
            y1={yMinThresh}
            x2={width - padRight}
            y2={yMinThresh}
            stroke="#b66a4e"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <text
            x={width - padRight}
            y={yMinThresh + 12}
            textAnchor="end"
            fontSize="9"
            fill="#b66a4e"
            fontFamily="monospace"
          >
            MIN THRESHOLD ({minThreshold}&deg;C)
          </text>

          {/* Data Path (Thin solid line, no neon/glow) */}
          <path d={pathD} fill="none" stroke="#536b4f" strokeWidth="1.75" />

          {/* Data Points */}
          {sorted.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.temperature);
            const isBreach = d.temperature > maxThreshold || d.temperature < minThreshold;
            return (
              <g key={d.id || i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill={isBreach ? '#b66a4e' : '#536b4f'}
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* X Axis Timestamps */}
          {sorted.map((d, i) => {
            // Show first, middle, last or up to 5 points
            if (
              i === 0 ||
              i === sorted.length - 1 ||
              i === Math.floor(sorted.length / 2) ||
              sorted.length <= 5
            ) {
              const cx = getX(i);
              const timeStr = new Date(d.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              return (
                <text
                  key={`time-${i}`}
                  x={cx}
                  y={height - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6f706a"
                  fontFamily="monospace"
                >
                  {timeStr}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>

      {/* Threshold Documentation Note */}
      <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf] text-[11px] text-[#6f706a] flex items-center justify-between">
        <div>
          <strong>DISCIPLINED AUDIT NOTE:</strong> Thresholds configured for{' '}
          <span className="text-[#1c1d1b] font-semibold">{categoryLabel}</span> ({minThreshold}&deg;C
          to {maxThreshold}&deg;C). Status evaluated against local batch protocol.
        </div>
        <span className="text-[10px] text-[#3d523a] font-semibold bg-[#e8eee5] px-2 py-0.5">
          PROBE DS18B20 ACTIVE
        </span>
      </div>
    </div>
  );
}
