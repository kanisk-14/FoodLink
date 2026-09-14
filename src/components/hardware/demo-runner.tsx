'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DemoStepDefinition } from '@/lib/store/telemetry-store';

interface DemoRunnerProps {
  onStepChange?: () => void;
  compact?: boolean;
}

export function DemoRunner({ onStepChange, compact = false }: DemoRunnerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(5);
  const [step, setStep] = useState<DemoStepDefinition | null>(null);
  const [allSteps, setAllSteps] = useState<DemoStepDefinition[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDemoState = useCallback(async () => {
    try {
      const res = await fetch('/api/demo');
      if (res.ok) {
        const data = await res.json();
        setCurrentStepIndex(data.currentStepIndex);
        setStep(data.step);
        setAllSteps(data.allSteps || []);
      }
    } catch (err) {
      console.error('Failed to load demo state', err);
    }
  }, []);

  useEffect(() => {
    fetchDemoState();
  }, [fetchDemoState]);

  const handleAction = async (action: 'advance' | 'step' | 'reset', stepIndex?: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, stepIndex }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentStepIndex(data.currentStepIndex);
        setStep(data.step);
        if (onStepChange) onStepChange();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        handleAction('advance');
      }, 4000);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying]);

  if (!step) return null;

  const nextStepIndex = (currentStepIndex + 1) % (allSteps.length || 10);
  const nextStep = allSteps[nextStepIndex];

  if (compact) {
    return (
      <div className="bg-[#fcfbf9] border border-[#ddd9cf] p-3 font-mono text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 bg-[#f3e5de] text-[#934e35] text-[10px] font-bold border border-[#e2cdc4]">
            DEMO MODE
          </span>
          <span className="font-bold text-[#1c1d1b]">FL-DEMO-001</span>
          <span className="text-[#6f706a]">
            &bull; Step {step.stepNumber}: {step.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => handleAction('advance')}
            className="text-[11px]"
          >
            Advance Step &rarr;
          </Button>
          <Link href="/food/FL-DEMO-001">
            <Button variant="primary" size="sm" className="text-[11px]">
              Inspect Passport &rarr;
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#ddd9cf] font-mono text-xs shadow-2xs">
      {/* Top Header Label */}
      <div className="p-3 bg-[#f7f5ef] border-b border-[#ddd9cf] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 bg-[#f3e5de] text-[#934e35] font-bold border border-[#e2cdc4] text-[10px]">
            DEMO MODE &bull; SIMULATED DATA
          </span>
          <span className="text-xs font-bold text-[#1c1d1b]">
            COHERENT SCENARIO CONTROLLER &bull; BATCH FL-DEMO-001
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-[#6f706a]">Target Device:</span>
          <span className="font-semibold text-[#1c1d1b]">FL-NODE-001</span>
        </div>
      </div>

      {/* Main Control Strip */}
      <div className="p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#ece9df] pb-4">
          <div>
            <div className="text-[10px] text-[#536b4f] font-bold uppercase tracking-wider">
              CURRENT SCENARIO MILESTONE
            </div>
            <div className="text-base font-bold text-[#1c1d1b] mt-0.5">
              STEP {step.stepNumber} &bull; {step.title}
            </div>
            <p className="text-[11px] text-[#6f706a] mt-0.5 leading-relaxed max-w-xl">
              {step.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={isPlaying ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-xs"
            >
              {isPlaying ? '❚❚ Pause Auto-Play' : '▶ Run Automated Demo'}
            </Button>

            <Button
              variant="primary"
              size="sm"
              disabled={loading}
              onClick={() => handleAction('advance')}
              className="text-xs"
            >
              {nextStep ? `Advance: ${nextStep.stepNumber} ${nextStep.title} →` : 'Advance Step →'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              disabled={loading}
              onClick={() => handleAction('reset')}
              className="text-[11px] text-[#6f706a]"
            >
              Reset to 01
            </Button>

            <Link href="/food/FL-DEMO-001">
              <Button variant="outline" size="sm" className="text-xs">
                Open FL-DEMO-001 Record &rarr;
              </Button>
            </Link>
          </div>
        </div>

        {/* 10-Stage Milestone Selector Ribbon */}
        <div>
          <div className="text-[10px] font-bold text-[#6f706a] uppercase mb-2">
            SELECT SPECIFIC SCENARIO MILESTONE (01 – 10)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5">
            {allSteps.map((s, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <button
                  key={s.stepNumber}
                  onClick={() => handleAction('step', idx)}
                  className={`p-2 border text-left cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-[#1c1d1b] text-white border-[#1c1d1b]'
                      : isPast
                      ? 'bg-[#e8eee5] text-[#3d523a] border-[#ccd9c8] hover:bg-[#dbe4d7]'
                      : 'bg-[#f7f5ef] text-[#6f706a] border-[#ddd9cf] hover:bg-[#ece9df]'
                  }`}
                >
                  <div className="text-[10px] font-bold">{s.stepNumber}</div>
                  <div className="text-[9px] truncate mt-0.5">{s.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Status Row */}
        <div className="p-3 bg-[#f7f5ef] border border-[#ddd9cf] grid grid-cols-2 sm:grid-cols-5 gap-3 text-[11px]">
          <div>
            <span className="text-[10px] text-[#6f706a] block">CORE TEMP</span>
            <span className="font-bold text-[#3d523a]">{step.temperature.toFixed(1)} &deg;C</span>
          </div>
          <div>
            <span className="text-[10px] text-[#6f706a] block">NET WEIGHT</span>
            <span className="font-bold text-[#1c1d1b]">{step.netWeight.toFixed(2)} kg</span>
          </div>
          <div>
            <span className="text-[10px] text-[#6f706a] block">CONTAINER SEAL</span>
            <span className="font-bold text-[#3d523a]">
              {step.lidLatched ? '■ LATCHED' : '▲ UNLATCHED'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#6f706a] block">CURRENT LOCATION</span>
            <span className="font-semibold text-[#1c1d1b] truncate block">{step.location}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#6f706a] block">DISPATCH STAGE</span>
            <span className="font-bold text-[#536b4f]">{step.deliveryStage}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
