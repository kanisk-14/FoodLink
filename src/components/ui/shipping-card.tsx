'use client';

import React, { useState, useEffect } from 'react';

export interface EquipmentCardProps {
  nodeId?: string;
  batchCode?: string;
  itemDescription?: string;
  weightKg?: number;
  tempC?: number;
  status?: string;
  time?: string;
  lidStatus?: string;
  categoryTag?: string;
  interactiveNodeConnect?: boolean;
}

type ConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'FAILED';

function formatTimestamp(isoOrTime?: string): string {
  if (!isoOrTime) return '12:42 PM';
  if (!isoOrTime.includes('T')) return isoOrTime;
  try {
    const d = new Date(isoOrTime);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return isoOrTime;
  }
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
  interactiveNodeConnect = false,
}: EquipmentCardProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    interactiveNodeConnect ? 'DISCONNECTED' : 'CONNECTED'
  );

  const [liveData, setLiveData] = useState({
    tempC,
    weightKg,
    lidStatus,
    status,
    time,
    batchCode,
    itemDescription,
    categoryTag,
  });

  const handleConnect = async () => {
    if (connectionState === 'CONNECTING') return;
    setConnectionState('CONNECTING');

    try {
      // Connect to real ESP32 node 01 via existing Phase 3 backend API
      const res = await fetch('/api/devices/FL-NODE-001');
      if (!res.ok) {
        throw new Error('Device unreachable');
      }

      const data = await res.json();
      const logs = data.recentTelemetry || [];
      // Look for real hardware telemetry or latest available log
      const realLog =
        [...logs].reverse().find((t: any) => !t.isDemo) || logs[logs.length - 1];

      if (realLog) {
        setLiveData((prev) => ({
          ...prev,
          tempC: typeof realLog.temperature === 'number' ? realLog.temperature : prev.tempC,
          weightKg:
            typeof realLog.netWeight === 'number'
              ? realLog.netWeight
              : typeof realLog.weight === 'number'
              ? Math.max(0, realLog.weight - 2.2)
              : prev.weightKg,
          lidStatus: realLog.lidOpen ? 'UNLATCHED' : 'LATCHED',
          time: formatTimestamp(realLog.timestamp),
          batchCode: realLog.batchId || prev.batchCode,
        }));
      }

      // Small tactical delay for real connection feedback
      setTimeout(() => {
        setConnectionState('CONNECTED');
      }, 400);
    } catch (err) {
      console.warn('Node 01 connection attempt failed:', err);
      setTimeout(() => {
        setConnectionState('FAILED');
      }, 400);
    }
  };

  // Real-time polling after connection
  useEffect(() => {
    if (connectionState !== 'CONNECTED' || !interactiveNodeConnect) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch('/api/devices/FL-NODE-001');
        if (res.ok) {
          const data = await res.json();
          const logs = data.recentTelemetry || [];
          const realLog =
            [...logs].reverse().find((t: any) => !t.isDemo) || logs[logs.length - 1];

          if (realLog) {
            setLiveData((prev) => ({
              ...prev,
              tempC: typeof realLog.temperature === 'number' ? realLog.temperature : prev.tempC,
              weightKg:
                typeof realLog.netWeight === 'number'
                  ? realLog.netWeight
                  : typeof realLog.weight === 'number'
                  ? Math.max(0, realLog.weight - 2.2)
                  : prev.weightKg,
              lidStatus: realLog.lidOpen ? 'UNLATCHED' : 'LATCHED',
              time: formatTimestamp(realLog.timestamp),
              batchCode: realLog.batchId || prev.batchCode,
            }));
          }
        }
      } catch (err) {
        console.warn('Telemetry polling error:', err);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [connectionState, interactiveNodeConnect]);

  return (
    <div className="w-full max-w-sm bg-white border border-[#ddd9cf] p-5 shadow-xs font-mono text-xs text-[#1c1d1b] select-none relative">
      {/* Top Header */}
      <div className="pb-3 border-b border-[#ddd9cf] space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 shrink-0 mt-0.5 ${
                connectionState === 'CONNECTED'
                  ? 'bg-[#536b4f]'
                  : connectionState === 'CONNECTING'
                  ? 'bg-[#536b4f] animate-pulse'
                  : connectionState === 'FAILED'
                  ? 'bg-[#934e35]'
                  : 'bg-[#b8b4a7]'
              }`}
            />
            <div>
              <div className="text-[10px] text-[#6f706a] uppercase tracking-wider">
                EQUIPMENT TAG
              </div>
              <div className="font-bold text-sm tracking-tight text-[#1c1d1b]">
                {connectionState === 'CONNECTED' ? (
                  <span>FOODLINK {nodeId}</span>
                ) : (
                  <span className="filter blur-[3.5px] select-none opacity-80">
                    FOODLINK NODE ••
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-[#6f706a] uppercase tracking-wider">
              CONTROLLER
            </div>
            <div
              className={`text-[11px] font-semibold ${
                connectionState === 'CONNECTED' ? 'text-[#536b4f]' : 'text-[#8e8e86]'
              }`}
            >
              {connectionState === 'CONNECTED' ? 'ESP32 \u2022 VER 1.2' : 'NOT CONNECTED'}
            </div>
          </div>
        </div>

        {/* Interactive Connection Row */}
        {interactiveNodeConnect && (
          <div>
            {connectionState === 'DISCONNECTED' && (
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  id="connect-node-btn"
                  onClick={handleConnect}
                  className="px-2.5 py-1 bg-[#1c1d1b] hover:bg-[#536b4f] text-[#f7f5ef] text-[10px] font-mono font-medium tracking-wider uppercase rounded-xs transition-colors cursor-pointer border border-[#1c1d1b]"
                >
                  CONNECT TO NODE 01
                </button>
                <span className="text-[9px] text-[#8e8e86] font-mono uppercase">
                  STANDBY &bull; OFFLINE
                </span>
              </div>
            )}

            {connectionState === 'CONNECTING' && (
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled
                  id="connect-node-btn"
                  className="px-2.5 py-1 bg-[#f2efe7] text-[#6f706a] border border-[#ddd9cf] text-[10px] font-mono tracking-wider uppercase rounded-xs cursor-wait flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 bg-[#536b4f] animate-spin rounded-full" />
                  CONNECTING...
                </button>
                <span className="text-[9px] text-[#536b4f] font-mono uppercase animate-pulse">
                  CONNECTING TO ESP32...
                </span>
              </div>
            )}

            {connectionState === 'CONNECTED' && (
              <div className="flex items-center justify-between pt-0.5 text-[9px] font-mono text-[#536b4f]">
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-[#536b4f] rounded-full inline-block" />
                  NODE 01 ONLINE &bull; LIVE STREAM
                </span>
                <span className="text-[9px] text-[#6f706a]">Wi-Fi -62 dBm</span>
              </div>
            )}

            {connectionState === 'FAILED' && (
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  id="connect-node-btn"
                  onClick={handleConnect}
                  className="px-2.5 py-1 bg-[#f3e5de] hover:bg-[#e2cdc4] text-[#934e35] border border-[#e2cdc4] text-[10px] font-mono tracking-wider uppercase rounded-xs transition-colors cursor-pointer"
                >
                  RETRY CONNECTION
                </button>
                <span className="text-[9px] text-[#934e35] font-mono uppercase font-semibold">
                  NODE CONNECTION FAILED
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Grid: Data Matrix */}
      <div className="py-4 space-y-3.5 divide-y divide-[#ece9df]">
        {/* Batch & Category Tag */}
        <div className="pt-0 flex items-start justify-between">
          <div>
            <span className="text-[10px] text-[#6f706a] uppercase tracking-wider block mb-0.5">
              BATCH IDENTIFIER
            </span>
            <span className="text-base font-bold text-[#1c1d1b] tracking-tight">
              {liveData.batchCode}
            </span>
          </div>
          {/* Subtle Terracotta Accent Tag */}
          <span className="px-1.5 py-0.5 bg-[#f3e5de] text-[#934e35] border border-[#e2cdc4] text-[9px] font-bold tracking-wider uppercase">
            {liveData.categoryTag}
          </span>
        </div>

        {/* Item & Net Weight */}
        <div className="pt-3 flex items-baseline justify-between">
          <div>
            <span className="text-[10px] text-[#6f706a] uppercase tracking-wider block mb-0.5">
              FOOD BATCH
            </span>
            <span className="font-bold text-sm text-[#1c1d1b]">{liveData.itemDescription}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#6f706a] uppercase tracking-wider block mb-0.5">
              NET WEIGHT
            </span>
            <span className="font-bold text-sm text-[#1c1d1b]">
              {liveData.weightKg.toFixed(1)} kg
            </span>
          </div>
        </div>

        {/* Temp & Container Seal (with Muted Olive for Healthy Latch) */}
        <div className="pt-3 grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] text-[#6f706a] uppercase tracking-wider block mb-0.5">
              RECORDED TEMP
            </span>
            <span className="text-base font-bold text-[#1c1d1b]">
              {liveData.tempC.toFixed(1)} &deg;C
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#6f706a] uppercase tracking-wider block mb-0.5">
              CONTAINER SEAL
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 ${
                  liveData.lidStatus === 'LATCHED' ? 'bg-[#536b4f]' : 'bg-[#934e35]'
                }`}
              />
              <span
                className={`text-sm font-semibold ${
                  liveData.lidStatus === 'LATCHED' ? 'text-[#536b4f]' : 'text-[#934e35]'
                }`}
              >
                {liveData.lidStatus}
              </span>
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
              {liveData.status}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#6f706a] uppercase tracking-wider block mb-0.5">
              LAST LOGGED
            </span>
            <span className="text-xs text-[#1c1d1b] font-medium">{liveData.time}</span>
          </div>
        </div>
      </div>

      {/* Bottom Technical Bar */}
      <div className="pt-3 border-t border-[#ddd9cf] flex items-center justify-between text-[10px] text-[#6f706a]">
        <span>SENSOR: DS18B20 + HX711</span>
        <span
          className={
            connectionState === 'CONNECTED'
              ? 'text-[#536b4f] font-medium'
              : 'text-[#8e8e86]'
          }
        >
          {connectionState === 'CONNECTED' ? 'SYS LOG OK' : 'SYS LOG STANDBY'}
        </span>
      </div>
    </div>
  );
}
