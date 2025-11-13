'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';

interface Post {
  id: string;
  title: string;
  brief: string;
  coverImage: {
    url: string;
  } | null;
  publishedAt: string;
  slug: string;
  readTimeInMinutes: number;
  author: {
    name: string;
    profilePicture: string;
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMessage, setSubscribeMessage] = useState('');

  const PUBLICATION_ID = '654f5acfd03f881958ba54e6';

  useEffect(() => {
    const fetchPosts = async () => {
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
                  posts(first: 20) {
                    edges {
                      node {
                        id
                        title
                        brief
                        slug
                        coverImage {
                          url
                        }
                        publishedAt
                        readTimeInMinutes
                        author {
                          name
                          profilePicture
                        }
                      }
                    }
                  }
                }
              }
            `,
          }),
        });

        const data = await response.json();
        
        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        const publication = data.data.publication;
        const postsData = publication.posts.edges.map((edge: any) => edge.node);
        setPosts(postsData);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('loading');

    try {
      const response = await fetch('https://gql.hashnode.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation SubscribeToNewsletter($input: SubscribeToNewsletterInput!) {
              subscribeToNewsletter(input: $input) {
                status
              }
            }
          `,
          variables: {
            input: {
              publicationId: PUBLICATION_ID,
              email: email,
            },
          },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        setSubscribeStatus('error');
        setSubscribeMessage(data.errors[0].message || 'Something went wrong. Please try again.');
      } else if (data.data?.subscribeToNewsletter?.status) {
        setSubscribeStatus('success');
        setSubscribeMessage('🎉 Successfully subscribed! Check your inbox to confirm.');
        setEmail('');
      } else {
        setSubscribeStatus('error');
        setSubscribeMessage('Something went wrong. Please try again.');
      }
    } catch (err) {
      setSubscribeStatus('error');
      setSubscribeMessage('Failed to subscribe. Please try again later.');
      console.error('Subscription error:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main>
      {/* Hero Section */}
      <Hero
        title=""
        subtitle="ragTech Blog"
        description="Insights, tutorials, and stories from the ragTech team. Scroll down to read!"
        heroImage="/assets/laptop.png"
        backgroundGradient={true}
      >
        {/* Newsletter Subscription */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-2xl border-2 border-primary/20">
            <h3 className="text-2xl font-bold text-brownDark dark:text-brown mb-3 text-center">
              Subscribe to our newsletter!
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-center">
              Read articles from ragTech directly inside your inbox. Subscribe to the newsletter, and don&apos;t miss out.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-full border-2 border-secondary focus:border-primary focus:outline-none text-brownDark dark:text-brown dark:bg-neutral-700 dark:border-neutral-600"
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="px-8 py-4 bg-gradient-primary text-white rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            {subscribeMessage && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-center font-semibold ${
                  subscribeStatus === 'success' ? 'text-secondary' : 'text-red-600'
                }`}
              >
                {subscribeMessage}
              </motion.p>
            )}
          </div>
        </div>
      </Hero>

      {/* Blog Posts Section */}
      <section className="py-20 px-6 bg-neutral-50">
        <div className="container mx-auto max-w-6xl">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading posts...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
            </div>
          )}

          {/* Posts Grid */}
          {!loading && !error && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-video overflow-hidden">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage.url}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-6xl">📝</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-3 text-brownDark dark:text-brown group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-3">
                        {post.brief}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-500">
                        <div className="flex items-center gap-2">
                          {post.author.profilePicture && (
                            <Image
                              src={post.author.profilePicture}
                              alt={post.author.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          )}
                          <span>{post.author.name}</span>
                        </div>
                        <span>{post.readTimeInMinutes} min read</span>
                      </div>
                      <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-2">
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

          {/* No Posts */}
          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                No posts found. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
