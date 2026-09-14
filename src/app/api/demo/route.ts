import { NextRequest, NextResponse } from 'next/server';
import { telemetryStore } from '@/lib/store/telemetry-store';

export async function GET() {
  try {
    const demoState = telemetryStore.getDemoState();
    return NextResponse.json(demoState);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve demo scenario state', details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, stepIndex } = body;

    let result;
    if (action === 'advance') {
      result = telemetryStore.advanceDemo();
    } else if (action === 'reset') {
      result = telemetryStore.resetDemo();
    } else if (action === 'step' && typeof stepIndex === 'number') {
      result = telemetryStore.setDemoStep(stepIndex);
    } else {
      return NextResponse.json(
        { error: 'Invalid demo action. Expected advance, reset, or step' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: 'OK',
      action,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to execute demo action', details: error?.message },
      { status: 500 }
    );
  }
}
