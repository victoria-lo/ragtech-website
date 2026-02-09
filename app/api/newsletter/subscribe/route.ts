/**
 * API Route: POST /api/newsletter/subscribe
 * Subscribe email to newsletter services (Resend and/or Beehiiv)
 * Properly decoupled to allow easy removal of either service
 */

import { NextRequest, NextResponse } from 'next/server';
import { subscribeToBeehiiv } from '@/lib/beehiiv';
import { subscribeToResend, sendWelcomeEmail } from '@/lib/newsletter';

// Configuration: Enable/disable newsletter services
const NEWSLETTER_CONFIG = {
  resend: true,   // Set to false to disable Resend
  beehiiv: true,  // Set to false to disable Beehiiv
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

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

    const results: {
      resend?: { success: boolean; error?: string };
      beehiiv?: { success: boolean; error?: string };
    } = {};

    // Subscribe to Resend (if enabled)
    if (NEWSLETTER_CONFIG.resend) {
      try {
        const resendResult = await subscribeToResend({
          email,
          firstName,
          lastName,
        });
        results.resend = {
          success: resendResult.success,
          error: resendResult.error,
        };
        
        // Send welcome email (only for new subscribers)
        if (resendResult.success && resendResult.messageId !== 'already-subscribed') {
          try {
            const welcomeResult = await sendWelcomeEmail({
              email,
              firstName,
              source: 'newsletter',
            });
            if (welcomeResult.success) {
              console.log('Welcome email sent:', { email, messageId: welcomeResult.messageId });
            } else {
              console.error('Welcome email failed:', welcomeResult.error);
            }
          } catch (welcomeError) {
            console.error('Welcome email error:', welcomeError);
          }
        }
      } catch (error) {
        console.error('Resend subscription error:', error);
        results.resend = {
          success: false,
          error: error instanceof Error ? error.message : 'Resend subscription failed',
        };
      }
    }

    // Subscribe to Beehiiv (if enabled)
    if (NEWSLETTER_CONFIG.beehiiv) {
      try {
        const beehiivResponse = await subscribeToBeehiiv(email);
        results.beehiiv = {
          success: true,
        };
      } catch (error) {
        console.error('Beehiiv subscription error:', error);
        results.beehiiv = {
          success: false,
          error: error instanceof Error ? error.message : 'Beehiiv subscription failed',
        };
      }
    }

    // Determine overall success
    const enabledServices = [
      NEWSLETTER_CONFIG.resend && 'resend',
      NEWSLETTER_CONFIG.beehiiv && 'beehiiv',
    ].filter(Boolean);

    const successfulSubscriptions = [
      results.resend?.success && 'Resend',
      results.beehiiv?.success && 'Beehiiv',
    ].filter(Boolean);

    // If at least one service succeeded, consider it a success
    if (successfulSubscriptions.length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: `Successfully subscribed to ${successfulSubscriptions.join(' and ')}`,
          results,
        },
        { status: 200 }
      );
    }

    // All services failed
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to subscribe to newsletter services',
        },
        results,
      },
      { status: 500 }
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
