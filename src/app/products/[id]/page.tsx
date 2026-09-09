'use client';

import React, { useState, useEffect } from 'react';
import { Product, useCart } from '@/context/CartContext';
import { ShoppingBag, Check, Plus, Minus, ShieldCheck, Truck, ArrowRight, Heart, Star, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setSelectedImageIndex(0);

          if (data.categoryId) {
            const relRes = await fetch(`/api/products?category=${data.category?.slug || ''}`);
            if (relRes.ok) {
              const relData = await relRes.json();
              setRelatedProducts(relData.filter((p: Product) => p.id !== data.id));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-bold">جاري تحميل تفاصيل المنتج...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-slate-800 mb-2">عذراً، المنتج غير موجود!</h2>
        <p className="text-slate-500 text-sm mb-6">قد يكون تم حذف المنتج أو تغيير رابط الصفحة.</p>
        <Link href="/" className="px-6 py-2.5 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  // Parse images list (supports JSON string or newline-separated string)
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

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isAvailable = product.stock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-500">
        <Link href="/" className="hover:text-rose-600 transition">الرئيسية</Link>
        <span>/</span>
        <span className="text-rose-600">{product.category?.name || 'المنتجات'}</span>
        <span>/</span>
        <span className="text-slate-800 line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-slate-100 salla-card-shadow">
        
        {/* Images Gallery */}
        <div className="space-y-4">
          {/* Main Selected Image */}
          <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group">
            <img
              src={currentMainImage}
              alt={product.name}
              className="w-full h-full object-contain p-4 transition-all duration-300"
            />
            {product.badge && (
              <span className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-md z-10">
                {product.badge}
              </span>
            )}

            {/* Slider Arrow Controls for Main Image */}
            {imagesList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition opacity-80 hover:opacity-100"
                  aria-label="Previous Image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition opacity-80 hover:opacity-100"
                  aria-label="Next Image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails list */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition bg-slate-50 ${
                    selectedImageIndex === idx
                      ? 'border-rose-500 ring-2 ring-rose-200 shadow-md scale-105'
                      : 'border-slate-200 hover:border-rose-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & Purchase Form */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {product.category && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                {product.category.name}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">{product.name}</h1>

            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-rose-600">{product.price}</span>
              <span className="text-sm font-bold text-slate-500">ر.س (الريال السعودي)</span>
              {product.oldPrice && (
                <span className="text-base text-slate-400 line-through mr-3 font-medium">
                  {product.oldPrice} ر.س
                </span>
              )}
            </div>

            <div className="border-t border-b border-slate-100 py-4 my-4">
              <h4 className="font-bold text-slate-800 text-sm mb-2">وصف المنتج:</h4>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Binary Availability Status (متوفر / غير متوفر) */}
            {isAvailable ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl inline-flex border border-emerald-200/60">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>متوفر بالمخزون</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 px-3.5 py-2 rounded-xl inline-flex border border-rose-200/60">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>غير متوفر حالياً</span>
              </div>
            )}
          </div>

          {/* Action Box */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-700">تحديد الكمية المطلوبة:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 transition"
                  disabled={!isAvailable}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-bold text-slate-800 text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 transition"
                  disabled={!isAvailable}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`w-full py-4 px-6 rounded-2xl font-extrabold text-white flex items-center justify-center gap-3 transition shadow-xl text-base disabled:opacity-50 ${
                added
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-rose-200'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-6 h-6" />
                  <span>تم الإضافة إلى سلة المشتريات!</span>
                </>
              ) : !isAvailable ? (
                <span>المنتج غير متوفر حالياً</span>
              ) : (
                <>
                  <ShoppingBag className="w-6 h-6" />
                  <span>إضافة للسلة ({product.price * quantity} ر.س)</span>
                </>
              )}
            </button>

            {/* Payment & Delivery Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="bg-rose-50/60 p-3 rounded-2xl border border-rose-100 flex items-center gap-2.5 text-xs text-rose-900 font-bold">
                <CreditCard className="w-5 h-5 text-rose-500 shrink-0" />
                <span>تحويل للصرافات (النجم، العمقي، الكريمي...)</span>
              </div>
              <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100 flex items-center gap-2.5 text-xs text-amber-900 font-bold">
                <Truck className="w-5 h-5 text-amber-600 shrink-0" />
                <span>توصيل سريع لكافة اليمن</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6">
          <h2 className="text-xl font-black text-slate-800">منتجات ذات صلة 🌸</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
