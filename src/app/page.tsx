import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductsGrid } from '@/components/sections/ProductsGrid'; // Yolunuzu kontrol edin
import { ChevronDown } from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export default function HomePage() {
    // Sunucu tarafında (Server-side) bir kere hesaplanır, istemciyi yormaz.
    const rawNumber = process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER || '905452544951';
    const whatsappUrl = `https://wa.me/${rawNumber.replace(/\D/g, '')}`;

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#FDFAF4]">
                {/* ─── Hero (Video Arka Planlı) ───────────────────────────────── */}
                <section
                    className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#161616]"
                    style={{ background: 'linear-gradient(135deg, #161616 0%, #242424 60%, #161616 100%)' }}
                >
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0 pointer-events-none"
                    >
                        <source src="/kadın2.mp4" type="video/mp4" />
                    </video>

                    <div
                        className="absolute inset-0 z-10 pointer-events-none"
                        style={{
                            backgroundImage: `
                                radial-gradient(circle at 20% 50%, rgba(212, 168, 41, 0.25) 0%, transparent 50%), 
                                radial-gradient(circle at 80% 20%, rgba(212, 168, 41, 0.20) 0%, transparent 40%)
                            `
                        }}
                    />

                    <div className="relative z-20 text-center space-y-8 px-6 max-w-4xl mx-auto">
                        <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[#D4A829] animate-fade-up">
                            ✨ TOPTAN TAKILAR — SİPARİŞLERİNİZE ÖZEL İNDİRİMLER
                        </p>

                        <h1 className="font-display text-5xl md:text-7xl text-white leading-tight animate-fade-up">
                            Toptan Takıda
                            <span className="block text-[#D4A829]">Zarafetin Yeni Adı</span>
                        </h1>

                        <p className="font-display italic text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto animate-fade-up">
                            Toptan çelik takı koleksiyonu — üstün kalite, toptan fiyatlar, hızlı teslimat.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
                            <a href="#products" className="btn-gold">
                                Ürünleri Keşfet
                            </a>
                            <WhatsAppButton
                                whatsappUrl={whatsappUrl}
                                className="btn-outline border-gray-600 text-gray-200 hover:border-[#D4A829] hover:text-[#D4A829]"
                            >
                                WhatsApp İletişim
                            </WhatsAppButton>
                        </div>
                    </div>

                    <a href="#products" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#D4A829] z-20 animate-bounce" aria-label="Aşağı Kaydır">
                        <ChevronDown className="w-7 h-7" />
                    </a>
                </section>

                {/* ─── Ürün Grid (Client Component burada render ediliyor) ─── */}
                <ProductsGrid />

                {/* ─── Hakkımızda Bölümü ────────────────────────────────────── */}
                <section id="hakkimizda" className="relative py-24 bg-[#FDFAF4] overflow-hidden border-t border-[#E4E0D8]/30">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #D4A829 0%, transparent 50%)" }} />
                    <div className="max-w-6xl mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            <div className="lg:col-span-7 space-y-6 animate-fade-up">
                                <span className="block font-sans font-medium text-xs uppercase tracking-widest text-[#9E9589]">Hikayemiz & Zarafet</span>
                                <h2 className="text-4xl md:text-5xl font-display text-[#161616] leading-tight">
                                    Toptan Takı ve Çelik Bijuteride <br />
                                    <span className="italic text-[#D4A829]">Güvenilir Toptan Ticaret</span>
                                </h2>
                                <div className="font-sans text-base text-[#555555] leading-relaxed space-y-6">
                                    <p>İnternet alışverişlerinde güven duymanın ne kadar önemli olduğunu çok iyi biliyoruz. Bu yüzden size sadece bir web sitesi olarak değil, <strong>Klas İş Merkezi Rüstempaşa Mah, Sabuncuhanı Sok., No:24A, Fatih, İstanbul'daki fiziki toptan satış merkezimizde</strong> ve yılların getirdiği sektörel tecrübemizle hizmet veriyoruz.</p>
                                    <p>Biz, sadece son tüketiciye ulaşan bir marka değiliz; Türkiye’nin dört bir yanındaki <strong>çeşitli mağazalara ve işletmelere de toptan ürün tedariği sağlayan, üretici bir firmayız.</strong></p>
                                    <div className="pt-2">
                                        <ul className="space-y-3 list-none pl-0">
                                            <li className="bg-white shadow-sm p-4 rounded-xl border border-[#E4E0D8]">
                                                <strong className="text-[#161616]">📍 Elden Teslim Alabilirsiniz:</strong> Klas İş Merkezi Rüstempaşa Mah, Sabuncuhanı Sok., No:24A, Fatih, İstanbul adresindeki üretim atölyemizi ziyaret edebilir, siparişinizi çayımızı içerken kendi ellerinizle teslim alabilirsiniz.
                                            </li>
                                            <li className="bg-white shadow-sm p-4 rounded-xl border border-[#E4E0D8]">
                                                <strong className="text-[#161616]">📦 Güvenli Kargo İle Kapınızda:</strong> Ürünlerimizi özenle paketliyor, Türkiye'nin her yerine güvenli ve hızlı kargo seçenekleriyle ulaştırıyoruz.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-5 relative p-4 animate-scale-in">
                                <div className="border border-[#E4E0D8] rounded-2xl p-3 bg-[#F8F4EE]/50 backdrop-blur-sm">
                                    <div className="relative group overflow-hidden rounded-lg aspect-[3/4] w-full">
                                        <Image
                                            src="/arka.jpg"
                                            alt="Allure Toptan Takı - Üretim ve Tedarik"
                                            fill
                                            sizes="(max-w-1024px) 100vw, 40vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/40 to-transparent pointer-events-none" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -left-2 w-24 h-24 border border-[#D4A829]/30 rounded-xl -z-10 animate-gold-pulse" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}