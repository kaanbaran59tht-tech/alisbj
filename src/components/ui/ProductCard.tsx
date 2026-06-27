'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCartStore } from '@/hooks/useCart';
import { Plus, Minus, ShoppingBag, Package, X, ChevronRight, ChevronLeft, Check, Timer, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORIES } from '@/types/index';
import { cn } from '@/lib/utils';

// ─── Renk Seçenekleri ──────────────────────────────────────────────────────────
const COLORS = [
    { id: 'altin', name: 'Gold Rengi', bg: '#D4A829', ring: '#C49A20' },
    { id: 'gumus', name: 'Silver Rengi', bg: '#A8A8B4', ring: '#8A8A96' },
];

interface ProductData {
    id: string;
    title: string;
    description?: string;
    price: number;
    image_url?: string;
    category_id?: string;
    variants?: Array<{ id: string; name: string }>;
    discountPercentage?: number;
    discountEndTime?: number;
}

interface ProductCardProps extends ProductData {
    allProducts?: ProductData[];
}

// ─── Geri Sayım Hook'u ────────────────────────────────────────────────────────
function useCountdown(endTime?: number) {
    const [timeLeft, setTimeLeft] = useState('');
    useEffect(() => {
        if (!endTime) return;
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;
            if (distance < 0) {
                setTimeLeft('SÜRE DOLDU');
                clearInterval(interval);
                return;
            }
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(interval);
    }, [endTime]);
    return timeLeft;
}

