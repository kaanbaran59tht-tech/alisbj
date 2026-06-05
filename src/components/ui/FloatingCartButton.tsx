'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

export function FloatingCartButton() {
    const { openCart, getTotalUnits } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setMounted(true);
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsVisible(window.scrollY > 300);
                    ticking = false;
                });
                ticking = true;
            }
        };

        // passive: true parametresi tarayıcıya "scroll'u engellemeyeceğim" der ve kaydırmayı yağ gibi akıcı yapar.
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!mounted) return null;
    const itemCount = getTotalUnits();

    return (
        <button
            onClick={openCart}
            className={cn(
                'fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full',
                'bg-[#D4A829] hover:bg-[#E8C14E] text-[#161616]',
                'shadow-lg transition-all duration-300',
                'flex items-center justify-center md:hidden',
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
            )}
            aria-label="Sepeti Aç"
        >
            <ShoppingBag className="w-6 h-6 stroke-[2]" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#161616] text-[#FDFAF4] text-[10px] font-sans font-bold rounded-full flex items-center justify-center animate-pulse">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </button>
    );
}