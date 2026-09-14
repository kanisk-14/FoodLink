'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import { Button } from '@/components/ui/button';
import { RouteMap } from '@/components/ui/route-map';
import { BatchQrCode } from '@/components/ui/qr-code';
import { TempHistoryChart } from '@/components/hardware/temp-history-chart';
import { NodeTechnicalSheet } from '@/components/hardware/node-technical-sheet';
import { DemoRunner } from '@/components/hardware/demo-runner';
import { FoodBatch, PassportEvent } from '@/types/foodlink';
import { TelemetryRecord } from '@/lib/store/telemetry-store';

export default function FoodBatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const batchIdParam = (params?.batchId as string) || 'FL-0024';
  const initialViewParam = searchParams.get('view');

  const [batch, setBatch] = useState<FoodBatch | null>(null);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'passport' | 'temp_chart' | 'hardware' | 'route' | 'label'>('passport');
  const [presentationMode, setPresentationMode] = useState(initialViewParam === 'presentation');
  const [secondsAgo, setSecondsAgo] = useState(12);

  const isDemoBatch = batch?.code === 'FL-DEMO-001' || batchIdParam.toLowerCase() === 'fl-demo-001';

  // Load batch data from API or store
  const fetchBatchData = useCallback(async () => {
    try {
      if (isDemoBatch) {
        const res = await fetch('/api/demo');
        if (res.ok) {
          const data = await res.json();
          setBatch(data.batch);
          setLoading(false);
        }
      } else {
        const res = await fetch(`/api/batches?code=${batchIdParam}`);
        if (res.ok) {
          const data = await res.json();
          if (data.batch) {
            setBatch(data.batch);
            setLoading(false);
          } else {
            setError(true);
            setLoading(false);
          }
        } else {
          setError(true);
          setLoading(false);
        }
      }

      // Sync telemetry logs
      const devQuery = 'FL-NODE-001';
      const telRes = await fetch(`/api/devices/${devQuery}/telemetry?batchId=${batchIdParam}`);
      if (telRes.ok) {
        const telJson = await telRes.json();
        setTelemetryLogs(telJson.telemetry || []);
      }
    } catch (err) {
      console.error('Failed to fetch batch data', err);
      setError(true);
      setLoading(false);
    }
  }, [batchIdParam, isDemoBatch]);

  useEffect(() => {
    fetchBatchData();
  }, [fetchBatchData]);

  // Tick seconds counter for last sync
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] text-[#1c1d1b] flex flex-col font-mono text-xs">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
          <div className="w-5 h-5 border-2 border-[#1c1d1b] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#6f706a]">Querying digital food passport registry...</div>
          <div className="text-[10px] text-[#b8b4a7]">IDENTIFIER: {batchIdParam}</div>
        </div>
      </div>
    );
  }

  if (error || !batch) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] text-[#1c1d1b] flex flex-col font-mono text-xs">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 max-w-md mx-auto text-center">
          <div className="text-sm font-bold text-[#8e2929] uppercase">RECORD NOT FOUND</div>
          <p className="text-[#6f706a]">
            No verified chain-of-custody ledger found for identifier &quot;{batchIdParam}&quot;.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Link href="/food/FL-0024">
              <Button variant="outline" size="sm">Inspect FL-0024</Button>
            </Link>
            <Link href="/food/FL-DEMO-001">
              <Button variant="primary" size="sm">Launch FL-DEMO-001</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const originalWeight = Number(batch.initialWeightKg.toFixed(2));
  const currentNetWeight = Number(batch.hardware.netFoodWeightKg.toFixed(2));
  const weightChange = Number((currentNetWeight - originalWeight).toFixed(2));
  const isUnexpectedWeightChange = Math.abs(weightChange) >= 0.25;

  const isCriticalTemp =
    batch.hardware.temperatureC > batch.hardware.targetMaxTempC + 2 ||
    batch.hardware.temperatureC < batch.hardware.targetMinTempC - 2;

  const isDeviceOffline = !isDemoBatch && secondsAgo > 120;

  // -------------------------------------------------------------------------
  // CALM PRESENTATION MODE (Section 16)
  // -------------------------------------------------------------------------
  if (presentationMode) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] text-[#1c1d1b] flex flex-col font-mono text-xs p-6 sm:p-10 space-y-6">
        <div className="flex items-center justify-between border-b border-[#ddd9cf] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-[#1c1d1b]">FOODLINK</span>
            <span className="w-1.5 h-1.5 bg-[#536b4f]" />
            <span className="text-xs text-[#6f706a]">PRESENTATION DISPLAY &bull; BATCH EVALUATION</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-[#e8eee5] text-[#3d523a] text-[10px] font-bold border border-[#ccd9c8]">
              {isDemoBatch ? 'DEMO SCENARIO MODE' : 'LIVE TELEMETRY MODE'}
            </span>
            <button
              onClick={() => setPresentationMode(false)}
              className="px-2.5 py-1 bg-white border border-[#ddd9cf] text-[#1c1d1b] hover:bg-[#f2efe7] cursor-pointer text-[11px]"
            >
              Exit Presentation View &times;
            </button>
          </div>
        </div>

        {/* Presentation Header Block */}
        <div className="bg-white border border-[#ddd9cf] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#ece9df] pb-3">
            <div>
              <div className="text-[10px] text-[#6f706a] uppercase tracking-wider">CURRENT FOOD BATCH</div>
              <div className="text-3xl font-bold text-[#1c1d1b] mt-1">{batch.code}</div>
              <div className="text-base font-semibold text-[#536b4f] mt-0.5">{batch.title}</div>
            </div>

            <div className="text-left sm:text-right font-mono">
              <span className="text-[10px] text-[#6f706a] block uppercase">STATUS</span>
              <span className="text-sm font-bold text-[#1c1d1b] uppercase bg-[#f7f5ef] border border-[#ddd9cf] px-2 py-0.5 inline-block">
                {batch.status === 'in_transit' ? 'IN TRANSIT' : batch.status === 'awaiting_pickup' ? 'AWAITING PICKUP' : 'DELIVERED'}
              </span>
              <div className="text-[10px] text-[#6f706a] mt-1">ETA: {batch.estimatedArrivalIso}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf]">
              <span className="text-[10px] text-[#6f706a] block uppercase">TEMPERATURE</span>
              <div className="text-2xl font-bold text-[#3d523a] mt-1">
                {batch.hardware.temperatureC.toFixed(1)} &deg;C
              </div>
              <span className="text-[10px] text-[#6f706a]">Hot-Hold Safe &gt;60&deg;C</span>
            </div>

            <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf]">
              <span className="text-[10px] text-[#6f706a] block uppercase">NET WEIGHT</span>
              <div className="text-2xl font-bold text-[#1c1d1b] mt-1">
                {currentNetWeight.toFixed(2)} kg
              </div>
              <span className="text-[10px] text-[#6f706a]">Tare: 2.20 kg</span>
            </div>

            <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf]">
              <span className="text-[10px] text-[#6f706a] block uppercase">CONTAINER</span>
              <div className="text-base font-bold text-[#3d523a] mt-2">
                {batch.hardware.lidLatched ? '■ SEALED' : '▲ UNSEALED'}
              </div>
              <span className="text-[10px] text-[#6f706a]">Reed Switch Monitored</span>
            </div>

            <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf]">
              <span className="text-[10px] text-[#6f706a] block uppercase">PHYSICAL NODE</span>
              <div className="text-base font-bold text-[#1c1d1b] mt-2 truncate">
                {batch.hardware.deviceId}
              </div>
              <span className="text-[10px] text-[#536b4f]">ESP32 Wi-Fi Uplink</span>
            </div>
          </div>
        </div>

        {/* Presentation Two-Column: History & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <TempHistoryChart
              data={telemetryLogs}
              minThreshold={batch.hardware.targetMinTempC}
              maxThreshold={batch.hardware.targetMaxTempC}
              categoryLabel={batch.categoryLabel || 'Prepared Food Transit'}
            />
          </div>

          <div className="lg:col-span-5 bg-white border border-[#ddd9cf] p-5 space-y-3">
            <div className="flex items-baseline justify-between border-b border-[#ece9df] pb-2">
              <span className="font-bold text-xs text-[#1c1d1b] uppercase">EVENT CHRONOLOGY</span>
              <span className="text-[10px] text-[#536b4f]">{batch.passport.filter((p) => p.completed).length} / 10 MILESTONES</span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // MAIN PRODUCT VIEW
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1c1d1b] flex flex-col font-sans selection:bg-[#536b4f] selection:text-[#f7f5ef]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-[#6f706a] border-b border-[#ddd9cf] pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Link href="/app" className="hover:text-[#1c1d1b] transition-colors">
              &larr; Operations Console
            </Link>
            <span>/</span>
            <span>Batches</span>
            <span>/</span>
            <span className="text-[#1c1d1b] font-bold">{batch.code}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Real vs Demo Indicator */}
            {isDemoBatch ? (
              <span className="px-2 py-0.5 bg-[#f3e5de] text-[#934e35] font-bold border border-[#e2cdc4] text-[10px]">
                DEMO MODE &bull; SIMULATED DATA
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-[#e8eee5] text-[#3d523a] font-bold border border-[#ccd9c8] text-[10px]">
                LIVE HARDWARE STREAM
              </span>
            )}

            <button
              onClick={() => setPresentationMode(true)}
              className="text-[11px] font-semibold text-[#1c1d1b] hover:text-[#536b4f] underline underline-offset-2 cursor-pointer"
            >
              [ Presentation View ]
            </button>
          </div>
        </div>

        {/* Offline Warning Banner (Section 15) */}
        {isDeviceOffline && (
          <div className="p-3 bg-[#fcfbf9] border border-[#ddd9cf] text-[11px] font-mono text-[#6f706a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#b66a4e]" />
              <strong className="text-[#1c1d1b]">DEVICE OFFLINE:</strong> Node {batch.hardware.deviceId} has stopped reporting.
            </div>
            <span className="text-[10px]">LAST DATA RECEIVED: {batch.hardware.lastPingIso ? new Date(batch.hardware.lastPingIso).toLocaleTimeString() : '12:42:18'}</span>
          </div>
        )}

        {/* Demo Scenario Controller (if viewing FL-DEMO-001) */}
        {isDemoBatch && (
          <DemoRunner onStepChange={fetchBatchData} />
        )}

        {/* =============================================================== */}
        {/* SECTION 6: CONCISE BATCH CONDITION SUMMARY (< 5 Seconds) */}
        {/* =============================================================== */}
        <div className="bg-white border border-[#ddd9cf] p-6 space-y-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#ece9df] pb-3">
            <div>
              <span className="text-[10px] font-bold text-[#536b4f] uppercase tracking-wider">
                CURRENT CONDITION SUMMARY
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1c1d1b] mt-0.5 tracking-tight">
                {batch.code} &bull; {batch.title}
              </h1>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-[#6f706a] uppercase block">CURRENT STATUS</span>
              <span className="inline-block px-2 py-0.5 bg-[#e8eee5] text-[#3d523a] border border-[#ccd9c8] font-bold uppercase text-xs mt-0.5">
                {batch.status === 'in_transit' ? 'IN TRANSIT' : batch.status === 'awaiting_pickup' ? 'AWAITING PICKUP' : 'DELIVERED'}
              </span>
            </div>
          </div>

          {/* 5-Column Quick Scan Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* 1. Temperature */}
            <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf]">
              <span className="text-[10px] text-[#6f706a] uppercase block">Temperature</span>
              <div className={`text-xl font-bold mt-1 ${isCriticalTemp ? 'text-[#934e35]' : 'text-[#3d523a]'}`}>
                {batch.hardware.temperatureC.toFixed(1)} &deg;C
              </div>
              <span className="text-[10px] text-[#6f706a]">Target: {batch.hardware.targetMinTempC}&deg;–{batch.hardware.targetMaxTempC}&deg;C</span>
            </div>

            {/* 2. Weight */}
            <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf]">
              <span className="text-[10px] text-[#6f706a] uppercase block">Weight</span>
              <div className="text-xl font-bold text-[#1c1d1b] mt-1">
                {currentNetWeight.toFixed(2)} kg
              </div>
              <span className="text-[10px] text-[#6f706a]">Tare: 2.20 kg locked</span>
            </div>

            {/* 3. Container */}
            <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf]">
              <span className="text-[10px] text-[#6f706a] uppercase block">Container</span>
              <div className="text-base font-bold text-[#3d523a] mt-1.5 flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 ${batch.hardware.lidLatched ? 'bg-[#536b4f]' : 'bg-[#934e35]'}`} />
                <span>{batch.hardware.lidLatched ? 'SEALED' : 'UNSEALED'}</span>
              </div>
              <span className="text-[10px] text-[#6f706a]">Reed sensor monitor</span>
            </div>

            {/* 4. Device */}
            <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf]">
              <span className="text-[10px] text-[#6f706a] uppercase block">Device</span>
              <div className="text-base font-bold text-[#3d523a] mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#536b4f]" />
                <span>{isDeviceOffline ? 'OFFLINE' : 'ONLINE'}</span>
              </div>
              <span className="text-[10px] text-[#6f706a] truncate block">{batch.hardware.deviceId}</span>
            </div>

            {/* 5. Journey */}
            <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf]">
              <span className="text-[10px] text-[#6f706a] uppercase block">Journey</span>
              <div className="text-base font-bold text-[#1c1d1b] mt-1.5">
                {batch.delivery.status}
              </div>
              <span className="text-[10px] text-[#536b4f]">ETA: {batch.estimatedArrivalIso}</span>
            </div>
          </div>

          {/* Continuous Weight Audit Strip */}
          <div className="pt-2 border-t border-[#ece9df] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-4 text-[#6f706a]">
              <span>ORIGINAL: <strong className="text-[#1c1d1b]">{originalWeight.toFixed(2)} kg</strong></span>
              <span>CURRENT: <strong className="text-[#1c1d1b]">{currentNetWeight.toFixed(2)} kg</strong></span>
              <span>CHANGE: <strong className={weightChange < 0 ? 'text-[#934e35]' : 'text-[#3d523a]'}>{weightChange >= 0 ? `+${weightChange.toFixed(2)}` : weightChange.toFixed(2)} kg</strong></span>
            </div>

            {isUnexpectedWeightChange && (
              <span className="text-[#934e35] font-bold bg-[#f3e5de] px-2 py-0.5 border border-[#e2cdc4]">
                Unexpected weight change detected ({weightChange.toFixed(2)} kg)
              </span>
            )}
          </div>
        </div>

        {/* =============================================================== */}
        {/* SECTION 7: HARDWARE ↔ SOFTWARE VISUAL CONNECTION */}
        {/* =============================================================== */}
        <div className="bg-white border border-[#ddd9cf] p-4 font-mono text-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ece9df] pb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1c1d1b]">{batch.hardware.deviceId}</span>
              <span className="text-[10px] text-[#6f706a]">&bull; FIRMWARE {batch.hardware.firmwareVersion}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[10px]">
              <div><span className="text-[#6f706a]">TEMP SENSOR:</span> <span className="font-bold text-[#3d523a]">CONNECTED</span></div>
              <div><span className="text-[#6f706a]">WEIGHT SENSOR:</span> <span className="font-bold text-[#3d523a]">CONNECTED</span></div>
              <div><span className="text-[#6f706a]">CONTAINER SENSOR:</span> <span className="font-bold text-[#3d523a]">CONNECTED</span></div>
              <div><span className="text-[#6f706a]">WI-FI:</span> <span className="font-bold text-[#3d523a]">CONNECTED</span></div>
              <div><span className="text-[#6f706a]">LAST SYNC:</span> <span className="font-semibold text-[#1c1d1b]">{secondsAgo}s ago</span></div>
            </div>
          </div>

          {/* Architecture Pipeline Trace */}
          <div className="flex items-center justify-between text-[10px] text-[#6f706a] bg-[#f7f5ef] p-2 border border-[#ddd9cf]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#536b4f]" />
              <span>Physical ESP32 Node</span>
            </div>
            <span>&rarr;</span>
            <div>Telemetry Packet (JSON)</div>
            <span>&rarr;</span>
            <div>FoodLink Server Engine</div>
            <span>&rarr;</span>
            <div className="font-bold text-[#1c1d1b]">Immutable Food Passport</div>
          </div>
        </div>

        {/* Multi-View Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#ddd9cf] pb-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab('passport')}
            className={`px-3 py-1.5 border transition-colors cursor-pointer ${
              activeTab === 'passport'
                ? 'bg-[#1c1d1b] text-white border-[#1c1d1b]'
                : 'bg-white text-[#6f706a] border-[#ddd9cf] hover:text-[#1c1d1b]'
            }`}
          >
            01 &bull; Complete Food Passport (10 Stages)
          </button>
          <button
            onClick={() => setActiveTab('temp_chart')}
            className={`px-3 py-1.5 border transition-colors cursor-pointer ${
              activeTab === 'temp_chart'
                ? 'bg-[#1c1d1b] text-white border-[#1c1d1b]'
                : 'bg-white text-[#6f706a] border-[#ddd9cf] hover:text-[#1c1d1b]'
            }`}
          >
            02 &bull; Operations Temperature Chart
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-3 py-1.5 border transition-colors cursor-pointer ${
              activeTab === 'hardware'
                ? 'bg-[#1c1d1b] text-white border-[#1c1d1b]'
                : 'bg-white text-[#6f706a] border-[#ddd9cf] hover:text-[#1c1d1b]'
            }`}
          >
            03 &bull; Node Technical Product Sheet
          </button>
          <button
            onClick={() => setActiveTab('route')}
            className={`px-3 py-1.5 border transition-colors cursor-pointer ${
              activeTab === 'route'
                ? 'bg-[#1c1d1b] text-white border-[#1c1d1b]'
                : 'bg-white text-[#6f706a] border-[#ddd9cf] hover:text-[#1c1d1b]'
            }`}
          >
            04 &bull; Route &amp; Transit Corridor
          </button>
          <button
            onClick={() => setActiveTab('label')}
            className={`px-3 py-1.5 border transition-colors cursor-pointer ${
              activeTab === 'label'
                ? 'bg-[#1c1d1b] text-white border-[#1c1d1b]'
                : 'bg-white text-[#6f706a] border-[#ddd9cf] hover:text-[#1c1d1b]'
            }`}
          >
            05 &bull; Physical QR Inspection Tag
          </button>
        </div>

        {/* =============================================================== */}
        {/* TAB 1: FOOD PASSPORT (10-STAGE CHRONOLOGICAL RECORD) */}
        {/* =============================================================== */}
        {activeTab === 'passport' && (
          <div className="bg-white border border-[#ddd9cf] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#ece9df] pb-4 font-mono">
              <div>
                <span className="text-[10px] text-[#536b4f] uppercase tracking-wider font-bold">
                  IMMUTABLE CHAIN-OF-CUSTODY PASSPORT
                </span>
                <h2 className="text-lg font-bold text-[#1c1d1b] tracking-tight">
                  What happened to this exact food batch?
                </h2>
              </div>
              <span className="text-xs text-[#6f706a]">
                PASSPORT LEDGER #{batch.code}
              </span>
            </div>

            {/* Batch Core Factsheet Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#f7f5ef] border border-[#ddd9cf] font-mono text-xs">
              <div><span className="text-[#6f706a] block text-[10px]">ORIGIN PROVIDER</span><span className="font-semibold text-[#1c1d1b]">{batch.provider.name}</span></div>
              <div><span className="text-[#6f706a] block text-[10px]">RECIPIENT DEPOT</span><span className="font-semibold text-[#1c1d1b]">{batch.receiver.name}</span></div>
              <div><span className="text-[#6f706a] block text-[10px]">DELIVERY COURIER</span><span className="font-semibold text-[#1c1d1b]">{batch.delivery.driverName}</span></div>
              <div><span className="text-[#6f706a] block text-[10px]">MONITORING NODE</span><span className="font-semibold text-[#536b4f]">{batch.hardware.deviceId}</span></div>
            </div>

            {/* 10-Stage Chronological Event Timeline */}
            <div className="space-y-3 font-mono text-xs">
              {batch.passport.map((evt) => (
                <div
                  key={`${evt.step}-${evt.title}`}
                  className={`p-4 border rounded-xs transition-colors ${
                    evt.completed ? 'bg-white border-[#ddd9cf]' : 'bg-[#f7f5ef]/50 border-[#ece9df] opacity-65'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2 border-b border-[#f2efe7]">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-bold text-xs px-2 py-0.5 rounded-xs ${
                          evt.completed ? 'bg-[#e8eee5] text-[#3d523a]' : 'bg-[#f2efe7] text-[#6f706a]'
                        }`}
                      >
                        {evt.step}
                      </span>
                      <span className="font-bold text-sm text-[#1c1d1b]">{evt.title}</span>
                      <span className="text-[11px] text-[#6f706a] hidden sm:inline">&bull; {evt.stageName}</span>
                    </div>

                    <div className="text-[11px] text-[#6f706a] flex items-center gap-2">
                      <span>{evt.timestamp}</span>
                      {evt.completed && <span className="text-[#536b4f] font-semibold">&bull; RECORDED</span>}
                    </div>
                  </div>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                    <div>
                      <span className="text-[#6f706a] block text-[10px]">LOCATION</span>
                      <span className="text-[#1c1d1b] font-medium">{evt.location}</span>
                    </div>
                    <div>
                      <span className="text-[#6f706a] block text-[10px]">OPERATOR / AUDITOR</span>
                      <span className="text-[#1c1d1b]">{evt.operator}</span>
                    </div>
                    <div>
                      <span className="text-[#6f706a] block text-[10px]">RECORDED CONDITIONS</span>
                      <span className="text-[#1c1d1b]">
                        {evt.tempC !== undefined && `${evt.tempC.toFixed(1)} °C`}
                        {evt.weightKg !== undefined && ` • ${evt.weightKg.toFixed(2)} kg net`}
                        {evt.lidStatus && ` • ${evt.lidStatus}`}
                        {!evt.tempC && !evt.weightKg && '—'}
                      </span>
                    </div>
                  </div>

                  {evt.notes && (
                    <div className="mt-2 pt-2 border-t border-[#f7f5ef] text-[11px] text-[#6f706a]">
                      <span className="text-[#1c1d1b] font-medium">AUDIT NOTE:</span> {evt.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#ddd9cf] flex items-center justify-between text-xs font-mono text-[#6f706a]">
              <span>ELECTRONIC RECORD AUDIT CERTIFICATE</span>
              <span>VERIFIED BY FOODLINK CORE TELEMETRY ENGINE</span>
            </div>
          </div>
        )}

        {/* TAB 2: TEMPERATURE OPERATIONS CHART */}
        {activeTab === 'temp_chart' && (
          <TempHistoryChart
            data={telemetryLogs}
            minThreshold={batch.hardware.targetMinTempC}
            maxThreshold={batch.hardware.targetMaxTempC}
            categoryLabel={batch.categoryLabel || 'Hot-Hold / Chilled Logistics'}
          />
        )}

        {/* TAB 3: HARDWARE PRODUCT SHEET */}
        {activeTab === 'hardware' && (
          <NodeTechnicalSheet
            nodeId={`FOODLINK ${batch.hardware.deviceId}`}
            firmware={batch.hardware.firmwareVersion}
            tempReading={batch.hardware.temperatureC}
            weightReading={batch.hardware.netFoodWeightKg}
            lidLatched={batch.hardware.lidLatched}
          />
        )}

        {/* TAB 4: ROUTE MAP */}
        {activeTab === 'route' && (
          <div className="space-y-6">
            <RouteMap
              originName={batch.provider.name}
              destinationName={batch.receiver.name}
              currentLocationName={batch.hardware.locationName}
              eta={batch.estimatedArrivalIso}
              progressPercent={batch.status === 'awaiting_pickup' ? 10 : batch.status === 'in_transit' ? 68 : 100}
            />
          </div>
        )}

        {/* TAB 5: QR LABEL */}
        {activeTab === 'label' && (
          <div className="bg-white border border-[#ddd9cf] p-6 rounded-xs flex flex-col sm:flex-row items-start justify-between gap-8 font-mono text-xs">
            <div className="space-y-3 max-w-md">
              <div className="text-[10px] text-[#536b4f] uppercase tracking-wider font-bold">
                PHYSICAL PACKAGING BARCODE
              </div>
              <h3 className="text-lg font-bold text-[#1c1d1b]">Container Carton 2D Matrix</h3>
              <p className="text-[#6f706a] leading-relaxed">
                Scan this 2D QR matrix with any smartphone camera or courier scanner to immediately pull up
                this exact digital Food Passport record on mobile.
              </p>
              <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf] space-y-1 text-[11px]">
                <div><span className="text-[#6f706a]">BATCH ID:</span> {batch.code}</div>
                <div><span className="text-[#6f706a]">NET FOOD MASS:</span> {currentNetWeight.toFixed(2)} kg</div>
                <div><span className="text-[#6f706a]">CONTAINER NODE:</span> {batch.hardware.deviceId}</div>
              </div>
            </div>

            <div className="flex justify-center w-full sm:w-auto">
              <BatchQrCode
                batchCode={batch.code}
                foodName={batch.title}
                weightKg={currentNetWeight}
                nodeId={batch.hardware.deviceId}
                size={160}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
