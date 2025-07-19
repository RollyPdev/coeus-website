import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import JsonLd from "./components/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Coeus Review & Training Specialist, Inc. | Premier Review Center in Roxas City",
  description: "Coeus Review & Training Specialist, Inc. is the leading review center in Roxas City offering professional review programs for Criminology and Nursing licensure examinations, and CPD seminars for all licensed professionals.",
  keywords: ["review center", "criminology review", "nursing review", "CPD seminars", "licensure exam", "professional development", "Roxas City", "Capiz", "board exam", "review programs"],
  authors: [{ name: "Coeus Review & Training Specialist, Inc." }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://coeusreview.com",
    siteName: "Coeus Review & Training Specialist, Inc.",
    title: "Premier Review Center for Criminology and Nursing in Roxas City",
    description: "Achieve your professional goals with our comprehensive review programs and expert instructors. High passing rates for board exams.",
    images: [
      {
        url: "https://coeusreview.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Coeus Review Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coeus Review & Training Specialist, Inc.",
    description: "Leading review center for Criminology and Nursing board exams with proven track record of success.",
    images: ["https://coeusreview.com/images/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://coeusreview.com",
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
    <html lang="en" className="scroll-smooth">
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
