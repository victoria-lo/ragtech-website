/**
 * API Route: POST /api/submit-waitlist
 * Handles techie-taboo waitlist form submissions and forwards to Netlify Forms
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { name, email, screenshotData } = formData;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Create FormData for Netlify Forms submission
    const netlifyFormData = new FormData();
    netlifyFormData.append('form-name', 'techie-taboo-waitlist');
    netlifyFormData.append('name', name);
    netlifyFormData.append('email', email);
    
    // Handle screenshot if present
    if (screenshotData) {
      // Convert base64 to blob
      const base64Response = await fetch(screenshotData);
      const blob = await base64Response.blob();
      netlifyFormData.append('payment-screenshot', blob, 'screenshot.png');
    }

    // Submit to Netlify Forms
    const netlifyResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://ragtechdev.com'}/`, {
      method: 'POST',
      body: netlifyFormData,
    });

    if (!netlifyResponse.ok) {
      throw new Error('Netlify form submission failed');
    }

    console.log('Waitlist submission successful:', { name, email });

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the waitlist!',
    });
  } catch (error) {
    console.error('Error processing waitlist submission:', error);

    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}
