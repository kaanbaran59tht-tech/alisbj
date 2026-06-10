'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCartStore } from '@/hooks/useCart';
import { Plus, Minus, ShoppingBag, Package, X, ChevronRight, Check, Timer, Flame } from 'lucide-react';
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
// 1. ÜRÜN DETAY MODAL BİLEŞENİ (Kapsayıcı İç Yapı)
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
    const [tab, setTab] = useState<'detay' | 'benzer'>('detay');

    useEffect(() => {
        setPackages(1);
        setSelectedColor(COLORS[0]);
        setSelectedVariant(activeProduct.variants?.[0] || null);
        setTab('detay');
    }, [activeProduct]);

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
            .slice(0, 6);
    }, [allProducts, activeProduct]);

    // ESC Tuşu Kontrolü ve iOS Uyumlu Sayfa Scroll Kilidi
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
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

            requestAnimationFrame(() => {
                document.documentElement.style.scrollBehavior = '';
            });
        };
    }, [onClose]);

    const handleAddToCart = () => {
        // Renk ve model varyantını birleştir
        const variantName = selectedVariant
            ? `${selectedColor.name} · ${selectedVariant.name}`
            : selectedColor.name;
        const variantId = selectedVariant
            ? `${selectedColor.id}-${selectedVariant.id}`
            : selectedColor.id;

        addPackage({
            productId: activeProduct.id,
            title: activeProduct.title,
            packagePrice: finalPackagePrice,
            quantity: packages,
            selectedVariant: { id: variantId, name: variantName },
            image_url: activeProduct.image_url,
        });

        toast.success(
            `${activeProduct.title} sepete eklendi — ${packages} Paket · ${selectedColor.name}`,
            { duration: 800, icon: '🛍️' }
        );
        // Modal kapanmıyor — müşteri farklı renk seçip tekrar ekleyebilir
    };

    return (
        <div
            className="fixed inset-0 z-[150] flex items-end md:items-center justify-center bg-[#161616]/60 p-0 md:p-4 backdrop-blur-sm transition-opacity"
        >
            <div
                className="relative bg-[#FDFAF4] flex flex-col w-full rounded-t-2xl md:rounded-2xl max-h-[90dvh] md:max-h-[85vh] md:max-w-4xl shadow-2xl overflow-hidden animate-scale-in"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E0D8] bg-[#F8F4EE]">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-[#E4E0D8] md:hidden" />

                    <div className="text-[11px] font-sans text-[#9E9589] tracking-wider uppercase truncate pr-4">
                        {apCategoryLabel ? (
                            <span className="flex items-center gap-1.5">
                                <span>{(apCategoryLabel as any).icon}</span>
                                <span>{apCategoryLabel.name}</span>
                                <ChevronRight className="w-3 h-3 text-[#9E9589]" />
                                <span className="text-[#161616] font-medium truncate max-w-[180px] sm:max-w-[320px]">{activeProduct.title}</span>
                            </span>
                        ) : (
                            <span>Koleksiyon / {activeProduct.title}</span>
                        )}
                    </div>

                    <button onClick={onClose} className="p-1 rounded-full text-[#9E9589] hover:text-[#161616] transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
                    <div className="w-full md:w-1/2 bg-[#F8F4EE] flex-shrink-0 relative h-[240px] sm:h-[320px] md:h-auto border-b md:border-b-0 md:border-r border-[#E4E0D8]">
                        {activeProduct.image_url ? (
                            <img src={activeProduct.image_url} alt={activeProduct.title} className="w-full h-full object-cover md:absolute md:inset-0" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#9E9589]">
                                <Package className="w-12 h-12 stroke-[1.2]" />
                                <span className="text-xs font-sans tracking-widest uppercase text-center">Görsel Mevcut Değil</span>
                            </div>
                        )}
                        <div className="absolute top-3 left-3 bg-[#161616]/80 text-[#FDFAF4] px-2.5 py-1 rounded text-[10px] font-sans font-medium tracking-widest shadow-sm uppercase">
                            Toptan 12&apos;li Paket
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0 bg-[#FDFAF4]">
                        <div className="flex bg-[#F8F4EE] border-b border-[#E4E0D8] px-6">
                            <button
                                onClick={() => setTab('detay')}
                                className={cn(
                                    'py-3 px-1 font-sans text-xs font-medium uppercase tracking-widest border-b-2 transition-all mr-6 -mb-px',
                                    tab === 'detay' ? 'border-[#D4A829] text-[#161616]' : 'border-transparent text-[#9E9589] hover:text-[#161616]'
                                )}
                            >
                                Modeller &amp; Detay
                            </button>
                            <button
                                onClick={() => setTab('benzer')}
                                className={cn(
                                    'py-3 px-1 font-sans text-xs font-medium uppercase tracking-widest border-b-2 transition-all -mb-px',
                                    tab === 'benzer' ? 'border-[#D4A829] text-[#161616]' : 'border-transparent text-[#9E9589] hover:text-[#161616]'
                                )}
                            >
                                Benzer Ürünler ({apSimilar.length})
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                            {tab === 'detay' ? (
                                <div className="space-y-6 animate-fade-up">
                                    <div className="space-y-1">
                                        <h2 className="font-display text-2xl text-[#161616] leading-tight">{activeProduct.title}</h2>
                                        <p className="text-[10px] font-sans text-[#9E9589] uppercase tracking-widest">KOD: #{activeProduct.id.slice(0, 8)}</p>
                                    </div>

                                    {activeProduct.discountPercentage && timeLeft && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-red-600">
                                                <Flame className="w-4 h-4 animate-pulse" />
                                                <span className="font-sans font-bold text-xs uppercase tracking-wider">Süreli Fırsat - %{activeProduct.discountPercentage} İndirim</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-red-700 bg-red-100 px-2.5 py-1 rounded-md">
                                                <Timer className="w-3.5 h-3.5" />
                                                <span className="font-mono text-xs font-bold">{timeLeft}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-[#F8F4EE] border border-[#E4E0D8] rounded-lg p-3 relative">
                                            <span className="block text-[10px] font-sans text-[#9E9589] uppercase tracking-widest mb-1">Adet Fiyatı</span>
                                            <div className="flex items-end gap-2">
                                                <span className="font-sans text-base font-semibold text-[#161616]">₺{apUnitPrice.toFixed(2)}</span>
                                                {activeProduct.discountPercentage && (
                                                    <span className="text-[10px] font-sans text-[#9E9589] line-through mb-0.5">₺{(activeProduct.price / 12).toFixed(2)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-[#F5EDD3] border border-[#D4A829]/20 rounded-lg p-3 relative">
                                            <span className="block text-[10px] font-sans text-[#D4A829] uppercase tracking-widest mb-1">Paket Fiyatı</span>
                                            <div className="flex items-end gap-2">
                                                <span className="font-sans text-lg font-bold text-[#161616]">₺{finalPackagePrice.toFixed(2)}</span>
                                                {activeProduct.discountPercentage && (
                                                    <span className="text-xs font-sans text-red-500/70 line-through mb-1">₺{activeProduct.price.toFixed(2)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {activeProduct.description && (
                                        <div className="space-y-1.5">
                                            <h4 className="text-[10px] font-sans font-medium uppercase tracking-widest text-[#9E9589]">Ürün Açıklaması</h4>
                                            <p className="text-sm font-sans text-[#161616] opacity-90 leading-relaxed whitespace-pre-line">{activeProduct.description}</p>
                                        </div>
                                    )}

                                    {/* ─── Renk Seçimi (Zorunlu) ───────────────────────────────── */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-sans font-medium uppercase tracking-widest text-[#9E9589] block">
                                            Renk Seçimi <span className="text-[#D4A829]">*</span>
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {COLORS.map((color) => (
                                                <button
                                                    key={color.id}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={cn(
                                                        'flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-sans font-medium transition-all border-2',
                                                        selectedColor.id === color.id
                                                            ? 'border-[#161616] bg-[#F8F4EE] shadow-sm'
                                                            : 'border-[#E4E0D8] bg-[#F8F4EE] hover:border-[#9E9589]'
                                                    )}
                                                >
                                                    <span
                                                        className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm border border-black/10"
                                                        style={{ backgroundColor: color.bg }}
                                                    />
                                                    <span className="text-[#161616]">{color.name}</span>
                                                    {selectedColor.id === color.id && (
                                                        <Check className="w-3.5 h-3.5 text-[#D4A829] ml-0.5" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ─── Model / Varyant Seçimi (DB'den geliyorsa) ───────────── */}
                                    {activeProduct.variants && activeProduct.variants.length > 0 && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-sans font-medium uppercase tracking-widest text-[#9E9589] block">Model Seçimi</label>
                                            <div className="flex flex-wrap gap-2">
                                                {activeProduct.variants.map((v) => (
                                                    <button
                                                        key={v.id}
                                                        onClick={() => setSelectedVariant(v)}
                                                        className={cn(
                                                            'px-3.5 py-1.5 rounded-md text-xs font-sans transition-all flex items-center gap-1.5 border',
                                                            selectedVariant?.id === v.id
                                                                ? 'bg-[#161616] border-[#161616] text-[#FDFAF4] font-medium'
                                                                : 'bg-[#F8F4EE] border-[#E4E0D8] text-[#161616] hover:border-[#9E9589]'
                                                        )}
                                                    >
                                                        {selectedVariant?.id === v.id && <Check className="w-3 h-3 text-[#D4A829]" />}
                                                        {v.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* ─── Paket Miktarı ───────────────────────────────────────── */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-sans font-medium uppercase tracking-widest text-[#9E9589] block">Sipariş Paket Miktarı</label>
                                        <div className="flex items-center rounded-lg border border-[#E4E0D8] overflow-hidden bg-[#F8F4EE] max-w-[180px] shadow-sm">
                                            <button onClick={() => setPackages((p) => Math.max(1, p - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-[#E4E0D8] transition-colors text-[#161616]"><Minus className="w-3.5 h-3.5" /></button>
                                            <div className="flex-1 text-center font-sans font-bold text-sm text-[#161616]">{packages}</div>
                                            <button onClick={() => setPackages((p) => p + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-[#E4E0D8] transition-colors text-[#161616]"><Plus className="w-3.5 h-3.5" /></button>
                                        </div>
                                        <p className="text-[11px] font-sans text-[#9E9589] italic">* Bu üründen toplam <strong>{apTotalUnits} adet</strong> sevk edilecektir.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-up">
                                    {apSimilar.length === 0 ? (
                                        <div className="text-center py-8 text-[#9E9589] font-sans text-xs">Bu kategoride henüz başka benzer ürün bulunmamaktadır.</div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {apSimilar.map((p) => (
                                                <div key={p.id} onClick={() => setActiveProduct(p)} className="group bg-[#F8F4EE] rounded-lg border border-[#E4E0D8] hover:border-[#D4A829] overflow-hidden transition-all p-1.5 flex flex-col h-full cursor-pointer">
                                                    <div className="aspect-product rounded bg-[#FDFAF4] overflow-hidden relative flex-shrink-0">
                                                        {p.image_url ? (
                                                            <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[#9E9589]"><Package className="w-5 h-5" /></div>
                                                        )}
                                                    </div>
                                                    <div className="pt-2 flex-1 flex flex-col justify-between">
                                                        <p className="font-sans font-medium text-[11px] text-[#161616] line-clamp-2 leading-tight group-hover:text-[#D4A829] transition-colors mb-1">{p.title}</p>
                                                        <p className="font-sans text-xs font-semibold text-[#161616]">₺{p.price.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-5 border-t border-[#E4E0D8] bg-[#F8F4EE]">
                            {/* Seçili renk özeti */}
                            <div className="flex items-center gap-2 mb-3 px-1">
                                <span
                                    className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0 shadow-sm"
                                    style={{ backgroundColor: selectedColor.bg }}
                                />
                                <span className="text-xs font-sans text-[#9E9589]">
                                    {selectedColor.name}
                                    {selectedVariant && <span className="text-[#C8C0B4]"> · {selectedVariant.name}</span>}
                                </span>
                            </div>
                            <button onClick={handleAddToCart} className="w-full btn-gold !rounded-lg font-bold tracking-widest flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4 stroke-[2]" />
                                <span>Sepete Ekle · ₺{apTotalPrice.toFixed(2)}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
                        <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1.5 text-[10px] sm:text-[12px] font-sans font-bold tracking-widest uppercase shadow-md flex justify-between items-center z-20">
                            <div className="flex items-center gap-1.5">
                                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
                                <span>GÜNÜN FIRSATI %{discountPercentage}</span>
                            </div>
                            <div className="flex items-center gap-1 bg-black/20 px-1.5 py-0.5 rounded">
                                <Timer className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                <span className="font-mono">{timeLeft}</span>
                            </div>
                        </div>
                    )}

                    <div className={cn("absolute left-3 flex flex-col gap-1.5 z-10", discountPercentage ? "top-10" : "top-3")}>
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

                    <div className="pt-2 border-t border-[#E4E0D8]/50 flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-sans text-[#9E9589] uppercase tracking-widest mb-0.5">Adet Fiyatı</span>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-sans font-medium text-[#9E9589]">₺{unitPrice.toFixed(2)}</span>
                                {discountPercentage && <span className="text-[9px] font-sans text-red-500/60 line-through">₺{(price / 12).toFixed(2)}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[9px] font-sans text-[#D4A829] uppercase tracking-widest mb-0.5">Paket Fiyatı</span>
                            <div className="flex items-center gap-1.5 justify-end">
                                {discountPercentage && <span className="text-[10px] font-sans text-red-500/60 line-through">₺{price.toFixed(2)}</span>}
                                <span className={cn("text-base font-sans font-bold text-[#161616]", discountPercentage && "text-red-600")}>₺{finalPackagePrice.toFixed(2)}</span>
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