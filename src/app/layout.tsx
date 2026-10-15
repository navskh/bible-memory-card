import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ServiceWorkerUpdater } from '@/components/module/service-worker-updater';

export const metadata: Metadata = {
  title: '성경 암송 앱',
  description: '성경 구절을 효과적으로 암송할 수 있는 PWA 앱',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '성경 암송',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/216.png', sizes: '216x216', type: 'image/png' },
      { url: '/icons/512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/216.png', sizes: '216x216', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const version = process.env.APP_COMMIT_SHA?.slice(0, 7) ?? 'local';

  return (
    <html lang="ko">
      <head>
        <meta name="application-name" content="성경 암송 앱" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="성경 암송" />
        <meta
          name="description"
          content="성경 구절을 효과적으로 암송할 수 있는 PWA 앱"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#4f46e5" />

        <link rel="apple-touch-icon" href="/icons/216.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="216x216"
          href="/icons/216.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/icon.svg" color="#4f46e5" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
      </head>
      <body className="antialiased">
        <ServiceWorkerUpdater />
        <div
          aria-label={`배포 버전 ${version}`}
          className="pointer-events-none fixed right-3 top-3 z-50 rounded-full border border-amber-200 bg-amber-50/95 px-2.5 py-1 font-mono text-[11px] font-semibold text-amber-800 shadow-sm backdrop-blur"
        >
          배포 {version}
        </div>
        {children}
      </body>
    </html>
  );
}
