"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaBrain, FaUsers, FaHeart, FaChartLine } from "react-icons/fa";
import Hero from "../components/Hero";

const problemQuotes = [
  {
    quote: "It&apos;s very hard to get her off the screen every time.",
    context: "Parent struggling with screen time management",
  },
  {
    quote: "I don&apos;t know how she ends up figuring out DuckDuckGo and discover all these streamers.",
    context: "Parent concerned about content discovery",
  },
  {
    quote: "I want them not to lie to me.",
    context: "Parent seeking trust-based solutions",
  },
];

const researchInsights = [
  {
    icon: <FaBrain className="text-5xl text-primary" />,
    title: "Coaching Over Control",
    stat: "Parents prefer calmer conversations and iterative learning over one-off enforcement",
    description: "Our research shows a strong desire for tools that support explanation, reasoning, and shared agreements rather than rigid restrictions.",
  },
  {
    icon: <FaUsers className="text-5xl text-secondary" />,
    title: "Community-Driven Approach",
    stat: "15-20 parent interviews • 8-10 educator sessions • Multiple user personas",
    description: "We&apos;re building with real families, understanding diverse parenting styles from &lsquo;The Unbreakable Boundary Setter&rsquo; to &lsquo;The Trust-Based Self-Regulator&rsquo;.",
  },
  {
    icon: <FaHeart className="text-5xl text-accent" />,
    title: "Non-Monetary Solutions",
    stat: "Parents strongly prefer non-paid interventions for digital wellbeing",
    description: "Exploring default-safe UX patterns, routine-based supports, and device-free transitions that don't require constant financial investment.",
  },
  {
    icon: <FaChartLine className="text-5xl text-primary" />,
    title: "Real Data, Real Impact",
    stat: "Quiz results revealing parenting patterns and needs",
    description: "Every quiz response helps us understand how technology shapes modern parenting and what support families actually need.",
  },
];

const whyCarePoints = [
  {
    title: "The stakes are higher than ever",
    description: "Kids today face digital challenges we never experienced: algorithmic feeds, constant connectivity, and pressure to be online. The choices we make now shape their relationship with technology for life.",
  },
  {
    title: "Parents shouldn&apos;t navigate this alone",
    description: "From anxious screen management to trust-based autonomy, every family has a unique digital parenting journey. Research helps us build tools that actually support diverse needs.",
  },
  {
    title: "Technology can be a force for good",
    description: "We believe in tech that promotes freedom, creativity, and authentic connections—the kind of childhood experiences we cherish from our own past.",
  },
];

export default function FutureNetPage() {
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past hero (about 600px)
      setShowStickyCTA(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative">
      {/* Sticky CTA */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: showStickyCTA ? 0 : -100,
          opacity: showStickyCTA ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="fixed top-20 left-0 right-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700 shadow-lg"
      >
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Help shape the future of digital parenting
          </p>
          <a
            href="https://futurenet.ragtechdev.com/digital-parent-quiz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-primary text-white rounded-full font-semibold text-sm hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
          >
            Take the Quiz
          </a>
        </div>
      </motion.div>

      {/* Hero Section */}
      <Hero
        heroImage="/assets/futurenet.png"
        title="FutureNet"
        titleOnImage={false}
        subtitle="Research for a Safer Digital Future"
        description="A technologist-led research initiative exploring the digital landscape for children, adolescents, and their parents. Join us in understanding how technology shapes modern parenting."
        backgroundGradient={true}
      />

      {/* Problem Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-neutral-50 dark:from-primary/10 dark:to-neutral-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-white">
              The Challenge We're Facing
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Modern parents are navigating uncharted territory. The digital landscape is evolving faster than our understanding of its impact on children.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-8">
              {problemQuotes.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border-l-4 border-primary"
                >
                  <p className="text-lg italic text-neutral-700 dark:text-neutral-300 mb-4">
                    "{item.quote}"
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    — {item.context}
                  </p>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <Image
                src="/assets/children.png"
                alt="Child engrossed in digital device"
                width={400}
                height={400}
                className="rounded-2xl w-full max-w-md h-auto object-cover"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto"
          >
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
              From managing screen time battles to preventing content bypass, from building trust to maintaining safety—parents are making critical decisions without adequate support or research-backed guidance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-white">
              Our Research in Action
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              We're building a comprehensive understanding of digital parenting through community engagement, interviews, and data-driven insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {researchInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700"
              >
                <div className="mb-6 flex justify-center">{insight.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-white text-center">
                  {insight.title}
                </h3>
                <p className="text-sm font-semibold text-brownDark dark:text-brown mb-4 text-center">
                  {insight.stat}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {insight.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why You Should Care */}
      <section className="py-20 px-6 bg-gradient-to-br from-secondary/5 to-neutral-50 dark:from-secondary/10 dark:to-neutral-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-white">
              Why This Matters
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              This isn't just about devices and apps—it's about shaping the kind of childhood we want for the next generation.
            </p>
          </motion.div>

          <div className="space-y-8">
            {whyCarePoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">
                  {point.title}
                </h3>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 rounded-2xl p-8 text-center"
          >
            <p className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
              We're a group of technologists who care deeply about parents and future generations
            </p>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto">
              Working together to help the next generation grow up with the same freedom, creativity, and authentic connections we experienced in our own childhoods.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contribute Section (Bottom CTA) */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-white">
              Help Us Understand Digital Parenting
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
              Take our Digital Parent Quiz—a short, day-in-the-life experience that reveals your parenting style through a nostalgic 2000s phone persona. Every response contributes to crucial research.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mb-8"
            >
              <a
                href="https://futurenet.ragtechdev.com/digital-parent-quiz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-primary text-white rounded-full font-bold text-xl hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <FaBrain className="text-2xl" />
                Take the Digital Parent Quiz
              </a>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-12">
              <div className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl p-6">
                <p className="text-3xl font-bold text-primary mb-2">12</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Questions
                </p>
              </div>
              <div className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl p-6">
                <p className="text-3xl font-bold text-secondary mb-2">5 min</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  To Complete
                </p>
              </div>
              <div className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl p-6">
                <p className="text-3xl font-bold mb-2" style={{ color: '#eec08c' }}>100%</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Anonymous
                </p>
              </div>
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-8 italic">
              From &ldquo;The Unbreakable Boundary Setter&rdquo; to &ldquo;The Trust-Based Self-Regulator&rdquo;—discover which 2000s phone matches your digital parenting style.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
