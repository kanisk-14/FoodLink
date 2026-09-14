'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface DemoModeControlProps {
  batchId: string;
  deviceId: string;
  currentTemp: number;
  currentWeight: number;
  lidLatched: boolean;
  onUpdate: () => void;
}

export function DemoModeControl({
  batchId,
  deviceId,
  currentTemp,
  currentWeight,
  lidLatched,
  onUpdate,
}: DemoModeControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const simulatePing = async (overrides: {
    temperature?: number;
    weight?: number;
    lidOpen?: boolean;
    location?: string;
  }) => {
    setLoading(true);
    try {
      const payload = {
        batchId,
        temperature: overrides.temperature ?? currentTemp,
        weight: overrides.weight ?? currentWeight,
        lidOpen: overrides.lidOpen ?? !lidLatched,
        location: overrides.location,
        timestamp: new Date().toISOString(),
        isDemo: true,
      };

      const res = await fetch(`/api/devices/${deviceId}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onUpdate();
      }
    } catch (err) {
      console.error('Demo simulation error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[#ddd9cf] bg-white font-mono text-xs">
      {/* Demo Header Bar with explicit DEMO DATA label */}
      <div className="p-3 bg-[#f7f5ef] border-b border-[#ddd9cf] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[#f3e5de] text-[#934e35] font-bold border border-[#e2cdc4] text-[10px]">
            DEMO DATA SIMULATOR
          </span>
          <span className="text-[11px] text-[#6f706a]">
            Presentation Hardware Controls &bull; {deviceId}
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[11px] font-semibold text-[#1c1d1b] hover:text-[#536b4f] underline underline-offset-2 cursor-pointer"
        >
          {isOpen ? '[ Hide Controls ]' : '[ Open Controls ]'}
        </button>
      </div>

      {/* Simulator Control Drawer */}
      {isOpen && (
        <div className="p-4 space-y-4">
          <div className="p-2.5 bg-[#f7f5ef] border border-[#ddd9cf] text-[11px] text-[#6f706a]">
            <strong>NOTICE:</strong> Telemetry generated here is flagged with <code className="text-[#934e35]">[DEMO]</code> in
            the audit ledger. It simulates real hardware pin activity for client presentations without altering actual physical sensor logs.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Lid Open / Close */}
            <div className="p-3 border border-[#ddd9cf] bg-[#fcfbf9] space-y-2">
              <span className="text-[10px] text-[#6f706a] uppercase font-bold block">
                01 &bull; LID REED SWITCH
              </span>
              <p className="text-[10px] text-[#6f706a]">
                State: {lidLatched ? 'LATCHED (Hermetic)' : 'OPEN (Breach)'}
              </p>
              <Button
                variant="outline"
                size="sm"
                disabled={loading}
                className="w-full text-xs"
                onClick={() => {
                  const nextState = !lidLatched;
                  setLastAction(nextState ? 'Lid Opened Event Triggered' : 'Lid Resealed Event Triggered');
                  simulatePing({ lidOpen: nextState });
                }}
              >
                {lidLatched ? 'Trigger Lid Open' : 'Trigger Lid Reseal'}
              </Button>
            </div>

            {/* 2. Temperature Fluctuations */}
            <div className="p-3 border border-[#ddd9cf] bg-[#fcfbf9] space-y-2">
              <span className="text-[10px] text-[#6f706a] uppercase font-bold block">
                02 &bull; THERMAL PROBE (DS18B20)
              </span>
              <p className="text-[10px] text-[#6f706a]">
                Reading: {currentTemp.toFixed(1)} &deg;C
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="w-1/2 text-[10px]"
                  onClick={() => {
                    setLastAction('Temp warmed +1.2°C');
                    simulatePing({ temperature: currentTemp + 1.2 });
                  }}
                >
                  Warm (+1.2&deg;)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="w-1/2 text-[10px]"
                  onClick={() => {
                    setLastAction('Temp cooled -0.8°C');
                    simulatePing({ temperature: Math.max(1.0, currentTemp - 0.8) });
                  }}
                >
                  Cool (-0.8&deg;)
                </Button>
              </div>
            </div>

            {/* 3. Weight / Load Cell */}
            <div className="p-3 border border-[#ddd9cf] bg-[#fcfbf9] space-y-2">
              <span className="text-[10px] text-[#6f706a] uppercase font-bold block">
                03 &bull; LOAD CELL (HX711)
              </span>
              <p className="text-[10px] text-[#6f706a]">
                Gross: {currentWeight.toFixed(2)} kg
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="w-1/2 text-[10px]"
                  onClick={() => {
                    setLastAction('Weight decreased -0.30 kg');
                    simulatePing({ weight: Math.max(2.2, currentWeight - 0.3) });
                  }}
                >
                  Delta (-0.30kg)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  className="w-1/2 text-[10px]"
                  onClick={() => {
                    setLastAction('Reset initial weight (6.4 kg)');
                    simulatePing({ weight: 6.4 });
                  }}
                >
                  Reset (6.4kg)
                </Button>
              </div>
            </div>
          </div>

          {lastAction && (
            <div className="text-[10px] text-[#536b4f] font-semibold border-t border-[#ece9df] pt-2 flex items-center justify-between">
              <span>✓ Last simulated dispatch: {lastAction}</span>
              <span className="text-[#6f706a]">Recorded in local audit ledger</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
