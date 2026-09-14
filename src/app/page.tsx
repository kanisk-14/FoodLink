'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EquipmentCard } from '@/components/ui/shipping-card';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1c1d1b] flex flex-col font-sans selection:bg-[#536b4f] selection:text-[#f7f5ef]">
      <Navbar />

      <main className="flex-1">
        {/* ================================================================= */}
        {/* HERO / PRODUCT SECTION */}
        {/* ================================================================= */}
        <section id="product" className="scroll-mt-16 border-b border-[#ddd9cf] pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline with intentional olive color emphasis */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-[#e8eee5] text-[#3d523a] border border-[#ccd9c8] font-mono text-[10px] font-semibold uppercase tracking-wider rounded-xs">
                    HARDWARE + SOFTWARE SYSTEM
                  </span>
                  <span className="text-[11px] font-mono text-[#6f706a]">PROTOTYPE V1.2</span>
                </div>

                {/* Hero Heading: Charcoal with muted olive emphasis on 'delivery.' */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1c1d1b] leading-[1.18]">
                  Surplus food,
                  <br />
                  tracked from pickup to{' '}
                  <span className="text-[#536b4f] underline decoration-[#ccd9c8] decoration-2 underline-offset-4">
                    delivery.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-[#6f706a] leading-relaxed max-w-xl">
                  FoodLink connects surplus-food providers, delivery partners, and receiving
                  organizations while keeping a digital record of each food batch during its
                  journey.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link href="/app">
                    <Button variant="primary" size="md">
                      Open dashboard
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="md">
                      Sign in by role
                    </Button>
                  </Link>
                </div>

                {/* Honest Disclosure Note with warm border & subtle olive accent */}
                <div className="pt-6 border-t border-[#ddd9cf] max-w-lg">
                  <div className="flex items-start gap-2 text-[11px] font-mono text-[#6f706a] leading-relaxed">
                    <span className="text-[#536b4f] font-bold">[NOTE]</span>
                    <p>
                      FoodLink monitors and records physical transit conditions (temperature,
                      weight, and lid status). It provides transparent data, not automatic food
                      guarantees.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Physical Product Equipment Card with color hierarchy */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <EquipmentCard
                  nodeId="NODE 01"
                  batchCode="FL-0024"
                  itemDescription="BIRYANI"
                  weightKg={4.2}
                  tempC={7.4}
                  status="IN TRANSIT"
                  time="12:42 PM"
                  lidStatus="LATCHED"
                  categoryTag="PREPARED MEAL"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* HOW IT WORKS (01 - 04 FLOW) WITH OLIVE / TERRACOTTA COLOR ACCENTS */}
        {/* ================================================================= */}
        <section id="how-it-works" className="scroll-mt-16 border-b border-[#ddd9cf] py-16 sm:py-20 bg-[#f2efe7]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12 pb-4 border-b border-[#ddd9cf]">
              <div>
                <span className="text-[11px] font-mono text-[#536b4f] font-semibold uppercase tracking-wider block mb-1">
                  WORKFLOW
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1c1d1b]">
                  How FoodLink works
                </h2>
              </div>
              <span className="text-xs font-mono text-[#6f706a] mt-2 sm:mt-0">
                FOUR STEPS &bull; PICKUP TO INTAKE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
              {/* Step 01 */}
              <div className="space-y-3 bg-white/70 p-4 border border-[#ddd9cf] rounded-xs">
                <div className="border-t-2 border-[#536b4f] pt-2 flex items-baseline justify-between font-mono text-xs">
                  <span className="font-bold text-base text-[#536b4f]">01</span>
                  <span className="px-1.5 py-0.5 bg-[#e8eee5] text-[#3d523a] text-[9px] font-bold uppercase tracking-wider">
                    COLLECT
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#1c1d1b] tracking-tight">
                  FOOD PREPARED
                </h3>
                <p className="text-xs text-[#6f706a] leading-relaxed">
                  The food provider packages surplus food into the container. The initial batch
                  weight and temperature are recorded to establish the baseline entry.
                </p>
              </div>

              {/* Step 02 */}
              <div className="space-y-3 bg-white/70 p-4 border border-[#ddd9cf] rounded-xs">
                <div className="border-t-2 border-[#536b4f] pt-2 flex items-baseline justify-between font-mono text-xs">
                  <span className="font-bold text-base text-[#536b4f]">02</span>
                  <span className="px-1.5 py-0.5 bg-[#e8eee5] text-[#3d523a] text-[9px] font-bold uppercase tracking-wider">
                    MONITOR
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#1c1c1f] tracking-tight">
                  FOOD MONITORED
                </h3>
                <p className="text-xs text-[#6f706a] leading-relaxed">
                  During transportation, the onboard device periodically logs temperature, weight,
                  and container lid state, creating a continuous historical record.
                </p>
              </div>

              {/* Step 03 (Terracotta Highlight for Transit/Move Step) */}
              <div className="space-y-3 bg-white/70 p-4 border border-[#ddd9cf] rounded-xs">
                <div className="border-t-2 border-[#b66a4e] pt-2 flex items-baseline justify-between font-mono text-xs">
                  <span className="font-bold text-base text-[#b66a4e]">03</span>
                  <span className="px-1.5 py-0.5 bg-[#f3e5de] text-[#934e35] text-[9px] font-bold uppercase tracking-wider">
                    MOVE
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#1c1d1b] tracking-tight">
                  FOOD DELIVERED
                </h3>
                <p className="text-xs text-[#6f706a] leading-relaxed">
                  The delivery partner transports the container to the destination. Couriers can check
                  the simple physical display to see current conditions at a glance.
                </p>
              </div>

              {/* Step 04 */}
              <div className="space-y-3 bg-white/70 p-4 border border-[#ddd9cf] rounded-xs">
                <div className="border-t-2 border-[#536b4f] pt-2 flex items-baseline justify-between font-mono text-xs">
                  <span className="font-bold text-base text-[#536b4f]">04</span>
                  <span className="px-1.5 py-0.5 bg-[#e8eee5] text-[#3d523a] text-[9px] font-bold uppercase tracking-wider">
                    RECEIVE
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#1c1d1b] tracking-tight">
                  FOOD RECEIVED
                </h3>
                <p className="text-xs text-[#6f706a] leading-relaxed">
                  The receiving shelter or food pantry inspects the food along with its complete
                  temperature and weight log before accepting the batch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* HARDWARE SPECIFICATION SHEET WITH COLOR-CODED LABELS */}
        {/* ================================================================= */}
        <section id="hardware" className="scroll-mt-16 border-b border-[#ddd9cf] py-16 sm:py-20 bg-[#f7f5ef]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12 pb-4 border-b border-[#ddd9cf]">
              <div>
                <span className="text-[11px] font-mono text-[#536b4f] font-semibold uppercase tracking-wider block mb-1">
                  SPECIFICATION
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1c1d1b]">
                  The Physical Hardware
                </h2>
              </div>
              <span className="text-xs font-mono text-[#6f706a] mt-2 sm:mt-0">
                FOODLINK NODE ARCHITECTURE
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Technical Line Topology Diagram */}
              <div className="lg:col-span-6 bg-white border border-[#ddd9cf] p-6 font-mono text-xs text-[#1c1d1b]">
                <div className="flex items-center justify-between pb-3 border-b border-[#ddd9cf] text-[11px]">
                  <span className="font-semibold text-[#1c1d1b]">FIG 1.0 &bull; SYSTEM TOPOLOGY</span>
                  <span className="px-1.5 py-0.2 bg-[#e8eee5] text-[#3d523a] text-[9px] uppercase font-bold">
                    ACTIVE ARCHITECTURE
                  </span>
                </div>

                <div className="py-8 flex flex-col items-center justify-center select-none text-center">
                  <div className="px-3.5 py-1.5 border border-[#536b4f] bg-[#e8eee5] text-[#3d523a] font-bold text-xs">
                    FOODLINK NODE
                  </div>
                  <div className="w-px h-6 bg-[#536b4f]" />

                  {/* Split branches */}
                  <div className="w-64 sm:w-80 border-t border-[#536b4f] h-6 flex justify-between relative">
                    <div className="w-px h-6 bg-[#536b4f] -ml-[0.5px]" />
                    <div className="w-px h-6 bg-[#536b4f] -mr-[0.5px]" />
                  </div>

                  <div className="w-64 sm:w-80 flex justify-between text-[11px]">
                    <div className="w-32 p-2 border border-[#ddd9cf] bg-[#f7f5ef] text-center">
                      <div className="font-semibold text-[#536b4f]">TEMPERATURE</div>
                      <div className="text-[10px] text-[#6f706a]">DS18B20 Probe</div>
                    </div>
                    <div className="w-32 p-2 border border-[#ddd9cf] bg-[#f7f5ef] text-center">
                      <div className="font-semibold text-[#536b4f]">WEIGHT</div>
                      <div className="text-[10px] text-[#6f706a]">Load Cell / HX711</div>
                    </div>
                  </div>

                  <div className="w-64 sm:w-80 border-b border-[#536b4f] h-6 flex justify-between relative mt-0">
                    <div className="w-px h-6 bg-[#536b4f] -ml-[0.5px]" />
                    <div className="w-px h-6 bg-[#536b4f] -mr-[0.5px]" />
                  </div>

                  <div className="w-px h-6 bg-[#536b4f]" />

                  <div className="px-3.5 py-1.5 border border-[#1c1d1b] bg-[#f2efe7] font-bold text-xs text-[#1c1d1b]">
                    ESP32 CONTROLLER
                  </div>

                  <div className="w-px h-6 bg-[#1c1d1b]" />

                  <div className="flex items-center gap-2 sm:gap-3 text-[10px]">
                    <span className="px-2 py-0.5 border border-[#ddd9cf] bg-[#f7f5ef]">
                      LID SENSOR
                    </span>
                    <span className="text-[#b8b4a7]">&bull;</span>
                    <span className="px-2 py-0.5 border border-[#ddd9cf] bg-[#f7f5ef]">
                      0.96&quot; OLED
                    </span>
                    <span className="text-[#b8b4a7]">&bull;</span>
                    <span className="px-2 py-0.5 border border-[#ddd9cf] bg-[#f7f5ef]">
                      WI-FI SYNC
                    </span>
                  </div>

                  <div className="w-px h-6 bg-[#b66a4e]" />

                  {/* Terracotta Central Record Block */}
                  <div className="px-3 py-1 border border-[#b66a4e] text-[#934e35] bg-[#f3e5de] font-semibold text-[11px]">
                    CENTRAL WEB RECORD
                  </div>
                </div>

                <div className="pt-3 border-t border-[#ddd9cf] flex items-center justify-between text-[10px] text-[#6f706a]">
                  <span>REF: SPEC-ESP32-FL</span>
                  <span>PHYSICAL EDGE NODE</span>
                </div>
              </div>

              {/* Right Column: Component List with Color-Coded Tags */}
              <div className="lg:col-span-6 space-y-3.5">
                <div className="p-4 bg-white border border-[#ddd9cf]">
                  <div className="flex items-baseline justify-between pb-1 font-mono text-xs">
                    <span className="font-bold text-[#1c1d1b] flex items-center gap-2">
                      <span className="px-1.5 py-0.2 bg-[#e8eee5] text-[#3d523a] text-[9px] font-bold uppercase">
                        TEMP SENSOR
                      </span>
                      01 &bull; TEMPERATURE SENSOR
                    </span>
                    <span className="text-[10px] font-semibold text-[#536b4f]">DS18B20</span>
                  </div>
                  <p className="text-xs text-[#6f706a] leading-relaxed mt-1">
                    Measures the internal ambient temperature of the food compartment to observe
                    whether perishable items stay within expected ranges during transport.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#ddd9cf]">
                  <div className="flex items-baseline justify-between pb-1 font-mono text-xs">
                    <span className="font-bold text-[#1c1d1b] flex items-center gap-2">
                      <span className="px-1.5 py-0.2 bg-[#e8eee5] text-[#3d523a] text-[9px] font-bold uppercase">
                        WEIGHT SENSOR
                      </span>
                      02 &bull; LOAD CELL
                    </span>
                    <span className="text-[10px] font-semibold text-[#536b4f]">HX711 ADC</span>
                  </div>
                  <p className="text-xs text-[#6f706a] leading-relaxed mt-1">
                    Integrated into the container base. Records the net food mass when loaded,
                    helping confirm that the quantity collected matches the quantity delivered.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#ddd9cf]">
                  <div className="flex items-baseline justify-between pb-1 font-mono text-xs">
                    <span className="font-bold text-[#1c1d1b] flex items-center gap-2">
                      <span className="px-1.5 py-0.2 bg-[#e8eee5] text-[#3d523a] text-[9px] font-bold uppercase">
                        LID SENSOR
                      </span>
                      03 &bull; CONTAINER SEAL STATUS
                    </span>
                    <span className="text-[10px] font-semibold text-[#536b4f]">MAGNETIC SWITCH</span>
                  </div>
                  <p className="text-xs text-[#6f706a] leading-relaxed mt-1">
                    Monitors whether the container was opened unexpectedly between pickup and
                    delivery, flagging any unlatched intervals on the record.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#ddd9cf]">
                  <div className="flex items-baseline justify-between pb-1 font-mono text-xs">
                    <span className="font-bold text-[#1c1d1b] flex items-center gap-2">
                      <span className="px-1.5 py-0.2 bg-[#f3e5de] text-[#934e35] text-[9px] font-bold uppercase">
                        TELEMETRY
                      </span>
                      04 &bull; ESP32 &amp; PHYSICAL DISPLAY
                    </span>
                    <span className="text-[10px] font-semibold text-[#b66a4e]">I2C OLED + WI-FI</span>
                  </div>
                  <p className="text-xs text-[#6f706a] leading-relaxed mt-1">
                    Coordinates sensor readings, displays basic status on a compact 0.96&quot; screen
                    for the driver, and uploads batch logs via Wi-Fi when connected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* OPERATIONS / ROLES SECTION */}
        {/* ================================================================= */}
        <section id="operations" className="scroll-mt-16 border-b border-[#ddd9cf] py-16 sm:py-20 bg-[#f2efe7]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12 pb-4 border-b border-[#ddd9cf]">
              <div>
                <span className="text-[11px] font-mono text-[#536b4f] font-semibold uppercase tracking-wider block mb-1">
                  STAKEHOLDERS
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1c1d1b]">
                  Connecting the food rescue chain
                </h2>
              </div>
              <span className="text-xs font-mono text-[#6f706a] mt-2 sm:mt-0">
                THREE USER ROLES
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Role 1: Provider (Olive tag) */}
              <div className="bg-white border border-[#ddd9cf] p-5 space-y-3">
                <div className="flex items-baseline justify-between font-mono text-xs border-b border-[#ece9df] pb-2">
                  <span className="font-bold text-[#1c1d1b]">FOOD PROVIDERS</span>
                  <span className="px-1.5 py-0.5 bg-[#e8eee5] text-[#3d523a] text-[9px] font-bold uppercase">
                    ORIGIN
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[#1c1d1b]">
                  Kitchens, Delis &amp; Catering
                </h3>
                <p className="text-xs text-[#6f706a] leading-relaxed">
                  Providers register surplus food batches, pack the container, and initiate the
                  batch record with starting temperature and weight.
                </p>
                <div className="pt-2">
                  <Link
                    href="/login?role=provider"
                    className="text-xs font-mono text-[#536b4f] hover:text-[#3d523a] font-medium inline-flex items-center gap-1"
                  >
                    <span>Provider access</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Role 2: Delivery Partner (Terracotta tag for transit) */}
              <div className="bg-white border border-[#ddd9cf] p-5 space-y-3">
                <div className="flex items-baseline justify-between font-mono text-xs border-b border-[#ece9df] pb-2">
                  <span className="font-bold text-[#1c1d1b]">DELIVERY PARTNERS</span>
                  <span className="px-1.5 py-0.5 bg-[#f3e5de] text-[#934e35] text-[9px] font-bold uppercase">
                    TRANSIT
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[#1c1d1b]">
                  Couriers &amp; Transport Volunteers
                </h3>
                <p className="text-xs text-[#6f706a] leading-relaxed">
                  Drivers carry the monitored containers, check the physical status display, and
                  hand off the container directly to the receiving staff.
                </p>
                <div className="pt-2">
                  <Link
                    href="/login?role=delivery"
                    className="text-xs font-mono text-[#b66a4e] hover:text-[#934e35] font-medium inline-flex items-center gap-1"
                  >
                    <span>Courier access</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>

              {/* Role 3: Receiving Org (Olive tag) */}
              <div className="bg-white border border-[#ddd9cf] p-5 space-y-3">
                <div className="flex items-baseline justify-between font-mono text-xs border-b border-[#ece9df] pb-2">
                  <span className="font-bold text-[#1c1d1b]">RECEIVING ORGS</span>
                  <span className="px-1.5 py-0.5 bg-[#e8eee5] text-[#3d523a] text-[9px] font-bold uppercase">
                    DESTINATION
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-[#1c1d1b]">
                  Food Banks &amp; Community Pantries
                </h3>
                <p className="text-xs text-[#6f706a] leading-relaxed">
                  Receiving staff view the batch&apos;s condition log on arrival, inspect the food, and
                  record confirmation with full visibility into the transit data.
                </p>
                <div className="pt-2">
                  <Link
                    href="/login?role=receiver"
                    className="text-xs font-mono text-[#536b4f] hover:text-[#3d523a] font-medium inline-flex items-center gap-1"
                  >
                    <span>Receiver access</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* CALL TO ACTION */}
        {/* ================================================================= */}
        <section className="py-16 sm:py-20 bg-[#f7f5ef]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="border border-[#ddd9cf] bg-white p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-lg">
                <span className="px-2 py-0.5 bg-[#e8eee5] text-[#3d523a] font-mono text-[10px] font-bold uppercase tracking-wider inline-block">
                  FOODLINK DEMO
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1c1d1b]">
                  Explore the prototype interface
                </h2>
                <p className="text-xs text-[#6f706a] leading-relaxed">
                  Review the operational dashboard, test role perspectives, and see how physical
                  batch data is displayed in the software layer.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/app">
                  <Button variant="primary" size="md">
                    Open dashboard
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="md">
                    Sign in by role
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================= */}
      {/* FOOTER */}
      {/* ================================================================= */}
      <footer className="border-t border-[#ddd9cf] py-10 bg-[#f2efe7] text-xs font-mono text-[#6f706a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1c1d1b]">FOODLINK</span>
            <span className="w-1 h-1 bg-[#536b4f]" />
            <span>Surplus food tracking prototype</span>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <span>ESP32 Hardware + Web Interface</span>
            <span>Document Ref: FL-2026-V1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
