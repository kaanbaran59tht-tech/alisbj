/* eslint-disable */
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react'; // X buraya eklendi!
import { CATEGORIES } from '@/types/index';
import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/hooks/useCategoryStore';

interface CategoryDropdownProps {
    onSelectCategory?: (categoryId: string | null) => void;
}

export function CategoryDropdown({ onSelectCategory }: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { activeCategory: selectedCategory, setActiveCategory: setSelectedCategory, categories, loadCategories } = useCategoryStore();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

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
        const newCategory = categoryId === selectedCategory ? null : categoryId;
        setSelectedCategory(newCategory);
        onSelectCategory?.(newCategory);
        setIsOpen(false);
        
        // Ürünler bölümüne kaydır
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const selectedCategoryItem =
        selectedCategory &&
        (categories.find((c) => c.id === selectedCategory) || CATEGORIES.find((c) => c.id === selectedCategory));

    const selectedCategoryName = selectedCategoryItem?.name;
    const selectedCategoryIcon = selectedCategoryItem?.icon;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Buton */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'hidden md:flex items-center gap-2 px-4 py-2 rounded-lg',
                    'font-sans text-sm font-medium uppercase tracking-wider',
                    'transition-colors duration-300',
                    selectedCategory
                        ? 'bg-gold/20 text-gold border border-gold/30'
                        : 'hover:bg-cream-200 text-charcoal-700'
                )}
            >
                {selectedCategoryName ? (
                    <>
                        <span className="flex items-center gap-1.5">
                            <span>{selectedCategoryIcon}</span>
                            <span>{selectedCategoryName}</span>
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
                        'animate-fade-up max-h-[70vh] overflow-y-auto'
                    )}
                >
                    <div className="grid grid-cols-2 gap-2 p-3">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleSelect(category.id)}
                                className={cn(
                                    'px-3 py-2 rounded-lg text-left text-sm',
                                    'font-sans font-medium transition-colors duration-200 flex items-center gap-1.5',
                                    selectedCategory === category.id
                                        ? 'bg-gold text-charcoal-800'
                                        : 'hover:bg-cream-100 text-charcoal-700'
                                )}
                            >
                                <span className="flex-shrink-0">{category.icon}</span>
                                <span className="truncate">{category.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Hepsini Temizle Butonu */}
                    {selectedCategory && (
                        <div className="border-t border-warm-gray-200 p-3 pb-1">
                            <button
                                onClick={() => handleSelect(selectedCategory)}
                                className="w-full px-3 py-2 rounded-lg bg-cream-100 hover:bg-cream-200 text-charcoal-700 text-sm font-sans font-medium transition-colors"
                            >
                                Filtreyi Temizle
                            </button>
                        </div>
                    )}

                    {/* İletişim Butonu */}
                    <div className="border-t border-warm-gray-200 p-3 pt-2">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                const contactSection = document.getElementById('contact');
                                if (contactSection) {
                                    contactSection.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-gold text-sm font-sans font-medium transition-colors"
                        >
                            <span>📞</span> İletişim
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}