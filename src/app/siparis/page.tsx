'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Package, Phone, User, CheckCircle2, ShoppingBag, MapPin } from 'lucide-react';

function decodeOrder(encoded: string) {
    try {
        const json = decodeURIComponent(escape(atob(encoded)));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

interface OrderItem {
    title: string;
    image_url: string | null;
    category_id?: string | null;
    packagePrice: number;
    quantity: number;
    variant: string | null;
}

interface Order {
    customerName: string;
    customerPhone: string;
    customerAddress: string; // Yeni eklenen Adres tipi
    items: OrderItem[];
    total: number;
    createdAt: string;
}

export default function SiparisPage() {
    const searchParams = useSearchParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const d = searchParams.get('d');
        if (!d) { setError(true); return; }
        const decoded = decodeOrder(d);
        if (!decoded) { setError(true); return; }
        setOrder(decoded);
    }, [searchParams]);

    if (error) {
        return (
            <main className="min-h-screen bg-[#F8F5EF] flex items-center justify-center p-4">
                <div className="text-center space-y-3">
                    <ShoppingBag className="w-12 h-12 text-warm-gray-300 mx-auto" />
                    <p className="font-sans text-warm-gray-500 text-sm">Sipariş bulunamadı veya link geçersiz.</p>
                </div>
            </main>
        );
    }

    if (!order) {
        return (
            <main className="min-h-screen bg-[#F8F5EF] flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-gold border-t-transparent animate-spin" />
            </main>
        );
    }

    const totalUnits = order.items.reduce((s, i) => s + i.quantity * 6, 0);
    const date = new Date(order.createdAt).toLocaleString('tr-TR', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });

    return (
        <main className="min-h-screen bg-[#F8F5EF] flex items-start justify-center p-4 py-10">
            <div className="w-full max-w-md space-y-4">

                <div className="text-center pb-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366]/10 mb-3">
                        <CheckCircle2 className="w-7 h-7 text-[#25D366]" />
                    </div>
                    <h1 className="font-display text-3xl text-[#161616]">Sipariş Detayı</h1>
                    <p className="text-xs font-sans text-[#9E9589] mt-1">{date}</p>
                </div>

                {/* Müşteri ve Teslimat Bilgileri */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#F0EBE3]">
                        <p className="text-2xs font-sans font-600 uppercase tracking-widest text-[#9E9589]">
                            Müşteri & Teslimat
                        </p>
                    </div>
                    <div className="px-5 py-4 space-y-4">
                        {/* Ad Soyad */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#FDF9EE] flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-[#D4A829]" />
                            </div>
                            <div>
                                <p className="text-2xs text-[#9E9589] font-sans">Ad Soyad</p>
                                <p className="font-sans font-600 text-[#161616] text-sm">{order.customerName}</p>
                            </div>
                        </div>

                        {/* Telefon */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#FDF9EE] flex items-center justify-center flex-shrink-0">
                                <Phone className="w-4 h-4 text-[#D4A829]" />
                            </div>
                            <div>
                                <p className="text-2xs text-[#9E9589] font-sans">Telefon</p>
                                <a href={`tel:${order.customerPhone}`} className="font-sans font-600 text-[#161616] text-sm hover:text-[#D4A829] transition-colors">
                                    {order.customerPhone}
                                </a>
                            </div>
                        </div>

                        {/* Yeni Eklenen Adres Görünümü */}
                        <div className="flex items-start gap-3 border-t border-[#FAFAFA] pt-3">
                            <div className="w-9 h-9 rounded-full bg-[#FDF9EE] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MapPin className="w-4 h-4 text-[#D4A829]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-2xs text-[#9E9589] font-sans">Teslimat Adresi</p>
                                <p className="font-sans font-500 text-[#161616] text-sm leading-relaxed whitespace-pre-line break-words">
                                    {order.customerAddress || 'Belirtilmedi'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ürünler Tablosu */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#F0EBE3] flex items-center justify-between">
                        <p className="text-2xs font-sans font-600 uppercase tracking-widest text-[#9E9589]">Ürünler</p>
                        <span className="text-2xs font-sans text-[#9E9589]">{totalUnits} adet toplam</span>
                    </div>

                    <div className="divide-y divide-[#F5F0E8]">
                        {order.items.map((item, idx) => {
                            const unitPrice = item.packagePrice / 6;
                            const lineTotal = item.packagePrice * item.quantity;
                            const pageImageUrl = item.image_url || (item.category_id ? `/images/categories/${item.category_id}.jpg` : null);

                            return (
                                <div key={idx} className="flex gap-4 px-5 py-4">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F5F0E8] flex-shrink-0">
                                        {pageImageUrl ? (
                                            <img src={pageImageUrl} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-6 h-6 text-[#C8C0B4]" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-sans font-600 text-sm text-[#161616] leading-snug">{item.title}</p>
                                        {item.variant && (
                                            <p className="text-2xs text-[#9E9589] font-sans mt-0.5">{item.variant}</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1.5 text-2xs font-sans text-[#9E9589]">
                                            <span>{item.quantity} paket</span>
                                            <span>·</span>
                                            <span>{item.quantity * 6} adet</span>
                                            <span>·</span>
                                            <span>₺{unitPrice.toFixed(2)}/adet</span>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 text-right">
                                        <p className="font-display font-500 text-base text-[#D4A829]">₺{lineTotal.toFixed(2)}</p>
                                        <p className="text-2xs text-[#9E9589] font-sans mt-0.5">₺{item.packagePrice.toFixed(2)}/paket</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="px-5 py-4 bg-[#FDFAF4] border-t border-[#F0EBE3] flex items-center justify-between">
                        <div>
                            <p className="font-sans font-600 text-[#161616]">Toplam</p>
                            <p className="text-2xs text-[#9E9589] font-sans">{totalUnits} adet · {order.items.length} ürün çeşidi</p>
                        </div>
                        <p className="font-display text-2xl text-[#D4A829] font-500">₺{order.total.toFixed(2)}</p>
                    </div>
                </div>

                <a
                    href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#17a850] text-white font-sans font-600 text-sm transition-colors shadow-sm"
                >
                    <Phone className="w-4 h-4" />
                    {order.customerPhone} — WhatsApp'ta Aç
                </a>

                <p className="text-center text-2xs font-sans text-[#C0B8AE] pb-4">
                    Bu sayfa sipariş kaydı içermez. Yalnızca sipariş detaylarını gösterir.
                </p>

            </div>
        </main>
    );
}