/**
 * API Route: POST /api/newsletter/send-broadcast
 * Send an existing broadcast with optional scheduling
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendBroadcast } from '@/lib/newsletter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { broadcastId, scheduledAt = 'now' } = body;

    if (!broadcastId) {
      return NextResponse.json(
        { error: 'Broadcast ID is required' },
        { status: 400 }
      );
    }

    // Send the broadcast
    const result = await sendBroadcast(broadcastId, {
      scheduledAt,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send broadcast' },
        { status: 500 }
      );
    }

    const scheduleText = scheduledAt === 'now' ? 'immediately' : `at ${scheduledAt}`;

    return NextResponse.json({
      success: true,
      broadcastId: result.broadcastId,
      message: `Broadcast scheduled ${scheduleText}`,
    });
  } catch (error) {
    console.error('Error in /api/newsletter/send-broadcast:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
