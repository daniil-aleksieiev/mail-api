import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mail Service - Gmail API Email Forwarding Service',
  description:
    'A simple email forwarding service built with Next.js that sends emails via Gmail API. Supports plain text, HTML templates, and automatic object formatting.',
  keywords: ['email', 'gmail', 'api', 'nextjs', 'typescript', 'email service'],
  authors: [{ name: 'Dan Aleksieiev', url: 'https://github.com/daniil-aleksieiev' }],
  openGraph: {
    title: 'Mail Service - Gmail API Email Forwarding',
    description: 'Send emails via Gmail API with support for text, HTML, and object-based formatting',
    type: 'website',
    images: [
      {
        url: '/logo.svg',
        width: 512,
        height: 512,
        alt: 'Mail Service Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Mail Service - Gmail API Email Forwarding',
    description: 'Send emails via Gmail API with support for text, HTML, and object-based formatting',
    images: ['/logo.svg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
