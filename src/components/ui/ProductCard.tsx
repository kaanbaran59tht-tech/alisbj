'use client';

import { useState } from 'react';
import Image from 'next/image'; // Image bileşeni eklendi
import { useCartStore } from '@/hooks/useCart';
import { Plus, Minus, ShoppingBag, Box } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductCardProps {
    id: string;
    title: string;
    description?: string;
    price: number;
    image_url?: string;
    variants?: Array<{ id: string; name: string }>;
}

export function ProductCard({
    id,
    title,
    description,
    price,
    image_url,
    variants,
}: ProductCardProps) {
    const [packages, setPackages] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(
        variants?.[0] || undefined
    );
    const { addPackage } = useCartStore();

    const handleAddToCart = () => {
        if (packages <= 0) {
            toast.error('Lütfen 1 paket veya daha fazla seçin');
            return;
        }

        addPackage({
            productId: id,
            title,
            packagePrice: price,
            quantity: packages,
            selectedVariant,
            image_url,
        });

        toast.success(
            `✅ ${title} sepete eklendi! ${packages} Paket = ${packages * 6} Adet`
        );
        setPackages(1);
    };

    return (
        <div className="card-product group h-full flex flex-col">
            {/* Görsel */}
            <div className="img-zoom relative aspect-product bg-warm-gray-100 overflow-hidden">
                {image_url ? (
                    <Image
                        src={image_url}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="w-full h-full object-cover group-hover:brightness-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-warm-gray-400">
                        <ShoppingBag className="w-12 h-12 opacity-30" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* İçerik */}
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-display font-400 text-lg text-charcoal-800 group-hover:text-gold transition-colors mb-2">
                    {title}
                </h3>

                {description && (
                    <p className="text-2xs text-warm-gray-500 font-sans line-clamp-2 mb-3">
                        {description}
                    </p>
                )}

                <div className="mb-3 inline-flex items-center gap-1 bg-gold/10 px-3 py-1.5 rounded-full w-fit">
                    <Box className="w-3.5 h-3.5 text-gold" />
                    <span className="text-2xs font-sans font-600 text-gold">
                        1 Paket = 6 Adet
                    </span>
                </div>

                <div className="flex-1" />

                <div className="mb-4">
                    <p className="text-2xs text-warm-gray-500 font-sans mb-1">
                        Paket Fiyatı
                    </p>
                    <span className="font-display text-2xl font-500 text-gold">
                        ₺{price.toFixed(2)}
                    </span>
                </div>

                {/* ... (Varyant ve Paket Seçici kısımları aynı kalabilir) */}

                {variants && variants.length > 0 && (
                    <div className="mb-4">
                        <label className="label-bijou">Seçenek</label>
                        <select
                            value={selectedVariant?.id || ''}
                            onChange={(e) => {
                                const variant = variants.find((v) => v.id === e.target.value);
                                setSelectedVariant(variant);
                            }}
                            className="input-bijou text-sm h-10"
                        >
                            {variants.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-cream-100 rounded-lg p-2">
                        <button
                            onClick={() => setPackages(Math.max(1, packages - 1))}
                            className="inline-flex items-center justify-center w-7 h-7 hover:bg-warm-gray-300 rounded transition-colors"
                        >
                            <Minus className="w-3 h-3 text-charcoal-600" />
                        </button>
                        <div className="flex-1 text-center">
                            <div className="font-sans font-600 text-lg text-charcoal-700">{packages}</div>
                            <div className="text-2xs text-warm-gray-500 leading-tight">({packages * 6} adet)</div>
                        </div>
                        <button
                            onClick={() => setPackages(packages + 1)}
                            className="inline-flex items-center justify-center w-7 h-7 hover:bg-warm-gray-300 rounded transition-colors"
                        >
                            <Plus className="w-3 h-3 text-charcoal-600" />
                        </button>
                    </div>

                    <button onClick={handleAddToCart} className="btn-gold w-full">
                        <ShoppingBag className="w-4 h-4" />
                        Sepete Ekle
                    </button>
                </div>
            </div>
        </div>
    );
}