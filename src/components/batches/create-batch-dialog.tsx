'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BatchQrCode } from '@/components/ui/qr-code';
import { FoodBatch, FoodCategory } from '@/types/foodlink';

interface CreateBatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchCreated: (newBatch: FoodBatch) => void;
}

export function CreateBatchDialog({
  isOpen,
  onClose,
  onBatchCreated,
}: CreateBatchDialogProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');

  // Form Fields
  const [foodName, setFoodName] = useState('Braised Vegetable & Rice Trays');
  const [category, setCategory] = useState<FoodCategory>('hot_prepared');
  const [quantityKg, setQuantityKg] = useState('5.6');
  const [portions, setPortions] = useState('30');
  const [prepTime, setPrepTime] = useState('11:30 AM');
  const [pickupDeadline, setPickupDeadline] = useState('01:00 PM');
  const [destination, setDestination] = useState('Downtown Community Shelter');
  const [notes, setNotes] = useState('Packed hot in sealed stainless steel food-grade trays. Keep container latched.');

  // Generated Result
  const [createdBatch, setCreatedBatch] = useState<FoodBatch | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const generatedCode = `FL-${Math.floor(20 + Math.random() * 30).toString().padStart(4, '0')}`;
    const weight = parseFloat(quantityKg) || 5.0;

    const newBatch: FoodBatch = {
      id: `batch_${randomNum}`,
      code: generatedCode,
      title: foodName,
      category: category,
      categoryLabel: category === 'hot_prepared' ? 'HOT HOLD' : 'CHILLED DELI',
      provider: {
        id: 'prov_curr',
        name: 'Central Catering Services',
        type: 'Commercial Kitchen',
        address: 'Industrial District Bay 4',
        contactPerson: 'Elena Rostova',
        phone: '+1 555-0192',
      },
      delivery: {
        driverId: 'drv_pending',
        driverName: 'Dispatched Courier #08',
        vehicle: 'Transport Van #2 (EV)',
        phone: '+1 555-0284',
        status: 'ASSIGNED',
      },
      receiver: {
        id: 'rcv_sel',
        name: destination,
        type: 'Shelter & Kitchen',
        address: '88 Bowery St, Lower East Side',
        contactPerson: 'Sarah Jenkins',
        intakeWindow: '12:30 PM - 02:00 PM',
      },
      status: 'awaiting_pickup',
      portionsEstimated: parseInt(portions, 10) || 25,
      initialWeightKg: weight,
      preparedAtIso: new Date().toISOString(),
      pickupDeadlineIso: pickupDeadline,
      dispatchedAtIso: '',
      estimatedArrivalIso: '01:45 PM',
      haccpCompliant: true,
      tamperAlert: false,
      notes: notes,
      hardware: {
        deviceId: 'NODE 05',
        firmwareVersion: 'v1.2',
        temperatureC: category === 'hot_prepared' ? 68.2 : 4.4,
        targetMinTempC: category === 'hot_prepared' ? 60.0 : 2.0,
        targetMaxTempC: category === 'hot_prepared' ? 75.0 : 8.0,
        tempStatus: 'safe',
        currentWeightKg: weight + 2.2,
        tareWeightKg: 2.2,
        netFoodWeightKg: weight,
        weightVerified: true,
        lidLatched: true,
        lidOpenCount: 0,
        lastLidEventIso: new Date().toISOString(),
        wifiConnected: true,
        wifiRssiDbm: -55,
        batteryPct: 96,
        isCharging: false,
        lastPingIso: 'Just now',
        locationName: 'Central Kitchen Loading Bay',
        oledDisplay: {
          line1: 'FOODLINK NODE 05',
          line2: `${generatedCode} | STAGED`,
          line3: `TEMP: ${category === 'hot_prepared' ? '68.2C' : '4.4C'} [OK]`,
          line4: `NET: ${weight.toFixed(2)}kg READY`,
        },
      },
      passport: [
        {
          step: '01',
          title: 'FOOD PREPARED',
          stageName: 'Origin Kitchen Registration',
          timestamp: prepTime,
          location: 'Central Catering Kitchen #3',
          operator: 'Elena Rostova',
          tempC: category === 'hot_prepared' ? 68.2 : 4.4,
          weightKg: weight,
          notes: notes,
          completed: true,
        },
        {
          step: '02',
          title: 'PACKED',
          stageName: 'Container Tare & Seal',
          timestamp: 'Just now',
          location: 'Loading Bay 4',
          operator: 'Elena Rostova',
          weightKg: weight,
          lidStatus: 'LATCHED',
          notes: 'Node 05 tare calibrated. Latch engaged.',
          completed: true,
        },
        {
          step: '03',
          title: 'PICKED UP',
          stageName: 'Courier Pickup',
          timestamp: `Deadline ${pickupDeadline}`,
          location: 'Loading Bay 4',
          operator: 'Pending Courier Handshake',
          completed: false,
        },
        {
          step: '04',
          title: 'IN TRANSIT',
          stageName: 'Transit Telemetry',
          timestamp: 'Pending Handover',
          location: '—',
          operator: '—',
          completed: false,
        },
        {
          step: '05',
          title: 'ARRIVED',
          stageName: 'Destination Dock',
          timestamp: 'Pending Arrival',
          location: destination,
          operator: '—',
          completed: false,
        },
        {
          step: '06',
          title: 'RECEIVED',
          stageName: 'Intake Sign-off',
          timestamp: 'Pending Acceptance',
          location: destination,
          operator: 'Sarah Jenkins',
          completed: false,
        },
      ],
    };

    setCreatedBatch(newBatch);
    onBatchCreated(newBatch);
    setStep('success');
  };

  const handleReset = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c1d1b]/40 backdrop-blur-2xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-[#f7f5ef] border border-[#ddd9cf] rounded-xs shadow-md p-6 font-mono text-xs text-[#1c1d1b] my-8">
        {step === 'form' ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#ddd9cf] mb-4">
              <div>
                <div className="text-[10px] text-[#536b4f] font-bold uppercase tracking-wider">
                  REGISTRATION PROTOCOL
                </div>
                <h3 className="text-base font-bold text-[#1c1d1b] tracking-tight">
                  Create Food Batch
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-[#6f706a] hover:text-[#1c1d1b] text-sm p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[11px] text-[#6f706a] uppercase">FOOD ITEM NAME</label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Chicken Biryani & Rice Portions"
                  className="w-full px-3 py-2 bg-white border border-[#ddd9cf] text-[#1c1d1b] focus:outline-none focus:border-[#536b4f] rounded-xs text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] text-[#6f706a] uppercase">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FoodCategory)}
                    className="w-full px-3 py-2 bg-white border border-[#ddd9cf] text-[#1c1d1b] focus:outline-none focus:border-[#536b4f] rounded-xs text-xs font-mono"
                  >
                    <option value="hot_prepared">Hot Prepared Meals</option>
                    <option value="chilled_meals">Chilled Deli &amp; Sandwiches</option>
                    <option value="fresh_produce">Fresh Produce / Salads</option>
                    <option value="dairy_beverages">Dairy &amp; Beverages</option>
                    <option value="bakery_ambient">Bakery / Ambient</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] text-[#6f706a] uppercase">DESTINATION</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#ddd9cf] text-[#1c1d1b] focus:outline-none focus:border-[#536b4f] rounded-xs text-xs font-mono"
                  >
                    <option value="Downtown Community Shelter">Downtown Community Shelter</option>
                    <option value="Eastside Food Pantry">Eastside Food Pantry</option>
                    <option value="North End Senior Hub">North End Senior Hub</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] text-[#6f706a] uppercase">QUANTITY (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#ddd9cf] text-[#1c1d1b] focus:outline-none focus:border-[#536b4f] rounded-xs text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-[#6f706a] uppercase">PORTIONS</label>
                  <input
                    type="number"
                    required
                    value={portions}
                    onChange={(e) => setPortions(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#ddd9cf] text-[#1c1d1b] focus:outline-none focus:border-[#536b4f] rounded-xs text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-[#6f706a] uppercase">PREP TIME</label>
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#ddd9cf] text-[#1c1d1b] focus:outline-none focus:border-[#536b4f] rounded-xs text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-[#6f706a] uppercase">PICKUP DEADLINE</label>
                  <input
                    type="text"
                    value={pickupDeadline}
                    onChange={(e) => setPickupDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#ddd9cf] text-[#1c1d1b] focus:outline-none focus:border-[#536b4f] rounded-xs text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] text-[#6f706a] uppercase">HANDLING &amp; PACKAGING NOTES</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#ddd9cf] text-[#1c1d1b] focus:outline-none focus:border-[#536b4f] rounded-xs text-xs font-mono"
                />
              </div>

              <div className="pt-3 border-t border-[#ddd9cf] flex items-center justify-between">
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Register Batch &amp; Generate ID &rarr;
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Success / Generated Certificate View */
          <div className="space-y-5">
            <div className="flex items-baseline justify-between pb-3 border-b border-[#ddd9cf]">
              <div>
                <span className="text-[10px] text-[#536b4f] font-bold uppercase tracking-wider">
                  BATCH REGISTERED SUCCESSFULLY
                </span>
                <h3 className="text-base font-bold text-[#1c1d1b] tracking-tight">
                  FOODLINK BATCH RECORD
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-[#e8eee5] text-[#3d523a] border border-[#ccd9c8] text-[10px] font-bold">
                NODE 05 ASSIGNED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
              {/* QR Code */}
              <div className="sm:col-span-5 flex justify-center">
                {createdBatch && (
                  <BatchQrCode
                    batchCode={createdBatch.code}
                    foodName={createdBatch.title}
                    weightKg={createdBatch.initialWeightKg}
                    nodeId="NODE 05"
                    size={130}
                  />
                )}
              </div>

              {/* Recorded Spec */}
              <div className="sm:col-span-7 bg-white border border-[#ddd9cf] p-4 space-y-2 text-[11px]">
                <div className="border-b border-[#ece9df] pb-2">
                  <div className="text-[10px] text-[#6f706a] uppercase">ASSIGNED BATCH ID</div>
                  <div className="text-lg font-bold text-[#1c1d1b]">{createdBatch?.code}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-b border-[#ece9df] pb-2">
                  <div>
                    <span className="text-[#6f706a] block text-[10px]">NET WEIGHT</span>
                    <span className="font-bold text-[#1c1d1b]">{createdBatch?.initialWeightKg} kg</span>
                  </div>
                  <div>
                    <span className="text-[#6f706a] block text-[10px]">PORTIONS</span>
                    <span className="font-bold text-[#1c1d1b]">~{createdBatch?.portionsEstimated} meals</span>
                  </div>
                </div>

                <div className="border-b border-[#ece9df] pb-2">
                  <span className="text-[#6f706a] block text-[10px]">DESTINATION</span>
                  <span className="font-medium text-[#1c1d1b]">{createdBatch?.receiver.name}</span>
                </div>

                <div>
                  <span className="text-[#6f706a] block text-[10px]">INITIAL SENSOR CHECK</span>
                  <span className="text-[#536b4f] font-semibold">
                    Core: {createdBatch?.hardware.temperatureC} &deg;C &bull; Latch: Hermetic OK
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ddd9cf] flex items-center justify-between">
              <span className="text-[10px] text-[#6f706a]">
                Printable label ready for physical container placement
              </span>
              <Button type="button" variant="primary" size="sm" onClick={handleReset}>
                Done &bull; Return to Batches
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
