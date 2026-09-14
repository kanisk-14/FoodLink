import React from 'react';

interface EquipmentCardProps {
  nodeId?: string;
  batchCode?: string;
  itemDescription?: string;
  weightKg?: number;
  tempC?: number;
  status?: string;
  time?: string;
  lidStatus?: string;
  categoryTag?: string;
}

export function EquipmentCard({
  nodeId = 'NODE 01',
  batchCode = 'FL-0024',
  itemDescription = 'BIRYANI',
  weightKg = 4.2,
  tempC = 7.4,
  status = 'IN TRANSIT',
  time = '12:42 PM',
  lidStatus = 'LATCHED',
  categoryTag = 'PREPARED MEAL',
}: EquipmentCardProps) {
  return (
    <div className="w-full max-w-sm bg-white border border-[#ddd9cf] p-5 shadow-xs font-mono text-xs text-[#1c1d1b] select-none relative">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#ddd9cf]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#536b4f]" />
          <div>
            <div className="text-[10px] text-[#6f706a] uppercase tracking-wider">EQUIPMENT TAG</div>
            <div className="font-bold text-sm tracking-tight text-[#1c1d1b]">FOODLINK {nodeId}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-[#6f706a] uppercase tracking-wider">CONTROLLER</div>
          <div className="text-[11px] text-[#536b4f] font-semibold">ESP32 &bull; VER 1.2</div>
        </div>
      </div>

      {/* Main Grid: Data Matrix */}
      <div className="py-4 space-y-3.5 divide-y divide-[#ece9df]">
        {/* Batch & Category Tag */}
        <div className="pt-0 flex items-start justify-between">
          <div>
            <span className="text-[10px] text-[#6f706a] uppercase tracking-wider block mb-0.5">
              BATCH IDENTIFIER
            </span>
            <span className="text-base font-bold text-[#1c1d1b] tracking-tight">{batchCode}</span>
          </div>
          {/* Subtle Terracotta Accent Tag */}
          <span className="px-1.5 py-0.5 bg-[#f3e5de] text-[#934e35] border border-[#e2cdc4] text-[9px] font-bold tracking-wider uppercase">
            {categoryTag}
          </span>
        </div>

        {/* Item & Net Weight */}
        <div className="pt-3 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] text-[#6f706a] uppercase tracking-wider block mb-0.5">
              FOOD BATCH
            </span>
            <span className="font-bold text-sm text-[#1c1d1b]">{itemDescription}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#6f706a] uppercase tracking-wider block mb-0.5">
              NET WEIGHT
            </span>
            <span className="font-bold text-sm text-[#1c1d1b]">{weightKg.toFixed(1)} kg</span>
          </div>
        </div>

        {/* Temp & Container Seal (with Muted Olive for Healthy Latch) */}
        <div className="pt-3 grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] text-[#6f706a] uppercase tracking-wider block mb-0.5">
              RECORDED TEMP
            </span>
            <span className="text-base font-bold text-[#1c1d1b]">{tempC.toFixed(1)} &deg;C</span>
          </div>
          <div>
            <span className="text-[10px] text-[#6f706a] uppercase tracking-wider block mb-0.5">
              CONTAINER SEAL
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#536b4f]" />
              <span className="text-sm font-semibold text-[#536b4f]">{lidStatus}</span>
            </div>
          </div>
        </div>

        {/* Tracking State (Muted olive on light green tint) */}
        <div className="pt-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#6f706a] uppercase tracking-wider block mb-0.5">
              TRACKING STATE
            </span>
            <span className="inline-block px-2 py-0.5 bg-[#e8eee5] text-[#3d523a] border border-[#ccd9c8] text-[10px] font-bold tracking-wider">
              {status}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#6f706a] uppercase tracking-wider block mb-0.5">
              LAST LOGGED
            </span>
            <span className="text-xs text-[#1c1d1b] font-medium">{time}</span>
          </div>
        </div>
      </div>

      {/* Bottom Technical Bar */}
      <div className="pt-3 border-t border-[#ddd9cf] flex items-center justify-between text-[10px] text-[#6f706a]">
        <span>SENSOR: DS18B20 + HX711</span>
        <span className="text-[#536b4f] font-medium">SYS LOG OK</span>
      </div>
    </div>
  );
}
