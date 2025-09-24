import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import JsonLd from "./components/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }, { url: '/logo.png', sizes: '32x32' }],
    apple: [{ url: '/logo.png' }],
    shortcut: [{ url: '/logo.png' }],
  },
  manifest: '/manifest.json',
  title: "Coeus Review & Training Specialist, Inc. | Premier Review Center in Roxas City",
  description: "Coeus Review & Training Specialist, Inc. is the leading review center in Roxas City offering professional review programs for Criminology and Nursing licensure examinations, and CPD seminars for all licensed professionals.",
  keywords: ["review center", "criminology review", "nursing review", "CPD seminars", "licensure exam", "professional development", "Roxas City", "Capiz", "board exam", "review programs"],
  authors: [{ name: "Coeus Review & Training Specialist, Inc." }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://coeus-incorporated.com",
    siteName: "Coeus Review & Training Specialist, Inc.",
    title: "Premier Review Center for Criminology and Nursing in Roxas City",
    description: "Achieve your professional goals with our comprehensive review programs and expert instructors. High passing rates for board exams.",
    images: [
      {
        url: "https://coeus-incorporated.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Coeus Review Center",
        type: "image/png",
      },
    ],
  },
  other: {
    'og:image:secure_url': 'https://coeus-incorporated.com/logo.png',
  },
  twitter: {
    card: "summary_large_image",
    title: "Coeus Review & Training Specialist, Inc.",
    description: "Leading review center for Criminology and Nursing board exams with proven track record of success.",
    images: [
      {
        url: "https://coeus-incorporated.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Coeus Review Center",
      },
    ],
  },
  alternates: {
    canonical: "https://coeus-incorporated.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: ["f8aa2903657b804d", "W8uVriLGV3Lf4fTpWvl3JQ-KcL3qpsEO29kLyPKDbRc"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <Providers>
          <JsonLd />
          {children}
        </Providers>
      </body>
    </html>
  );
}
