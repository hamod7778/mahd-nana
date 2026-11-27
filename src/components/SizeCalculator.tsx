'use client';

import React, { useState, useMemo } from 'react';
import {
  INTERNATIONAL_BABY_SIZES,
  BabySizeSpec,
  MeasurementUnit,
  findSizeByQuery,
  findSizeByHeight,
  findSizeByWeight,
  formatRange,
} from '@/lib/sizeSystem';
import {
  Ruler,
  Baby,
  Scale,
  Sparkles,
  Search,
  Info,
  ArrowLeftRight,
  Globe,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface SizeCalculatorProps {
  compact?: boolean;
  showFullTable?: boolean;
  initialSizeQuery?: string;
}

export default function SizeCalculator({
  compact = false,
  showFullTable = false,
  initialSizeQuery = '0-3',
}: SizeCalculatorProps) {
  const [mode, setMode] = useState<'by-size' | 'by-body'>('by-size');
  const [sizeInput, setSizeInput] = useState<string>(initialSizeQuery);
  const [unit, setUnit] = useState<MeasurementUnit>('cm');

  // Reverse calculator inputs (baby height/weight)
  const [babyHeight, setBabyHeight] = useState<string>('60');
  const [babyWeight, setBabyWeight] = useState<string>('5');

  const sizeLookup = useMemo(() => {
    if (mode === 'by-size') {
      return findSizeByQuery(sizeInput);
    }

    const h = parseFloat(babyHeight);
    const w = parseFloat(babyWeight);

    const byH = !isNaN(h) && h > 30 ? findSizeByHeight(h) : null;
    const byW = !isNaN(w) && w > 1 ? findSizeByWeight(w) : null;

    if (byH && byW) {
      // Pick the larger size between height recommendation and weight recommendation for comfort
      const idxH = INTERNATIONAL_BABY_SIZES.findIndex((s) => s.id === byH.id);
      const idxW = INTERNATIONAL_BABY_SIZES.findIndex((s) => s.id === byW.id);
      const chosen = idxH >= idxW ? byH : byW;
      return {
        spec: chosen,
        matchReason:
          idxH === idxW
            ? 'متطابق تماماً مع طول ووزن طفلك'
            : 'تم اختيار المقاس الأنسب والأكثر راحة لطول ووزن طفلك',
      };
    }

    if (byH) {
      return { spec: byH, matchReason: `مناسب لطول الطفل (${h} سم)` };
    }
    if (byW) {
      return { spec: byW, matchReason: `مناسب لوزن الطفل (${w} كجم)` };
    }

    return { spec: null };
  }, [mode, sizeInput, babyHeight, babyWeight]);

  const activeSpec: BabySizeSpec | null = sizeLookup.spec;

  const handleQuickSelect = (spec: BabySizeSpec) => {
    setMode('by-size');
    setSizeInput(spec.code);
  };

  return (
    <div className="space-y-6">
      {/* Control Header & Mode Switcher */}
      <div className="bg-white rounded-3xl border border-rose-100/80 p-5 sm:p-7 salla-card-shadow space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md shadow-rose-200 shrink-0">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl text-slate-900">
                حاسبة القياسات العالمية للمواليد
              </h3>
              <p className="text-xs text-slate-500">
                أدخل المقاس (مثل <span className="font-bold text-rose-600">0-3</span> أو{' '}
                <span className="font-bold text-rose-600">3-6</span> أو{' '}
                <span className="font-bold text-rose-600">68</span>) لمعرفة الطول والعرض العالمي فوراً
              </p>
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition ${
                unit === 'cm'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              سنتيمتر (سم)
            </button>
            <button
              type="button"
              onClick={() => setUnit('inch')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition ${
                unit === 'inch'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              إنش (inch)
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-rose-50/60 p-1.5 rounded-2xl border border-rose-100">
          <button
            type="button"
            onClick={() => setMode('by-size')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
              mode === 'by-size'
                ? 'bg-white text-rose-600 shadow-sm border border-rose-100'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>أدخل المقاس (مثل 0-3)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('by-body')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
              mode === 'by-body'
                ? 'bg-white text-rose-600 shadow-sm border border-rose-100'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <Baby className="w-4 h-4" />
            <span>احسب حسب طول ووزن الطفل</span>
          </button>
        </div>

        {/* Inputs Area */}
        {mode === 'by-size' ? (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                placeholder="اكتب المقاس هنا... مثال: 0-3 أو 3-6 أو 9-12 أو NB أو 68"
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-rose-400 focus:bg-white rounded-2xl py-3.5 pr-12 pl-4 text-slate-900 font-extrabold text-base outline-none transition shadow-inner"
                dir="auto"
              />
              <Search className="w-5 h-5 text-rose-500 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Quick Select Size Pills */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">
                اختيار سريع للمقاسات العالمية:
              </span>
              <div className="flex flex-wrap gap-2">
                {INTERNATIONAL_BABY_SIZES.map((spec) => {
                  const isActive = activeSpec?.id === spec.id;
                  return (
                    <button
                      key={spec.id}
                      type="button"
                      onClick={() => handleQuickSelect(spec)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition border ${
                        isActive
                          ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200 scale-[1.03]'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300 hover:bg-rose-50/50'
                      }`}
                    >
                      {spec.code}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 mb-2">
                <Ruler className="w-4 h-4 text-rose-500" />
                <span>طول الطفل الحالي (سم)</span>
              </label>
              <input
                type="number"
                min={35}
                max={120}
                value={babyHeight}
                onChange={(e) => setBabyHeight(e.target.value)}
                placeholder="مثال: 60"
                className="w-full bg-white border border-slate-200 focus:border-rose-400 rounded-xl px-4 py-2.5 font-extrabold text-slate-900 outline-none"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5 mb-2">
                <Scale className="w-4 h-4 text-amber-500" />
                <span>وزن الطفل الحالي (كجم)</span>
              </label>
              <input
                type="number"
                step="0.5"
                min={1}
                max={25}
                value={babyWeight}
                onChange={(e) => setBabyWeight(e.target.value)}
                placeholder="مثال: 5"
                className="w-full bg-white border border-slate-200 focus:border-rose-400 rounded-xl px-4 py-2.5 font-extrabold text-slate-900 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Live Result Card */}
      {activeSpec ? (
        <div className="bg-gradient-to-br from-white via-rose-50/30 to-amber-50/30 rounded-3xl border-2 border-rose-200/70 p-5 sm:p-8 shadow-lg shadow-rose-100/50 animate-fade-in">
          {/* Top Badge & Title */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-rose-100">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 rounded-full text-[11px] font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{sizeLookup.matchReason || 'المقاس حسب النظام العالمي'}</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-black text-slate-900 pt-1">
                مقاس <span className="text-rose-600">{activeSpec.code}</span>{' '}
                <span className="text-base sm:text-lg font-bold text-slate-500">
                  ({activeSpec.labelAr})
                </span>
              </h4>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-700 shadow-sm">
                🇪🇺 EU: <span className="text-rose-600">{activeSpec.euSize}</span>
              </span>
              <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-700 shadow-sm">
                🇺🇸 US: <span className="text-rose-600">{activeSpec.usSize}</span>
              </span>
              {!compact && (
                <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-700 shadow-sm">
                  🇬🇧 UK: <span className="text-rose-600">{activeSpec.ukSize}</span>
                </span>
              )}
            </div>
          </div>

          {/* Main Grid: Diagram + Length & Width Numbers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
            {/* Visual Garment SVG Diagram showing Length & Width */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-rose-100 shadow-sm flex flex-col items-center justify-center relative">
              <span className="text-[11px] font-extrabold text-slate-400 mb-3 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                توضيح الطول والعرض على القطعة
              </span>

              <svg
                viewBox="0 0 260 240"
                className="w-full max-w-[240px] h-auto select-none"
                aria-label="توضيح قياسات الطول والعرض لملابس المواليد"
              >
                {/* Soft Background Circle */}
                <circle cx="130" cy="120" r="102" fill="#FFF1F2" />

                {/* Baby Onesie / Romper Silhouette */}
                <path
                  d="M90,42 C104,54 156,54 170,42 L205,58 L216,95 L186,105 L180,82 L180,152 C180,175 156,195 145,198 L115,198 C104,195 80,175 80,152 L80,82 L74,105 L44,95 L55,58 Z"
                  fill="#FFFFFF"
                  stroke="#F43F5E"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* Collar trim */}
                <path
                  d="M96,45 C110,60 150,60 164,45"
                  fill="none"
                  stroke="#FDA4AF"
                  strokeWidth="2.5"
                />

                {/* WIDTH (العرض) Horizontal Arrow across Chest */}
                <line
                  x1="82"
                  y1="108"
                  x2="178"
                  y2="108"
                  stroke="#0284C7"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                />
                <polygon points="82,108 90,103 90,113" fill="#0284C7" />
                <polygon points="178,108 170,103 170,113" fill="#0284C7" />

                {/* Width Badge */}
                <rect x="88" y="84" width="84" height="20" rx="6" fill="#0284C7" />
                <text
                  x="130"
                  y="98"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10.5"
                  fontWeight="bold"
                >
                  العرض: {formatRange(activeSpec.garmentWidthMinCm, activeSpec.garmentWidthMaxCm, unit)}
                </text>

                {/* LENGTH (الطول) Vertical Arrow on side */}
                <line
                  x1="212"
                  y1="44"
                  x2="212"
                  y2="196"
                  stroke="#E11D48"
                  strokeWidth="2.5"
                />
                <polygon points="212,44 207,52 217,52" fill="#E11D48" />
                <polygon points="212,196 207,188 217,188" fill="#E11D48" />

                {/* Length Badge */}
                <rect x="135" y="128" width="118" height="22" rx="6" fill="#E11D48" />
                <text
                  x="194"
                  y="143"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10.5"
                  fontWeight="bold"
                >
                  الطول: {formatRange(activeSpec.garmentLengthMinCm, activeSpec.garmentLengthMaxCm, unit)}
                </text>
              </svg>

              <p className="text-[11px] text-slate-400 text-center mt-2">
                * أبعاد القطعة وهي مفرودة بشكل مسطح
              </p>
            </div>

            {/* Key Measurements Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Baby Total Height */}
              <div className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-slate-500">
                    طول الطفل الكلي (النظام العالمي)
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Ruler className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-rose-600">
                  {formatRange(activeSpec.heightMinCm, activeSpec.heightMaxCm, unit)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  طول القطعة التقريبي: {formatRange(activeSpec.garmentLengthMinCm, activeSpec.garmentLengthMaxCm, unit)}
                </p>
              </div>

              {/* Chest / Width */}
              <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-slate-500">
                    العرض ومحيط الصدر (العالمي)
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-sky-600">
                  {formatRange(activeSpec.chestMinCm, activeSpec.chestMaxCm, unit)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  عرض الصدر مسطحاً: {formatRange(activeSpec.garmentWidthMinCm, activeSpec.garmentWidthMaxCm, unit)}
                </p>
              </div>

              {/* Waist */}
              <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-slate-500">محيط الخصر</span>
                  <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-black text-purple-700">
                  {formatRange(activeSpec.waistMinCm, activeSpec.waistMaxCm, unit)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">الفئة العمرية: {activeSpec.ageRangeAr}</p>
              </div>

              {/* Weight */}
              <div className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-slate-500">الوزن المناسب للطفل</span>
                  <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-black text-amber-600">
                  {activeSpec.weightMinKg} - {activeSpec.weightMaxKg} كجم
                </p>
                <p className="text-[11px] text-slate-400 mt-1">حسب متوسط نمو الأطفال العالمي</p>
              </div>
            </div>
          </div>

          {/* Smart Tip Box */}
          <div className="mt-5 bg-white/90 border border-rose-100 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
            <Info className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-extrabold text-rose-600">نصيحة اختيار المقاس: </span>
              {activeSpec.tipAr}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-amber-200 p-8 text-center space-y-2">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h4 className="font-bold text-slate-800">لم نتمكن من مطابقة هذا المقاس</h4>
          <p className="text-xs text-slate-500">
            جرب كتابة مقاس مثل <span className="font-bold text-rose-600">0-3</span> أو{' '}
            <span className="font-bold text-rose-600">3-6</span> أو{' '}
            <span className="font-bold text-rose-600">9-12</span> أو اختر من الأزرار السريعة أعلاه.
          </p>
        </div>
      )}

      {/* Optional Full International Table */}
      {showFullTable && (
        <div className="bg-white rounded-3xl border border-slate-100 salla-card-shadow overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-black text-lg text-slate-900">
                الجدول الشامل للقياسات العالمية للمواليد والأطفال 🌍
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                انقر على أي صف لعرض رسمه التوضيحي وأبعاده التفصيلية أعلاه
              </p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full self-start">
              الوحدة الحالية: {unit === 'cm' ? 'سنتيمتر (سم)' : 'إنش (inch)'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">المقاس</th>
                  <th className="py-3.5 px-4">العمر</th>
                  <th className="py-3.5 px-4">طول الطفل</th>
                  <th className="py-3.5 px-4">طول القطعة</th>
                  <th className="py-3.5 px-4">محيط الصدر</th>
                  <th className="py-3.5 px-4">عرض القطعة (مسطحة)</th>
                  <th className="py-3.5 px-4">الوزن</th>
                  <th className="py-3.5 px-4">الأوروبي (EU)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INTERNATIONAL_BABY_SIZES.map((spec) => {
                  const isRowActive = activeSpec?.id === spec.id;
                  return (
                    <tr
                      key={spec.id}
                      onClick={() => handleQuickSelect(spec)}
                      className={`cursor-pointer transition ${
                        isRowActive
                          ? 'bg-rose-50/90 font-bold text-rose-900'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-black text-rose-600 whitespace-nowrap">
                        {spec.code}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">{spec.ageRangeAr}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {formatRange(spec.heightMinCm, spec.heightMaxCm, unit)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {formatRange(spec.garmentLengthMinCm, spec.garmentLengthMaxCm, unit)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-sky-700 font-bold">
                        {formatRange(spec.chestMinCm, spec.chestMaxCm, unit)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-sky-600">
                        {formatRange(spec.garmentWidthMinCm, spec.garmentWidthMaxCm, unit)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {spec.weightMinKg} - {spec.weightMaxKg} كجم
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold">{spec.euSize}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
