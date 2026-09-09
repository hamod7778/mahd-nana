'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, CreditCard, Send, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Copy, Check, MessageSquare, Truck } from 'lucide-react';
import Link from 'next/link';

interface ExchangeAccount {
  id: string;
  name: string;
  accountName: string;
  accountNumber: string;
  instructions?: string;
  logoUrl?: string;
}

interface Governorate {
  id: string;
  name: string;
  shippingFee: number;
  isActive: boolean;
}

export default function CheckoutPage() {
  const { items, totalAmountSAR, totalItems, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [selectedGovName, setSelectedGovName] = useState<string>('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [exchangeAccounts, setExchangeAccounts] = useState<ExchangeAccount[]>([]);
  const [selectedExchangeId, setSelectedExchangeId] = useState<string>('');
  const [copiedAccNum, setCopiedAccNum] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Order completed state
  const [orderResult, setOrderResult] = useState<{
    orderCode: string;
    whatsappUrl: string;
  } | null>(null);

  // Load exchange accounts and governorates
  useEffect(() => {
    async function loadData() {
      try {
        const [exchRes, govRes] = await Promise.all([
          fetch('/api/exchange-accounts'),
          fetch('/api/governorates'),
        ]);

        if (exchRes.ok) {
          const exchData = await exchRes.json();
          setExchangeAccounts(exchData);
          if (exchData.length > 0) {
            setSelectedExchangeId(exchData[0].id);
          }
        }

        if (govRes.ok) {
          const govData: Governorate[] = await govRes.json();
          const activeGovs = govData.filter((g) => g.isActive !== false);
          setGovernorates(activeGovs);
          if (activeGovs.length > 0) {
            setSelectedGovName(activeGovs[0].name);
          }
        }
      } catch (err) {
        console.error('Failed to load checkout data', err);
      }
    }
    loadData();
  }, []);

  const selectedGov = governorates.find((g) => g.name === selectedGovName);
  const currentShippingFee = selectedGov ? selectedGov.shippingFee : 0;
  const finalTotalSAR = totalAmountSAR + currentShippingFee;

  const selectedAccount = exchangeAccounts.find((a) => a.id === selectedExchangeId);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      setErrorMsg('يرجى تعبئة جميع الحقول المطلوبة (الاسم، رقم الهاتف، العنوان).');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('سلة المشتريات فارغة!');
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        city: selectedGovName || 'صنعاء',
        shippingFee: currentShippingFee,
        address: address.trim(),
        notes: notes.trim(),
        exchangeAccountName: selectedAccount ? selectedAccount.name : 'تحويل صرافة يمني',
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'فشل إنشاء الطلب');
      }

      // Success
      setOrderResult({
        orderCode: result.orderCode,
        whatsappUrl: result.whatsappUrl,
      });

      // Clear cart
      clearCart();
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ غير متوقع أثناء حفظ الطلب.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccNum(text);
    setTimeout(() => setCopiedAccNum(null), 2000);
  };

  // SUCCESS ORDER SCREEN
  if (orderResult) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 salla-card-shadow text-center space-y-6 animate-fade-in">
          
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <span className="text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wider">
              تم تسجيل الطلب بنجاح ⚡
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3 mb-2">
              رقم الطلب الخاص بك: #{orderResult.orderCode}
            </h1>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              تم حجز وتجهيز بيانات طلبك في النظام. الخطوة الأخيرة هي فتح الواتساب وإرسال صورة إيصال التحويل المالي لتأكيد الشحن فوراً.
            </p>
          </div>

          {/* Direct WhatsApp Button */}
          <div className="pt-2">
            <a
              href={orderResult.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-emerald-200 transition transform hover:-translate-y-1 w-full sm:w-auto"
            >
              <MessageSquare className="w-6 h-6 fill-current" />
              <span>الانتقال للواتساب وإرسال صورة الإيصال 📲</span>
            </a>
          </div>

          {/* Important instructions */}
          <div className="bg-amber-50 rounded-2xl p-4 text-right text-xs text-amber-900 border border-amber-200/80 space-y-2">
            <div className="font-extrabold text-sm text-amber-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>تعليمات مهمة لإكمال طلبك:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>افتح الرابط أعلاه للانتقال لمحادثة الواتساب المباشرة للمتجر.</li>
              <li>الرسالة تحتوي بالفعل على كافة تفاصيل طلبك ورقم الطلب (#{orderResult.orderCode}).</li>
              <li>أرفق **صورة إيصال التحويل (السند)** في محادثة الواتساب.</li>
              <li>يمكنك متابعة حالة الطلب في أي وقت من خلال صفحة <Link href="/track" className="underline font-bold text-rose-600">تتبع الطلب</Link>.</li>
            </ol>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-center gap-4">
            <Link
              href={`/track?query=${orderResult.orderCode}`}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              تتبع حالة هذا الطلب الآن 🔍
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/" className="text-xs font-bold text-slate-500 hover:underline">
              العودة للتسوق من جديد 🏠
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // EMPTY CART GUARD
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl p-10 border border-slate-100 salla-card-shadow space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">سلة المشتريات فارغة</h2>
          <p className="text-sm text-slate-500">اختر من المنتجات المتميزة أولاً ثم عد لإكمال الطلب.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-rose-500 text-white font-bold text-sm rounded-xl shadow-md hover:bg-rose-600 transition"
          >
            تصفح منتجات المواليد
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">إتمام الطلب والدفع 💳</h1>
        <p className="text-xs sm:text-sm text-slate-500">أدخل بيانات التوصيل واختر شركة الصرافة للتحويل</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Form & Exchange Selection */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Customer Shipping Info */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 salla-card-shadow space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-extrabold text-lg text-slate-800">بيانات العنوان والتوصيل (اليمن)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم العميل الكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: عبدالله علي المحضار"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:bg-white focus:border-rose-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم الواتساب / الجوال <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="مثال: 771234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:bg-white focus:border-rose-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  المحافظة / المدينة <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedGovName}
                  onChange={(e) => setSelectedGovName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white rounded-xl py-3 px-4 text-sm text-slate-900 outline-none transition font-bold"
                >
                  {governorates.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name} ({g.shippingFee > 0 ? `توصيل: ${g.shippingFee} ر.س` : 'توصيل مجاني'})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  تتغير رسوم التوصيل تلقائياً بملخص الطلب فور اختيار المحافظة 🚚
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  العنوان التفصيلي والحي <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شارع 60 - بجوار مستشفى الأمومة"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm text-slate-800 focus:bg-white focus:border-rose-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ملاحظات التوصيل (اختياري)
              </label>
              <textarea
                rows={2}
                placeholder="أي إرشادات إضافية لمندوب التوصيل..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:bg-white focus:border-rose-500 outline-none transition"
              />
            </div>
          </div>

          {/* 2. Yemeni Exchange Networks Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 salla-card-shadow space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-800">طريقة التحويل عبر الصرافة اليمنية 💳</h3>
                <p className="text-xs text-slate-500">اختر شركة الصرافة التي ترغب بالتحويل عن طريقها بالريال السعودي</p>
              </div>
            </div>

            {/* Exchange Accounts Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exchangeAccounts.map((acc) => {
                const isSelected = selectedExchangeId === acc.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedExchangeId(acc.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                      isSelected
                        ? 'bg-rose-50/60 border-rose-500 ring-2 ring-rose-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border mt-1 flex items-center justify-center ${
                        isSelected ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-extrabold text-sm text-slate-800">{acc.name}</h4>
                      <p className="text-xs text-slate-600 font-medium">اسم المستفيد: {acc.accountName}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                        <span className="text-base font-mono font-bold text-rose-600">
                          {acc.accountNumber}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(acc.accountNumber);
                          }}
                          className="text-[11px] text-slate-500 hover:text-rose-600 font-bold flex items-center gap-1"
                        >
                          {copiedAccNum === acc.accountNumber ? (
                            <span className="text-emerald-600">تم النسخ ✓</span>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> نسخ الحساب
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Account Details Box */}
            {selectedAccount && (
              <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 text-xs text-amber-950 space-y-2">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>بيانات الحساب المختار للتحويل:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
                  <div>
                    <span className="text-slate-500">شركة الصرافة:</span>{' '}
                    <strong className="text-rose-600">{selectedAccount.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">اسم المستفيد:</span>{' '}
                    <strong>{selectedAccount.accountName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">رقم الحساب/الهاتف:</span>{' '}
                    <strong className="font-mono text-slate-900">{selectedAccount.accountNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">العملة:</span>{' '}
                    <strong className="text-emerald-700">الريال السعودي (SAR)</strong>
                  </div>
                </div>
                {selectedAccount.instructions && (
                  <p className="pt-2 border-t border-amber-200/60 text-slate-600 italic">
                    ملاحظة: {selectedAccount.instructions}
                  </p>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Right 1 Col: Summary & Final Button */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 salla-card-shadow space-y-4 sticky top-28">
            <h3 className="font-extrabold text-lg text-slate-800 border-b border-slate-100 pb-3">
              ملخص الطلب ({totalItems} منتجات)
            </h3>

            {/* Itemized List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <img src={product.image} alt={product.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <h5 className="font-bold text-slate-800 line-clamp-1">{product.name}</h5>
                      <span className="text-slate-400">العدد: {quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">{product.price * quantity} ر.س</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-800">{totalAmountSAR} ر.س</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>رسوم التوصيل ({selectedGovName || 'المحافظة'}):</span>
                <span className="text-emerald-600 font-bold">
                  {currentShippingFee > 0 ? `${currentShippingFee} ر.س` : 'مجاني ✨'}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-base">
                <span className="font-black text-slate-900">المبلغ المطلوب تحويله:</span>
                <span className="font-black text-xl text-rose-600">{finalTotalSAR} ر.س</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-rose-200 transition transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري تسجيل الطلب...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>تأكيد الطلب والتحويل للواتساب</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400 leading-relaxed">
              عند إكمال الطلب سيتم تحويلك فوراً إلى الواتساب مع رسالة جاهزة برقم الطلب لتأكيد التحويل وإرفاق السند.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
}
