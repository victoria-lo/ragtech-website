'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaEnvelope, FaYoutube, FaInstagram, FaSpotify, FaLinkedin, FaGithub, FaTiktok } from 'react-icons/fa';
import { SiLinktree } from 'react-icons/si';
import Hero from '../components/Hero';
import ContactForm from '../components/ContactForm';

export default function ContactPage() {
  const socialLinks = [
    {
      href: 'https://www.youtube.com/@ragTechDev',
      icon: FaYoutube,
      label: 'YouTube',
      color: 'text-red-600 hover:text-red-700',
      handle: '@ragTechDev',
    },
    {
      href: 'https://www.instagram.com/ragtechdev/',
      icon: FaInstagram,
      label: 'Instagram',
      color: 'text-pink-600 hover:text-pink-700',
      handle: '@ragtechdev',
    },
    {
      href: 'https://open.spotify.com/show/1KfM9JTWsDQ5QoMYEh489d',
      icon: FaSpotify,
      label: 'Spotify',
      color: 'text-green-600 hover:text-green-700',
      handle: 'Bytes & Banter',
    },
    {
      href: 'https://sg.linkedin.com/company/ragtechdev',
      icon: FaLinkedin,
      label: 'LinkedIn',
      color: 'text-blue-600 hover:text-blue-700',
      handle: 'ragtechdev',
    },
  ];

  const contactReasons = [
    {
      title: 'Collaboration',
      description: 'Interested in sponsoring, or booking our communication workshops?',
      icon: '🤝',
    },
    {
      title: 'Guest Appearance',
      description: 'Want to be a guest on our podcast or contribute to our blog?',
      icon: '🎙️',
    },
    {
      title: 'Feedback',
      description: 'Have suggestions or feedback about our content or projects?',
      icon: '💭',
    },
    {
      title: 'General Inquiry',
      description: 'Any other questions or just want to say hello?',
      icon: '✉️',
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <Hero
        title=""
        subtitle="Let's Start a Conversation"
        description="Whether you have a question, want to collaborate, or just want to say hi, we'd love to hear from you!"
        backgroundGradient={true}
        heroImage="/assets/techybara/techybara-raising-hand.png"
      />

      {/* Contact Reasons Section */}
      <section className="py-20 px-6 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">
              Why Reach Out?
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              We&apos;re always excited to connect with our community and explore new opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactReasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700"
              >
                <div className="text-5xl mb-4">{reason.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-neutral-900 dark:text-white">
                  {reason.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">
              Send Us a Message
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Fill out the form below and we&apos;ll get back to you as soon as possible.
            </p>
          </motion.div>

          <ContactForm />
        </div>
      </section>

      {/* Contact Info & Social Section */}
      <section className="py-20 px-6 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Direct Contact */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <h3 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">
                Direct Contact
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FaEnvelope className="text-3xl text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-neutral-900 dark:text-white">
                      Email Us
                    </h4>
                    <a
                      href="mailto:hello@ragtechdev.com"
                      className="text-primary dark:text-primary-light hover:underline"
                    >
                      hello@ragtechdev.com
                    </a>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      We typically respond within 24-48 hours
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex justify-center">
                  <Image
                    src="/assets/techybara/techybara-holding-mail.png"
                    alt="Contact Us"
                    width={200}
                    height={200}
                    className="w-56 h-auto"
                  />
                </div>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-lg border border-neutral-200 dark:border-neutral-700"
            >
              <h3 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">
                Follow Us
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Stay connected and join our community on social media for the latest updates, 
                behind-the-scenes content, and engaging discussions.
              </p>
              <div className="space-y-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-300 group"
                  >
                    <social.icon className={`text-3xl ${social.color} transition-colors duration-300`} />
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-300">
                        {social.label}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {social.handle}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Community CTA */}
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
              Be part of the conversation! Subscribe to our podcast, follow us on social media, 
              and join the Techie Taboo waitlist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/techie-taboo"
                className="px-8 py-4 bg-gradient-primary text-white rounded-full font-semibold hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                Join Techie Taboo Waitlist
              </a>
              <a
                href="https://www.youtube.com/@ragTechDev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white dark:bg-neutral-800 text-primary border-2 border-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300 shadow-lg"
              >
                Subscribe on YouTube
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
