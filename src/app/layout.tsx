import type { Metadata } from "next";
import { AppLayout } from "@/components/layout/AppLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "ALLURE — Toptan Takı ve Bujteri",
  description: "Premium kalitede toptan takı ve bujteri koleksiyonları",
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
