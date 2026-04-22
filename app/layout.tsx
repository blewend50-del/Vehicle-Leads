import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Get a Fast Cash Offer for Your Car | Progressive Motors',
  description:
    'Progressive Motors has been buying cars for over 40 years. Get a real, no-obligation cash offer from our expert — no spam, no pressure.',
  openGraph: {
    title: 'Get a Fast Cash Offer for Your Car | Progressive Motors',
    description: 'Real buyers, real offers. Family-owned for 40+ years.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white text-[#1A1A1A] antialiased">{children}</body>
    </html>
  );
}
