import type { Metadata } from 'next';
import { AppRuntime } from '@/components/AppRuntime';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('http://127.0.0.1:5173'),
  title: 'MASAAR - Jordan National Tourism Intelligence Platform',
  description: 'Government-grade tourism intelligence platform for Jordan.',
  applicationName: 'MASAAR',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/icon.png', sizes: '512x512', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.svg', type: 'image/svg+xml' }],
  },
  appleWebApp: {
    capable: true,
    title: 'MASAAR',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'MASAAR - Jordan National Tourism Intelligence Platform',
    description: 'Jordan national tourism intelligence for travellers, investors, businesses, and government teams.',
    images: ['/brand/masaar-logo.svg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body><AppRuntime>{children}</AppRuntime></body>
    </html>
  );
}
