import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.alluretoptantaki.com'),
  title: {
    default: "ALLURE — Toptan Çelik Takı ve Bijuteri",
    template: "%s | ALLURE Toptan Takı",
  },
  description: "Türkiye'nin her yerine 12'li paketlerle premium kalitede toptan çelik takı, bijuteri, bileklik, kolye, küpe ve yüzük koleksiyonları.",
  keywords: ["toptan takı", "toptan çelik takı", "bijuteri toptan", "allure toptan", "toptan kolye", "toptan bileklik", "istanbul toptan takı"],
  authors: [{ name: "Allure Toptan Takı" }],
  creator: "Allure Toptan Takı",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.alluretoptantaki.com",
    siteName: "ALLURE Toptan Çelik Takı",
    title: "ALLURE — Premium Toptan Çelik Takı ve Bijuteri",
    description: "Zarafetin yeni adı. Uygun fiyatlarla toptan takı tedariği.",
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
    title: "ALLURE — Premium Toptan Çelik Takı ve Bijuteri",
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
  return (
    <html lang="tr">
      <body className="font-sans antialiased bg-cream-50 text-charcoal-800">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
