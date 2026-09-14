'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/navbar';
import { Button } from '@/components/ui/button';
import { DeviceRecord } from '@/lib/store/telemetry-store';

export default function DevicesInventoryPage() {
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDevices() {
      try {
        const res = await fetch('/api/devices');
        if (res.ok) {
          const data = await res.json();
          setDevices(data.devices || []);
        }
      } catch (err) {
        console.error('Failed to load devices', err);
      } finally {
        setLoading(false);
      }
    }
    loadDevices();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1c1d1b] flex flex-col font-sans selection:bg-[#536b4f] selection:text-[#f7f5ef]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-mono text-[#6f706a] border-b border-[#ddd9cf] pb-3">
          <div className="flex items-center gap-2">
            <Link href="/app" className="hover:text-[#1c1d1b] transition-colors">
              &larr; Operations Console
            </Link>
            <span>/</span>
            <span className="text-[#1c1d1b] font-bold">Hardware Nodes</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#536b4f]" />
            <span className="text-[11px] text-[#536b4f] font-semibold uppercase">
              HARDWARE LAYER ACTIVE
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-white border border-[#ddd9cf] p-6 space-y-2">
          <div className="text-[10px] font-mono text-[#536b4f] uppercase tracking-wider font-bold">
            EQUIPMENT REGISTRY
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-2xl font-bold font-mono tracking-tight text-[#1c1d1b]">
              FIELD MONITORING NODES
            </h1>
            <span className="text-xs font-mono text-[#6f706a]">
              4 NODES REGISTERED &bull; ESP32 ARCHITECTURE
            </span>
          </div>
          <p className="text-xs text-[#6f706a] max-w-2xl pt-1 leading-relaxed">
            Physical telemetry units deployed on insulated food transit containers. Each node pairs a
            dual-core ESP32 controller with digital thermal probes, 24-bit strain gauge amplifiers, and
            hermetic lid latches.
          </p>
        </div>

        {/* Device List Table */}
        {loading ? (
          <div className="p-8 text-center font-mono text-xs text-[#6f706a] bg-white border border-[#ddd9cf]">
            Querying node inventory...
          </div>
        ) : (
          <div className="bg-white border border-[#ddd9cf] overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#ddd9cf] bg-[#f7f5ef] text-[#6f706a] text-[10px] uppercase">
                  <th className="py-3 px-4 font-semibold">Node Name / ID</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Assigned Batch</th>
                  <th className="py-3 px-4 font-semibold">Battery</th>
                  <th className="py-3 px-4 font-semibold">Sensors</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ece9df]">
                {devices.map((device) => (
                  <tr key={device.deviceId} className="hover:bg-[#fcfbf9] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1c1d1b]">{device.name}</div>
                      <div className="text-[10px] text-[#6f706a]">{device.deviceId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#e8eee5] text-[#3d523a] text-[10px] font-bold border border-[#ccd9c8]">
                        <span className="w-1.5 h-1.5 bg-[#536b4f]" />
                        {device.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {device.assignedBatchId ? (
                        <Link
                          href={`/food/${device.assignedBatchId}`}
                          className="font-semibold text-[#1c1d1b] hover:text-[#536b4f] underline underline-offset-2"
                        >
                          {device.assignedBatchId}
                        </Link>
                      ) : (
                        <span className="text-[#6f706a]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#1c1d1b]">{device.batteryPct}%</span>
                      <span className="text-[10px] text-[#6f706a] block">
                        RSSI {device.wifiRssiDbm} dBm
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[10px] text-[#6f706a]">
                      <div className="flex items-center gap-2">
                        <span className="text-[#3d523a]">DS18B20</span> &bull;
                        <span className="text-[#3d523a]">HX711</span> &bull;
                        <span className="text-[#3d523a]">Reed</span> &bull;
                        <span className="text-[#3d523a]">OLED</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/devices/${device.deviceId}`}>
                        <Button variant="outline" size="sm">
                          Inspect Node &rarr;
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
