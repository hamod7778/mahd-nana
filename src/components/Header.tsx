'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Truck, Baby, Compass, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100/60 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white text-xs py-2 px-4 text-center font-bold tracking-wide flex items-center justify-center gap-2">
        <Truck className="w-4 h-4 animate-bounce" />
        <span>🚚 توصيل لاغلب المحافظات اليمنيه | 💳 الدفع بالتحويل لجميع شبكات الصرافة بالريال السعودي</span>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-rose-100 group-hover:scale-105 transition transform bg-white border border-rose-100 p-0.5">
              <img
                src="/logo.jpg"
                alt="متجر مهد ونعناع"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl text-slate-900 tracking-tight">مهد ونعناع</span>
                <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">اليمن</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">أرقى مستلزمات الأطفال والمواليد</p>
            </div>
          </Link>

          {/* Search Input Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="ابحث عن ملابس، سرير، رضاعات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white text-slate-800 text-sm rounded-full py-2.5 pr-11 pl-4 outline-none transition shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition shadow-md"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Action Links & Cart */}
          <div className="flex items-center gap-3">
            {/* Order Tracking Button */}
            <Link
              href="/track"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition border border-rose-200/60"
            >
              <Compass className="w-4 h-4 text-rose-500" />
              <span>تتبع طلبك</span>
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-200 transition active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">السلة</span>
              {mounted && totalItems > 0 && (
                <span className="bg-white text-rose-600 font-extrabold text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="ابحث عن منتجات المواليد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 text-slate-800 text-sm rounded-full py-2 pr-10 pl-4 outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-3 animate-fade-in">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 px-3 rounded-lg text-slate-700 font-bold hover:bg-rose-50 hover:text-rose-600"
          >
            الرئيسية
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-rose-600 font-bold bg-rose-50"
          >
            <Compass className="w-4 h-4" />
            تتبع طلبك برقم الطلب
          </Link>
        </div>
      )}
    </header>
  );
}
