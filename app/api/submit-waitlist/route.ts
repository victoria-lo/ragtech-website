/**
 * API Route: POST /api/submit-waitlist
 * Handles techie-taboo waitlist form submissions with automated workflows:
 * 1. Submit to Netlify Forms
 * 2. Subscribe to Beehiiv and add "techie taboo waitlisters" tag
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

    // Get request metadata
    const referrer = request.headers.get('referer') || 'direct';
    const origin = request.headers.get('origin') || request.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'https://ragtechdev.com';

    // Workflow: Submit to Netlify Forms
    try {
      const netlifyFormData = new URLSearchParams();
      netlifyFormData.append('form-name', 'techie-taboo-waitlist');
      netlifyFormData.append('name', name);
      netlifyFormData.append('email', email);
      
      if (screenshotData) {
        netlifyFormData.append('payment-screenshot', screenshotData);
      }

      const netlifyResponse = await fetch(`${origin}/__forms.html`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: netlifyFormData.toString(),
      });

      if (netlifyResponse.ok) {
        console.log('Netlify form submission successful');
      } else {
        console.error('Netlify form submission failed:', netlifyResponse.status);
      }
    } catch (error) {
      console.error('Netlify workflow error:', error);
    }

    console.log('Waitlist submission successful:', { name, email });

    // Workflow: Subscribe to Beehiiv and add tag (non-blocking)
    try {
      const beehiivApiKey = process.env.BEEHIIV_API_KEY;
      const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

      // Step 1: Create subscription
      const subscriptionResponse = await fetch(
        `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${beehiivApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            reactivate_existing: false,
            send_welcome_email: false,
            utm_source: 'techie-taboo-waitlist',
            utm_medium: 'website',
            referring_site: referrer,
          }),
        }
      );

      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        const subscriptionId = subscriptionData.data.id;
        
        // Step 2: Add tag to subscription
        const tagResponse = await fetch(
          `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions/${subscriptionId}/tags`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${beehiivApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tags: ['techie taboo waitlisters'],
            }),
          }
        );

        if (tagResponse.ok) {
          console.log('Added to Beehiiv with tag:', { email, subscriptionId });
        } else {
          console.error('Failed to add tag:', await tagResponse.text());
        }
      } else {
        console.error('Beehiiv subscription failed:', await subscriptionResponse.text());
      }
    } catch (error) {
      console.error('Beehiiv workflow error:', error);
    }

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
