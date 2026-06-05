'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCartStore } from '@/hooks/useCart';
import { Plus, Minus, ShoppingBag, Package, X, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { CATEGORIES } from '@/types/index';
import { cn } from '@/lib/utils';

interface ProductData {
    id: string;
    title: string;
    description?: string;
    price: number;
    image_url?: string;
    category_id?: string;
    variants?: Array<{ id: string; name: string }>;
}

interface ProductCardProps extends ProductData {
    allProducts?: ProductData[];
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
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [tab, setTab] = useState<'detay' | 'benzer'>('detay');

    useEffect(() => {
        setPackages(1);
        setSelectedVariant(activeProduct.variants?.[0] || null);
        setTab('detay');
    }, [activeProduct]);

    const apUnitPrice = useMemo(() => activeProduct.price / 6, [activeProduct.price]);
    const apTotalPrice = useMemo(() => activeProduct.price * packages, [activeProduct.price, packages]);
    const apTotalUnits = useMemo(() => packages * 6, [packages]);

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

        // 1. Ekranı kilitle
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);

            // 2. Kilidi aç
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';

            // 3. KRİTİK DÜZELTME: Yumuşak kaydırmayı geçici olarak kapat ve anında eski yere git
            document.documentElement.style.scrollBehavior = 'auto';
            window.scrollTo(0, scrollY);

            // 4. Smooth ayarını hemen geri yükle ki sitenin diğer yerleri bozulmasın
            requestAnimationFrame(() => {
                document.documentElement.style.scrollBehavior = '';
            });
        };
    }, [onClose]);

    const handleAddToCart = () => {
        addPackage({
            productId: activeProduct.id,
            title: activeProduct.title,
            packagePrice: activeProduct.price,
            quantity: packages,
            selectedVariant,
            image_url: activeProduct.image_url,
        });

        toast.success(
            `${activeProduct.title} eklendi — ${packages} Paket (${apTotalUnits} Adet)`,
            { duration: 2500, icon: '🛍️' }
        );
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[150] flex items-end md:items-center justify-center bg-[#161616]/60 p-0 md:p-4 backdrop-blur-sm transition-opacity"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
                            Toptan 6'lı Paket
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
                                Modeller & Detay
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

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-[#F8F4EE] border border-[#E4E0D8] rounded-lg p-3">
                                            <span className="block text-[10px] font-sans text-[#9E9589] uppercase tracking-widest mb-1">Adet Fiyatı</span>
                                            <span className="font-sans text-base font-semibold text-[#161616]">₺{apUnitPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="bg-[#F5EDD3] border border-[#D4A829]/20 rounded-lg p-3">
                                            <span className="block text-[10px] font-sans text-[#D4A829] uppercase tracking-widest mb-1">Paket Fiyatı</span>
                                            <span className="font-sans text-lg font-bold text-[#161616]">₺{activeProduct.price.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {activeProduct.description && (
                                        <div className="space-y-1.5">
                                            <h4 className="text-[10px] font-sans font-medium uppercase tracking-widest text-[#9E9589]">Ürün Açıklaması</h4>
                                            <p className="text-sm font-sans text-[#161616] opacity-90 leading-relaxed whitespace-pre-line">{activeProduct.description}</p>
                                        </div>
                                    )}

                                    {activeProduct.variants && activeProduct.variants.length > 0 && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-sans font-medium uppercase tracking-widest text-[#9E9589] block">Renk / Varyant Seçimi</label>
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
    const { id, title, description, price, image_url, category_id, variants, allProducts = [] } = props;
    const [packages, setPackages] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const { addPackage } = useCartStore();

    const unitPrice = useMemo(() => price / 6, [price]);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addPackage({
            productId: id,
            title,
            packagePrice: price,
            quantity: packages,
            selectedVariant: variants?.[0] || null,
            image_url,
        });
        toast.success(`${title} eklendi (${packages} Paket)`, { duration: 2000, icon: '🛍️' });
        setPackages(1);
    };

    return (
        <>
            <div
                className="group relative flex flex-col bg-[#F8F4EE] border border-[#E4E0D8] rounded-xl overflow-hidden transition-all duration-500 ease-out cursor-pointer hover:shadow-lg hover:border-[#D4A829]/40 h-full"
                onClick={() => setModalOpen(true)}
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

                    <div className="absolute top-3 left-3 bg-[#161616]/80 backdrop-blur-md text-[#FDFAF4] px-2.5 py-1 rounded-md text-[9px] font-sans font-medium tracking-widest uppercase shadow-2xs">
                        6'lı Paket
                    </div>

                    <div className="absolute top-3 right-3 bg-[#FDFAF4]/90 p-2 rounded-full shadow-2xs opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs">
                        <ChevronRight className="w-3.5 h-3.5 text-[#161616]" />
                    </div>

                    <div
                        className="absolute bottom-0 inset-x-0 bg-[#FDFAF4]/95 backdrop-blur-md p-3 border-t border-[#E4E0D8] translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out hidden md:flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center border border-[#E4E0D8] rounded-lg bg-[#F8F4EE] h-9 flex-1 overflow-hidden shadow-3xs">
                            <button onClick={() => setPackages(p => Math.max(1, p - 1))} className="px-2.5 h-full hover:bg-[#E4E0D8] text-[#161616] transition-colors">
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="flex-1 text-center text-xs font-sans font-bold text-[#161616]">{packages}</span>
                            <button onClick={() => setPackages(p => p + 1)} className="px-2.5 h-full hover:bg-[#E4E0D8] text-[#161616] transition-colors">
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="bg-[#D4A829] hover:bg-[#E8C14E] text-[#161616] h-9 px-3.5 rounded-lg font-sans font-medium text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-3xs"
                        >
                            <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
                            <span>Ekle</span>
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
                            <span className="text-[9px] font-sans text-[#9E9589] uppercase tracking-widest mb-0.5">Adet Maliyeti</span>
                            <span className="text-xs font-sans font-medium text-[#9E9589]">₺{unitPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="text-[9px] font-sans text-[#D4A829] uppercase tracking-widest mb-0.5">Paket Fiyatı</span>
                            <span className="text-base font-sans font-bold text-[#161616]">₺{price.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex md:hidden items-center gap-2 mt-1 pt-1" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center border border-[#E4E0D8] rounded-lg bg-[#FDFAF4] h-8 flex-1 overflow-hidden">
                            <button onClick={() => setPackages(p => Math.max(1, p - 1))} className="px-2 h-full bg-[#F8F4EE] text-[#161616]"><Minus className="w-2.5 h-2.5" /></button>
                            <span className="flex-1 text-center text-xs font-sans font-bold text-[#161616]">{packages}</span>
                            <button onClick={() => setPackages(p => p + 1)} className="px-2 h-full bg-[#F8F4EE] text-[#161616]"><Plus className="w-2.5 h-2.5" /></button>
                        </div>
                        <button onClick={handleAddToCart} className="bg-[#D4A829] p-2 rounded-lg text-[#161616]">
                            <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
                        </button>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <ProductModal
                    initialProduct={{ id, title, description, price, image_url, category_id, variants }}
                    allProducts={allProducts}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    );
}