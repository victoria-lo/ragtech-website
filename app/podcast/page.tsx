'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import EpisodeCard from '../components/EpisodeCard';

export default function PodcastPage() {
  const episodes = [
    {
      title: '10x Engineers: Myth or Reality?',
      description:
        'We dive into the controversial topic of 10x engineers. Are they real or just a myth? What makes a truly exceptional developer?',
      youtubeUrl: 'https://youtu.be/FKcIMe44miw',
    },
    {
      title: 'Artificial Intelligence: Beyond the Hype',
      description:
        'Breaking down AI concepts and separating the reality from the hype. What can AI actually do today?',
      youtubeUrl: 'https://youtu.be/MrU62CMdlus',
    },
    {
      title: 'Career Growth in Tech',
      description:
        'Strategies for advancing your tech career, from junior to senior roles and beyond.',
      youtubeUrl: 'https://youtu.be/2K8EsXQy2OU',
    },
    {
      title: 'Career Part 1: Getting Started',
      description:
        'The first steps in your tech journey. How to break into the industry and land your first role.',
      youtubeUrl: 'https://youtu.be/MHo_dqEZmN8',
    },
    {
      title: 'Imposter Syndrome in Tech',
      description:
        'Everyone experiences it. Let\'s talk about imposter syndrome and how to overcome it.',
      youtubeUrl: 'https://youtu.be/UQxeOVvZrRI',
    },
    {
      title: 'Thriving as an Introvert in Tech',
      description:
        'You don\'t have to be extroverted to succeed. Tips for introverts navigating the tech world.',
      youtubeUrl: 'https://youtu.be/ovx_xbz-fkM',
    },
    {
      title: 'Finding Joy in Your Work',
      description:
        'How to stay passionate about coding and technology, even when things get tough.',
      youtubeUrl: 'https://youtu.be/0DWWiiBbc70',
    },
    {
      title: 'Leadership in Tech',
      description:
        'What makes a great tech leader? Exploring leadership principles and practices.',
      youtubeUrl: 'https://youtu.be/NF6rMZLRwhY',
    },
    {
      title: 'Interview with Martin',
      description:
        'A deep dive conversation with industry expert Martin about his journey and insights.',
      youtubeUrl: 'https://youtu.be/gIorV-YCNQs',
    },
    {
      title: 'Interview with Martin - Part 1',
      description:
        'The first part of our conversation with Martin, covering his early career and key learnings.',
      youtubeUrl: 'https://youtu.be/kcI3lRNh5b0',
    },
    {
      title: 'Getting That Promotion',
      description:
        'Strategies and tips for advancing in your current role and getting promoted.',
      youtubeUrl: 'https://youtu.be/vy_XQVmPE3M',
    },
    {
      title: 'Interview with Saloni',
      description:
        'Co-host Saloni shares her tech journey, challenges, and advice for aspiring developers.',
      youtubeUrl: 'https://youtu.be/Q-7eorueeRA',
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <Hero
        title="Bytes & Banter"
        subtitle="A Tech Podcast for Everyone"
        description="Simplifying technology and making it accessible to everyone. Join Saloni, Victoria, and Natasha as they break down complex tech topics with humor, insight, and real talk."
        backgroundGradient={true}
      >
        <Link
          href="https://techie-taboo.ragtechdev.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-gradient-primary text-white rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Visit Techie Taboo 🎮
        </Link>
      </Hero>

      {/* About Podcast Section */}
      <section className="py-20 px-6 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-white">
              About the Podcast
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
              Bytes & Banter is a tech podcast dedicated to making technology accessible and fun. 
              We believe that tech shouldn&apos;t be intimidating – it should be engaging, easy to understand, 
              and a source of inspiration for everyone.
            </p>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Each episode features candid conversations about various tech topics, from career advice 
              and imposter syndrome to AI, leadership, and the latest industry trends. We break down 
              complex concepts into bite-sized, relatable discussions that anyone can follow.
            </p>
          </motion.div>

          {/* Listen On Platforms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="https://www.youtube.com/@ragTechDev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg"
            >
              Watch on YouTube
            </a>
            <a
              href="https://open.spotify.com/show/1KfM9JTWsDQ5QoMYEh489d"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg"
            >
              Listen on Spotify
            </a>
          </motion.div>
        </div>
      </section>

      {/* Episodes Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">
              Latest Episodes
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Explore our collection of episodes covering a wide range of tech topics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {episodes.map((episode, index) => (
              <EpisodeCard
                key={episode.title}
                title={episode.title}
                description={episode.description}
                youtubeUrl={episode.youtubeUrl}
                delay={index * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-white">
              Join Our Community
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10 max-w-2xl mx-auto">
              Subscribe to stay updated with new episodes and join the conversation!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.youtube.com/@ragTechDev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-gradient-primary text-white rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                Subscribe on YouTube
              </a>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white dark:bg-neutral-800 text-primary border-2 border-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-lg"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
