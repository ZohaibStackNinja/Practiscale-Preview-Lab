import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Practiscale Preview Lab — Craft & Test Stunning Thumbnails in Seconds',
  description:
    'Simulate how your thumbnails and ad creatives appear inside real YouTube, Instagram, TikTok, Facebook, and LinkedIn feeds before you hit publish.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="%2300A67E"/><text x="50%" y="56%" dominant-baseline="central" text-anchor="middle" fill="white" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="62">.p</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-brand-surface text-brand-text-primary antialiased selection:bg-[#00A67E]/15 selection:text-[#008B68]">
        {children}
      </body>
    </html>
  );
}
