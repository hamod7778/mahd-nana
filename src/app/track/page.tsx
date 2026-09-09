'use client';

import React, { useState, useEffect } from 'react';
import { Search, Compass, CheckCircle2, Clock, Truck, Package, XCircle, AlertCircle, ShoppingBag, ShieldCheck, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  notes?: string;
  exchangeAccountName: string;
  totalAmount: number;
  status: string; // PENDING, VERIFIED, PREPARING, SHIPPED, DELIVERED, CANCELLED
  items: OrderItem[];
  createdAt: string;
}

const STATUS_STEPS = [
  { key: 'PENDING', label: 'قيد الانتظار', desc: 'في انتظار مراجعة إيصال التحويل', icon: Clock },
  { key: 'VERIFIED', label: 'تم تأكيد الدفع', desc: 'تم مطابقة السند بنجاح', icon: CheckCircle2 },
  { key: 'PREPARING', label: 'قيد التجهيز', desc: 'تجهيز المنتجات والتغليف', icon: Package },
  { key: 'SHIPPED', label: 'تم الشحن', desc: 'التسليم لمندوب التوصيل', icon: Truck },
  { key: 'DELIVERED', label: 'تم التوصيل', desc: 'تم التسليم للعميل بنجاح', icon: CheckCircle2 },
];

function formatDate(dateString: string) {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  } catch (e) {
    return dateString;
  }
}

export default function TrackOrderPage() {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Check URL query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('query');
    if (codeParam) {
      setQuery(codeParam);
      fetchOrder(codeParam);
    }
  }, []);

  const fetchOrder = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      setOrders(null);

      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(searchQuery.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'لم يتم العثور على طلب بهاتين البيانات');
      }

      setOrders(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء البحث عن الطلب.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(query);
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'VERIFIED': return 1;
      case 'PREPARING': return 2;
      case 'SHIPPED': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">خدمة تتبع الطلب 🔍</h1>
        <p className="text-slate-500 text-sm">
          أدخل رقم الطلب الخاص بك (مثال: <span className="font-mono text-rose-600 font-bold">#YMN-92841</span>) أو رقم الجوال لمشاهدة حالة طلبك مباشرة.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 salla-card-shadow">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="أدخل رقم الطلب أو رقم الجوال..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white text-slate-800 text-base rounded-2xl py-3.5 pr-11 pl-4 outline-none font-bold transition shadow-inner"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-3.5 px-8 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-rose-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>البحث عن الطلب</span>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold rounded-2xl flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Orders List Result */}
      {orders && orders.length > 0 && (
        <div className="space-y-8 animate-fade-in">
          {orders.map((order) => {
            const currentStepIdx = getStepIndex(order.status);
            const isCancelled = order.status === 'CANCELLED';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 salla-card-shadow space-y-6"
              >
                {/* Order Header Summary */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xl font-black text-rose-600">#{order.orderCode}</span>
                      <span className="text-xs text-slate-400 font-medium">
                        تاريخ الطلب: {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-bold">
                      العميل: {order.customerName} ({order.customerPhone}) - {order.city}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">الإجمالي بالريال السعودي:</span>
                    <span className="font-black text-2xl text-slate-900">{order.totalAmount} ر.س</span>
                  </div>
                </div>

                {/* Cancelled Alert */}
                {isCancelled ? (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-2xl flex items-center gap-3">
                    <XCircle className="w-6 h-6 shrink-0" />
                    <span>تم إلغاء هذا الطلب. يرجى التواصل مع خدمة العملاء عبر الواتساب للاستفسار.</span>
                  </div>
                ) : (
                  /* Visual Stepper Timeline */
                  <div className="py-4">
                    <h4 className="font-extrabold text-sm text-slate-800 mb-6">مراحل تتبع تنفيذ الطلب:</h4>
                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-0">
                      
                      {/* Stepper connecting line */}
                      <div className="hidden md:block absolute top-5 left-10 right-10 h-1 bg-slate-100 -z-0">
                        <div
                          className="h-full bg-rose-500 transition-all duration-500"
                          style={{
                            width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%`,
                          }}
                        />
                      </div>

                      {STATUS_STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        const isCompleted = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div
                            key={step.key}
                            className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2 text-right md:text-center flex-1"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition duration-300 shadow-md ${
                                isCompleted
                                  ? 'bg-rose-500 text-white ring-4 ring-rose-100'
                                  : 'bg-slate-100 text-slate-400'
                              } ${isCurrent ? 'scale-110' : ''}`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>

                            <div>
                              <h5
                                className={`text-xs font-bold ${
                                  isCompleted ? 'text-rose-600' : 'text-slate-400'
                                }`}
                              >
                                {step.label}
                              </h5>
                              <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
                  
                  {/* Delivery & Exchange info */}
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                    <h5 className="font-extrabold text-slate-800 text-sm mb-1 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      عنوان التوصيل والصرافة:
                    </h5>
                    <p className="text-slate-700"><strong>المحافظة:</strong> {order.city}</p>
                    <p className="text-slate-700"><strong>العنوان:</strong> {order.address}</p>
                    <p className="text-slate-700"><strong>الصرافة المختارة:</strong> {order.exchangeAccountName}</p>
                    {order.notes && <p className="text-slate-500 italic">ملاحظات: {order.notes}</p>}
                  </div>

                  {/* Items Purchased */}
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                    <h5 className="font-extrabold text-slate-800 text-sm mb-1 flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-rose-500" />
                      المنتجات المطلوبة:
                    </h5>
                    <ul className="space-y-1.5">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between items-center text-slate-800">
                          <span>{item.productName} <strong className="text-slate-500">(x{item.quantity})</strong></span>
                          <span className="font-bold text-rose-600">{item.price * item.quantity} ر.س</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
