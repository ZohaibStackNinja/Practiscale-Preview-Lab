import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Practiscale Preview Lab",
  description:
    "Test your thumbnail and creative across YouTube, Instagram, Facebook, TikTok, and LinkedIn before posting.",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%230ABAB5"/><text x="50" y="70" font-size="60" font-family="system-ui, sans-serif" font-weight="900" fill="white" text-anchor="middle">P</text></svg>',
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-brand-surface font-sans text-brand-text-primary">
        {children}
      </body>
    </html>
  );
}
