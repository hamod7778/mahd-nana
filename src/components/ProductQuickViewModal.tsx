'use client';

import React, { useState } from 'react';
import { Product, useCart } from '@/context/CartContext';
import { X, ShoppingBag, Plus, Minus, Check, ShieldCheck, Truck, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  // Parse images list
  let imagesList: string[] = [];
  try {
    if (product.images) {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        imagesList = parsed;
      }
    }
  } catch (e) {
    if (product.images) {
      imagesList = product.images.split('\n').map((s) => s.trim()).filter(Boolean);
    }
  }

  if (imagesList.length === 0 && product.image) {
    imagesList = [product.image];
  }

  const currentMainImage = imagesList[selectedImageIndex] || product.image;
  const isAvailable = product.stock > 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-fade-in border border-slate-100">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Thumbnails */}
          <div className="bg-slate-50 relative p-6 flex flex-col justify-between">
            <div className="relative aspect-square flex items-center justify-center">
              <img
                src={currentMainImage}
                alt={product.name}
                className="w-full h-full object-contain max-h-72"
              />
              {product.badge && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {imagesList.length > 1 && (
              <div className="flex justify-center gap-2 pt-3 overflow-x-auto">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                      selectedImageIndex === idx ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-200 opacity-60'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              {product.category && (
                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  {product.category.name}
                </span>
              )}
              <h2 className="font-bold text-xl text-slate-800 mt-2 mb-2 leading-snug">{product.name}</h2>
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-3">
                {product.description}
              </p>

              {/* Binary Stock Status */}
              {isAvailable ? (
                <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 mb-3">
                  ✓ متوفر بالمخزون
                </span>
              ) : (
                <span className="inline-block text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60 mb-3">
                  ✕ غير متوفر حالياً
                </span>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-black text-rose-600">{product.price}</span>
                <span className="text-sm font-bold text-slate-500">ر.س (الريال السعودي)</span>
                {product.oldPrice && (
                  <span className="text-sm text-slate-400 line-through mr-2">
                    {product.oldPrice} ر.س
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">الكمية:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition"
                    disabled={!isAvailable}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-slate-800 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 transition"
                    disabled={!isAvailable}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`w-full py-3.5 px-6 rounded-2xl font-extrabold text-white flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-50 ${
                  added ? 'bg-emerald-500' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>تمت الإضافة للسلة بنجاح</span>
                  </>
                ) : !isAvailable ? (
                  <span>غير متوفر حالياً</span>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>إضافة للسلة ({product.price * quantity} ر.س)</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  href={`/products/${product.id}`}
                  onClick={onClose}
                  className="text-xs font-bold text-slate-500 hover:text-rose-600 underline"
                >
                  عرض صفحة التفاصيل الكاملة للمنتج
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
