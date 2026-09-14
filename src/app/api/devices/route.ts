import { NextResponse } from 'next/server';
import { telemetryStore } from '@/lib/store/telemetry-store';

export async function GET() {
  try {
    const devices = telemetryStore.getDevices();
    return NextResponse.json({
      count: devices.length,
      devices,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve device inventory', details: error?.message },
      { status: 500 }
    );
  }
}
