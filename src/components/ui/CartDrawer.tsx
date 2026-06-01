'use client';

import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/hooks/useCart';
import { ShoppingBag, X, Plus, Minus, MessageCircle, Trash2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// ─── WhatsApp Mesajı ──────────────────────────────────────────────────────────
function buildWhatsAppMessage(items: ReturnType<typeof useCartStore.getState>['items'], total: number) {
    const lines = items.map((item) => {
        const variant = item.selectedVariant ? ` [${item.selectedVariant.name}]` : '';
        const units = item.quantity * 6;
        const subtotal = (item.packagePrice * item.quantity).toFixed(2);
        return `• ${item.title}${variant}\n  ${item.quantity} Paket (${units} Adet) = ₺${subtotal}`;
    });

    const totalUnits = items.reduce((s, i) => s + i.quantity * 6, 0);

    return [
        '🛍️ *TOPTAN SİPARİŞ*',
        '',
        lines.join('\n'),
        '',
        '━━━━━━━━━━━━━━━━━━',
        `📦 *Toplam Adet: ${totalUnits}*`,
        `💰 *Toplam Tutar: ₺${total.toFixed(2)}*`,
    ].join('\n');
}

// ─── Onay Modali ──────────────────────────────────────────────────────────────
function ConfirmModal({
    isOpen,
    items,
    total,
    onClose,
    displayPhone,
}: {
    isOpen: boolean;
    items: ReturnType<typeof useCartStore.getState>['items'];
    total: number;
    onClose: () => void;
    displayPhone: string;
}) {
    if (!isOpen) return null;

    const copyDetails = () => {
        const text = items
            .map((i) => {
                const v = i.selectedVariant ? ` [${i.selectedVariant.name}]` : '';
                return `${i.title}${v}: ${i.quantity} Paket (${i.quantity * 6} Adet) = ₺{(i.packagePrice * i.quantity).toFixed(2)}`;
            })
            .join('\n') + `\n\nToplam: ₺${total.toFixed(2)}`;
        navigator.clipboard.writeText(text).then(() => toast.success('Kopyalandı'));
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 animate-fade-in">
            <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-scale-in overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-warm-gray-200">
                    <h3 className="font-display text-xl text-charcoal-800">✅ Sipariş Gönderildi</h3>
                    <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-warm-gray-100 transition-colors">
                        <X className="w-5 h-5 text-charcoal-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    <p className="text-sm font-sans text-warm-gray-600">
                        WhatsApp'a yönlendirildiniz. Açılmadıysa aşağıdaki detayları
                        <strong> +{displayPhone}</strong> numarasına gönderin.
                    </p>

                    <div className="bg-cream-50 rounded-xl p-4 space-y-3 border border-warm-gray-200">
                        {items.map((item) => (
                            <div key={item.id} className="pb-3 border-b border-warm-gray-200 last:border-0 last:pb-0">
                                <div className="flex justify-between items-start gap-2">
                                    <span className="font-sans font-600 text-sm text-charcoal-800 leading-snug">{item.title}</span>
                                    <span className="font-sans font-600 text-sm text-gold whitespace-nowrap">
                                        ₺{(item.packagePrice * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                                {item.selectedVariant && (
                                    <p className="text-2xs text-warm-gray-500 font-sans mt-0.5">{item.selectedVariant.name}</p>
                                )}
                                <p className="text-2xs text-warm-gray-600 font-sans mt-0.5">
                                    {item.quantity} Paket · {item.quantity * 6} Adet · ₺{(item.packagePrice / 6).toFixed(2)}/adet
                                </p>
                            </div>
                        ))}
                        <div className="flex justify-between items-center pt-2 font-sans font-600">
                            <span className="text-charcoal-800">Toplam</span>
                            <span className="text-xl font-display text-gold">₺{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 flex gap-3 border-t border-warm-gray-200">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-warm-gray-300 font-sans font-600 text-sm text-charcoal-700 hover:bg-warm-gray-50 active:bg-warm-gray-100 transition-colors">
                        Kapat
                    </button>
                    <button onClick={copyDetails} className="flex-1 py-3 rounded-xl bg-gold hover:bg-gold-light active:bg-gold-dark font-sans font-600 text-sm text-charcoal-800 transition-colors">
                        📋 Kopyala
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Ana Sepet Drawer ─────────────────────────────────────────────────────────
export function CartDrawer() {
    const { items, isOpen, closeCart, updatePackageQuantity, removeItem, clearCart, getTotal, getTotalPackages, getTotalUnits } = useCartStore();
    const [showModal, setShowModal] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);

    const total = getTotal();
    const totalPackages = getTotalPackages();
    const totalUnits = getTotalUnits();

    // ─── DOĞRUDAN .ENV DOSYASINDAN GÜVENLİ OKUMA ──────────────────────────────
    const rawPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER || '';
    const phone = rawPhone.replace(/\D/g, '');

    // Body scroll kilitle
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleOrder = () => {
        if (items.length === 0) { toast.error('Sepet boş'); return; }

        if (!phone) {
            toast.error('WhatsApp numarası .env dosyasından okunamadı!');
            return;
        }

        const msg = buildWhatsAppMessage(items, total);
        const link = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
        window.open(link, '_blank');
        setTimeout(() => setShowModal(true), 600);
    };

    const handleModalClose = () => {
        setShowModal(false);
        closeCart();
        clearCart();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={cn(
                    'fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300',
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                )}
                onClick={closeCart}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={cn(
                    'fixed top-0 right-0 z-[100] h-full w-full sm:w-[420px] flex flex-col',
                    'bg-white shadow-2xl',
                    'transition-transform duration-300 ease-in-out',
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                )}
                style={{ height: '100dvh' }}
                aria-label="Alışveriş Sepeti"
                role="dialog"
                aria-modal="true"
            >

                {/* Header */}
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
                        aria-label="Sepeti kapat"
                    >
                        <X className="w-5 h-5 text-charcoal-600" />
                    </button>
                </div>

                {/* Ürün Listesi */}
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

                                return (
                                    <div
                                        key={item.id}
                                        className="flex gap-3 bg-white rounded-xl p-3 border border-warm-gray-200 shadow-sm"
                                    >
                                        {/* Görsel */}
                                        <div className="w-[72px] h-[72px] flex-shrink-0 rounded-lg overflow-hidden bg-warm-gray-100">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-6 h-6 text-warm-gray-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Bilgi */}
                                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-sans font-600 text-sm text-charcoal-800 leading-snug line-clamp-2 flex-1">
                                                    {item.title}
                                                </p>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-warm-gray-400 hover:text-red-500 active:bg-red-100 transition-colors flex-shrink-0"
                                                    aria-label="Sil"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {item.selectedVariant && (
                                                <p className="text-2xs text-warm-gray-500 font-sans">{item.selectedVariant.name}</p>
                                            )}

                                            {/* Fiyatlar */}
                                            <div className="flex items-center gap-2 text-2xs font-sans text-warm-gray-600">
                                                <span>₺{unitPrice.toFixed(2)}/adet</span>
                                                <span className="text-warm-gray-300">·</span>
                                                <span>₺{item.packagePrice.toFixed(2)}/paket</span>
                                            </div>

                                            {/* Kontroller */}
                                            <div className="flex items-center justify-between mt-auto pt-1">
                                                <div className="flex items-center rounded-lg border border-warm-gray-200 overflow-hidden">
                                                    <button
                                                        onClick={() => updatePackageQuantity(item.id, item.quantity - 1)}
                                                        className="w-9 h-9 flex items-center justify-center bg-cream-50 hover:bg-cream-100 active:bg-cream-200 transition-colors"
                                                        aria-label="Azalt"
                                                    >
                                                        <Minus className="w-3.5 h-3.5 text-charcoal-600" />
                                                    </button>
                                                    <div className="px-3 flex flex-col items-center min-w-[52px]">
                                                        <span className="font-sans font-700 text-sm text-charcoal-800 leading-none">
                                                            {item.quantity}
                                                        </span>
                                                        <span className="text-2xs text-warm-gray-500 font-sans leading-none mt-0.5">
                                                            {units} adet
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => updatePackageQuantity(item.id, item.quantity + 1)}
                                                        className="w-9 h-9 flex items-center justify-center bg-cream-50 hover:bg-cream-100 active:bg-cream-200 transition-colors"
                                                        aria-label="Artır"
                                                    >
                                                        <Plus className="w-3.5 h-3.5 text-charcoal-600" />
                                                    </button>
                                                </div>

                                                <span className="font-display font-500 text-base text-gold">
                                                    ₺{lineTotal.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="flex-shrink-0 border-t border-warm-gray-200 bg-white px-5 pt-4 pb-safe-6 space-y-3"
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

                        {/* WhatsApp Butonu */}
                        <button
                            onClick={handleOrder}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#17a850] text-white font-sans font-600 text-sm transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            WhatsApp ile Sipariş Ver
                        </button>

                        {/* Sepeti Boşalt */}
                        <button
                            onClick={() => { if (confirm('Sepet boşaltılsın mı?')) clearCart(); }}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-warm-gray-200 hover:border-red-300 hover:bg-red-50 active:bg-red-100 text-warm-gray-500 hover:text-red-600 font-sans font-500 text-sm transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Sepeti Boşalt
                        </button>
                    </div>
                )}
            </div>

            {/* Onay Modali */}
            <ConfirmModal
                isOpen={showModal}
                items={items}
                total={total}
                onClose={handleModalClose}
                displayPhone={phone || '905452544951'}
            />
        </>
    );
}