import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

// ============================================================================
// FONTS - Luxury Typography
// ============================================================================
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

// ============================================================================
// METADATA
// ============================================================================
export const metadata: Metadata = {
  title: {
    default: 'Vintedge | Premium Personalized Wines',
    template: '%s | Vintedge',
  },
  description:
    'Create unique, personalized wines with custom labels. Premium quality wines crafted to your specifications and delivered worldwide.',
  keywords: [
    'personalized wine',
    'custom wine labels',
    'premium wine',
    'wine gifts',
    'corporate wine gifts',
    'wedding wine',
    'custom bottles',
    'luxury wine',
  ],
  authors: [{ name: 'Vintedge' }],
  creator: 'Vintedge',
  publisher: 'Vintedge',
  metadataBase: new URL('https://vintedge.vip'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'es': '/es',
      'pt': '/pt',
      'hi': '/hi',
      'ja': '/ja',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['en_US', 'pt_BR', 'hi_IN', 'ja_JP'],
    url: 'https://vintedge.vip',
    siteName: 'Vintedge',
    title: 'Vintedge | Premium Personalized Wines',
    description:
      'Create unique, personalized wines with custom labels. Premium quality wines crafted to your specifications and delivered worldwide.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vintedge - Premium Personalized Wines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vintedge | Premium Personalized Wines',
    description:
      'Create unique, personalized wines with custom labels. Premium quality wines crafted to your specifications and delivered worldwide.',
    creator: '@vintedge',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code',
  },
};

// ============================================================================
// ROOT LAYOUT
// ============================================================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical assets */}
        <link
          rel="preload"
          href="/images/hero-vineyard.jpg"
          as="image"
          type="image/jpeg"
        />
      </head>
      <body className="min-h-screen bg-cream-50 font-cormorant antialiased">
        {children}
      </body>
    </html>
  );
}
