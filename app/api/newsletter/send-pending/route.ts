import { NextResponse } from 'next/server';
import {
  getPendingNewsletterPosts,
  sendBlogPostNewsletter,
  markNewsletterAsSent,
} from '@/lib/newsletter';

export const dynamic = 'force-dynamic';

/**
 * POST /api/newsletter/send-pending
 * Send all pending newsletters
 */
export async function POST() {
  try {
    const pendingPosts = await getPendingNewsletterPosts();

    if (pendingPosts.length === 0) {
      return NextResponse.json({
        message: 'No pending newsletters to send',
        sent: 0,
        results: [],
      });
    }

    const results = [];

    for (const post of pendingPosts) {
      console.log(`Sending newsletter for: ${post.slug}`);
      
      const result = await sendBlogPostNewsletter(post);

      if (result.success) {
        try {
          await markNewsletterAsSent(post.slug);
          results.push({
            slug: post.slug,
            title: post.title,
            success: true,
            messageId: result.messageId,
          });
        } catch (error) {
          results.push({
            slug: post.slug,
            title: post.title,
            success: false,
            error: 'Failed to mark as sent',
          });
        }
      } else {
        results.push({
          slug: post.slug,
          title: post.title,
          success: false,
          error: result.error,
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      message: `Sent ${successCount} of ${pendingPosts.length} newsletters`,
      sent: successCount,
      total: pendingPosts.length,
      results,
    });
  } catch (error) {
    console.error('Batch newsletter send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
