'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BeehiivPost, ArchivedPost, isArchivedPost } from '@/lib/beehiiv-types';

interface BlogPostsProps {
  initialPosts: BeehiivPost[];
  initialPage: number;
  initialTotalPages: number;
  archivedPosts: ArchivedPost[];
}

export default function BlogPosts({
  initialPosts,
  initialPage,
  initialTotalPages,
  archivedPosts,
}: BlogPostsProps) {
  const [posts, setPosts] = useState<BeehiivPost[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = async () => {
    if (currentPage >= totalPages || loading) return;

    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetch(`/api/blog/posts?page=${nextPage}&limit=6`);
      const data = await response.json();

      if (response.ok && data.data) {
        setPosts((prev) => [...prev, ...data.data]);
        setCurrentPage(nextPage);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (post: BeehiivPost | ArchivedPost) => {
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
  };

  const getPostUrl = (post: BeehiivPost | ArchivedPost) => {
    return `/blog/${post.slug}`;
  };

  const getPostImage = (post: BeehiivPost | ArchivedPost) => {
    if (isArchivedPost(post)) {
      return post.coverImage?.url;
    }
    return post.thumbnail_url;
  };

  const getPostBrief = (post: BeehiivPost | ArchivedPost) => {
    if (isArchivedPost(post)) {
      return post.brief;
    }
    return post.preview_text || post.subtitle;
  };

  return (
    <>
      {/* Latest Posts Grid */}
      {posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link
                href={getPostUrl(post)}
                className="block bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                {/* Cover Image */}
                <div className="relative aspect-video overflow-hidden">
                  {getPostImage(post) ? (
                    <Image
                      src={getPostImage(post)!}
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
                    {getPostBrief(post)}
                  </p>

                  {/* Meta Info */}
                  <p className="text-xs text-neutral-400 dark:text-neutral-600">
                    {formatDate(post)}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      )}

      {/* Show More Button */}
      {currentPage < totalPages && (
        <div className="flex justify-center mb-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMorePosts}
            disabled={loading}
            className="px-10 py-4 bg-gradient-primary text-white rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </span>
            ) : (
              'Show More'
            )}
          </motion.button>
        </div>
      )}

      {/* Archived Posts Section */}
      {archivedPosts.length > 0 && (
        <div className="mt-16 pt-12 border-t-2 border-neutral-200 dark:border-neutral-700">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-brownDark dark:text-brown mb-8 text-center"
          >
            From the Archives
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {archivedPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link
                  href={getPostUrl(post)}
                  className="block bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-video overflow-hidden">
                    {post.coverImage?.url ? (
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
                    <p className="text-xs text-neutral-400 dark:text-neutral-600">
                      {formatDate(post)}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      )}

      {/* No Posts */}
      {posts.length === 0 && archivedPosts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            No posts found. Check back soon!
          </p>
        </div>
      )}
    </>
  );
}
