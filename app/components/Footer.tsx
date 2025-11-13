'use client';

import Link from 'next/link';
import { FaYoutube, FaInstagram, FaSpotify, FaEnvelope, FaLinkedin, FaGithub, FaTiktok } from 'react-icons/fa';
import { SiLinktree } from 'react-icons/si';

export default function Footer() {
  const socialLinks = [
    {
      href: 'https://www.youtube.com/@ragTechDev',
      icon: FaYoutube,
      label: 'YouTube',
      color: 'hover:text-red-600',
    },
    {
      href: 'https://www.instagram.com/ragtechdev/',
      icon: FaInstagram,
      label: 'Instagram',
      color: 'hover:text-pink-600',
    },
    {
      href: 'https://www.tiktok.com/@ragtechdev',
      icon: FaTiktok,
      label: 'TikTok',
      color: 'hover:text-gray-900',
    },
    {
      href: 'https://open.spotify.com/show/1KfM9JTWsDQ5QoMYEh489d',
      icon: FaSpotify,
      label: 'Spotify',
      color: 'hover:text-green-600',
    },
    {
      href: 'https://linktr.ee/ragtechdev',
      icon: SiLinktree,
      label: 'Linktree',
      color: 'hover:text-green-500',
    },
    {
      href: 'https://sg.linkedin.com/company/ragtechdev',
      icon: FaLinkedin,
      label: 'LinkedIn',
      color: 'hover:text-blue-600',
    },
    {
      href: 'https://github.com/ragTechDev',
      icon: FaGithub,
      label: 'GitHub',
      color: 'hover:text-gray-600',
    },
    {
      href: 'mailto:hello@ragtechdev.com',
      icon: FaEnvelope,
      label: 'Email',
      color: 'hover:text-primary',
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-brownDark via-brown to-brownDark text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent mb-4">
              ragTech
            </h3>
            <p className="text-accent/90 mb-4">
              Where bytes meet banter. Making technology fun, engaging, and accessible to everyone through podcasts and creative projects.
            </p>
            <Link
              href="/techie-taboo"
              className="inline-block px-6 py-2 bg-accent text-brownDark rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              Join Techie Taboo Waitlist
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-accent/80 hover:text-accent transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-accent/80 hover:text-accent transition-colors duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@ragTechDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent/80 hover:text-accent transition-colors duration-300"
                >
                  Podcast
                </a>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-accent/80 hover:text-accent transition-colors duration-300"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-accent/80 hover:text-accent transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/techie-taboo"
                  className="text-accent/80 hover:text-accent transition-colors duration-300"
                >
                  Techie Taboo
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">Connect With Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-accent/80 hover:text-accent hover:scale-110 transition-all duration-300"
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
            <p className="text-accent/80 mt-6 text-sm">
              hello@ragtechdev.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-accent/30 pt-8 text-center text-accent/80 text-sm">
          <p>© {new Date().getFullYear()} ragTech | Bytes & Banter Podcast</p>
        </div>
      </div>
    </footer>
  );
}
