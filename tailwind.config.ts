import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#fda2a9', // Pink - ragTech brand
          light: '#fdb9be',
          dark: '#fc8b94',
        },
        secondary: {
          DEFAULT: '#a2d4d1', // Turquoise - ragTech brand
          light: '#b8dedd',
          dark: '#8cc9c5',
        },
        accent: {
          DEFAULT: '#fff3c1', // Cream Yellow - ragTech brand
          light: '#fff7d4',
          dark: '#ffefae',
        },
        brown: {
          DEFAULT: '#a2805d', // Brown - Capybara mascot
          light: '#b89674',
          dark: '#8b6a46',
        },
        brownDark: {
          DEFAULT: '#8b5a49', // Dark Brown - Capybara mascot
          light: '#a06d5d',
          dark: '#764735',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #fda2a9 0%, #a2d4d1 100%)",
        "gradient-secondary": "linear-gradient(135deg, #a2d4d1 0%, #fff3c1 100%)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
