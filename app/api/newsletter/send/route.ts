import { NextRequest, NextResponse } from 'next/server';
import { loadMarkdownPostBySlug } from '@/lib/markdown';
import { sendBlogPostNewsletter, markNewsletterAsSent } from '@/lib/newsletter';

export const dynamic = 'force-dynamic';

/**
 * POST /api/newsletter/send
 * Send a blog post as a newsletter
 * 
 * Body: {
 *   slug: string,
 *   testEmail?: string  // Optional: send to test email instead of audience
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, testEmail } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Load post
    const post = await loadMarkdownPostBySlug(slug);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if newsletter should be sent
    if (!post.newsletter?.send) {
      return NextResponse.json(
        { error: 'Newsletter sending not enabled for this post' },
        { status: 400 }
      );
    }

    // Check if already sent (unless test email)
    if (post.newsletter.sent && !testEmail) {
      return NextResponse.json(
        { error: 'Newsletter already sent for this post' },
        { status: 400 }
      );
    }

    // Send newsletter
    const result = await sendBlogPostNewsletter(post, { testEmail });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send newsletter' },
        { status: 500 }
      );
    }

    // Mark as sent (only if not test email)
    if (!testEmail) {
      try {
        await markNewsletterAsSent(slug);
      } catch (error) {
        console.error('Failed to mark newsletter as sent:', error);
        // Don't fail the request if marking fails
      }
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: testEmail
        ? `Test email sent to ${testEmail}`
        : 'Newsletter sent to audience',
    });
  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
