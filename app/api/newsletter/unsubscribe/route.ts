/**
 * API Route: POST /api/newsletter/unsubscribe
 * Handles one-click unsubscribe from transactional emails
 * See: https://resend.com/docs/dashboard/emails/add-unsubscribe-to-transactional-emails
 */

import { NextRequest, NextResponse } from 'next/server';
import { resend, RESEND_CONFIG } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    // Get email from query params or body
    const url = new URL(request.url);
    const emailFromQuery = url.searchParams.get('email');
    
    let email = emailFromQuery;
    
    // Try to get email from body if not in query
    if (!email) {
      try {
        const body = await request.json();
        email = body.email;
      } catch {
        // Body might be empty for one-click unsubscribe
      }
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!resend || !RESEND_CONFIG.generalSegmentId) {
      return NextResponse.json(
        { error: 'Resend is not configured' },
        { status: 500 }
      );
    }

    // Find contact by email and update unsubscribed status
    const contactsResult = await resend.contacts.list({
      audienceId: RESEND_CONFIG.generalSegmentId,
    });

    if (contactsResult.error) {
      console.error('Error listing contacts:', contactsResult.error);
      return NextResponse.json(
        { error: 'Failed to find contact' },
        { status: 500 }
      );
    }

    const contact = contactsResult.data?.data?.find(
      (c: any) => c.email.toLowerCase() === email!.toLowerCase()
    );

    if (!contact) {
      // Contact not found - might already be unsubscribed or never subscribed
      return NextResponse.json(
        { success: true, message: 'Unsubscribed successfully' },
        { status: 200 }
      );
    }

    // Update contact to unsubscribed
    const updateResult = await resend.contacts.update({
      id: contact.id,
      audienceId: RESEND_CONFIG.generalSegmentId,
      unsubscribed: true,
    });

    if (updateResult.error) {
      console.error('Error unsubscribing contact:', updateResult.error);
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      );
    }

    console.log(`Unsubscribed: ${email}`);
    return NextResponse.json(
      { success: true, message: 'Unsubscribed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request' },
      { status: 500 }
    );
  }
}

// Also handle GET for manual unsubscribe link clicks
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');

  if (!email) {
    // Redirect to unsubscribe page without email
    return NextResponse.redirect(new URL('/unsubscribe', request.url));
  }

  // Redirect to unsubscribe page with email
  return NextResponse.redirect(new URL(`/unsubscribe?email=${encodeURIComponent(email)}`, request.url));
}
