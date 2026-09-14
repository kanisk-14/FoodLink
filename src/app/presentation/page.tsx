'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TempHistoryChart } from '@/components/hardware/temp-history-chart';
import { DemoRunner } from '@/components/hardware/demo-runner';
import { FoodBatch } from '@/types/foodlink';
import { TelemetryRecord } from '@/lib/store/telemetry-store';

export default function PresentationPage() {
  const [batch, setBatch] = useState<FoodBatch | null>(null);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryRecord[]>([]);
  const [selectedCode, setSelectedCode] = useState<'FL-DEMO-001' | 'FL-0024'>('FL-DEMO-001');

  const fetchBatch = useCallback(async () => {
    try {
      if (selectedCode === 'FL-DEMO-001') {
        const res = await fetch('/api/demo');
        if (res.ok) {
          const data = await res.json();
          setBatch(data.batch);
        }
      } else {
        const res = await fetch(`/api/batches?code=${selectedCode}`);
        if (res.ok) {
          const data = await res.json();
          setBatch(data.batch);
        }
      }

      const telRes = await fetch(`/api/devices/FL-NODE-001/telemetry?batchId=${selectedCode}`);
      if (telRes.ok) {
        const telJson = await telRes.json();
        setTelemetryLogs(telJson.telemetry || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, [selectedCode]);

  useEffect(() => {
    fetchBatch();
  }, [fetchBatch]);

  if (!batch) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] text-[#1c1d1b] p-8 font-mono text-xs flex items-center justify-center">
        Loading presentation console...
      </div>
    );
  }

  const isDemo = batch.code === 'FL-DEMO-001';

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1c1d1b] font-mono text-xs p-4 sm:p-8 space-y-6">
      {/* Top Evaluation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#ddd9cf] pb-4 gap-3">
        <div className="flex items-center gap-3">
          <Link href="/app" className="text-sm font-bold text-[#1c1d1b] hover:text-[#536b4f]">
            FOODLINK
          </Link>
          <span className="w-1.5 h-1.5 bg-[#536b4f]" />
          <span className="text-xs text-[#6f706a]">STARTUP EVALUATION &bull; LIVE PRESENTATION CONSOLE</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#6f706a]">Source:</span>
          <select
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value as any)}
            className="px-2.5 py-1 bg-white border border-[#ddd9cf] text-[#1c1d1b] font-semibold"
          >
            <option value="FL-DEMO-001">FL-DEMO-001 (Interactive Scenario)</option>
            <option value="FL-0024">FL-0024 (Field Biryani)</option>
          </select>

          <Link
            href="/app"
            className="px-2.5 py-1 bg-white border border-[#ddd9cf] hover:bg-[#f2efe7] text-[#1c1d1b]"
          >
            Exit to App &rarr;
          </Link>
        </div>
      </div>

      {/* Controlled Demo Runner (when showing demo batch) */}
      {isDemo && (
        <DemoRunner onStepChange={fetchBatch} />
      )}

      {/* Main Condition Header */}
      <div className="bg-white border border-[#ddd9cf] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#ece9df] pb-4">
          <div>
            <div className="text-[10px] text-[#6f706a] uppercase">CURRENT FOOD BATCH</div>
            <div className="text-3xl font-bold text-[#1c1d1b] mt-1">{batch.code}</div>
            <div className="text-base font-semibold text-[#536b4f] mt-0.5">{batch.title}</div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-[#6f706a] block uppercase">MONITORING STATUS</span>
            <span className="inline-block px-2.5 py-1 bg-[#e8eee5] text-[#3d523a] border border-[#ccd9c8] font-bold uppercase text-xs mt-1">
              {batch.status === 'in_transit' ? 'IN TRANSIT' : batch.status === 'awaiting_pickup' ? 'AWAITING PICKUP' : 'DELIVERED'}
            </span>
            <div className="text-[11px] text-[#6f706a] mt-1">ETA: {batch.estimatedArrivalIso}</div>
          </div>
        </div>

        {/* 4 Core Vital Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 bg-[#f7f5ef] border border-[#ddd9cf]">
            <span className="text-[10px] text-[#6f706a] uppercase block">TEMPERATURE</span>
            <div className="text-2xl font-bold text-[#3d523a] mt-1">
              {batch.hardware.temperatureC.toFixed(1)} &deg;C
            </div>
            <span className="text-[10px] text-[#6f706a]">Hot-Hold &gt;60&deg;C</span>
          </div>

          <div className="p-3.5 bg-[#f7f5ef] border border-[#ddd9cf]">
            <span className="text-[10px] text-[#6f706a] uppercase block">NET WEIGHT</span>
            <div className="text-2xl font-bold text-[#1c1d1b] mt-1">
              {batch.hardware.netFoodWeightKg.toFixed(2)} kg
            </div>
            <span className="text-[10px] text-[#6f706a]">Tare: 2.20 kg baseline</span>
          </div>

          <div className="p-3.5 bg-[#f7f5ef] border border-[#ddd9cf]">
            <span className="text-[10px] text-[#6f706a] uppercase block">CONTAINER</span>
            <div className="text-base font-bold text-[#3d523a] mt-2">
              {batch.hardware.lidLatched ? '■ SEALED' : '▲ UNSEALED'}
            </div>
            <span className="text-[10px] text-[#6f706a]">Hermetic Reed Switch</span>
          </div>

          <div className="p-3.5 bg-[#f7f5ef] border border-[#ddd9cf]">
            <span className="text-[10px] text-[#6f706a] uppercase block">DEVICE STATUS</span>
            <div className="text-base font-bold text-[#1c1d1b] mt-2">
              ONLINE &bull; {batch.hardware.deviceId}
            </div>
            <span className="text-[10px] text-[#536b4f]">ESP32 Wi-Fi Telemetry</span>
          </div>
        </div>
      </div>

      {/* Split View: Operations Chart + Chronological Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <TempHistoryChart
            data={telemetryLogs}
            minThreshold={batch.hardware.targetMinTempC}
            maxThreshold={batch.hardware.targetMaxTempC}
            categoryLabel={batch.categoryLabel || 'Hot-Hold Logistics'}
          />
        </div>

        <div className="lg:col-span-5 bg-white border border-[#ddd9cf] p-5 space-y-3">
          <div className="flex items-baseline justify-between border-b border-[#ece9df] pb-2">
            <span className="font-bold text-xs text-[#1c1d1b] uppercase">FOOD PASSPORT TIMELINE</span>
            <span className="text-[10px] text-[#536b4f]">
              {batch.passport.filter((p) => p.completed).length} / 10 MILESTONES COMPLETED
            </span>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {batch.passport.map((p) => (
              <div
                key={p.step}
                className={`p-2.5 border text-xs ${
                  p.completed ? 'bg-[#fcfbf9] border-[#ddd9cf]' : 'bg-[#f7f5ef]/50 border-[#ece9df] opacity-60'
                }`}
              >
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-[#1c1d1b]">{p.step} &bull; {p.title}</span>
                  <span className="text-[10px] text-[#6f706a]">{p.timestamp}</span>
                </div>
                <div className="text-[10px] text-[#6f706a] mt-0.5">{p.location}</div>
                {p.notes && (
                  <div className="text-[9px] text-[#536b4f] mt-1 pt-1 border-t border-[#ece9df]">
                    {p.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
