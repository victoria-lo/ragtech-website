/**
 * Newsletter Topics Configuration
 * Maps topic names to Resend Topic IDs
 * Server-side only
 */

import 'server-only';

export type NewsletterTopic = 'ragTech' | 'FutureNet' | 'Techie Taboo';

export const NEWSLETTER_TOPICS: Record<NewsletterTopic, string | undefined> = {
  'ragTech': process.env.RESEND_TOPIC_RAGTECH,
  'FutureNet': process.env.RESEND_TOPIC_FUTURENET,
  'Techie Taboo': process.env.RESEND_TOPIC_TECHIE_TABOO,
};

/**
 * Get Resend topic IDs from topic names
 */
export function getTopicIds(topics: NewsletterTopic[]): string[] {
  const topicIds: string[] = [];
  
  for (const topic of topics) {
    const topicId = NEWSLETTER_TOPICS[topic];
    if (topicId) {
      topicIds.push(topicId);
    } else {
      console.warn(`Topic ID not configured for: ${topic}`);
    }
  }
  
  return topicIds;
}

/**
 * Validate that all required topics are configured
 */
export function validateTopicsConfiguration(): {
  valid: boolean;
  missing: NewsletterTopic[];
} {
  const missing: NewsletterTopic[] = [];
  
  for (const [topic, topicId] of Object.entries(NEWSLETTER_TOPICS)) {
    if (!topicId) {
      missing.push(topic as NewsletterTopic);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Get all available topic names
 */
export function getAvailableTopics(): NewsletterTopic[] {
  return Object.keys(NEWSLETTER_TOPICS) as NewsletterTopic[];
}
