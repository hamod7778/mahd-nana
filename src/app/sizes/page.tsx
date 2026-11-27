'use client';

import React from 'react';
import SizeCalculator from '@/components/SizeCalculator';
import { Ruler, Sparkles, ArrowRight, Globe, Baby } from 'lucide-react';
import Link from 'next/link';

export default function SizesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-500">
        <Link href="/" className="hover:text-rose-600 transition flex items-center gap-1">
          <ArrowRight className="w-3.5 h-3.5" />
          <span>الرئيسية</span>
        </Link>
        <span>/</span>
        <span className="text-rose-600">نظام القياسات العالمي للمواليد</span>
      </nav>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 rounded-3xl p-6 sm:p-10 border border-rose-100/80 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 text-rose-600 text-xs font-extrabold shadow-sm border border-rose-200/70">
            <Globe className="w-4 h-4 text-rose-500" />
            <span>ميزة جديدة • حسب المعايير العالمية</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
            نظام القياسات الذكي لملابس المواليد والأطفال 📏👶
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            أدخل المقاس المكتوب على القطعة مثل <span className="font-extrabold text-rose-600">0-3</span> أو{' '}
            <span className="font-extrabold text-rose-600">3-6</span> أو{' '}
            <span className="font-extrabold text-rose-600">NB</span>، وسيظهر لك فوراً الطول والعرض الدقيق بالسنتيمتر والإنش حسب النظام العالمي، أو احسب المقاس الأنسب من طول ووزن طفلك.
          </p>

          <div className="flex flex-wrap gap-3 pt-2 text-xs font-bold text-slate-600">
            <span className="inline-flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-rose-100">
              <Ruler className="w-4 h-4 text-rose-500" />
              قياسات الجسم والقطعة مسطحة
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-rose-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              مقارنة الأنظمة (EU / US / UK)
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-rose-100">
              <Baby className="w-4 h-4 text-sky-500" />
              من عمر الخديج حتى 4 سنوات
            </span>
          </div>
        </div>
      </div>

      {/* Main Calculator + Full International Table */}
      <SizeCalculator showFullTable initialSizeQuery="0-3" />
    </div>
  );
}
