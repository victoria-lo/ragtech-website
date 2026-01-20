/**
 * Shared TypeScript interfaces for Beehiiv integration
 * Safe to import in both client and server components
 */

// ============================================================================
// Beehiiv API Interfaces
// ============================================================================

export interface BeehiivContent {
  free: {
    web: string;
    email: string;
    rss: string;
  };
  premium: {
    web: string;
    email: string;
  };
}

export interface BeehiivPost {
  id: string;
  title: string;
  subtitle: string;
  authors: string[];
  created: number; // Unix timestamp
  status: 'draft' | 'confirmed' | 'published';
  split_tested: boolean;
  subject_line: string;
  preview_text: string;
  slug: string;
  thumbnail_url: string;
  web_url: string;
  audience: 'free' | 'premium' | 'both';
  platform: 'web' | 'email' | 'both';
  content_tags: string[];
  hidden_from_feed: boolean;
  enforce_gated_content: boolean;
  email_capture_popup: boolean;
  publish_date: number; // Unix timestamp
  displayed_date: number; // Unix timestamp
  meta_default_description: string;
  meta_default_title: string;
  content: BeehiivContent;
}

export interface BeehiivPagination {
  limit: number;
  page: number;
  total_results: number;
  total_pages: number;
}

export interface BeehiivPostsResponse {
  data: BeehiivPost[];
  limit: number;
  page: number;
  total_results: number;
  total_pages: number;
}

export interface BeehiivSubscriptionResponse {
  data: {
    id: string;
    email: string;
    status: string;
    created: number;
  };
}

export interface BeehiivErrorResponse {
  error: {
    message: string;
    code?: string;
  };
}

// ============================================================================
// Archived Posts Interfaces
// ============================================================================

export interface ArchivedPost {
  id: string;
  title: string;
  brief: string;
  slug: string;
  coverImage: {
    url: string;
  } | null;
  publishedAt: string;
  readTimeInMinutes: number;
  author: {
    name: string;
    profilePicture: string;
  };
  content: {
    html: string;
    markdown: string;
  };
  tags: Array<{
    name: string;
    slug: string;
  }>;
  _archived: {
    source: 'hashnode';
    archived_date: string;
    original_url: string;
  };
}

export interface ArchivedPostMeta {
  slug: string;
  title: string;
  publishedAt: string;
  source: 'hashnode';
  filePath: string;
}

export interface ArchivedPostsIndex {
  version: '1.0';
  source: 'hashnode';
  archived_date: string;
  posts: ArchivedPostMeta[];
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Type guard to check if a post is archived
 */
export function isArchivedPost(post: any): post is ArchivedPost {
  return '_archived' in post && post._archived?.source === 'hashnode';
}

/**
 * Format Unix timestamp to readable date
 */
export function formatBeehiivDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get date from either Beehiiv or archived post
 */
export function getPostDate(post: BeehiivPost | ArchivedPost): Date {
  if (isArchivedPost(post)) {
    return new Date(post.publishedAt);
  }
  return new Date(post.displayed_date * 1000);
}
