'use client';

import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const rawPhone = process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER || '905439136096';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const waPhone = cleanPhone.startsWith('90') ? cleanPhone : (cleanPhone.startsWith('0') ? '9' + cleanPhone : '90' + cleanPhone);
  const displayPhone = '0543 913 60 96';

  return (
    <footer id="contact" className="relative bg-charcoal-800 text-ivory-300 overflow-hidden pt-20 pb-6 border-t-[6px] border-gold">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Footer */}
      <div className="container-bijou relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-16 items-center">

          {/* Brand & Socials */}
          <div className="space-y-6 md:col-span-1">
            <h3 className="font-display text-4xl text-gold tracking-wider mb-2">ALİŞ BİJUTERİ</h3>
            <p className="font-sans font-light text-sm text-warm-gray-300 leading-relaxed max-w-xs">
              Premium kalitede toptan takı ve bijuteri koleksiyonları. En trend tasarımlar, rekabetçi fiyatlar ve güvenilir hizmet anlayışı.
            </p>
            <div className="flex items-center gap-5 pt-5">
              <a
                href="https://www.instagram.com/alissbijuteri/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-charcoal-700/50 border border-charcoal-600 flex items-center justify-center text-warm-gray-400 hover:bg-gold hover:text-charcoal-900 hover:border-gold transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-1">
            <h4 className="font-sans font-semibold text-lg uppercase tracking-[0.15em] text-gold mb-8 pb-4 border-b border-charcoal-700/50">
              İletişim Bilgileri
            </h4>
            <ul className="space-y-8">
              <li className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-charcoal-700/40 flex items-center justify-center group-hover:bg-gold/15 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0 shadow-sm border border-charcoal-600/50">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="font-sans font-semibold text-base text-ivory-100 mb-2 tracking-wide">Mağaza & Atölye Adresimiz</span>
                  <span className="font-sans font-light text-base text-warm-gray-300 leading-relaxed">
                    Özdiker Bağdat Pasajı K-1 No:63,<br />Eyyübiye / ŞANLIURFA
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-charcoal-700/40 flex items-center justify-center group-hover:bg-gold/15 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0 shadow-sm border border-charcoal-600/50">
                  <Phone className="w-6 h-6 text-gold" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="font-sans font-semibold text-base text-ivory-100 mb-2 tracking-wide">Telefon / WhatsApp</span>
                  <a
                    href={`https://wa.me/${waPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans font-light text-lg text-warm-gray-300 hover:text-gold transition-colors"
                  >
                    {displayPhone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-charcoal-700/40 flex items-center justify-center group-hover:bg-gold/15 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0 shadow-sm border border-charcoal-600/50">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="font-sans font-semibold text-base text-ivory-100 mb-2 tracking-wide">E-Posta Adresimiz</span>
                  <a
                    href="mailto:info@allure.com"
                    className="font-sans font-light text-lg text-warm-gray-300 hover:text-gold transition-colors"
                  >
                    info@allure.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-charcoal-700/50 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="font-sans font-light text-sm text-warm-gray-500 tracking-wide">
            © {currentYear} <span className="text-ivory-300 font-medium">ALİŞ BİJUTERİ - Design by KaanG</span>. Tüm hakları saklıdır.
          </p>
          <p className="font-sans font-light text-sm text-warm-gray-500 tracking-wider uppercase">
            Premium Toptan Takı ve Bijuteri
          </p>
        </div>
      </div>
    </footer>
  );
}
