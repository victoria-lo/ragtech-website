'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  backgroundGradient?: boolean;
  heroImage?: string;
  titleOnImage?: boolean;
  largeImage?: boolean;
}

export default function Hero({
  title,
  subtitle,
  description,
  children,
  backgroundGradient = true,
  heroImage,
  titleOnImage = false,
  largeImage = false,
}: HeroProps) {
  return (
    <section
      className={`relative min-h-screen flex items-center justify-center pt-20 pb-16 px-6 overflow-hidden ${
        backgroundGradient ? 'bg-gradient-to-br from-accent/40 via-pink-50 to-secondary/30' : ''
      }`}
    >
      {/* Geometric Background */}
      {backgroundGradient && (
        <>
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brown/10 rounded-full blur-3xl" />
        </>
      )}

      <div className="relative z-10 container mx-auto max-w-6xl text-center">
        {/* Hero Image with Subtitle Overlay */}
        {heroImage && titleOnImage ? (
          <>
            {/* Title above the image */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-brownDark via-primary to-secondary bg-clip-text text-transparent"
            >
              {title}
            </motion.h1>
            
            <div className="relative mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="flex justify-center"
              >
                <img
                  src={heroImage}
                  alt={title}
                  className="w-64 md:w-80 lg:w-96 h-auto"
                />
              </motion.div>
              {subtitle && (
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute text-2xl md:text-3xl lg:text-4xl font-semibold left-0 right-0 mx-auto"
                  style={{ top: '70%', transform: 'translateY(-50%)', color: '#845f45' }}
                >
                  {subtitle}
                </motion.h2>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Hero Image - Optional image before title */}
            {heroImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8 flex justify-center"
              >
                <img
                  src={heroImage}
                  alt={title}
                  className={largeImage ? "w-64 md:w-80 lg:w-96 h-auto" : "w-48 md:w-60 h-auto"}
                />
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-brownDark via-primary to-secondary bg-clip-text text-transparent"
            >
              {title}
            </motion.h1>
          </>
        )}

        {/* Subtitle */}
        {subtitle && !titleOnImage && (
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 text-brown"
          >
            {subtitle}
          </motion.h2>
        )}

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-brown mb-10 max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
        )}

        {/* Children (CTAs, etc.) */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
