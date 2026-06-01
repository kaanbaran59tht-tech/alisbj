/* eslint-disable */
'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductsGrid } from '@/components/sections/ProductsGrid';
import { ChevronDown } from 'lucide-react';

export default function HomePage() {
    // Performans: Telefon numarası temizleme işlemini hafızaya alıyoruz (Memoization)
    const whatsappUrl = useMemo(() => {
        const rawNumber = process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER || '905452544951';
        const cleanedNumber = rawNumber.replace(/\D/g, '');
        return `https://wa.me/${cleanedNumber}`;
    }, []);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-cream-50">

                {/* ─── Hero (Video Arka Planlı) ───────────────────────────────── */}
                <section
                    className="relative min-h-screen flex items-center justify-center overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #161616 0%, #242424 60%, #161616 100%)',
                    }}
                >
                    {/* OPTİMİZASYON: Tarayıcıyı yormayan, kontrollü video yüklemesi */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
                    >
                        <source src="/kadın2.mp4" type="video/mp4" />
                    </video>

                    {/* Arka Plan Radyal Parlama Maskesi */}
                    <div
                        className="absolute inset-0 z-10 pointer-events-none"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 20% 50%, rgba(212, 168, 41, 0.25) 0%, transparent 50%), 
                                radial-gradient(circle at 80% 20%, rgba(212, 168, 41, 0.20) 0%, transparent 40%)
                            `
                        }}
                    ></div>

                    {/* İçerik */}
                    <div className="relative z-20 text-center space-y-8 px-6 max-w-4xl mx-auto">
                        <p className="text-xs font-sans font-semibold uppercase tracking-widest text-gold animate-fade-up">
                            ✨ TOPTAN TAKILAR — 6'LI PAKET SİSTEMİ
                        </p>

                        <h1 className="font-display text-5xl md:text-7xl text-white leading-tight animate-fade-up">
                            Zarafetin
                            <span className="block" style={{ color: '#D4A829' }}>
                                Yeni Adı
                            </span>
                        </h1>

                        <p className="font-display italic text-xl md:text-2xl text-warm-gray-400 max-w-2xl mx-auto animate-fade-up">
                            Çelik takı koleksiyonu — kalite, fiyat, hız.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
                            <a href="#products" className="btn-gold">
                                Koleksiyonu Keşfet
                            </a>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline border-warm-gray-600 text-ivory-200 hover:border-gold hover:text-gold"
                            >
                                WhatsApp İletişim
                            </a>
                        </div>
                    </div>

                    {/* Aşağı Ok */}
                    <a
                        href="#products"
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold z-20 animate-bounce"
                    >
                        <ChevronDown className="w-7 h-7" />
                    </a>
                </section>

                {/* ─── Ürün Grid ─────────────────────────────────────────────── */}
                <ProductsGrid />

                {/* ─── Hakkımızda Bölümü ───────────────────── */}
                <section id="hakkimizda" className="relative py-24 bg-[#FDFAF4] overflow-hidden border-t border-[#E4E0D8]/30">

                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(circle at 80% 50%, #D4A829 0%, transparent 50%)"
                        }}
                    ></div>

                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                            {/* Sol Taraf: Hikaye ve Metinler */}
                            <div className="lg:col-span-7 space-y-6 animate-fade-up">
                                <span className="block font-sans font-medium text-xs uppercase tracking-widest text-[#9E9589]">
                                    Hikayemiz & Zarafet
                                </span>

                                <h2 className="text-4xl md:text-5xl font-display text-[#161616] leading-tight">
                                    Mücevherde Kalite ve <br />
                                    <span className="italic text-[#D4A829]">Güvenilir Toptan Ticaret</span>
                                </h2>

                                <div className="font-sans text-base text-[#555555] leading-relaxed space-y-6">
                                    <p>
                                        İnternet alışverişlerinde güven duymanın ne kadar önemli olduğunu çok iyi biliyoruz.
                                        Bu yüzden size sadece bir web sitesi olarak değil, <strong>İstanbul Bağcılar’daki fiziki üretim atölyemiz</strong> ve
                                        yılların getirdiği sektörel tecrübemizle hizmet veriyoruz.
                                    </p>

                                    <p>
                                        Biz, sadece son tüketiciye ulaşan bir marka değiliz; Türkiye’nin dört bir yanındaki <strong>çeşitli mağazalara ve
                                            işletmelere de toptan ürün tedariği sağlayan, üretici bir firmayız.</strong> Tezgahımızdan çıkan her bir üründe
                                        kaliteli malzeme, titiz işçilik ve şeffaf ticaret ilkelerini benimsiyoruz.
                                    </p>

                                    <div className="pt-2">
                                        <p className="font-semibold text-gray-800 mb-3">
                                            Sürecin her adımında içinizin rahat olması için iki farklı teslimat seçeneği sunuyoruz:
                                        </p>
                                        <ul className="space-y-3 list-none pl-0">
                                            <li className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                                                <strong className="text-gray-900">📍 Elden Teslim Alabilirsiniz:</strong> <em className="text-gray-600">"Gözümle görmeden, dokunmadan inanmam"</em> diyenlerdenseniz, İstanbul Bağcılar'daki üretim atölyemizi ziyaret edebilir, siparişinizi çayımızı içerken kendi ellerinizle teslim alabilirsiniz.
                                            </li>
                                            <li className="bg-gray-50 p-3 rounded-lg border-l-4 border-green-500">
                                                <strong className="text-gray-900">📦 Güvenli Kargo İle Kapınızda:</strong> İstanbul dışındaysanız ya da vaktiniz kısıtlıysa; ürünlerimizi özenle paketliyor, Türkiye'nin her yerine güvenli ve hızlı kargo seçenekleriyle ulaştırıyoruz.
                                            </li>
                                        </ul>
                                    </div>

                                    <p className="pt-2 font-medium text-gray-800">
                                        Gerçek bir üreticiyle çalışmanın, muhatap bulabilmenin ve birinci elden alışveriş yapmanın rahatlığını yaşamanız için buradayız.
                                        Bizi tercih ettiğiniz için teşekkür ederiz!
                                    </p>
                                </div>
                            </div>

                            {/* Sağ Taraf: Optimize Resim Çerçevesi */}
                            <div className="lg:col-span-5 relative p-4 animate-scale-in">
                                <div className="border border-[#E4E0D8] rounded-2xl p-3 bg-[#F8F4EE]/50 backdrop-blur-sm">
                                    {/* OPTİMİZASYON: Aspect ratio korumalı, Next.js Image entegrasyonlu ve lazy-load aktif yapısı */}
                                    <div className="card-product relative group img-zoom overflow-hidden rounded-lg aspect-[3/4] w-full">
                                        <Image
                                            src="/arka.jpg"
                                            alt="Hakkımızda Görseli"
                                            fill
                                            sizes="(max-w-1024px) 100vw, 33vw"
                                            loading="lazy"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/20 to-transparent"></div>
                                    </div>
                                </div>

                                {/* Dekoratif Altın Çerçeve Efekti */}
                                <div className="absolute -bottom-2 -left-2 w-24 h-24 border border-[#D4A829]/30 rounded-xl -z-10 animate-gold-pulse"></div>
                            </div>

                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}