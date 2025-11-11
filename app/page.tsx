'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaMicrophone, FaGamepad, FaLightbulb, FaUsers } from 'react-icons/fa';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <Hero
        title=""
        subtitle="Where bytes meet banter"
        description="ragTech is a tech podcast dedicated to simplifying technology and making it accessible to everyone. We believe that tech shouldn't be intimidating – it should be fun, engaging, and easy to understand!"
        heroImage="/assets/mic.png"
      >
        <Link
          href="https://techie-taboo.ragtechdev.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-gradient-primary text-white rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Play Techie Taboo!
        </Link>
        <Link
          href="https://www.youtube.com/@ragTechDev"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-white dark:bg-neutral-800 text-primary border-2 border-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-lg"
        >
          Watch on YouTube
        </Link>
      </Hero>

      {/* Key Projects Section */}
      <section className="py-20 px-6 bg-neutral-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-brownDark bg-clip-text text-transparent">
              What We Do
            </h2>
            <p className="text-lg text-brown max-w-2xl mx-auto">
              Explore our innovative projects that combine technology, creativity, and community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              title="ragTech Podcast"
              description="A tech podcast that simplifies complex topics and makes technology accessible to everyone. Join Saloni, Victoria, and Natasha as they break down tech concepts with humor and insight."
              link="https://www.youtube.com/@ragTechDev"
              linkText="Watch on YouTube"
              image="/assets/subscribe.png"
            />
            <ProjectCard
              title="Techie Taboo Game"
              description="The ultimate tech communication challenge! Explain complex tech concepts, programming languages, and industry buzzwords without using the obvious terms. Perfect for tech teams and coding bootcamps."
              link="https://techie-taboo.ragtechdev.com/"
              linkText="Join Waitlist"
              image="/assets/games.png"
            />
            <ProjectCard
              title="Workshops"
              description="Interactive workshops designed to help engineers communicate more effectively and empower non-technical folks to understand technology better. Bridge the gap between tech and non-tech."
              link="/contact"
              linkText="Get in Touch"
              image="/assets/teacher.png"
            />
          </div>
        </div>
      </section>

      {/* About Teaser Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brownDark via-primary to-secondary bg-clip-text text-transparent">
                Our Story
              </h2>
              <p className="text-lg text-brown mb-6 leading-relaxed">
                We&apos;re a passionate team dedicated to making technology fun, engaging, and accessible to everyone
              </p>
              <p className="text-lg text-brown mb-8 leading-relaxed">
                From podcasts that simplify complex tech topics to interactive games that challenge your communication skills, 
                and workshops that help engineers communicate better and non-techies understand technology—we believe 
                technology shouldn&apos;t be intimidating, it should be an adventure
              </p>
              <Link
                href="/about"
                className="inline-block px-8 py-4 bg-gradient-to-r from-brown to-brownDark text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Learn More About Us
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              <div className="bg-gradient-to-br from-primary/30 to-accent/40 p-8 rounded-2xl border-2 border-primary/30 text-center">
                <FaLightbulb className="text-5xl text-brownDark mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-brown">Innovation</h3>
                <p className="text-brown/80 text-sm">
                  Creating unique tech experiences
                </p>
              </div>
              <div className="bg-gradient-to-br from-secondary/30 to-accent/40 p-8 rounded-2xl border-2 border-secondary/30 text-center">
                <FaUsers className="text-5xl text-brownDark mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-brown">Community</h3>
                <p className="text-brown/80 text-sm">
                  Building engaged learning communities
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-br from-accent/30 via-pink-50 to-secondary/20">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 flex justify-center">
              <Image 
                src="/assets/sparkle.png" 
                alt="Sparkle" 
                width={160} 
                height={160}
                className="w-40 h-auto"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brownDark via-primary to-secondary bg-clip-text text-transparent">
              Ready to Collaborate?
            </h2>
            <p className="text-lg text-brown mb-10 max-w-2xl mx-auto">
              Whether you have an idea, want to join our community, or just want to say hi, we&apos;d love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-brown to-brownDark text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Get in Touch
              </Link>
              <Link
                href="https://www.youtube.com/@ragTechDev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-brown border-2 border-brown rounded-full font-semibold hover:bg-brown hover:text-white transition-all duration-300"
              >
                Watch on YouTube
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
