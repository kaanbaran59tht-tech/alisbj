'use client';

import Image from 'next/image';
import { useCartStore } from '@/hooks/useCart';
import { ShoppingBag, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ... (Diğer fonksiyonların burada kalsın)

export function CartDrawer() {
    // HATAYI ÇÖZMEK İÇİN: useCartStore'dan değişkenleri burada destructure etmelisin
    const { isOpen, closeCart, items } = useCartStore();

    return (
        <>
            {/* Overlay */}
            <div
                className={cn(
                    'fixed inset-0 bg-black/50 transition-opacity z-modal',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className={cn(
                'fixed right-0 top-0 h-screen w-full max-w-md bg-ivory-300 shadow-xl transform transition-transform duration-300 z-modal flex flex-col',
                isOpen ? 'translate-x-0' : 'translate-x-full'
            )}>
                {/* Header */}
                <div className="p-6 border-b border-warm-gray-200 flex items-center justify-between">
                    <h3 className="font-display text-lg text-charcoal-800">Sepetiniz</h3>
                    <button onClick={closeCart} className="btn-icon hover:bg-red-50 text-red-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* İçerik */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingBag className="w-12 h-12 text-warm-gray-300 mx-auto mb-3" />
                            <p className="text-warm-gray-500 font-sans">Sepet boş</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 bg-ivory rounded-lg hover:shadow-md transition-shadow">
                                {item.image_url && (
                                    <div className="relative w-20 h-20 flex-shrink-0">
                                        <Image
                                            src={item.image_url}
                                            alt={item.title}
                                            width={80}
                                            height={80}
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                                {/* Detaylar */}
                                <div className="flex-1">
                                    <h4 className="font-sans font-semibold text-charcoal-800">{item.title}</h4>
                                    <p className="text-2xs text-warm-gray-500">{item.quantity} Paket</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}