/**
 * Newsletter service utilities
 * Server-side only
 */

import 'server-only';
import { resend, RESEND_CONFIG, isResendConfigured } from './resend';
import { render } from '@react-email/components';
import BlogPostNewsletter from '@/emails/BlogPostNewsletter';
import { MarkdownPost } from './markdown-types';
import { loadMarkdownPostBySlug, loadMarkdownPosts } from './markdown';
import fs from 'fs/promises';
import path from 'path';

// ============================================================================
// Newsletter Sending
// ============================================================================

export interface NewsletterSendResult {
  success: boolean;
  messageId?: string;
  broadcastId?: string;
  error?: string;
}

/**
 * Create a broadcast draft for a blog post
 * This creates the broadcast but does NOT send it
 */
export async function createBlogPostBroadcast(
  post: MarkdownPost,
  options?: {
    audienceId?: string;
  }
): Promise<NewsletterSendResult> {
  try {
    // Check if Resend is configured
    if (!resend) {
      return {
        success: false,
        error: 'Resend is not configured. Please set RESEND_API_KEY.',
      };
    }

    if (!isResendConfigured()) {
      return {
        success: false,
        error: 'Resend audience is not configured. Please set RESEND_AUDIENCE_ID.',
      };
    }

    // Format published date
    const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Render email template
    const emailHtml = await render(
      BlogPostNewsletter({
        title: post.title,
        brief: post.brief,
        coverImage: post.coverImage,
        content: post.content.html,
        slug: post.slug,
        author: post.author.name,
        publishedAt: publishedDate,
        tags: post.tags.map((t) => t.name),
      })
    );

    // Create broadcast draft
    const audienceId = options?.audienceId || RESEND_CONFIG.audienceId!;
    
    const result = await resend.broadcasts.create({
      audienceId,
      name: post.title,
      from: `${RESEND_CONFIG.fromName} <${RESEND_CONFIG.fromEmail}>`,
      subject: post.title,
      html: emailHtml,
    });

    if (result.error) {
      console.error('Resend API error:', result.error);
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      broadcastId: result.data?.id,
    };
  } catch (error) {
    console.error('Error creating broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send a broadcast immediately or schedule it
 */
export async function sendBroadcast(
  broadcastId: string,
  options?: {
    scheduledAt?: string; // e.g., 'in 1 min', 'in 1 hour', ISO timestamp
  }
): Promise<NewsletterSendResult> {
  try {
    if (!resend) {
      return {
        success: false,
        error: 'Resend is not configured. Please set RESEND_API_KEY.',
      };
    }

    const result = await resend.broadcasts.send(broadcastId, {
      scheduledAt: options?.scheduledAt || 'now',
    });

    if (result.error) {
      console.error('Resend API error:', result.error);
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      broadcastId: result.data?.id,
    };
  } catch (error) {
    console.error('Error sending broadcast:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create and immediately send a blog post as a newsletter
 * This is a convenience function that combines create + send
 */
export async function sendBlogPostNewsletter(
  post: MarkdownPost,
  options?: {
    testEmail?: string;
    audienceId?: string;
    scheduledAt?: string;
  }
): Promise<NewsletterSendResult> {
  try {
    // Check if Resend is configured
    if (!resend) {
      return {
        success: false,
        error: 'Resend is not configured. Please set RESEND_API_KEY.',
      };
    }

    if (!options?.testEmail && !isResendConfigured()) {
      return {
        success: false,
        error: 'Resend audience is not configured. Please set RESEND_AUDIENCE_ID.',
      };
    }

    // Format published date
    const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Render email template
    const emailHtml = await render(
      BlogPostNewsletter({
        title: post.title,
        brief: post.brief,
        coverImage: post.coverImage,
        content: post.content.html,
        slug: post.slug,
        author: post.author.name,
        publishedAt: publishedDate,
        tags: post.tags.map((t) => t.name),
      })
    );

    // Send email - use different API based on recipient type
    if (options?.testEmail) {
      // Send to individual test email using emails.send
      const result = await resend.emails.send({
        from: `${RESEND_CONFIG.fromName} <${RESEND_CONFIG.fromEmail}>`,
        to: options.testEmail,
        subject: post.title,
        html: emailHtml,
        tags: [
          { name: 'type', value: 'blog-post' },
          { name: 'slug', value: post.slug },
        ],
      });

      if (result.error) {
        console.error('Resend API error:', result.error);
        return {
          success: false,
          error: result.error.message,
        };
      }

      return {
        success: true,
        messageId: result.data?.id,
      };
    } else {
      // Create broadcast and send to audience
      const createResult = await createBlogPostBroadcast(post, {
        audienceId: options?.audienceId,
      });

      if (!createResult.success || !createResult.broadcastId) {
        return createResult;
      }

      // Send the broadcast
      const sendResult = await sendBroadcast(createResult.broadcastId, {
        scheduledAt: options?.scheduledAt || 'now',
      });

      return sendResult;
    }
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================================================
// Post Frontmatter Management
// ============================================================================

/**
 * Mark newsletter as sent in post frontmatter
 */
export async function markNewsletterAsSent(slug: string): Promise<void> {
  const postDir = path.join(process.cwd(), 'data', 'posts');
  
  // Find the post directory
  const entries = await fs.readdir(postDir, { withFileTypes: true });
  const postFolder = entries.find(
    (entry) => entry.isDirectory() && entry.name.includes(slug)
  );

  if (!postFolder) {
    throw new Error(`Post directory not found for slug: ${slug}`);
  }

  const postPath = path.join(postDir, postFolder.name, 'index.md');

  try {
    const content = await fs.readFile(postPath, 'utf-8');

    // Update frontmatter - handle both formats
    let updatedContent = content;

    // Try to update existing newsletter section
    if (content.includes('newsletter:')) {
      updatedContent = content.replace(
        /newsletter:\s*\n\s*send:\s*(true|false)\s*\n\s*sent:\s*(true|false)/,
        'newsletter:\n  send: true\n  sent: true'
      );
    } else {
      // Add newsletter section if it doesn't exist
      updatedContent = content.replace(
        /---\n([\s\S]*?)---/,
        (match, frontmatter) => {
          return `---\n${frontmatter}newsletter:\n  send: true\n  sent: true\n---`;
        }
      );
    }

    await fs.writeFile(postPath, updatedContent, 'utf-8');
    console.log(`Marked newsletter as sent for: ${slug}`);
  } catch (error) {
    console.error('Error updating post frontmatter:', error);
    throw error;
  }
}

/**
 * Get all posts pending newsletter send
 */
export async function getPendingNewsletterPosts(): Promise<MarkdownPost[]> {
  try {
    const allPosts = await loadMarkdownPosts();

    return allPosts.filter(
      (post) =>
        post.status === 'published' &&
        post.newsletter?.send === true &&
        post.newsletter?.sent !== true
    );
  } catch (error) {
    console.error('Error getting pending newsletter posts:', error);
    return [];
  }
}

// ============================================================================
// Subscriber Management
// ============================================================================

export interface SubscriberInfo {
  email: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Subscribe a user to Resend audience
 */
export async function subscribeToResend(
  subscriber: SubscriberInfo
): Promise<NewsletterSendResult> {
  try {
    if (!resend) {
      return {
        success: false,
        error: 'Resend is not configured',
      };
    }

    if (!RESEND_CONFIG.audienceId) {
      return {
        success: false,
        error: 'Resend audience ID is not configured',
      };
    }

    const result = await resend.contacts.create({
      email: subscriber.email,
      firstName: subscriber.firstName,
      lastName: subscriber.lastName,
      audienceId: RESEND_CONFIG.audienceId,
    });

    if (result.error) {
      // Check if already subscribed
      if (result.error.message?.includes('already exists')) {
        return {
          success: true,
          messageId: 'already-subscribed',
        };
      }

      console.error('Resend subscribe error:', result.error);
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      messageId: result.data?.id,
    };
  } catch (error) {
    console.error('Error subscribing to Resend:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
