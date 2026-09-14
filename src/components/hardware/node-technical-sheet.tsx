'use client';

import React from 'react';

interface NodeTechnicalSheetProps {
  nodeId?: string;
  firmware?: string;
  tempReading?: number;
  weightReading?: number;
  lidLatched?: boolean;
}

export function NodeTechnicalSheet({
  nodeId = 'FOODLINK NODE 01',
  firmware = 'v1.2.4-esp32',
  tempReading = 7.4,
  weightReading = 4.2,
  lidLatched = true,
}: NodeTechnicalSheetProps) {
  return (
    <div className="bg-white border border-[#ddd9cf] p-6 font-mono text-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#ece9df] pb-3">
        <div>
          <span className="text-[10px] text-[#536b4f] uppercase tracking-wider font-bold">
            HARDWARE ARCHITECTURAL SPECIFICATION
          </span>
          <h3 className="text-base font-bold text-[#1c1d1b]">
            {nodeId} &bull; Technical Product Sheet
          </h3>
        </div>
        <div className="text-[11px] text-[#6f706a]">
          FIRMWARE: <span className="text-[#1c1d1b] font-semibold">{firmware}</span>
        </div>
      </div>

      {/* Schematic Layout Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Module 01: Temperature */}
        <div className="p-4 bg-[#f7f5ef] border border-[#ddd9cf] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#ddd9cf] pb-1.5">
              <span className="text-[10px] text-[#536b4f] font-bold">01 THERMAL PROBE</span>
              <span className="w-1.5 h-1.5 bg-[#536b4f]" />
            </div>
            <div className="mt-2 text-[11px] font-bold text-[#1c1d1b]">DS18B20 1-WIRE</div>
            <p className="text-[10px] text-[#6f706a] mt-1 leading-relaxed">
              Stainless steel food-grade submersible thermal probe. Direct core reading.
            </p>
          </div>

          <div className="pt-2 border-t border-[#ddd9cf]">
            <span className="text-[9px] text-[#6f706a] uppercase block">LIVE TELEMETRY</span>
            <span className="text-base font-bold text-[#3d523a]">
              {tempReading.toFixed(1)} &deg;C
            </span>
          </div>
        </div>

        {/* Module 02: Weight */}
        <div className="p-4 bg-[#f7f5ef] border border-[#ddd9cf] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#ddd9cf] pb-1.5">
              <span className="text-[10px] text-[#536b4f] font-bold">02 LOAD CELL</span>
              <span className="w-1.5 h-1.5 bg-[#536b4f]" />
            </div>
            <div className="mt-2 text-[11px] font-bold text-[#1c1d1b]">HX711 24-BIT ADC</div>
            <p className="text-[10px] text-[#6f706a] mt-1 leading-relaxed">
              Integrated tare compensation base plate. Continuous net food mass audit.
            </p>
          </div>

          <div className="pt-2 border-t border-[#ddd9cf]">
            <span className="text-[9px] text-[#6f706a] uppercase block">NET FOOD WEIGHT</span>
            <span className="text-base font-bold text-[#1c1d1b]">
              {weightReading.toFixed(2)} kg
            </span>
          </div>
        </div>

        {/* Module 03: Container */}
        <div className="p-4 bg-[#f7f5ef] border border-[#ddd9cf] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#ddd9cf] pb-1.5">
              <span className="text-[10px] text-[#536b4f] font-bold">03 CONTAINER LATCH</span>
              <span className="w-1.5 h-1.5 bg-[#536b4f]" />
            </div>
            <div className="mt-2 text-[11px] font-bold text-[#1c1d1b]">HERMETIC REED SWITCH</div>
            <p className="text-[10px] text-[#6f706a] mt-1 leading-relaxed">
              Magnetic contact sensor triggers instant event log upon lid opening or resealing.
            </p>
          </div>

          <div className="pt-2 border-t border-[#ddd9cf]">
            <span className="text-[9px] text-[#6f706a] uppercase block">CONTAINER STATE</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 inline-block ${
                lidLatched ? 'bg-[#e8eee5] text-[#3d523a]' : 'bg-[#f3e5de] text-[#934e35]'
              }`}
            >
              {lidLatched ? '■ LATCHED' : '▲ UNLATCHED'}
            </span>
          </div>
        </div>

        {/* Module 04: Connectivity */}
        <div className="p-4 bg-[#f7f5ef] border border-[#ddd9cf] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#ddd9cf] pb-1.5">
              <span className="text-[10px] text-[#536b4f] font-bold">04 CONNECTIVITY</span>
              <span className="w-1.5 h-1.5 bg-[#536b4f]" />
            </div>
            <div className="mt-2 text-[11px] font-bold text-[#1c1d1b]">ESP32 + 0.96&quot; OLED</div>
            <p className="text-[10px] text-[#6f706a] mt-1 leading-relaxed">
              Wi-Fi 802.11 b/g/n telemetry uplink. Physical OLED displays courier manifest.
            </p>
          </div>

          <div className="pt-2 border-t border-[#ddd9cf]">
            <span className="text-[9px] text-[#6f706a] uppercase block">NETWORK LINK</span>
            <span className="text-xs font-bold text-[#3d523a]">ONLINE (-62 dBm)</span>
          </div>
        </div>
      </div>

      {/* Technical Schematic Footer */}
      <div className="p-3 border border-[#ddd9cf] bg-[#f7f5ef] text-[10px] text-[#6f706a] flex flex-wrap items-center justify-between gap-2">
        <span>PIN ASSIGNMENT: DS18B20 (GPIO 4) &bull; HX711 (GPIO 16/4) &bull; REED (GPIO 14) &bull; OLED (I2C 21/22)</span>
        <span className="text-[#1c1d1b] font-semibold">CIRCUIT SPECIFICATION REV 1.4</span>
      </div>
    </div>
  );
}
