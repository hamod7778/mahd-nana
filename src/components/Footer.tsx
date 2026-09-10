'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, MapPin, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="مهد ونعناع"
                className="w-10 h-10 rounded-2xl object-cover border border-slate-700 bg-white p-0.5 shadow-sm"
              />
              <span className="font-extrabold text-xl text-white">متجر مهد ونعناع</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              متجر إلكتروني يمني متخصص في توفير كافة مستلزمات الأطفال والمواليد بأعلى معايير الجودة وبأسعار مناسبة بالريال السعودي.
            </p>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>دعم كامل لكافة المحافظات اليمنية</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-base">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-rose-400 transition">الرئيسية</Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-rose-400 transition">تتبع طلبك برقم الطلب</Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-rose-400 transition">إتمام الطلب</Link>
              </li>
            </ul>
          </div>

          {/* Exchange Payment Methods */}
          <div>
            <h4 className="font-bold text-white mb-4 text-base">طرق الدفع المتاحة 💳</h4>
            <p className="text-xs text-slate-400 mb-3">
              نقبل التحويلات المالية عبر جميع شبكات الصرافة اليمنية (بالريال السعودي):
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-200">
              <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-center">
                ✨ بنك القطيبي
              </div>
              <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-center">
                ✨ العمقي وإخوانه
              </div>
              <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-center">
                ✨ بنك الكريمي
              </div>
			  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-center">
                ✨ بنك بن دول
              </div>
			  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-center">
                ✨ بنك امجاد
              </div>
              <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-center">
                ✨ بنك البسيري
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-bold text-white mb-4 text-base">خدمة العملاء والواتساب 📱</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300">خدمة الواتساب المباشرة لاستقبال الفواتير وتأكيد الطلبات</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="text-xs text-slate-300">اليمن (صنعاء، عدن، تعز، إب، حضرموت...)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {year} متجر مهد ونعناع لمستلزمات المواليد. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>تم التطوير بحب  👶</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
