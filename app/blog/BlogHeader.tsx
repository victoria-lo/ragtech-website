'use client';

import { motion } from 'framer-motion';

export default function BlogHeader() {
  return (
    <section className="relative py-12 px-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 overflow-hidden">
      <div className="container mx-auto max-w-4xl">
        {/* Title and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 mt-20"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-brownDark dark:text-brown mb-3">
            ragTech Blog
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Insights, tutorials, and stories from the ragTech team
          </p>
        </motion.div>
      </div>
    </section>
  );
}
