import { NextRequest, NextResponse } from 'next/server';
import { telemetryStore } from '@/lib/store/telemetry-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (code) {
      const batch = telemetryStore.getBatch(code);
      if (!batch) {
        return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
      }
      return NextResponse.json({ batch });
    }

    const batches = telemetryStore.getBatches();
    return NextResponse.json({
      count: batches.length,
      batches,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve batches', details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = telemetryStore.createBatch(body);
    return NextResponse.json({
      status: 'CREATED',
      batch: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create batch', details: error?.message },
      { status: 500 }
    );
  }
}
