import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PostData {
  id: string;
  title: string;
  content: {
    html: string;
  };
  coverImage: {
    url: string;
  } | null;
  publishedAt: string;
  readTimeInMinutes: number;
  author: {
    name: string;
    profilePicture: string;
  };
  tags: Array<{
    name: string;
    slug: string;
  }>;
}

// Fetch post data
async function getPost(slug: string): Promise<PostData | null> {
  try {
    const response = await fetch('https://gql.hashnode.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query Publication($slug: String!) {
            publication(host: "blog.ragtechdev.com") {
              post(slug: $slug) {
                id
                title
                content {
                  html
                  markdown
                }
                coverImage {
                  url
                }
                publishedAt
                readTimeInMinutes
                author {
                  name
                  profilePicture
                }
                tags {
                  name
                  slug
                }
              }
            }
          }
        `,
        variables: { slug },
      }),
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    const data = await response.json();
    
    if (data.errors || !data.data?.publication?.post) {
      return null;
    }

    return data.data.publication.post;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// This function is required for static export with dynamic routes
export async function generateStaticParams() {
  try {
    const response = await fetch('https://gql.hashnode.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query Publication {
            publication(host: "blog.ragtechdev.com") {
              posts(first: 50) {
                edges {
                  node {
                    slug
                  }
                }
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();
    
    if (data.errors || !data.data?.publication?.posts) {
      return [];
    }

    return data.data.publication.posts.edges.map((edge: any) => ({
      slug: edge.node.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

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
            <div className="flex items-center gap-3">
              {post.author.profilePicture && (
                <Image
                  src={post.author.profilePicture}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <span className="font-semibold">{post.author.name}</span>
            </div>
            <span>•</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span>{post.readTimeInMinutes} min read</span>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
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
        {post.coverImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl">
            <Image
              src={post.coverImage.url}
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
          dangerouslySetInnerHTML={{ __html: post.content.html }}
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
