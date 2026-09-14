import { NextRequest, NextResponse } from 'next/server';
import { telemetryStore } from '@/lib/store/telemetry-store';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ deviceId: string }> }
) {
  try {
    const { deviceId } = await context.params;
    const device = telemetryStore.getDevice(deviceId);

    if (!device) {
      return NextResponse.json(
        { error: 'Device not found in registry', requestedId: deviceId },
        { status: 404 }
      );
    }

    const recentLogs = telemetryStore.getTelemetryForDevice(device.deviceId).slice(-10);

    return NextResponse.json({
      device,
      recentTelemetry: recentLogs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve device specification', details: error?.message },
      { status: 500 }
    );
  }
}
