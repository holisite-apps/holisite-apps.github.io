import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";

import { FirebaseAnalytics } from "@/components/analytics/firebase-analytics";
import { loadAppsConfig } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const config = loadAppsConfig();

export const metadata: Metadata = {
  title: config.site.name,
  description: config.site.description,
  metadataBase: new URL(config.site.url),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: config.site.name,
    description: config.site.description,
    url: config.site.url,
    siteName: config.site.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1d1712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={config.site.locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={null}>
          <FirebaseAnalytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
