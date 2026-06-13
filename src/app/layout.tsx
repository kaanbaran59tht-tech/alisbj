import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";
import { GoogleAnalytics } from '@next/third-parties/google';
import { MetaPixel } from '@/components/MetaPixel';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.alluretoptantaki.com'),
  title: {
    default: "Toptan Takı ve Çelik Bijuteri | ALLURE Toptan",
    template: "%s | ALLURE Toptan Takı",
  },
  description: "Türkiye'nin en güvenilir toptan takı ve çelik bijuteri tedarikçisi. İndirimli fiyatlar, toptan çelik takı, kolye ve yüzük koleksiyonları.",
  keywords: ["toptan takı", "toptan çelik takı", "bijuteri toptan", "allure toptan", "toptan kolye", "toptan bileklik", "istanbul toptan takı", "toptan takı firmaları"],
  authors: [{ name: "Allure Toptan Takı" }],
  creator: "Allure Toptan Takı",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.alluretoptantaki.com",
    siteName: "ALLURE Toptan Çelik Takı",
    title: "Toptan Takı ve Çelik Bijuteri | ALLURE",
    description: "Zarafetin yeni adı. Uygun fiyatlarla toptan takı ve çelik bijuteri tedariği.",
    images: [
      {
        url: "/arka.jpg",
        width: 1200,
        height: 630,
        alt: "Allure Toptan Takı Koleksiyonu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toptan Takı ve Çelik Bijuteri | ALLURE",
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
    "name": "ALLURE Toptan Takı",
    "image": "https://www.alluretoptantaki.com/arka.jpg",
    "description": "Premium kalitede toptan çelik takı, bijuteri ve aksesuar toptancısı. Türkiye'nin her yerine güvenli gönderim.",
    "url": "https://www.alluretoptantaki.com",
    "telephone": "+905452544951",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bağcılar",
      "addressRegion": "İstanbul",
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
