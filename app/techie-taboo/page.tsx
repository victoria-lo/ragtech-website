'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FlippableCard from '../components/FlippableCard';
import PledgeMailto from '../components/PledgeMailto';

export default function TechieTabooPage() {
  const [pledgeCount, setPledgeCount] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    screenshot: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [showPledge, setShowPledge] = useState(false);
  const [showNonTechieVideo, setShowNonTechieVideo] = useState(false);

  const features = [
    { icon: '🎯', text: 'Perfect for tech teams, bootcamps, and meetups' },
    { icon: '⚡', text: 'Fast-paced rounds that test your tech vocabulary' },
    { icon: '🧠', text: 'Learn to explain complex concepts simply' },
    { icon: '😄', text: 'Hilarious moments guaranteed!' },
  ];

  const howToPlay = [
    {
      icon: '1️⃣',
      title: 'Draw a Card',
      text: 'Pick a card! We will color code based on category',
    },
    {
      icon: '2️⃣',
      title: 'Choose Your Word',
      text: 'Select which buzzword you want to explain to your team',
    },
    {
      icon: '3️⃣',
      title: 'Explain Without Taboo Words',
      text: 'Describe the buzzword without using any of the forbidden taboo words listed under it',
    },
    {
      icon: '4️⃣',
      title: 'Race Against Time',
      text: 'Get your team to guess correctly before time runs out! ⏰',
    },
  ];

  const borderColors = [
    'border-primary hover:border-primary/70',
    'border-secondary hover:border-secondary/70',
    'border-accent hover:border-accent/70',
    'border-primary hover:border-primary/70'
  ];

  // Fetch pledge count from Netlify function
  useEffect(() => {
    const fetchPledgeCount = async () => {
      try {
        const response = await fetch('/.netlify/functions/get-pledge-count');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // Function not deployed yet or returning HTML
          setPledgeCount(0);
          return;
        }
        
        const data = await response.json();
        
        if (data.count !== undefined) {
          setPledgeCount(data.count);
        } else {
          setPledgeCount(0);
        }
      } catch (error) {
        // Silently fail - function likely not deployed yet
        console.log('Pledge count fetch failed:', error);
        setPledgeCount(0);
      }
    };

    fetchPledgeCount();
    
    // Refresh count every 30 seconds to show updates
    const interval = setInterval(fetchPledgeCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'screenshot' && files) {
      setFormData(prev => ({ ...prev, screenshot: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Convert file to base64 if present
      let screenshotData = null;
      if (formData.screenshot) {
        const reader = new FileReader();
        screenshotData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(formData.screenshot!);
        });
      }

      // Submit to API route
      const response = await fetch('/api/submit-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          screenshotData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowThankYou(true);
        setFormData({ name: '', email: '', screenshot: null });
        setPledgeCount(prev => prev + 1);
      } else {
        throw new Error(data.error || 'Form submission failed');
      }
    } catch (err) {
      setError('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 mt-12 text-brownDark dark:text-brown">
              Techie Taboo
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-neutral-700 dark:text-neutral-300">
              Join the waitlist for our upcoming Techie Taboo game!
            </p>

            <div className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 px-6 py-3 rounded-full shadow-lg mb-8">
              <span className="text-2xl">🎉</span>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                <span className="text-2xl font-bold text-brownDark dark:text-brown">{pledgeCount}</span> supporters have joined!
              </p>
            </div>

            <div className="relative max-w-md mx-auto mb-8 group">
              <Image
                src="/assets/games.png"
                alt="Capybara mascots playing Techie Taboo"
                width={400}
                height={400}
                className="w-full h-auto"
              />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-800 px-4 py-2 rounded-2xl shadow-lg border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:border-l-[10px] after:border-l-transparent after:border-r-[10px] after:border-r-transparent after:border-t-[10px] after:border-t-primary before:content-[''] before:absolute before:bottom-[-8px] before:left-1/2 before:-translate-x-1/2 before:border-l-[8px] before:border-l-transparent before:border-r-[8px] before:border-r-transparent before:border-t-[8px] before:border-t-white dark:before:border-t-neutral-800 before:z-10">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                  Wow! This is so fun!
                </p>
              </div>
            </div>

            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
              We&apos;re building a fun social game for techies to explain buzzwords without using the buzzwords — think Taboo meets Tech Talk!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#cards"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-neutral-800 text-brownDark dark:text-brown border-2 border-primary rounded-full font-semibold text-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>View Cards</span>
                <span className="text-2xl">🎴</span>
              </a>
              <a
                href="#waitlist"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-primary text-white rounded-full font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>Join Waitlist Now</span>
                <span className="text-2xl">🚀</span>
              </a>
            </div>
            <div className="mt-6 max-w-xl mx-auto bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border-2 border-primary/20">
              <p className="text-xl font-bold text-primary dark:text-primary-light mb-2">
                Secure your spot for $1!
              </p>
              <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Your symbolic buy-in as one of our first supporters helping bring the Tech Taboo game to life.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Play Section */}
      <section className="py-12 px-6 bg-white dark:bg-neutral-900">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-8 text-brownDark dark:text-brown"
          >
            Why Play Techie Taboo?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`flex flex-col items-center text-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 ${borderColors[index]}`}
              >
                <span className="text-4xl mb-2">{feature.icon}</span>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-accent/10 via-white to-primary/10 dark:bg-neutral-900" id="about-game">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-brownDark dark:text-brown">
                How to Play
              </h2>
              <p className="text-xl text-primary dark:text-primary-light font-semibold mb-4">
                Never played before? It&apos;s easy!
              </p>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                Follow these 4 simple steps and you&apos;ll be explaining &quot;API&quot; without saying &quot;programming&quot; in no time.
              </p>

              <div className="space-y-4">
                {howToPlay.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`flex items-start gap-4 p-4 bg-white dark:bg-neutral-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 ${borderColors[index]}`}
                  >
                    <span className="text-3xl">{step.icon}</span>
                    <div>
                      <p className="font-bold text-brownDark dark:text-brown mb-1">{step.title}</p>
                      <p className="text-neutral-700 dark:text-neutral-300">{step.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-sm mx-auto">
                <div className={`${showNonTechieVideo ? 'bg-secondary/10 dark:bg-secondary/20' : 'bg-primary/10 dark:bg-primary/20'} px-4 py-2 text-center`}>
                  <p className="font-bold text-brownDark dark:text-brown">
                    {showNonTechieVideo ? 'Playing as a Non-Techie' : 'Playing as a Techie'}
                  </p>
                </div>
                <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
                  <iframe
                    key={showNonTechieVideo ? 'non-techie' : 'techie'}
                    className="absolute top-0 left-0 w-full h-full"
                    src={showNonTechieVideo ? 'https://www.youtube.com/embed/srzE_2TqzmA' : 'https://www.youtube.com/embed/uDFJM2xeNgw'}
                    title={showNonTechieVideo ? 'Non-Techie Gameplay Demo' : 'Techie Gameplay Demo'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setShowNonTechieVideo(!showNonTechieVideo)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-accent text-grey rounded-full font-semibold text-base hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                  <span>
                    {showNonTechieVideo ? 'See how techies play it!' : 'See how non-techies play it too!'}
                  </span>
                  <span className="text-xl">🔄</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Card Demo Section */}
      <section id="cards" className="py-20 px-6 bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/20 dark:bg-gradient-to-br dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        {/* Floating emojis */}
        <motion.div 
          className="absolute top-20 left-[10%] text-6xl opacity-20"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🎮
        </motion.div>
        <motion.div 
          className="absolute bottom-32 right-[15%] text-6xl opacity-20"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          💻
        </motion.div>
        <motion.div 
          className="absolute top-40 right-[20%] text-5xl opacity-20"
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          🎯
        </motion.div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-brownDark dark:text-brown pb-2">
              See the Cards in Action!
            </h2>
            <div className="max-w-2xl mx-auto bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary/30 shadow-lg">
              <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                Each card has <span className="text-primary font-bold">2 tech buzzwords</span> (top and bottom)<br/>and <span className="text-secondary font-bold">5 taboo words</span> under each word.
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 italic mb-4">
                Sample card below. Launch includes multiple color-coded categories! 🎨
              </p>
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-full font-semibold text-base hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                <span>Join Waitlist</span>
                <span className="text-xl">🚀</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FlippableCard
              frontImage="/assets/cards/front.png"
              backImage="/assets/cards/back.png"
              alt="Techie Taboo Sample Card"
            />
          </motion.div>
        </div>
      </section>

      {/* About ragTech Section */}
      <section className="py-20 px-6 bg-white dark:bg-neutral-900" id="about-ragtech">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-brownDark dark:text-brown">
              About ragTech
            </h2>
            <p className="text-xl text-primary dark:text-primary-light font-semibold mb-4">
              Bytes & Banter Podcast
            </p>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8">
              ragTech is a tech podcast dedicated to simplifying technology and making it accessible to everyone. We believe that tech shouldn&apos;t be intimidating – it should be fun, engaging, and easy to understand!
            </p>
          </motion.div>

          {/* Learn More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-primary text-white rounded-full font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <span>Learn More</span>
              <span className="text-2xl">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/15 dark:bg-neutral-900" id="waitlist">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brownDark dark:text-brown">
              Join the Waitlist
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
              Join the waitlist for $1 — your symbolic buy-in as one of our first supporters helping bring the Tech Taboo game to life.
            </p>

            <div className="inline-flex items-center gap-2 bg-white dark:bg-neutral-800 px-6 py-3 rounded-full shadow-lg mb-8">
              <span className="text-2xl">🎉</span>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                <span className="text-2xl font-bold text-brownDark dark:text-brown">{pledgeCount}</span> supporters have joined!
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-8 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl p-6 border-2 border-primary/30 shadow-lg">
              <p className="text-xl font-bold text-brownDark dark:text-brown text-center leading-relaxed mb-4">
                To confirm your spot, pledge $1 via PayNow and upload a screenshot of your transaction. We&apos;ll send you an email to order once the first batch comes in!
              
              </p>
              <div className="text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                  {showPledge ? 'In Singapore?' : 'Not in Singapore?'}
                </p>
                <button
                  type="button"
                  onClick={() => setShowPledge(!showPledge)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  {showPledge ? 'Pay $1 via PayNow' : 'Request to pledge in your currency'}
                </button>
              </div>
            </div>

            {!showPledge ? (
              <>
                {/* PayNow QR Code */}
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 inline-block shadow-xl mb-12 border-4 border-dashed border-secondary">
                  <Image
                    src="/assets/paynow-qr.jpg"
                    alt="PayNow QR Code"
                    width={300}
                    height={300}
                    className="w-64 h-64 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-4">
                    Scan to pay $1 via PayNow
                  </p>
                </div>
              </>
            ) : (
              <div className="max-w-2xl mx-auto mb-8">
                <PledgeMailto amountSGD={1} onClose={() => setShowPledge(false)} />
              </div>
            )}
          </motion.div>

          {/* Form - For Singaporeans */}
          {!showThankYou && !showPledge ? (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl"
            >
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 font-semibold">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-base font-semibold mb-2 text-brownDark dark:text-brown"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-secondary dark:border-secondary bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-secondary/70 focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-base font-semibold mb-2 text-brownDark dark:text-brown"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border-2 border-secondary dark:border-secondary bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-secondary/70 focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="screenshot"
                    className="block text-base font-semibold mb-2 text-brownDark dark:text-brown"
                  >
                    Upload Payment Screenshot
                  </label>
                  <div className="relative border-2 border-dashed border-secondary rounded-xl p-6 bg-secondary/5 hover:bg-secondary/10 transition-colors duration-200">
                    <input
                      type="file"
                      id="screenshot"
                      name="screenshot"
                      onChange={handleInputChange}
                      accept="image/*"
                      className="w-full text-neutral-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:opacity-90 file:cursor-pointer cursor-pointer"
                      required
                    />
                  </div>
                  {formData.screenshot && (
                    <p className="text-sm text-secondary dark:text-secondary-light mt-2 font-semibold">
                      ✓ Selected: {formData.screenshot.name}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-primary text-white rounded-full font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <span>{isSubmitting ? 'Processing...' : 'Join Waitlist'}</span>
                  <span className="text-2xl">{isSubmitting ? '⏳' : '🎮'}</span>
                </button>
              </div>
            </motion.form>
          ) : showThankYou && !showPledge ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-12 shadow-xl max-w-3xl mx-auto"
            >
              <div className="text-6xl mb-6 text-center">🎉</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-brownDark dark:text-brown">
                Thank You!
              </h1>
              
              <div className="space-y-4 text-center mb-8">
                <p className="text-lg text-neutral-700 dark:text-neutral-300">
                  Your waitlist registration for <span className="font-bold text-primary">Techie Taboo</span> has been successfully submitted!
                </p>
                
                <p className="text-lg text-neutral-700 dark:text-neutral-300">
                  We&apos;ll send you updates about the game launch to your email address once we&apos;ve confirmed your payment.
                </p>
                
                <p className="text-lg text-neutral-700 dark:text-neutral-300">
                  Get ready for the most exciting tech trivia game ever created! 🎮
                </p>
              </div>
              
              <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-6 border-2 border-secondary">
                <h2 className="text-2xl font-bold mb-3 text-center text-brownDark dark:text-brown">
                  Support ragTech While You Wait
                </h2>
                <p className="text-base text-neutral-700 dark:text-neutral-300 text-center mb-6">
                  Help us spread the word and build an amazing tech community!
                </p>
                
                <div className="flex justify-center">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-primary text-white rounded-full font-semibold text-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <span>Learn More About Us</span>
                    <span className="text-2xl">→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
