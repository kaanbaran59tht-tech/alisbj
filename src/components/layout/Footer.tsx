'use client';

import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const phoneNumber = process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER || '905xxxxxxxxx';

  return (
    <footer className="bg-charcoal-800 text-ivory-300">
      {/* Main Footer */}
      <div className="container-bijou py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-3xl text-gold mb-4">ALLURE</h3>
            <p className="font-sans font-300 text-sm text-warm-gray-400 leading-relaxed">
              Toptan takı ve bujteri koleksiyonları. Premium kalitede ürünler, kompetitif fiyatlar.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon hover:bg-gold/20 text-ivory-300 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon hover:bg-gold/20 text-ivory-300 hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@allure.com"
                className="btn-icon hover:bg-gold/20 text-ivory-300 hover:text-gold transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h4 className="font-sans font-600 text-sm uppercase tracking-widest text-ivory-200 mb-6">
              Hızlı Linkler
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#products"
                  className="font-sans font-300 text-sm text-warm-gray-400 hover:text-gold transition-colors"
                >
                  Ürünler
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="font-sans font-300 text-sm text-warm-gray-400 hover:text-gold transition-colors"
                >
                  Hakkımızda
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="font-sans font-300 text-sm text-warm-gray-400 hover:text-gold transition-colors"
                >
                  İletişim
                </a>
              </li>
              <li>
                <a
                  href="/admin/login"
                  className="font-sans font-300 text-sm text-warm-gray-400 hover:text-gold transition-colors"
                >
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>

          {/* Müşteri Hizmetleri */}
          <div>
            <h4 className="font-sans font-600 text-sm uppercase tracking-widest text-ivory-200 mb-6">
              Hizmetler
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#faq"
                  className="font-sans font-300 text-sm text-warm-gray-400 hover:text-gold transition-colors"
                >
                  Sıkça Sorulan Sorular
                </a>
              </li>
              <li>
                <a
                  href="#shipping"
                  className="font-sans font-300 text-sm text-warm-gray-400 hover:text-gold transition-colors"
                >
                  Kargo Bilgileri
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="font-sans font-300 text-sm text-warm-gray-400 hover:text-gold transition-colors"
                >
                  Gizlilik Politikası
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="font-sans font-300 text-sm text-warm-gray-400 hover:text-gold transition-colors"
                >
                  Kullanım Koşulları
                </a>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="font-sans font-600 text-sm uppercase tracking-widest text-ivory-200 mb-6">
              İletişim
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="font-sans font-300 text-sm text-warm-gray-400">
                  İstanbul, Türkiye
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <a
                  href={`https://wa.me/${phoneNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans font-300 text-sm text-warm-gray-400 hover:text-gold transition-colors"
                >
                  {phoneNumber}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:info@bijou.com"
                  className="font-sans font-300 text-sm text-warm-gray-400 hover:text-gold transition-colors"
                >
                  info@allure.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Alt Bar */}
      <div className="border-t border-charcoal-700">
        <div className="container-bijou py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="font-sans font-300 text-2xs text-warm-gray-500">
              © {currentYear} ALLURE Toptan Takı. Tüm hakları saklıdır - DESİGN BY KAAN.
            </p>
            <p className="font-sans font-300 text-2xs text-warm-gray-500">
              Premium Toptan Takı ve Bujteri
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