// ──────────────────────────────────────────────────────────────────────────────
// 1. ÜRÜN DETAY MODAL BİLEŞENİ (Kompakt & Mobil Uyumlu)
// ──────────────────────────────────────────────────────────────────────────────
function ProductModal({
    initialProduct,
    allProducts = [],
    onClose,
}: {
    initialProduct: ProductData;
    allProducts?: ProductData[];
    onClose: () => void;
}) {
    const { addPackage } = useCartStore();
    const [activeProduct, setActiveProduct] = useState<ProductData>(initialProduct);
    const [packages, setPackages] = useState(1);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    const [showSimilar, setShowSimilar] = useState(false);

    // ─── Ürün Geçişi (Swipe & Ok Tuşları) ────────────────────────────────────
    const currentIndex = allProducts.findIndex(p => p.id === activeProduct.id);
    const hasNext = currentIndex !== -1 && currentIndex < allProducts.length - 1;
    const hasPrev = currentIndex > 0;
    const goNext = () => { if (hasNext) setActiveProduct(allProducts[currentIndex + 1]); };
    const goPrev = () => { if (hasPrev) setActiveProduct(allProducts[currentIndex - 1]); };

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;
    const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance && hasNext) goNext();
        else if (distance < -minSwipeDistance && hasPrev) goPrev();
    };

    // ─── Ürün değiştiğinde state sıfırla ──────────────────────────────────────
    useEffect(() => {
        setPackages(1);
        setSelectedColor(COLORS[0]);
        setSelectedVariant(activeProduct.variants?.[0] || null);
        setShowSimilar(false);
    }, [activeProduct]);

    // ─── Hesaplamalar ─────────────────────────────────────────────────────────
    const finalPackagePrice = activeProduct.discountPercentage 
        ? activeProduct.price * (1 - activeProduct.discountPercentage / 100) 
        : activeProduct.price;
    const apUnitPrice = useMemo(() => finalPackagePrice / 12, [finalPackagePrice]);
    const apTotalPrice = useMemo(() => finalPackagePrice * packages, [finalPackagePrice, packages]);
    const apTotalUnits = useMemo(() => packages * 12, [packages]);
    const timeLeft = useCountdown(activeProduct.discountEndTime);

    const apCategoryLabel = useMemo(() => {
        return CATEGORIES.find((c) => c.id === activeProduct.category_id);
    }, [activeProduct.category_id]);

    const apSimilar = useMemo(() => {
        return allProducts
            .filter((p) => p.id !== activeProduct.id && p.category_id === activeProduct.category_id)
            .slice(0, 4);
    }, [allProducts, activeProduct]);

    // ─── ESC + Scroll Kilidi ──────────────────────────────────────────────────
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { 
            if (e.key === 'Escape') {
                setIsImageZoomed(prev => { if (prev) return false; onClose(); return prev; });
            }
            if (e.key === 'ArrowRight' && hasNext) goNext();
            if (e.key === 'ArrowLeft' && hasPrev) goPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        const scrollY = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, scrollY);
            requestAnimationFrame(() => { document.documentElement.style.scrollBehavior = ''; });
        };
    }, [onClose, hasNext, hasPrev]);

    // ─── Sepete Ekle ──────────────────────────────────────────────────────────
    const handleAddToCart = () => {
        const variantName = selectedVariant ? `${selectedColor.name} · ${selectedVariant.name}` : selectedColor.name;
        const variantId = selectedVariant ? `${selectedColor.id}-${selectedVariant.id}` : selectedColor.id;
        addPackage({
            productId: activeProduct.id,
            title: activeProduct.title,
            packagePrice: finalPackagePrice,
            quantity: packages,
            selectedVariant: { id: variantId, name: variantName },
            image_url: activeProduct.image_url,
        });
        toast.success(`${activeProduct.title} sepete eklendi — ${packages} Paket · ${selectedColor.name}`, { duration: 800, icon: '🛍️' });
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center bg-[#161616]/60 p-0 md:p-4 backdrop-blur-sm transition-opacity">
            <div className="relative bg-[#FDFAF4] flex flex-col w-full rounded-t-2xl md:rounded-2xl max-h-[92dvh] md:max-h-[88vh] md:max-w-4xl shadow-2xl overflow-hidden animate-scale-in">
                
                {/* ─── Mobil Grab Handle ──────────────────────────────────── */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[#E4E0D8]/80 md:hidden z-10" />

                {/* ─── MASAÜSTÜ: Klasik Yan Yana Düzen ────────────────────── */}
                <div className="hidden md:flex flex-1 overflow-hidden min-h-0">
                    {/* Görsel Alanı */}
                    <div className="w-[45%] bg-[#F8F4EE] flex-shrink-0 relative border-r border-[#E4E0D8] group"
                        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
                    >
                        {activeProduct.image_url ? (
                            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsImageZoomed(true)}>
                                <img src={activeProduct.image_url} alt={activeProduct.title} className="w-full h-full object-cover select-none pointer-events-none" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="bg-white/80 backdrop-blur-md text-[#161616] text-xs font-sans font-medium px-3 py-1.5 rounded-full shadow-sm">Büyüt</span>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#9E9589]">
                                <Package className="w-12 h-12 stroke-[1.2]" />
                                <span className="text-xs font-sans tracking-widest uppercase">Görsel Mevcut Değil</span>
                            </div>
                        )}
                        <div className="absolute top-3 left-3 bg-[#161616]/80 text-[#FDFAF4] px-2 py-0.5 rounded text-[9px] font-sans font-medium tracking-widest uppercase z-10">12&apos;li Paket</div>
                        {hasPrev && (
                            <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-[#161616] shadow-md hover:bg-white/80 transition-colors z-20">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        )}
                        {hasNext && (
                            <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-[#161616] shadow-md hover:bg-white/80 transition-colors z-20">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                        {currentIndex >= 0 && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#161616]/60 text-white/80 text-[10px] font-sans font-medium px-2 py-0.5 rounded-full z-10">
                                {currentIndex + 1} / {allProducts.length}
                            </div>
                        )}
                    </div>

                    {/* Masaüstü Detay Alanı */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Başlık Barı */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E4E0D8] bg-[#F8F4EE]">
                            <div className="flex-1 min-w-0 text-[10px] font-sans text-[#9E9589] tracking-wider uppercase truncate pr-3">
                                {apCategoryLabel ? (
                                    <span className="flex items-center gap-1">
                                        <span>{(apCategoryLabel as any).icon}</span>
                                        <span>{apCategoryLabel.name}</span>
                                        <ChevronRight className="w-3 h-3" />
                                        <span className="text-[#161616] font-medium truncate max-w-[260px]">{activeProduct.title}</span>
                                    </span>
                                ) : <span>Koleksiyon</span>}
                            </div>
                            <button onClick={onClose} className="p-1 rounded-full text-[#9E9589] hover:text-[#161616] transition-colors flex-shrink-0">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Kaydırılabilir İçerik */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0">
                            <div>
                                <h2 className="font-display text-xl text-[#161616] leading-tight">{activeProduct.title}</h2>
                                <p className="text-[10px] font-sans text-[#9E9589] uppercase tracking-widest mt-0.5">KOD: #{activeProduct.id.slice(0, 8)}</p>
                            </div>

                            {activeProduct.discountPercentage && timeLeft && (
                                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-red-600">
                                        <Flame className="w-3.5 h-3.5 animate-pulse" />
                                        <span className="font-sans font-bold text-[11px] uppercase tracking-wider">%{activeProduct.discountPercentage} İndirim</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-0.5 rounded">
                                        <Timer className="w-3 h-3" />
                                        <span className="font-mono text-[11px] font-bold">{timeLeft}</span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="bg-[#F8F4EE] border border-[#E4E0D8] rounded-lg p-2.5">
                                    <span className="block text-[9px] font-sans text-[#9E9589] uppercase tracking-widest mb-0.5">Adet Fiyatı</span>
                                    <div className="flex items-end gap-1.5">
                                        <span className="font-sans text-sm font-semibold text-[#161616]">₺{apUnitPrice.toFixed(2)}</span>
                                        {activeProduct.discountPercentage && (
                                            <span className="text-[9px] font-sans text-[#9E9589] line-through mb-0.5">₺{(activeProduct.price / 12).toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-[#F5EDD3] border border-[#D4A829]/20 rounded-lg p-2.5">
                                    <span className="block text-[9px] font-sans text-[#D4A829] uppercase tracking-widest mb-0.5">Paket Fiyatı</span>
                                    <div className="flex items-end gap-1.5">
                                        <span className="font-sans text-base font-bold text-[#161616]">₺{finalPackagePrice.toFixed(2)}</span>
                                        {activeProduct.discountPercentage && (
                                            <span className="text-[9px] font-sans text-red-500/70 line-through mb-0.5">₺{activeProduct.price.toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {activeProduct.description && (
                                <p className="text-xs font-sans text-[#161616]/80 leading-relaxed whitespace-pre-line">{activeProduct.description}</p>
                            )}

                            {/* Renk */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-sans font-medium uppercase tracking-widest text-[#9E9589] block">Renk <span className="text-[#D4A829]">*</span></label>
                                <div className="flex gap-2">
                                    {COLORS.map((color) => (
                                        <button key={color.id} onClick={() => setSelectedColor(color)}
                                            className={cn('flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-sans font-medium transition-all border',
                                                selectedColor.id === color.id ? 'border-[#161616] bg-[#F8F4EE] shadow-sm' : 'border-[#E4E0D8] bg-[#F8F4EE] hover:border-[#9E9589]'
                                            )}>
                                            <span className="w-4 h-4 rounded-full shadow-sm border border-black/10" style={{ backgroundColor: color.bg }} />
                                            <span className="text-[#161616]">{color.name}</span>
                                            {selectedColor.id === color.id && <Check className="w-3 h-3 text-[#D4A829]" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Varyant */}
                            {activeProduct.variants && activeProduct.variants.length > 0 && (
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-sans font-medium uppercase tracking-widest text-[#9E9589] block">Model</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {activeProduct.variants.map((v) => (
                                            <button key={v.id} onClick={() => setSelectedVariant(v)}
                                                className={cn('px-3 py-1 rounded-md text-xs font-sans transition-all border',
                                                    selectedVariant?.id === v.id ? 'bg-[#161616] border-[#161616] text-[#FDFAF4] font-medium' : 'bg-[#F8F4EE] border-[#E4E0D8] text-[#161616] hover:border-[#9E9589]'
                                                )}>
                                                {v.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Miktar */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-[9px] font-sans font-medium uppercase tracking-widest text-[#9E9589] block mb-1">Paket Adedi</label>
                                    <p className="text-[10px] font-sans text-[#9E9589]">Toplam <strong className="text-[#161616]">{apTotalUnits}</strong> adet</p>
                                </div>
                                <div className="flex items-center rounded-lg border border-[#E4E0D8] overflow-hidden bg-[#F8F4EE] shadow-sm">
                                    <button onClick={() => setPackages((p) => Math.max(1, p - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-[#E4E0D8] transition-colors text-[#161616]"><Minus className="w-3.5 h-3.5" /></button>
                                    <div className="w-10 text-center font-sans font-bold text-sm text-[#161616]">{packages}</div>
                                    <button onClick={() => setPackages((p) => p + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-[#E4E0D8] transition-colors text-[#161616]"><Plus className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>

                            {/* Benzer Ürünler */}
                            {apSimilar.length > 0 && (
                                <div className="border-t border-[#E4E0D8] pt-4">
                                    <p className="text-[9px] font-sans font-medium uppercase tracking-widest text-[#9E9589] mb-2">Benzer Ürünler</p>
                                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                                        {apSimilar.map((p) => (
                                            <div key={p.id} onClick={() => setActiveProduct(p)} className="flex-shrink-0 w-[100px] cursor-pointer group rounded-lg border border-[#E4E0D8] hover:border-[#D4A829] overflow-hidden bg-[#F8F4EE] transition-all">
                                                <div className="aspect-square overflow-hidden">
                                                    {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-[#9E9589]"><Package className="w-4 h-4" /></div>}
                                                </div>
                                                <div className="p-1.5">
                                                    <p className="font-sans text-[10px] font-medium text-[#161616] line-clamp-1 group-hover:text-[#D4A829] transition-colors">{p.title}</p>
                                                    <p className="font-sans text-[10px] font-semibold text-[#9E9589]">₺{p.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sepete Ekle Footer */}
                        <div className="px-5 py-3 border-t border-[#E4E0D8] bg-[#F8F4EE] flex items-center gap-3">
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="w-3 h-3 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: selectedColor.bg }} />
                                <span className="text-[10px] font-sans text-[#9E9589]">{selectedColor.name}</span>
                            </div>
                            <button onClick={handleAddToCart} className="flex-1 btn-gold !rounded-lg font-bold tracking-wider flex items-center justify-center gap-2 !py-2.5">
                                <ShoppingBag className="w-4 h-4 stroke-[2]" />
                                <span>Sepete Ekle · ₺{apTotalPrice.toFixed(2)}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ─── MOBİL: Tek Akış Düzeni ─────────────────────────────── */}
                <div className="flex md:hidden flex-col flex-1 overflow-hidden min-h-0">
                    {/* Mobil Üst: Tam Genişlik Görsel + Overlay Bilgi */}
                    <div className="relative flex-shrink-0 bg-[#F8F4EE]"
                        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
                    >
                        {/* Tam Genişlik Görsel */}
                        <div className="w-full aspect-[4/3] relative">
                            {activeProduct.image_url ? (
                                <div className="w-full h-full cursor-pointer" onClick={() => setIsImageZoomed(true)}>
                                    <img src={activeProduct.image_url} alt={activeProduct.title} className="w-full h-full object-cover select-none pointer-events-none" />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#9E9589]"><Package className="w-10 h-10 stroke-[1.2]" /></div>
                            )}

                            {/* Üst Sol: Badge */}
                            <div className="absolute top-2.5 left-2.5 bg-[#161616]/80 text-[#FDFAF4] px-2 py-0.5 rounded text-[9px] font-sans font-medium tracking-widest uppercase z-10">12&apos;li Paket</div>

                            {/* Üst Sağ: Kapat */}
                            <button onClick={onClose} className="absolute top-2.5 right-2.5 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-20">
                                <X className="w-4.5 h-4.5" />
                            </button>

                            {/* Nav Arrows */}
                            {hasPrev && (
                                <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-[#161616] shadow z-20">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                            )}
                            {hasNext && (
                                <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-[#161616] shadow z-20">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}

                            {/* Ürün Sayacı */}
                            {currentIndex >= 0 && (
                                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-[#161616]/50 text-white/90 text-[9px] font-sans font-medium px-2 py-0.5 rounded-full z-10">{currentIndex + 1} / {allProducts.length}</div>
                            )}

                            {/* Alt Gradient Overlay: Başlık + Fiyat */}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-12 pb-3 px-3.5 z-10">
                                <h2 className="font-display text-lg text-white leading-tight line-clamp-2 drop-shadow-sm">{activeProduct.title}</h2>
                                {activeProduct.discountPercentage && timeLeft && (
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Flame className="w-3 h-3 text-red-400 animate-pulse flex-shrink-0" />
                                        <span className="text-[10px] font-sans font-bold text-red-400 uppercase">%{activeProduct.discountPercentage}</span>
                                        <span className="font-mono text-[10px] font-bold text-white bg-red-500/60 px-1.5 py-0.5 rounded">{timeLeft}</span>
                                    </div>
                                )}
                                <div className="flex items-end justify-between mt-1.5">
                                    <div>
                                        <span className="block text-[8px] font-sans text-white/60 uppercase tracking-widest">Adet</span>
                                        <div className="flex items-center gap-1">
                                            <span className="font-sans text-sm font-bold text-white">₺{apUnitPrice.toFixed(2)}</span>
                                            {activeProduct.discountPercentage && <span className="text-[9px] text-white/50 line-through">₺{(activeProduct.price / 12).toFixed(2)}</span>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-[8px] font-sans text-[#D4A829] uppercase tracking-widest">Paket</span>
                                        <div className="flex items-center gap-1 justify-end">
                                            {activeProduct.discountPercentage && <span className="text-[9px] text-white/50 line-through">₺{activeProduct.price.toFixed(2)}</span>}
                                            <span className={cn("font-sans text-lg font-black", activeProduct.discountPercentage ? "text-red-400" : "text-white")}>₺{finalPackagePrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobil Kaydırılabilir İçerik */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                        {activeProduct.description && (
                            <p className="text-xs font-sans text-[#161616]/80 leading-relaxed">{activeProduct.description}</p>
                        )}

                        {/* Renk Seçimi — Kompakt Daireler */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-sans font-medium uppercase tracking-widest text-[#9E9589] block">Renk Seçimi</label>
                            <div className="flex gap-2.5">
                                {COLORS.map((color) => (
                                    <button key={color.id} onClick={() => setSelectedColor(color)}
                                        className={cn('relative w-8 h-8 rounded-full transition-all border-2 shadow-sm',
                                            selectedColor.id === color.id ? 'border-[#161616] scale-110' : 'border-transparent hover:scale-105'
                                        )}
                                        style={{ backgroundColor: color.bg }}
                                        title={color.name}
                                    >
                                        {selectedColor.id === color.id && (
                                            <Check className="w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md" />
                                        )}
                                    </button>
                                ))}
                                <span className="text-[11px] font-sans text-[#9E9589] self-center ml-1">{selectedColor.name}</span>
                            </div>
                        </div>

                        {/* Varyant Seçimi */}
                        {activeProduct.variants && activeProduct.variants.length > 0 && (
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-sans font-medium uppercase tracking-widest text-[#9E9589] block">Model</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {activeProduct.variants.map((v) => (
                                        <button key={v.id} onClick={() => setSelectedVariant(v)}
                                            className={cn('px-3 py-1 rounded-md text-[11px] font-sans transition-all border',
                                                selectedVariant?.id === v.id ? 'bg-[#161616] border-[#161616] text-[#FDFAF4] font-medium' : 'bg-[#F8F4EE] border-[#E4E0D8] text-[#161616]'
                                            )}>
                                            {v.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Miktar Seçici — Satır İçi */}
                        <div className="flex items-center justify-between bg-[#F8F4EE] rounded-lg border border-[#E4E0D8] p-2.5">
                            <div>
                                <span className="text-[9px] font-sans font-medium uppercase tracking-widest text-[#9E9589]">Paket Adedi</span>
                                <p className="text-[10px] font-sans text-[#9E9589] mt-0.5">Toplam <strong className="text-[#161616]">{apTotalUnits}</strong> adet</p>
                            </div>
                            <div className="flex items-center rounded-lg border border-[#E4E0D8] overflow-hidden bg-white shadow-sm">
                                <button onClick={() => setPackages((p) => Math.max(1, p - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-[#E4E0D8] transition-colors text-[#161616]"><Minus className="w-3.5 h-3.5" /></button>
                                <div className="w-9 text-center font-sans font-bold text-sm text-[#161616]">{packages}</div>
                                <button onClick={() => setPackages((p) => p + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-[#E4E0D8] transition-colors text-[#161616]"><Plus className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>

                        {/* Benzer Ürünler (Yatay Scroll) */}
                        {apSimilar.length > 0 && (
                            <div>
                                <button onClick={() => setShowSimilar(!showSimilar)} className="flex items-center gap-1.5 text-[9px] font-sans font-medium uppercase tracking-widest text-[#9E9589] mb-2">
                                    <span>Benzer Ürünler ({apSimilar.length})</span>
                                    <ChevronRight className={cn("w-3 h-3 transition-transform", showSimilar && "rotate-90")} />
                                </button>
                                {showSimilar && (
                                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 animate-fade-up">
                                        {apSimilar.map((p) => (
                                            <div key={p.id} onClick={() => setActiveProduct(p)} className="flex-shrink-0 w-[90px] cursor-pointer group rounded-lg border border-[#E4E0D8] overflow-hidden bg-[#F8F4EE]">
                                                <div className="aspect-square overflow-hidden">
                                                    {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#9E9589]"><Package className="w-4 h-4" /></div>}
                                                </div>
                                                <div className="p-1.5">
                                                    <p className="font-sans text-[9px] font-medium text-[#161616] line-clamp-1">{p.title}</p>
                                                    <p className="font-sans text-[9px] font-semibold text-[#9E9589]">₺{p.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobil Sabit Sepet Footer */}
                    <div className="px-4 py-3 border-t border-[#E4E0D8] bg-[#F8F4EE] flex-shrink-0 safe-area-bottom">
                        <button onClick={handleAddToCart} className="w-full btn-gold !rounded-xl font-bold tracking-wider flex items-center justify-center gap-2 !py-3 text-sm">
                            <ShoppingBag className="w-4 h-4 stroke-[2]" />
                            <span>Sepete Ekle · ₺{apTotalPrice.toFixed(2)}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Tam Ekran Görsel Zoom ─────────────────────────────────── */}
            {isImageZoomed && activeProduct.image_url && (
                <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsImageZoomed(false)}>
                    <button className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors" onClick={(e) => { e.stopPropagation(); setIsImageZoomed(false); }}>
                        <X className="w-6 h-6 md:w-8 md:h-8" />
                    </button>
                    <img src={activeProduct.image_url} alt={activeProduct.title} className="max-w-full max-h-[90dvh] object-contain rounded-lg shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
}

// ──────────────────────────────────────────────────────────────────────────────
// 2. ANA VİTRİN ÜRÜN KARTI BİLEŞENİ
// ──────────────────────────────────────────────────────────────────────────────
export function ProductCard(props: ProductCardProps) {
    const { id, title, description, price, image_url, category_id, variants, allProducts = [], discountPercentage, discountEndTime } = props;
    const [modalOpen, setModalOpen] = useState(false);

    const finalPackagePrice = discountPercentage ? price * (1 - discountPercentage / 100) : price;
    const unitPrice = useMemo(() => finalPackagePrice / 12, [finalPackagePrice]);
    const timeLeft = useCountdown(discountEndTime);

    const openModal = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setModalOpen(true);
    };

    return (
        <>
            <div
                className={cn(
                    "relative bg-[#FDFAF4] rounded-2xl overflow-hidden group flex flex-col h-full border transition-all duration-300 hover:shadow-xl",
                    discountPercentage ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:border-red-600" : "border-[#E4E0D8] hover:border-[#D4A829]"
                )}
                onClick={openModal}
            >
                <div className="relative bg-[#F5EDD3]/20 aspect-product overflow-hidden flex-shrink-0 w-full">
                    {image_url ? (
                        <img src={image_url} alt={title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#9E9589]">
                            <Package className="w-8 h-8 stroke-[1.2] mb-1" />
                            <span className="text-[10px] font-sans tracking-widest uppercase">Koleksiyon</span>
                        </div>
                    )}

                    {discountPercentage && timeLeft && (
                        <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-red-600 to-red-500 text-white px-2 sm:px-3 py-1.5 text-[9px] sm:text-[12px] font-sans font-bold tracking-widest uppercase shadow-md flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-1 sm:gap-0 z-20">
                            <div className="flex items-center gap-1 sm:gap-1.5">
                                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
                                <span>GÜNÜN FIRSATI %{discountPercentage}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-black/20 px-1.5 py-0.5 rounded">
                                <Timer className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                <span className="font-mono">{timeLeft}</span>
                            </div>
                        </div>
                    )}

                    <div className={cn("absolute left-3 flex flex-col gap-1.5 z-10", discountPercentage ? "top-14 sm:top-10" : "top-3")}>
                        <div className="bg-[#161616]/80 backdrop-blur-md text-[#FDFAF4] px-2.5 py-1 rounded-md text-[9px] font-sans font-medium tracking-widest uppercase shadow-2xs w-fit">
                            12&apos;li Paket
                        </div>
                    </div>

                    <div className="absolute top-3 right-3 bg-[#FDFAF4]/90 p-2 rounded-full shadow-2xs opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs">
                        <ChevronRight className="w-3.5 h-3.5 text-[#161616]" />
                    </div>

                    {/* Desktop hover overlay — ürün modalını açar */}
                    <div
                        className="absolute bottom-0 inset-x-0 bg-[#FDFAF4]/95 backdrop-blur-md p-3 border-t border-[#E4E0D8] translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out hidden md:flex"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={openModal}
                            className="w-full flex items-center justify-center gap-2 bg-[#D4A829] hover:bg-[#E8C14E] active:bg-[#C49A20] text-[#161616] h-9 rounded-lg font-sans font-medium text-xs uppercase tracking-wider transition-all shadow-3xs"
                        >
                            <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
                            <span>Sepete Ekle</span>
                        </button>
                    </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-[#F8F4EE]">
                    <div className="space-y-1">
                        <h3 className="font-sans font-medium text-sm md:text-base text-[#161616] group-hover:text-[#D4A829] transition-colors line-clamp-2 leading-tight tracking-wide">
                            {title}
                        </h3>
                        {description ? (
                            <p className="text-[11px] text-[#9E9589] font-sans line-clamp-1 leading-normal italic">{description}</p>
                        ) : (
                            <p className="text-[11px] text-[#9E9589]/40 font-sans tracking-widest uppercase">Premium Çelik Serisi</p>
                        )}
                    </div>

                    <div className="pt-2 border-t border-[#E4E0D8]/50 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-sans text-[#161616] font-bold uppercase tracking-widest">Adet Fiyatı</span>
                            <div className="flex flex-col items-end justify-center">
                                {discountPercentage && <span className="text-[9px] font-sans text-red-500/80 line-through leading-none mb-0.5">₺{(price / 12).toFixed(2)}</span>}
                                <span className="text-sm font-sans font-bold text-[#161616] leading-none">₺{unitPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-sans text-[#D4A829] font-bold uppercase tracking-widest">Paket Fiyatı</span>
                            <div className="flex flex-col items-end justify-center">
                                {discountPercentage && <span className="text-[9px] font-sans text-red-500/80 line-through leading-none mb-0.5">₺{price.toFixed(2)}</span>}
                                <span className={cn("text-sm font-sans font-black text-[#161616] leading-none", discountPercentage && "text-red-600")}>₺{finalPackagePrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobil: Sepete Ekle butonu → modal açar */}
                    <div className="flex md:hidden mt-1" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={openModal}
                            className="w-full flex items-center justify-center gap-2 bg-[#D4A829] hover:bg-[#E8C14E] active:bg-[#C49A20] text-[#161616] h-9 rounded-lg font-sans font-medium text-xs uppercase tracking-wider transition-all"
                        >
                            <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
                            <span>Sepete Ekle</span>
                        </button>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <ProductModal
                    initialProduct={{ id, title, description, price, image_url, category_id, variants, discountPercentage, discountEndTime }}
                    allProducts={allProducts}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    );
}