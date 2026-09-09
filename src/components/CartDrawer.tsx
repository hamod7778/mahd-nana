'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalAmountSAR, totalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 md:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-fade-in">
          
          {/* Header */}
          <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">سلة المشتريات</h3>
                <p className="text-xs text-slate-500">{totalItems} منتجات مختارة</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-white hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-rose-100/60 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="font-bold text-slate-700 text-lg mb-1">السلة فارغة حالياً</h4>
                <p className="text-slate-500 text-sm mb-6">استكشف أرقى ملابس ومستلزمات المواليد وأضفها لسلتك!</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition shadow-lg shadow-rose-200 text-sm"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-rose-200 transition"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl bg-white border border-slate-100"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{product.name}</h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-400 hover:text-rose-500 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-rose-600 font-bold mt-1">
                        {product.price} ر.س <span className="text-slate-400 font-normal">لكل قطعة</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-700">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-extrabold text-sm text-slate-900">
                        {product.price * quantity} ر.س
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-white space-y-4 shadow-lg">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>إجمالي المنتجات ({totalItems}):</span>
                  <span className="font-bold text-slate-800">{totalAmountSAR} ر.س</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>طريقة الشحن والتوصيل:</span>
                  <span className="text-emerald-600 font-bold">تحديد عند الطلب 🚚</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-extrabold text-slate-800">المبلغ الإجمالي (الريال السعودي):</span>
                  <span className="font-black text-xl text-rose-600">{totalAmountSAR} ر.س</span>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 text-amber-800 text-xs flex items-center gap-2 border border-amber-200/60">
                <ShieldCheck className="w-5 h-5 shrink-0 text-amber-600" />
                <span>الدفع يتم عبر التحويل للصرافات المحلية (النجم، العمقي، الكريمي، البسيري...).</span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-extrabold rounded-2xl shadow-xl shadow-rose-200 hover:from-rose-600 hover:to-rose-700 transition flex items-center justify-center gap-2 text-base"
              >
                <span>متابعة الشراء وإتمام الطلب</span>
                <ArrowRight className="w-5 h-5 rotate-180" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
