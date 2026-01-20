import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  fetchBeehiivPostBySlug,
  loadArchivedPostBySlug,
  getArchivedPostSlugs,
  isArchivedPost,
  BeehiivPost,
  ArchivedPost,
} from '@/lib/beehiiv';

export const dynamic = 'force-dynamic'; // Force dynamic rendering (no caching)
export const revalidate = 0; // No ISR caching

type PostData = BeehiivPost | ArchivedPost;

// Fetch post data from Beehiiv or archived files
async function getPost(slug: string): Promise<PostData | null> {
  try {
    // Try Beehiiv first
    const beehiivPost = await fetchBeehiivPostBySlug(slug);
    if (beehiivPost) {
      return beehiivPost;
    }

    // Fallback to archived posts
    const archivedPost = await loadArchivedPostBySlug(slug);
    return archivedPost;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Generate static params for all posts (Beehiiv + archived)
export async function generateStaticParams() {
  try {
    // Get archived post slugs
    const archivedSlugs = await getArchivedPostSlugs();

    // Get Beehiiv post slugs
    let beehiivSlugs: string[] = [];
    
    try {
      const { fetchBeehiivPosts } = await import('@/lib/beehiiv');
      const response = await fetchBeehiivPosts(1, 100);
      beehiivSlugs = response.data.map((post) => post.slug);
    } catch (error) {
      console.error('Error fetching Beehiiv slugs:', error);
    }

    // Combine both sources
    const allSlugs = [...beehiivSlugs, ...archivedSlugs].map((slug) => ({
      slug,
    }));

    console.log(`[generateStaticParams] Generated ${allSlugs.length} slugs`);
    return allSlugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

function formatDate(post: PostData): string {
  let date: Date;

  if (isArchivedPost(post)) {
    date = new Date(post.publishedAt);
  } else {
    // Beehiiv: Use displayed_date, fallback to publish_date, then created
    const timestamp = post.displayed_date || post.publish_date || post.created;
    date = new Date(timestamp * 1000);
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getPostContent(post: PostData): string {
  if (isArchivedPost(post)) {
    return post.content.html;
  }
  // For Beehiiv: Use web content, fallback to email if web is empty/minimal
  let beehiivContent = post.content.free.web || '';
  
  // If web content is too short (just tags) or empty, use email content instead
  const strippedWeb = beehiivContent.replace(/<[^>]*>/g, '').trim();
  if (!strippedWeb || strippedWeb.length < 50) {
    beehiivContent = post.content.free.email || beehiivContent;
  }
  
  // Remove any full HTML/body tags if present and just get the content
  let cleanContent = beehiivContent
    .replace(/<html[^>]*>/gi, '')
    .replace(/<\/html>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
    .trim();
  
  // Remove inline styles and Beehiiv-specific attributes that might override our CSS
  cleanContent = cleanContent
    .replace(/\s*style="[^"]*"/gi, '')
    .replace(/\s*class="[^"]*"/gi, '')
    .replace(/\s*width="[^"]*"/gi, '')
    .replace(/\s*height="[^"]*"/gi, '')
    .replace(/\s*align="[^"]*"/gi, '')
    .replace(/\s*bgcolor="[^"]*"/gi, '')
    .replace(/\s*color="[^"]*"/gi, '');
  
  return cleanContent;
}

function getPostCoverImage(post: PostData): string | null {
  if (isArchivedPost(post)) {
    return post.coverImage?.url || null;
  }
  return post.thumbnail_url || null;
}

function getPostTags(post: PostData): Array<{ name: string; slug: string }> {
  if (isArchivedPost(post)) {
    return post.tags;
  }
  // Convert Beehiiv content_tags to tag format
  return post.content_tags.map((tag) => ({
    name: tag,
    slug: tag.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const coverImage = getPostCoverImage(post);
  const tags = getPostTags(post);
  const content = getPostContent(post);

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-6 overflow-x-hidden">
      <article className="container mx-auto max-w-4xl w-full">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/70 transition-colors font-semibold"
          >
            <span>←</span>
            <span>Back to Blog</span>
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-brownDark dark:text-brown">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-neutral-600 dark:text-neutral-400">
            <span>{formatDate(post)}</span>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="px-3 py-1 bg-secondary/20 rounded-full text-sm font-semibold"
                  style={{ color: '#5da9a4' }}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {coverImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl">
            <Image
              src={coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Footer */}
        <div className="mt-16 pt-8 border-t-2 border-neutral-200 dark:border-neutral-700">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>←</span>
            <span>Back to All Posts</span>
          </Link>
        </div>
      </article>
    </main>
  );
}
