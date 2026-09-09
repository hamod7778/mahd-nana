'use client';

import React, { useState } from 'react';
import { Product, useCart } from '@/context/CartContext';
import { ShoppingBag, Eye, Star, Check } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 salla-card-shadow transition-all duration-300 flex flex-col justify-between">
      {/* Badge Tag */}
      {product.badge && (
        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md">
          {product.badge}
        </div>
      )}

      {/* Quick View Button */}
      {onQuickView && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onQuickView(product);
          }}
          className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500 backdrop-blur-md flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition duration-200"
          title="معاينة سريعة"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}

      {/* Product Image Link */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          {product.category && (
            <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2.5 py-0.5 rounded-full inline-block mb-2">
              {product.category.name}
            </span>
          )}

          {/* Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug line-clamp-2 hover:text-rose-600 transition mb-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-lg text-rose-600 tracking-tight">{product.price}</span>
              <span className="text-xs font-bold text-slate-500">ر.س</span>
            </div>
            {product.oldPrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {product.oldPrice} ر.س
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-200 hover:border-transparent'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>تم الإضافة</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>إضافة للسلة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
