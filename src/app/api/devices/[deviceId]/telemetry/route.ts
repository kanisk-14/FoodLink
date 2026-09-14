import { NextRequest, NextResponse } from 'next/server';
import { telemetryStore } from '@/lib/store/telemetry-store';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await context.params;
    const body = await request.json();

    const {
      batchId,
      temperature,
      weight,
      lidOpen,
      timestamp,
      location,
      rssiDbm,
      batteryPct,
      isDemo,
    } = body;

    if (!batchId || temperature === undefined || weight === undefined || lidOpen === undefined) {
      return NextResponse.json(
        {
          error: 'Invalid telemetry payload',
          required: ['batchId', 'temperature', 'weight', 'lidOpen'],
        },
        { status: 400 }
      );
    }

    const result = telemetryStore.recordTelemetry({
      deviceId,
      batchId,
      temperature: Number(temperature),
      weight: Number(weight),
      lidOpen: Boolean(lidOpen),
      timestamp: timestamp || new Date().toISOString(),
      location,
      rssiDbm: rssiDbm !== undefined ? Number(rssiDbm) : undefined,
      batteryPct: batteryPct !== undefined ? Number(batteryPct) : undefined,
      isDemo: Boolean(isDemo),
    });

    return NextResponse.json({
      status: 'ACK',
      deviceId,
      batchId,
      recordedAt: result.telemetry.timestamp,
      telemetry: result.telemetry,
      lidEventCreated: result.lidEventCreated,
      alerts: {
        weightAlert: result.weightAlert,
        tempAlert: result.tempAlert,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to process telemetry ping', details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await context.params;
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get('batchId');

    const logs = batchId
      ? telemetryStore.getTelemetryForBatch(batchId)
      : telemetryStore.getTelemetryForDevice(deviceId);

    const lidEvents = batchId ? telemetryStore.getLidEventsForBatch(batchId) : [];

    return NextResponse.json({
      deviceId,
      count: logs.length,
      telemetry: logs,
      lidEvents,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve telemetry', details: error?.message },
      { status: 500 }
    );
  }
}
