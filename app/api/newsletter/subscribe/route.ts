/**
 * API Route: POST /api/newsletter/subscribe
 * Subscribe email to Beehiiv newsletter
 */

import { NextRequest, NextResponse } from 'next/server';
import { subscribeToBeehiiv } from '@/lib/beehiiv';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {
          error: {
            message: 'Valid email address is required',
          },
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: {
            message: 'Please provide a valid email address',
          },
        },
        { status: 400 }
      );
    }

    const response = await subscribeToBeehiiv(email);

    return NextResponse.json(
      {
        success: true,
        data: response.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/newsletter/subscribe:', error);

    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Failed to subscribe to newsletter',
        },
      },
      { status: 500 }
    );
  }
}
