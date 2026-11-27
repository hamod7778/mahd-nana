'use client';

import React from 'react';
import { X, Ruler } from 'lucide-react';
import SizeCalculator from './SizeCalculator';
import Link from 'next/link';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSizeQuery?: string;
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  initialSizeQuery = '0-3',
}: SizeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6">
      <div className="relative bg-[#FAF8F5] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-rose-100 animate-fade-in">
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-sm">
              <Ruler className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-black text-base text-slate-900">نظام القياسات العالمي للمواليد</h3>
              <p className="text-[11px] text-slate-500">تحقق من الطول والعرض بدقة قبل إضافة المنتج للسلة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/sizes"
              onClick={onClose}
              className="hidden sm:inline-flex text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition"
            >
              فتح الجدول الكامل ↗
            </Link>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          <SizeCalculator compact initialSizeQuery={initialSizeQuery} />
        </div>
      </div>
    </div>
  );
}
