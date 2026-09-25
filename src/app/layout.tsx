import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";
import { GoogleAnalytics } from '@next/third-parties/google';
import { MetaPixel } from '@/components/MetaPixel';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.alluretoptantaki.com'),
  icons: { icon: '/favicon.ico' },
  title: {
    default: "Toptan Takı ve Çelik Bijuteri | ALİŞ BİJUTERİ",
    template: "%s | ALİŞ BİJUTERİ",
  },
  description: "Türkiye'nin en güvenilir toptan takı ve çelik bijuteri tedarikçisi. İndirimli fiyatlar, toptan çelik takı, kolye ve yüzük koleksiyonları.",
  keywords: ["toptan takı", "toptan çelik takı", "bijuteri toptan", "aliş bijuteri", "toptan kolye", "toptan bileklik", "şanlıurfa toptan takı", "toptan takı firmaları"],
  authors: [{ name: "ALİŞ BİJUTERİ" }],
  creator: "ALİŞ BİJUTERİ",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.alluretoptantaki.com",
    siteName: "ALİŞ BİJUTERİ",
    title: "Toptan Takı ve Çelik Bijuteri | ALİŞ BİJUTERİ",
    description: "Zarafetin yeni adı. Uygun fiyatlarla toptan takı ve çelik bijuteri tedariği.",
    images: [
      {
        url: "/arka.jpg",
        width: 1200,
        height: 630,
        alt: "ALİŞ BİJUTERİ Koleksiyonu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toptan Takı ve Çelik Bijuteri | ALİŞ BİJUTERİ",
    description: "Zarafetin yeni adı. Uygun fiyatlarla toptan takı tedariği.",
    images: ["/arka.jpg"],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    "name": "ALİŞ BİJUTERİ",
    "image": "https://www.alluretoptantaki.com/arka.jpg",
    "description": "Premium kalitede toptan çelik takı, bijuteri ve aksesuar toptancısı. Türkiye'nin her yerine güvenli gönderim.",
    "url": "https://www.alluretoptantaki.com",
    "telephone": "+905439136096",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Özdiker Bağdat Pasajı K-1 No:63",
      "addressLocality": "Eyyübiye",
      "addressRegion": "Şanlıurfa",
      "addressCountry": "TR"
    }
  };

  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-cream-50 text-charcoal-800">
        <AppLayout>
          {children}
        </AppLayout>
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        <MetaPixel />
      </body>
    </html>
  );
}
