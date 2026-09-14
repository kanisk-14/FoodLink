import React from 'react';
import { Thermometer, Scale, ShieldCheck, ShieldAlert, Wifi, Battery, BatteryCharging } from 'lucide-react';
import { Badge } from './badge';

interface TelemetryCardsProps {
  temperatureC: number;
  targetMinTempC: number;
  targetMaxTempC: number;
  tempStatus: 'safe' | 'warning' | 'breach';
  netWeightKg: number;
  tareWeightKg: number;
  weightVerified: boolean;
  lidLatched: boolean;
  lidOpenCount: number;
  wifiRssiDbm: number;
  batteryPct: number;
  isCharging?: boolean;
}

export function TelemetryOverviewGrid({
  temperatureC,
  targetMinTempC,
  targetMaxTempC,
  tempStatus,
  netWeightKg,
  tareWeightKg,
  weightVerified,
  lidLatched,
  lidOpenCount,
  wifiRssiDbm,
  batteryPct,
  isCharging = false,
}: TelemetryCardsProps) {
  const isHotChain = targetMinTempC >= 50;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* 1. Temperature Sensor (DS18B20 / PT100) */}
      <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-zinc-400" />
            Core Temp
          </span>
          <Badge
            variant={
              tempStatus === 'safe' ? 'success' : tempStatus === 'warning' ? 'warning' : 'danger'
            }
            size="sm"
          >
            {tempStatus}
          </Badge>
        </div>

        <div className="my-2 flex items-baseline gap-1">
          <span className="text-2xl font-semibold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
            {temperatureC.toFixed(1)}
          </span>
          <span className="text-xs font-mono text-zinc-500">°C</span>
        </div>

        <div className="text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-2 font-mono">
          <span>Target: {targetMinTempC.toFixed(1)}° - {targetMaxTempC.toFixed(1)}°C</span>
          <span className="text-zinc-400">{isHotChain ? 'Hot-Chain' : 'Chilled'}</span>
        </div>
      </div>

      {/* 2. Weight Sensor (Strain Gauge + HX711) */}
      <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-zinc-400" />
            Net Food Mass
          </span>
          <Badge variant={weightVerified ? 'success' : 'warning'} size="sm">
            {weightVerified ? 'Verified' : 'Uncalibrated'}
          </Badge>
        </div>

        <div className="my-2 flex items-baseline gap-1">
          <span className="text-2xl font-semibold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
            {netWeightKg.toFixed(2)}
          </span>
          <span className="text-xs font-mono text-zinc-500">kg</span>
        </div>

        <div className="text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-2 font-mono">
          <span>Tare: {tareWeightKg.toFixed(1)} kg</span>
          <span className="text-zinc-400">HX711 24b</span>
        </div>
      </div>

      {/* 3. Lid Latch Sensor (Magnetic Hall / Reed) */}
      <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
            {lidLatched ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            )}
            Lid Seal
          </span>
          <Badge variant={lidLatched ? 'success' : 'danger'} size="sm" pulse={!lidLatched}>
            {lidLatched ? 'Latched' : 'Open / Breached'}
          </Badge>
        </div>

        <div className="my-2 flex items-baseline gap-1.5">
          <span
            className={`text-lg font-semibold tracking-tight ${
              lidLatched ? 'text-zinc-900 dark:text-zinc-100' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {lidLatched ? 'Hermetic Seal Intact' : 'Seal Compromised'}
          </span>
        </div>

        <div className="text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-2 font-mono">
          <span>Open count: {lidOpenCount}</span>
          <span className="text-zinc-400">Reed Sw.</span>
        </div>
      </div>

      {/* 4. Telemetry Radio & Battery (ESP32 Node) */}
      <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            Radio Link
          </span>
          <Badge variant="hardware" size="sm">
            ESP32 Node
          </Badge>
        </div>

        <div className="my-2 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
              {batteryPct}
            </span>
            <span className="text-xs font-mono text-zinc-500">%</span>
            {isCharging ? (
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-500 ml-1 inline" />
            ) : (
              <Battery className="w-3.5 h-3.5 text-zinc-400 ml-1 inline" />
            )}
          </div>
          <span className="text-xs font-mono text-zinc-500">{wifiRssiDbm} dBm</span>
        </div>

        <div className="text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-2 font-mono">
          <span>Wi-Fi 802.11bgn</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Synced</span>
        </div>
      </div>
    </div>
  );
}
