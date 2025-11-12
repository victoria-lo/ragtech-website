'use client';

import { motion } from 'framer-motion';
import { FaSpotify, FaYoutube } from 'react-icons/fa';
import { SiApplepodcasts } from 'react-icons/si';

interface EpisodeCardProps {
  title: string;
  description: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  thumbnail?: string;
  delay?: number;
}

export default function EpisodeCard({
  title,
  description,
  youtubeUrl,
  spotifyUrl,
  appleUrl,
  thumbnail,
  delay = 0,
}: EpisodeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700"
    >
      {/* Thumbnail */}
      {thumbnail && (
        <div className="relative h-48 bg-gradient-primary">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">
          {title}
        </h3>

        {/* Description */}
        <p className="text-neutral-600 dark:text-neutral-400 mb-6 line-clamp-3">
          {description}
        </p>

        {/* Platform Links */}
        <div className="flex items-center gap-4">
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors duration-300"
              aria-label="Watch on YouTube"
            >
              <FaYoutube size={24} />
              <span className="text-sm font-medium">YouTube</span>
            </a>
          )}
          {spotifyUrl && (
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors duration-300"
              aria-label="Listen on Spotify"
            >
              <FaSpotify size={24} />
              <span className="text-sm font-medium">Spotify</span>
            </a>
          )}
          {appleUrl && (
            <a
              href={appleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors duration-300"
              aria-label="Listen on Apple Podcasts"
            >
              <SiApplepodcasts size={24} />
              <span className="text-sm font-medium">Apple</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
