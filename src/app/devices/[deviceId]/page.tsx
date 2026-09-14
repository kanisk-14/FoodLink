'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import { Button } from '@/components/ui/button';
import { DeviceRecord, TelemetryRecord } from '@/lib/store/telemetry-store';

export default function DeviceDetailPage() {
  const params = useParams();
  const rawId = (params?.deviceId as string) || 'FL-NODE-001';

  const [device, setDevice] = useState<DeviceRecord | null>(null);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(12);

  const fetchDeviceData = async () => {
    try {
      const res = await fetch(`/api/devices/${rawId}`);
      if (res.ok) {
        const data = await res.json();
        setDevice(data.device);
        setTelemetryLogs(data.recentTelemetry || []);
        setSecondsAgo(0);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceData();
    const ticker = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(ticker);
  }, [rawId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] text-[#1c1d1b] flex flex-col font-mono text-xs">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-3">
          <div className="w-5 h-5 border-2 border-[#1c1d1b] border-t-transparent rounded-full animate-spin" />
          <div className="text-[#6f706a]">Querying device equipment register...</div>
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] text-[#1c1d1b] flex flex-col font-mono text-xs">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 max-w-md mx-auto text-center">
          <div className="text-sm font-bold text-[#8e2929] uppercase">DEVICE NOT REGISTERED</div>
          <p className="text-[#6f706a]">
            No physical controller registered with identifier {rawId}.
          </p>
          <Link href="/devices">
            <Button variant="primary" size="sm">
              Return to Equipment Inventory
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1c1d1b] flex flex-col font-sans selection:bg-[#536b4f] selection:text-[#f7f5ef]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-mono text-[#6f706a] border-b border-[#ddd9cf] pb-3">
          <div className="flex items-center gap-2">
            <Link href="/devices" className="hover:text-[#1c1d1b] transition-colors">
              &larr; Equipment Registry
            </Link>
            <span>/</span>
            <span>Nodes</span>
            <span>/</span>
            <span className="text-[#1c1d1b] font-bold">{device.deviceId}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#536b4f]" />
            <span className="text-[10px] text-[#536b4f] font-semibold uppercase">
              HARDWARE HEARTBEAT OK
            </span>
          </div>
        </div>

        {/* =============================================================== */}
        {/* HEADER SECTION (EXACT FORMAT REQUESTED) */}
        {/* =============================================================== */}
        <div className="bg-white border border-[#ddd9cf] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#ece9df] pb-4">
            <div>
              <div className="text-[10px] font-mono text-[#6f706a] uppercase tracking-wider">
                PHYSICAL EQUIPMENT RECORD
              </div>
              <h1 className="text-2xl font-bold font-mono tracking-tight text-[#1c1d1b] mt-0.5">
                {device.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[#6f706a] uppercase block">DEVICE ID</span>
                <span className="font-bold text-sm text-[#1c1d1b]">{device.deviceId}</span>
              </div>

              <div>
                <span className="text-[10px] text-[#6f706a] uppercase block">STATUS</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#e8eee5] text-[#3d523a] text-xs font-bold border border-[#ccd9c8] mt-0.5">
                  <span className="w-1.5 h-1.5 bg-[#536b4f]" />
                  {device.status}
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================= */}
          {/* TECHNICAL SPECIFICATION LAYOUT (COMPACT ROWS & DIVIDERS) */}
          {/* ============================================================= */}
          <div className="space-y-1 font-mono text-xs">
            <div className="text-[10px] font-bold text-[#6f706a] uppercase tracking-wider py-1">
              SUBSYSTEM STATUS &amp; CONNECTIVITY
            </div>

            <div className="divide-y divide-[#ece9df] border-t border-b border-[#ece9df]">
              {/* Row 1: Temperature Sensor */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#536b4f]" />
                  <span className="text-[#6f706a] uppercase text-[11px]">TEMPERATURE SENSOR</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#6f706a]">DS18B20 1-Wire Digital Probe</span>
                  <span className="font-semibold text-[#3d523a] bg-[#e8eee5] px-2 py-0.5 text-[10px]">
                    {device.sensors.temperature}
                  </span>
                </div>
              </div>

              {/* Row 2: Weight Sensor */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#536b4f]" />
                  <span className="text-[#6f706a] uppercase text-[11px]">WEIGHT SENSOR</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#6f706a]">HX711 24-bit ADC + Strain Gauges</span>
                  <span className="font-semibold text-[#3d523a] bg-[#e8eee5] px-2 py-0.5 text-[10px]">
                    {device.sensors.weight}
                  </span>
                </div>
              </div>

              {/* Row 3: Lid Sensor */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#536b4f]" />
                  <span className="text-[#6f706a] uppercase text-[11px]">LID SENSOR</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#6f706a]">Hermetic Magnetic Reed Switch</span>
                  <span className="font-semibold text-[#3d523a] bg-[#e8eee5] px-2 py-0.5 text-[10px]">
                    {device.sensors.lid}
                  </span>
                </div>
              </div>

              {/* Row 4: Wi-Fi */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#536b4f]" />
                  <span className="text-[#6f706a] uppercase text-[11px]">WIFI</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#6f706a]">
                    2.4 GHz 802.11 b/g/n &bull; RSSI {device.wifiRssiDbm} dBm
                  </span>
                  <span className="font-semibold text-[#3d523a] bg-[#e8eee5] px-2 py-0.5 text-[10px]">
                    {device.sensors.wifi}
                  </span>
                </div>
              </div>

              {/* Row 5: Last Sync */}
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#6f706a]" />
                  <span className="text-[#6f706a] uppercase text-[11px]">LAST SYNC</span>
                </div>
                <div className="text-[11px] font-semibold text-[#1c1d1b]">
                  {secondsAgo} seconds ago
                </div>
              </div>
            </div>
          </div>

          {/* Quick Hardware Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="text-[11px] text-[#6f706a]">
              ASSIGNED BATCH:{' '}
              {device.assignedBatchId ? (
                <Link
                  href={`/food/${device.assignedBatchId}`}
                  className="font-bold text-[#1c1d1b] underline underline-offset-2 hover:text-[#536b4f]"
                >
                  {device.assignedBatchId} &rarr;
                </Link>
              ) : (
                <span className="text-[#b8b4a7]">Unassigned</span>
              )}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={fetchDeviceData}
              className="text-xs"
            >
              Refresh Hardware State
            </Button>
          </div>
        </div>

        {/* =============================================================== */}
        {/* HARDWARE SPECIFICATION SHEET */}
        {/* =============================================================== */}
        <div className="bg-white border border-[#ddd9cf] p-6 space-y-4 font-mono text-xs">
          <div className="border-b border-[#ece9df] pb-3">
            <span className="text-[10px] text-[#536b4f] uppercase tracking-wider font-bold">
              COMPONENT ARCHITECTURE
            </span>
            <h2 className="text-sm font-bold text-[#1c1d1b]">
              Physical Node Bill of Materials &amp; Pinout
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
            <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf] space-y-1">
              <span className="text-[10px] text-[#6f706a] block uppercase">MICROCONTROLLER (MCU)</span>
              <div className="font-semibold text-[#1c1d1b]">{device.specs.mcu}</div>
              <div className="text-[10px] text-[#6f706a]">Firmware Version: {device.firmwareVersion}</div>
            </div>

            <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf] space-y-1">
              <span className="text-[10px] text-[#6f706a] block uppercase">THERMAL PROBE</span>
              <div className="font-semibold text-[#1c1d1b]">{device.specs.tempSensor}</div>
              <div className="text-[10px] text-[#6f706a]">GPIO 4 &bull; 4.7kΩ Pull-Up Resistor</div>
            </div>

            <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf] space-y-1">
              <span className="text-[10px] text-[#6f706a] block uppercase">LOAD CELL SENSOR</span>
              <div className="font-semibold text-[#1c1d1b]">{device.specs.loadCell}</div>
              <div className="text-[10px] text-[#6f706a]">DT: GPIO 16 &bull; SCK: GPIO 4</div>
            </div>

            <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf] space-y-1">
              <span className="text-[10px] text-[#6f706a] block uppercase">POWER MANAGEMENT</span>
              <div className="font-semibold text-[#1c1d1b]">{device.specs.power}</div>
              <div className="text-[10px] text-[#536b4f]">Battery Level: {device.batteryPct}% Nominal</div>
            </div>
          </div>
        </div>

        {/* =============================================================== */}
        {/* RECENT TELEMETRY LOG LEDGER */}
        {/* =============================================================== */}
        <div className="bg-white border border-[#ddd9cf] p-6 space-y-4 font-mono text-xs">
          <div className="flex items-baseline justify-between border-b border-[#ece9df] pb-3">
            <div>
              <span className="text-[10px] text-[#536b4f] uppercase tracking-wider font-bold">
                TELEMETRY INGESTION LEDGER
              </span>
              <h2 className="text-sm font-bold text-[#1c1d1b]">
                Recent Ingested HTTP Telemetry Frames
              </h2>
            </div>
            <span className="text-[10px] text-[#6f706a]">
              {telemetryLogs.length} FRAMES RECORDED
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#ddd9cf] bg-[#f7f5ef] text-[#6f706a] text-[10px] uppercase">
                  <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-3 font-semibold">Batch ID</th>
                  <th className="py-2.5 px-3 font-semibold">Temperature</th>
                  <th className="py-2.5 px-3 font-semibold">Gross Weight</th>
                  <th className="py-2.5 px-3 font-semibold">Net Weight</th>
                  <th className="py-2.5 px-3 font-semibold">Container Lid</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece9df]">
                {telemetryLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#fcfbf9] transition-colors">
                    <td className="py-2 px-3 text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-2 px-3 font-semibold text-[#1c1d1b]">{log.batchId}</td>
                    <td className="py-2 px-3 font-semibold text-[#3d523a]">{log.temperature} &deg;C</td>
                    <td className="py-2 px-3">{log.weight} kg</td>
                    <td className="py-2 px-3 font-semibold text-[#1c1d1b]">{log.netWeight} kg</td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-block px-1.5 py-0.2 text-[9px] font-bold ${
                          log.lidOpen
                            ? 'bg-[#f3e5de] text-[#934e35]'
                            : 'bg-[#e8eee5] text-[#3d523a]'
                        }`}
                      >
                        {log.lidOpen ? 'OPEN' : 'SEALED'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[10px] text-[#6f706a]">
                      {log.isDemo ? (
                        <span className="text-[#b66a4e] font-semibold">[DEMO]</span>
                      ) : (
                        <span>[ESP32]</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
