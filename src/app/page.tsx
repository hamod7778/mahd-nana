'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductQuickViewModal from '@/components/ProductQuickViewModal';
import HeroSlider from '@/components/HeroSlider';
import { Product } from '@/context/CartContext';
import { Sparkles, ShieldCheck, Truck, CreditCard, Heart, ArrowLeft, Search, Baby, Filter, RefreshCw, Compass, Layers, Check, Shirt, Milk, BedDouble, Gamepad2, Gift } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  _count?: { products: number };
}

// Pastel theme presets for category graphic cards
const CATEGORY_THEMES = [
  {
    bgGradient: 'from-rose-100/80 via-pink-50 to-white',
    borderColor: 'border-rose-200/80 hover:border-rose-400',
    activeRing: 'ring-4 ring-rose-400 border-rose-400 bg-rose-50 shadow-xl scale-[1.02]',
    badgeBg: 'bg-rose-500 text-white',
    iconBg: 'bg-rose-500 text-white',
    countBg: 'bg-rose-100 text-rose-700',
    accentColor: 'text-rose-600',
  },
  {
    bgGradient: 'from-sky-100/80 via-blue-50 to-white',
    borderColor: 'border-sky-200/80 hover:border-sky-400',
    activeRing: 'ring-4 ring-sky-400 border-sky-400 bg-sky-50 shadow-xl scale-[1.02]',
    badgeBg: 'bg-sky-500 text-white',
    iconBg: 'bg-sky-500 text-white',
    countBg: 'bg-sky-100 text-sky-700',
    accentColor: 'text-sky-600',
  },
  {
    bgGradient: 'from-amber-100/80 via-orange-50 to-white',
    borderColor: 'border-amber-200/80 hover:border-amber-400',
    activeRing: 'ring-4 ring-amber-400 border-amber-400 bg-amber-50 shadow-xl scale-[1.02]',
    badgeBg: 'bg-amber-500 text-white',
    iconBg: 'bg-amber-500 text-white',
    countBg: 'bg-amber-100 text-amber-700',
    accentColor: 'text-amber-600',
  },
  {
    bgGradient: 'from-purple-100/80 via-pink-50 to-white',
    borderColor: 'border-purple-200/80 hover:border-purple-400',
    activeRing: 'ring-4 ring-purple-400 border-purple-400 bg-purple-50 shadow-xl scale-[1.02]',
    badgeBg: 'bg-purple-500 text-white',
    iconBg: 'bg-purple-500 text-white',
    countBg: 'bg-purple-100 text-purple-700',
    accentColor: 'text-purple-600',
  },
  {
    bgGradient: 'from-emerald-100/80 via-teal-50 to-white',
    borderColor: 'border-emerald-200/80 hover:border-emerald-400',
    activeRing: 'ring-4 ring-emerald-400 border-emerald-400 bg-emerald-50 shadow-xl scale-[1.02]',
    badgeBg: 'bg-emerald-500 text-white',
    iconBg: 'bg-emerald-500 text-white',
    countBg: 'bg-emerald-100 text-emerald-700',
    accentColor: 'text-emerald-600',
  },
  {
    bgGradient: 'from-indigo-100/80 via-blue-50 to-white',
    borderColor: 'border-indigo-200/80 hover:border-indigo-400',
    activeRing: 'ring-4 ring-indigo-400 border-indigo-400 bg-indigo-50 shadow-xl scale-[1.02]',
    badgeBg: 'bg-indigo-500 text-white',
    iconBg: 'bg-indigo-500 text-white',
    countBg: 'bg-indigo-100 text-indigo-700',
    accentColor: 'text-indigo-600',
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [catsRes, prodsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
        ]);

        if (catsRes.ok) {
          const catsData = await catsRes.json();
          setCategories(catsData);
        }

        if (prodsRes.ok) {
          const prodsData = await prodsRes.json();
          setProducts(prodsData);
        }
      } catch (err) {
        console.error('Error loading home page data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, []);

  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'ALL' || prod.categoryId === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. HERO BANNER (Salla-inspired soft baby design) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 rounded-b-3xl sm:rounded-3xl max-w-7xl mx-auto mt-0 sm:mt-6 p-6 sm:p-12 border border-rose-100/80 shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-rose-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-rose-600 text-xs font-bold shadow-sm border border-rose-200">
              <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>أرقى مستلزمات المواليد في اليمن 🇾🇪</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              كل ما يحتاجه طفلك الصغير في مكان واحد 👶✨
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
              تسوق تشكيلة واسعة من أطقم الملابس القطنية، أسرة النوم الهزازة، مستلزمات التغذية والعناية، بأعلى جودة وعملة المتجر الريال السعودي مع التوصيل لجميع المحافظات.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href="#products-section"
                className="px-7 py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-extrabold rounded-2xl shadow-xl shadow-rose-200 transition transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base"
              >
                <span>تصفح المنتجات الآن</span>
                <ArrowLeft className="w-5 h-5" />
              </a>

              <Link
                href="/track"
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl shadow-md border border-slate-200/80 transition flex items-center gap-2 text-sm"
              >
                <Compass className="w-5 h-5 text-rose-500" />
                <span>تتبع طلبك</span>
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-600 font-bold">
              <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-xl border border-rose-100">
                <CreditCard className="w-4 h-4 text-rose-500" /> الدفع عبر الصرافات
              </span>
              <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-xl border border-rose-100">
                <Truck className="w-4 h-4 text-emerald-500" /> توصيل كافة اليمن
              </span>
              <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-xl border border-rose-100">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> قطن عضوي آمن
              </span>
            </div>
          </div>

          {/* Hero Image Slider */}
          <HeroSlider />
        </div>
      </section>

      {/* 2. ENHANCED VISUAL CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
              <Layers className="w-4 h-4" />
              <span>أقسام المتجر الرئيسية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              تسوق حسب الأقسام 🍼✨
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              اختر القسم لتصفح تشكيلة منتجات المواليد المحددة
            </p>
          </div>

          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition shadow-sm ${
              selectedCategory === 'ALL'
                ? 'bg-rose-500 text-white shadow-rose-200'
                : 'bg-white text-slate-700 hover:bg-rose-50 border border-slate-200'
            }`}
          >
            {selectedCategory === 'ALL' ? '✓ تم عرض الكل' : 'عرض كافة المنتجات'}
          </button>
        </div>

        {/* Graphic Categories Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            const theme = CATEGORY_THEMES[idx % CATEGORY_THEMES.length];

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? 'ALL' : cat.id)}
                className={`group relative cursor-pointer rounded-3xl p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between overflow-hidden bg-gradient-to-b ${
                  theme.bgGradient
                } ${
                  isSelected ? theme.activeRing : `${theme.borderColor} hover:-translate-y-1.5 hover:shadow-xl`
                }`}
              >
                {/* Active Selected Checkmark Badge */}
                {isSelected && (
                  <div className={`absolute top-3 right-3 z-10 w-6 h-6 rounded-full ${theme.badgeBg} flex items-center justify-center shadow-md animate-bounce`}>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Category Cover Image Graphic Container */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-md bg-white/80 border border-white p-1">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                      <Baby className="w-10 h-10" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                </div>

                {/* Info Text */}
                <div className="text-center space-y-1.5">
                  <h3 className={`font-extrabold text-sm sm:text-base leading-snug ${theme.accentColor} group-hover:underline decoration-2 underline-offset-4`}>
                    {cat.name}
                  </h3>

                  <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full ${theme.countBg}`}>
                    {cat._count?.products || 0} منتج
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PRODUCTS GRID SECTION */}
      <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              منتجات المواليد المختارة 🛍️
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {searchQuery
                ? `نتائج البحث عن: "${searchQuery}"`
                : 'أجود الخامات والمستلزمات المختارة بعناية'}
            </p>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg font-bold hover:bg-rose-100 transition"
            >
              إلغاء البحث ✕
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <RefreshCw className="w-8 h-8 text-rose-500 animate-spin mx-auto mb-3" />
            <p className="text-slate-500 font-bold text-sm">جاري تحميل تشكيلة المواليد...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-6">
            <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">لم يتم العثور على منتجات</h3>
            <p className="text-slate-500 text-xs mb-4">جرب البحث بكلمات أخرى أو اختر قسماً مختلفاً</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="px-5 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl hover:bg-rose-600 transition"
            >
              عرض كافة المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. YEMENI PAYMENT & EXCHANGE INSTRUCTIONS GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-rose-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-rose-900/40 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-bold">
                <CreditCard className="w-4 h-4" />
                <span>كيفية الطلب والدفع في اليمن</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                سهولة في الطلب والتحويل عبر شبكات الصرافة اليمنية 📲💳
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                بعد إضافة منتجاتك للسلة وتعبئة عنوانك، يمكنك اختيار شبكة الصرافة المناسبة لك (القطيبي، العمقي، الكريمي، البسيري ...). فور إكمال الطلب يتم تحويلك تلقائياً للواتساب برقم طلبك لإرسال صورة إيصال التحويل بالريال السعودي.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <span className="text-rose-400 font-extrabold text-lg block mb-1">1. اختار واطلب</span>
                  <p className="text-xs text-slate-400">أضف المنتجات لسلتك وسجل عنوانك المحافظة والحي.</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <span className="text-rose-400 font-extrabold text-lg block mb-1">2. حول للصرافة</span>
                  <p className="text-xs text-slate-400">حول المبلغ بالريال السعودي لأي شبكة صرافة متاحة.</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <span className="text-rose-400 font-extrabold text-lg block mb-1">3. أرسل بالواتساب</span>
                  <p className="text-xs text-slate-400">انقر لفتح الواتساب وأرسل صورة الإيصال ليتم شحنه فوراً!</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center space-y-4">
              <Compass className="w-12 h-12 text-rose-400 mx-auto" />
              <h3 className="font-bold text-lg text-white">هل قمت بالطلب سابقاً؟</h3>
              <p className="text-xs text-slate-300">
                يمكنك متابعة حالة طلبك ومراحل التجهيز والشحن بكل سهولة باستخدام رقم الطلب.
              </p>
              <Link
                href="/track"
                className="inline-block w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition shadow-lg"
              >
                تتبع حالة الطلب الان
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

    </div>
  );
}
