'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react'; // X buraya eklendi!
import { CATEGORIES } from '@/types/index';
import { cn } from '@/lib/utils';

interface CategoryDropdownProps {
    onSelectCategory?: (categoryId: string | null) => void;
}

export function CategoryDropdown({ onSelectCategory }: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Dış klik kapatma
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (categoryId: string) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
        onSelectCategory?.(categoryId === selectedCategory ? null : categoryId);
        setIsOpen(false);
    };

    const selectedCategoryName =
        selectedCategory &&
        CATEGORIES.find((c) => c.id === selectedCategory)?.name;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Buton */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'hidden md:flex items-center gap-2 px-4 py-2 rounded-lg',
                    'font-sans text-sm font-500 uppercase tracking-wider',
                    'transition-colors duration-300',
                    selectedCategory
                        ? 'bg-gold/20 text-gold border border-gold/30'
                        : 'hover:bg-cream-200 text-charcoal-700'
                )}
            >
                {selectedCategoryName ? (
                    <>
                        <span>
                            {CATEGORIES.find((c) => c.id === selectedCategory)?.icon}{' '}
                            {selectedCategoryName}
                        </span>
                        <X className="w-4 h-4" />
                    </>
                ) : (
                    <>
                        <span>Kategoriler</span>
                        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
                    </>
                )}
            </button>

            {/* Dropdown Menü */}
            {isOpen && (
                <div
                    className={cn(
                        'absolute top-full left-0 mt-2 w-80 bg-ivory-300 rounded-lg',
                        'border border-warm-gray-200 shadow-lg z-50',
                        'animate-fade-up'
                    )}
                >
                    <div className="grid grid-cols-2 gap-2 p-3">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleSelect(category.id)}
                                className={cn(
                                    'px-3 py-2 rounded-lg text-left text-sm',
                                    'font-sans font-500 transition-colors duration-200',
                                    selectedCategory === category.id
                                        ? 'bg-gold text-charcoal-800'
                                        : 'hover:bg-cream-100 text-charcoal-700'
                                )}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Hepsini Temizle Butonu */}
                    {selectedCategory && (
                        <div className="border-t border-warm-gray-200 p-3">
                            <button
                                onClick={() => handleSelect(selectedCategory)}
                                className="w-full px-3 py-2 rounded-lg bg-cream-100 hover:bg-cream-200 text-charcoal-700 text-sm font-sans font-500 transition-colors"
                            >
                                Filtreyi Temizle
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}