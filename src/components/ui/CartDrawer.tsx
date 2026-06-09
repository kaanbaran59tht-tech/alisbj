'use client';

import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/hooks/useCart';
import {
    ShoppingBag, X, Plus, Minus, MessageCircle,
    Trash2, Package, User, Phone, ArrowRight, ChevronLeft, MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { ADMIN_PHONE } from '@/lib/env';

// ─── Sipariş verisini Base64 URL'e göm ────────────────────────────────────────
function encodeOrder(data: object): string {
    try {
        const json = JSON.stringify(data);
        return btoa(unescape(encodeURIComponent(json)));
    } catch {
        return '';
    }
}

// ─── Ana Sepet Drawer ─────────────────────────────────────────────────────────
export function CartDrawer() {
    const {
        items, isOpen, closeCart,
        updatePackageQuantity, removeItem, clearCart,
        getTotal, getTotalPackages, getTotalUnits,
    } = useCartStore();

    const [step, setStep] = useState<'sepet' | 'form'>('sepet');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState(''); // Yeni Eklenen Adres State'i
    const [submitting, setSubmitting] = useState(false);

    const total = getTotal();
    const totalPackages = getTotalPackages();
    const totalUnits = getTotalUnits();
    const phone = ADMIN_PHONE.replace(/\D/g, '');

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => setStep('sepet'), 300);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            const y = window.scrollY;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${y}px`;
            document.body.style.width = '100%';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    const handleSubmitOrder = () => {
        if (!customerName.trim()) { toast.error('Ad Soyad zorunlu'); return; }
        if (!customerPhone.trim()) { toast.error('Telefon numarası zorunlu'); return; }
        if (!customerAddress.trim()) { toast.error('Adres alanı zorunlu'); return; } // Adres Kontrolü

        setSubmitting(true);

        const orderData = {
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            customerAddress: customerAddress.trim(), // Veriye Adres Eklendi
            items: items.map((i) => ({
                title: i.title,
                image_url: i.image_url || null,
                category_id: i.category_id || null,
                packagePrice: i.packagePrice,
                quantity: i.quantity,
                variant: i.selectedVariant?.name || null,
            })),
            total,
            createdAt: new Date().toISOString(),
        };

        const encoded = encodeOrder(orderData);
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const detailLink = `${origin}/siparis?d=${encoded}`;

        const waMessage = `Merhaba, yeni bir siparişim var! 🛍️\n\nSipariş Detayları:\n${detailLink}`;
        const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;

        window.open(waLink, '_blank');

        setSubmitting(false);
        toast.success('Sipariş WhatsApp\'a iletildi!', { icon: '✅', duration: 3000 });

        setTimeout(() => {
            clearCart();
            setCustomerName('');
            setCustomerPhone('');
            setCustomerAddress('');
            setStep('sepet');
            closeCart();
        }, 1000);
    };

    return (
        <>
            <div
                className={cn(
                    'fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300',
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                )}
                onClick={closeCart}
                aria-hidden="true"
            />

            <div
                className={cn(
                    'fixed top-0 right-0 z-[100] h-full w-full sm:w-[420px] flex flex-col',
                    'bg-white shadow-2xl transition-transform duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                )}
                style={{ height: '100dvh' }}
                role="dialog"
                aria-modal="true"
                aria-label="Alışveriş Sepeti"
            >

                <div className={cn(
                    'flex flex-col h-full transition-all duration-300',
                    step === 'sepet' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none absolute inset-0'
                )}>
                    <div className="flex items-center justify-between px-5 py-4 border-b border-warm-gray-200 flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5 text-gold" />
                            <h2 className="font-display text-2xl text-charcoal-800">Sepet</h2>
                            {items.length > 0 && (
                                <span className="bg-gold text-charcoal-800 text-2xs font-sans font-700 px-2 py-0.5 rounded-full">
                                    {totalUnits} adet
                                </span>
                            )}
                        </div>
                        <button
                            onClick={closeCart}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-warm-gray-100 active:bg-warm-gray-200 transition-colors"
                            aria-label="Kapat"
                        >
                            <X className="w-5 h-5 text-charcoal-600" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
                                <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center">
                                    <ShoppingBag className="w-9 h-9 text-warm-gray-400" />
                                </div>
                                <p className="font-display text-xl text-charcoal-700">Sepet Boş</p>
                                <p className="font-sans text-sm text-warm-gray-500">
                                    Ürün kartlarından "Sepete Ekle" butonunu kullanın.
                                </p>
                                <button
                                    onClick={closeCart}
                                    className="mt-2 py-3 px-6 rounded-xl bg-gold hover:bg-gold-light font-sans font-600 text-sm text-charcoal-800 transition-colors"
                                >
                                    Alışverişe Devam
                                </button>
                            </div>
                        ) : (
                            <div className="px-4 py-3 space-y-3">
                                {items.map((item) => {
                                    const unitPrice = item.packagePrice / 6;
                                    const lineTotal = item.packagePrice * item.quantity;
                                    const units = item.quantity * 6;
                                    const finalImageUrl = item.image_url || (item.category_id ? `/images/categories/${item.category_id}.jpg` : null);

                                    return (
                                        <div key={item.id} className="flex gap-3 bg-white rounded-xl p-3 border border-warm-gray-200 shadow-sm">
                                            <div className="w-[72px] h-[72px] flex-shrink-0 rounded-lg overflow-hidden bg-warm-gray-100">
                                                {finalImageUrl ? (
                                                    <img src={finalImageUrl} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-warm-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="font-sans font-600 text-sm text-charcoal-800 leading-snug line-clamp-2 flex-1">{item.title}</p>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-warm-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                                        aria-label="Sil"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {item.selectedVariant && (
                                                    <p className="text-2xs text-warm-gray-500 font-sans">{item.selectedVariant.name}</p>
                                                )}
                                                <div className="flex items-center gap-2 text-2xs font-sans text-warm-gray-600">
                                                    <span>₺{unitPrice.toFixed(2)}/adet</span>
                                                    <span className="text-warm-gray-300">·</span>
                                                    <span>₺{item.packagePrice.toFixed(2)}/paket</span>
                                                </div>
                                                <div className="flex items-center justify-between mt-auto pt-1">
                                                    <div className="flex items-center rounded-lg border border-warm-gray-200 overflow-hidden">
                                                        <button onClick={() => updatePackageQuantity(item.id, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center bg-cream-50 hover:bg-cream-100 transition-colors">
                                                            <Minus className="w-3.5 h-3.5 text-charcoal-600" />
                                                        </button>
                                                        <div className="px-3 flex flex-col items-center min-w-[52px]">
                                                            <span className="font-sans font-700 text-sm text-charcoal-800 leading-none">{item.quantity}</span>
                                                            <span className="text-2xs text-warm-gray-500 font-sans leading-none mt-0.5">{units} adet</span>
                                                        </div>
                                                        <button onClick={() => updatePackageQuantity(item.id, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center bg-cream-50 hover:bg-cream-100 transition-colors">
                                                            <Plus className="w-3.5 h-3.5 text-charcoal-600" />
                                                        </button>
                                                    </div>
                                                    <span className="font-display font-500 text-base text-gold">₺{lineTotal.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {items.length > 0 && (
                        <div
                            className="flex-shrink-0 border-t border-warm-gray-200 bg-white px-5 pt-4 space-y-3"
                            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
                        >
                            <div className="space-y-1.5 text-sm font-sans">
                                <div className="flex justify-between text-warm-gray-600">
                                    <span>{totalPackages} Paket</span>
                                    <span>{totalUnits} Adet</span>
                                </div>
                                <div className="flex justify-between items-baseline pt-1 border-t border-warm-gray-200">
                                    <span className="font-600 text-charcoal-800">Toplam</span>
                                    <span className="font-display text-2xl text-gold">₺{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('form')}
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#17a850] text-white font-sans font-600 text-sm transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp ile Sipariş Ver
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => { if (confirm('Sepet boşaltılsın mı?')) clearCart(); }}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-warm-gray-200 hover:border-red-300 hover:bg-red-50 text-warm-gray-500 hover:text-red-600 font-sans font-500 text-sm transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Sepeti Boşalt
                            </button>
                        </div>
                    )}
                </div>

                {/* ─── FORM ADIMI (MÜŞTERİ BİLGİLERİ) ─────────────────────────────────── */}
                <div className={cn(
                    'flex flex-col h-full transition-all duration-300',
                    step === 'form' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none absolute inset-0'
                )}>
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-warm-gray-200 flex-shrink-0">
                        <button onClick={() => setStep('sepet')} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-warm-gray-100 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-charcoal-600" />
                        </button>
                        <h2 className="font-display text-xl text-charcoal-800">Bilgilerinizi Girin</h2>
                        <button onClick={closeCart} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-warm-gray-100 transition-colors ml-auto">
                            <X className="w-5 h-5 text-charcoal-600" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 space-y-5">
                        <p className="text-sm font-sans text-warm-gray-600 leading-relaxed">
                            Siparişinizi tamamlamak için bilgilerinizi girin. Bu bilgiler satıcıya WhatsApp üzerinden güvenli link ile iletilecektir.
                        </p>

                        {/* Ad Soyad */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-sans font-600 uppercase tracking-widest text-warm-gray-500">
                                <User className="w-3.5 h-3.5" />
                                Ad Soyad
                            </label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Örn: Ahmet Yılmaz"
                                className="w-full px-4 py-3.5 rounded-xl border border-warm-gray-200 bg-cream-50 font-sans text-sm text-charcoal-800 placeholder:text-warm-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                            />
                        </div>

                        {/* Telefon */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-sans font-600 uppercase tracking-widest text-warm-gray-500">
                                <Phone className="w-3.5 h-3.5" />
                                Telefon Numarası
                            </label>
                            <input
                                type="tel"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                placeholder="05XX XXX XX XX"
                                className="w-full px-4 py-3.5 rounded-xl border border-warm-gray-200 bg-cream-50 font-sans text-sm text-charcoal-800 placeholder:text-warm-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                            />
                        </div>

                        {/* Yeni Eklenen Adres Alanı */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-sans font-600 uppercase tracking-widest text-warm-gray-500">
                                <MapPin className="w-3.5 h-3.5" />
                                Teslimat Adresi
                            </label>
                            <textarea
                                value={customerAddress}
                                onChange={(e) => setCustomerAddress(e.target.value)}
                                placeholder="Örn: Merkez Mah. Atatürk Cad. No:5 Daire:3 Şişli / İstanbul"
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 bg-cream-50 font-sans text-sm text-charcoal-800 placeholder:text-warm-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                            />
                        </div>

                        <div className="bg-cream-100 rounded-xl p-4 space-y-2 border border-warm-gray-200">
                            <p className="text-2xs font-sans font-600 uppercase tracking-widest text-warm-gray-500 mb-3">Sipariş Özeti</p>
                            {items.map((item) => {
                                const summaryImageUrl = item.image_url || (item.category_id ? `/images/categories/${item.category_id}.jpg` : null);
                                return (
                                    <div key={item.id} className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2 min-w-0">
                                            {summaryImageUrl && (
                                                <img src={summaryImageUrl} alt={item.title} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-xs font-sans font-500 text-charcoal-800 truncate">{item.title}</p>
                                                {item.selectedVariant && <p className="text-2xs text-warm-gray-500">{item.selectedVariant.name}</p>}
                                                <p className="text-2xs text-warm-gray-600">{item.quantity} paket · {item.quantity * 6} adet</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-sans font-600 text-gold whitespace-nowrap">
                                            ₺{(item.packagePrice * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                );
                            })}
                            <div className="flex justify-between items-center pt-2 border-t border-warm-gray-300 mt-2">
                                <span className="font-sans font-600 text-sm text-charcoal-800">Toplam</span>
                                <span className="font-display text-lg text-gold font-500">₺{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div
                        className="flex-shrink-0 px-5 pt-4 border-t border-warm-gray-200 bg-white space-y-3"
                        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
                    >
                        <button
                            onClick={handleSubmitOrder}
                            disabled={submitting}
                            className={cn(
                                'w-full flex items-center justify-center gap-2 py-4 rounded-xl',
                                'bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#17a850]',
                                'text-white font-sans font-600 text-sm transition-colors',
                                submitting && 'opacity-70 cursor-not-allowed'
                            )}
                        >
                            <MessageCircle className="w-5 h-5" />
                            {submitting ? 'Gönderiliyor…' : 'Siparişi WhatsApp\'ta Tamamla'}
                        </button>
                        <button onClick={() => setStep('sepet')} className="w-full py-3 text-sm font-sans font-500 text-warm-gray-500 hover:text-charcoal-700 transition-colors text-center">
                            ← Sepete Dön
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
}