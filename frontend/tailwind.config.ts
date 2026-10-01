import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#00A67E',
          'primary-hover': '#008B68',
          'primary-soft': '#E6F7F3',
          surface: '#F8FAFB',
          card: '#FFFFFF',
          border: '#E2E8F0',
          'text-primary': '#0F172A',
          gray: '#475569',
          muted: '#94A3B8',
          success: '#00A67E',
          'success-soft': '#E6F7F3',
          warning: '#D97706',
          'warning-soft': '#FEF3C7',
          danger: '#E11D48',
          'danger-soft': '#FFE4E6',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 1px 3px 0 rgba(15, 23, 42, 0.03)',
        'card-hover': '0 12px 28px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04)',
        cta: '0 8px 20px -4px rgba(0, 166, 126, 0.38)',
      },
    },
  },
  plugins: [],
};
export default config;
