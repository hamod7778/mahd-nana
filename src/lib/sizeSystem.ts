export interface BabySizeSpec {
  id: string;
  code: string; // e.g. "0-3", "3-6", "NB"
  aliases: string[]; // search/input matches
  labelAr: string;
  ageRangeAr: string;
  monthsMin: number;
  monthsMax: number;
  // Body measurements (International WHO/ISO-inspired apparel standard)
  heightMinCm: number;
  heightMaxCm: number;
  chestMinCm: number;
  chestMaxCm: number;
  waistMinCm: number;
  waistMaxCm: number;
  weightMinKg: number;
  weightMaxKg: number;
  // Garment flat measurements (approximate standard onesie/top)
  garmentLengthMinCm: number;
  garmentLengthMaxCm: number;
  garmentWidthMinCm: number; // half-chest flat width
  garmentWidthMaxCm: number;
  // International codes
  euSize: string;
  usSize: string;
  ukSize: string;
  tipAr: string;
}

export const INTERNATIONAL_BABY_SIZES: BabySizeSpec[] = [
  {
    id: 'preemie',
    code: 'خديج (P)',
    aliases: ['p', 'preemie', 'premature', 'خديج', '44', '44-50', '00'],
    labelAr: 'خديج / ولادة مبكرة',
    ageRangeAr: 'أقل من شهر (وزن منخفض)',
    monthsMin: -1,
    monthsMax: 0,
    heightMinCm: 44,
    heightMaxCm: 50,
    chestMinCm: 35,
    chestMaxCm: 38,
    waistMinCm: 35,
    waistMaxCm: 38,
    weightMinKg: 1.8,
    weightMaxKg: 3.0,
    garmentLengthMinCm: 31,
    garmentLengthMaxCm: 34,
    garmentWidthMinCm: 18,
    garmentWidthMaxCm: 20,
    euSize: '44 - 50',
    usSize: 'Preemie (P)',
    ukSize: 'Tiny Baby',
    tipAr: 'مناسب للأطفال الخدج أو ذوي الوزن الصغير جداً عند الولادة.',
  },
  {
    id: 'nb',
    code: 'NB (0-1)',
    aliases: ['nb', 'newborn', '0-1', '0 - 1', '0', 'حديث الولادة', 'مولود جديد', '50', '50-56'],
    labelAr: 'حديث الولادة',
    ageRangeAr: 'من الولادة حتى شهر واحد',
    monthsMin: 0,
    monthsMax: 1,
    heightMinCm: 50,
    heightMaxCm: 56,
    chestMinCm: 39,
    chestMaxCm: 41,
    waistMinCm: 39,
    waistMaxCm: 41,
    weightMinKg: 3.0,
    weightMaxKg: 4.5,
    garmentLengthMinCm: 35,
    garmentLengthMaxCm: 37,
    garmentWidthMinCm: 20,
    garmentWidthMaxCm: 22,
    euSize: '50 - 56',
    usSize: 'NB',
    ukSize: 'Newborn (Up to 1m)',
    tipAr: 'إذا كان وزن المولود المتوقع أكثر من 4 كجم، ننصح باختيار مقاس 0-3 ليدوم فترة أطول.',
  },
  {
    id: '0-3',
    code: '0-3',
    aliases: ['0-3', '0 - 3', '0-3m', '0-3 أشهر', '0 الى 3', '0 إلى 3', '3m', '56', '62', '56-62'],
    labelAr: 'من 0 إلى 3 أشهر',
    ageRangeAr: 'من الولادة حتى 3 أشهر',
    monthsMin: 0,
    monthsMax: 3,
    heightMinCm: 56,
    heightMaxCm: 62,
    chestMinCm: 41,
    chestMaxCm: 44,
    waistMinCm: 41,
    waistMaxCm: 43,
    weightMinKg: 3.5,
    weightMaxKg: 6.0,
    garmentLengthMinCm: 37,
    garmentLengthMaxCm: 40,
    garmentWidthMinCm: 22,
    garmentWidthMaxCm: 24,
    euSize: '56 - 62',
    usSize: '0-3M / 3M',
    ukSize: '0-3 Months',
    tipAr: 'المقاس الأكثر طلباً لتجهيز المولود الجديد لأنه يناسب معظم المواليد خلال الأشهر الثلاثة الأولى.',
  },
  {
    id: '3-6',
    code: '3-6',
    aliases: ['3-6', '3 - 6', '3-6m', '3-6 أشهر', '3 الى 6', '3 إلى 6', '6m', '62-68', '68'],
    labelAr: 'من 3 إلى 6 أشهر',
    ageRangeAr: 'من 3 إلى 6 أشهر',
    monthsMin: 3,
    monthsMax: 6,
    heightMinCm: 62,
    heightMaxCm: 68,
    chestMinCm: 44,
    chestMaxCm: 47,
    waistMinCm: 43,
    waistMaxCm: 45,
    weightMinKg: 6.0,
    weightMaxKg: 8.0,
    garmentLengthMinCm: 40,
    garmentLengthMaxCm: 43,
    garmentWidthMinCm: 24,
    garmentWidthMaxCm: 25.5,
    euSize: '62 - 68',
    usSize: '3-6M / 6M',
    ukSize: '3-6 Months',
    tipAr: 'مناسب لمرحلة النمو السريع؛ تأكد من طول الطفل بالسم قبل الطلب إذا كان طويل القامة.',
  },
  {
    id: '6-9',
    code: '6-9',
    aliases: ['6-9', '6 - 9', '6-9m', '6-9 أشهر', '6 الى 9', '6 إلى 9', '9m', '68-74', '74'],
    labelAr: 'من 6 إلى 9 أشهر',
    ageRangeAr: 'من 6 إلى 9 أشهر',
    monthsMin: 6,
    monthsMax: 9,
    heightMinCm: 68,
    heightMaxCm: 74,
    chestMinCm: 47,
    chestMaxCm: 49,
    waistMinCm: 45,
    waistMaxCm: 47,
    weightMinKg: 8.0,
    weightMaxKg: 9.5,
    garmentLengthMinCm: 43,
    garmentLengthMaxCm: 46,
    garmentWidthMinCm: 25.5,
    garmentWidthMaxCm: 27,
    euSize: '68 - 74',
    usSize: '6-9M / 9M',
    ukSize: '6-9 Months',
    tipAr: 'مرحلة الجلوس والحبو؛ يفضل الملابس القطنية المريحة ذات العرض الكافي للحفاض.',
  },
  {
    id: '9-12',
    code: '9-12',
    aliases: ['9-12', '9 - 12', '9-12m', '9-12 شهر', '6-12', '12m', '74-80', '80'],
    labelAr: 'من 9 إلى 12 شهراً',
    ageRangeAr: 'من 9 إلى 12 شهراً (سنة)',
    monthsMin: 9,
    monthsMax: 12,
    heightMinCm: 74,
    heightMaxCm: 80,
    chestMinCm: 49,
    chestMaxCm: 51,
    waistMinCm: 47,
    waistMaxCm: 49,
    weightMinKg: 9.5,
    weightMaxKg: 11.0,
    garmentLengthMinCm: 46,
    garmentLengthMaxCm: 49,
    garmentWidthMinCm: 27,
    garmentWidthMaxCm: 28.5,
    euSize: '74 - 80',
    usSize: '9-12M / 12M',
    ukSize: '9-12 Months',
    tipAr: 'إذا كان طفلك يبدأ بالمشي ووزنه قريب من 11 كجم، فمقاس 12-18 سيكون أكثر راحة.',
  },
  {
    id: '12-18',
    code: '12-18',
    aliases: ['12-18', '12 - 18', '12-18m', '12-18 شهر', '18m', '80-86', '86', 'سنة ونص'],
    labelAr: 'من 12 إلى 18 شهراً',
    ageRangeAr: 'سنة إلى سنة ونصف',
    monthsMin: 12,
    monthsMax: 18,
    heightMinCm: 80,
    heightMaxCm: 86,
    chestMinCm: 51,
    chestMaxCm: 53,
    waistMinCm: 49,
    waistMaxCm: 50.5,
    weightMinKg: 11.0,
    weightMaxKg: 12.5,
    garmentLengthMinCm: 49,
    garmentLengthMaxCm: 52,
    garmentWidthMinCm: 28.5,
    garmentWidthMaxCm: 30,
    euSize: '80 - 86',
    usSize: '12-18M / 18M',
    ukSize: '12-18 Months',
    tipAr: 'مناسب للأطفال في بداية المشي والحركة النشطة.',
  },
  {
    id: '18-24',
    code: '18-24',
    aliases: ['18-24', '18 - 24', '18-24m', '18-24 شهر', '24m', '2t', '86-92', '92', 'سنتين'],
    labelAr: 'من 18 إلى 24 شهراً',
    ageRangeAr: 'سنة ونصف إلى سنتين',
    monthsMin: 18,
    monthsMax: 24,
    heightMinCm: 86,
    heightMaxCm: 92,
    chestMinCm: 53,
    chestMaxCm: 55,
    waistMinCm: 50.5,
    waistMaxCm: 52,
    weightMinKg: 12.5,
    weightMaxKg: 14.0,
    garmentLengthMinCm: 52,
    garmentLengthMaxCm: 55,
    garmentWidthMinCm: 30,
    garmentWidthMaxCm: 31.5,
    euSize: '86 - 92',
    usSize: '18-24M / 24M / 2T',
    ukSize: '1.5 - 2 Years',
    tipAr: 'يعادل مقاس سنتين (2T) في الكثير من الماركات العالمية.',
  },
  {
    id: '2-3y',
    code: '2-3 سنوات',
    aliases: ['2-3', '2 - 3', '2-3y', '2-3 سنوات', '24-36', '3t', '92-98', '98', '3 سنوات'],
    labelAr: 'من سنتين إلى 3 سنوات',
    ageRangeAr: 'سنتان إلى 3 سنوات',
    monthsMin: 24,
    monthsMax: 36,
    heightMinCm: 92,
    heightMaxCm: 98,
    chestMinCm: 55,
    chestMaxCm: 57,
    waistMinCm: 52,
    waistMaxCm: 53.5,
    weightMinKg: 14.0,
    weightMaxKg: 16.0,
    garmentLengthMinCm: 55,
    garmentLengthMaxCm: 58,
    garmentWidthMinCm: 31.5,
    garmentWidthMaxCm: 33,
    euSize: '92 - 98',
    usSize: '2T - 3T',
    ukSize: '2 - 3 Years',
    tipAr: 'مناسب لمرحلة الحضانة المبكرة؛ يراعى ترك مساحة مريحة للطفل عند الحركة.',
  },
  {
    id: '3-4y',
    code: '3-4 سنوات',
    aliases: ['3-4', '3 - 4', '3-4y', '3-4 سنوات', '4t', '98-104', '104', '4 سنوات'],
    labelAr: 'من 3 إلى 4 سنوات',
    ageRangeAr: '3 إلى 4 سنوات',
    monthsMin: 36,
    monthsMax: 48,
    heightMinCm: 98,
    heightMaxCm: 104,
    chestMinCm: 57,
    chestMaxCm: 59,
    waistMinCm: 53.5,
    waistMaxCm: 55,
    weightMinKg: 16.0,
    weightMaxKg: 18.0,
    garmentLengthMinCm: 58,
    garmentLengthMaxCm: 62,
    garmentWidthMinCm: 33,
    garmentWidthMaxCm: 34.5,
    euSize: '98 - 104',
    usSize: '3T - 4T',
    ukSize: '3 - 4 Years',
    tipAr: 'مثالي للأطفال من 3 إلى 4 سنوات مع مراعاة فرق الطول الفردي.',
  },
];

export type MeasurementUnit = 'cm' | 'inch';

export function cmToInch(cm: number): string {
  return (cm / 2.54).toFixed(1);
}

export function formatRange(minCm: number, maxCm: number, unit: MeasurementUnit): string {
  if (unit === 'inch') {
    return `${cmToInch(minCm)} - ${cmToInch(maxCm)} إنش`;
  }
  return `${minCm} - ${maxCm} سم`;
}

/**
 * Normalizes Arabic numerals and common separators so user inputs like "٠-٣" or "0 – 3" match cleanly.
 */
function normalizeSizeInput(raw: string): string {
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  const westernDigits = '0123456789';
  let result = raw.trim().toLowerCase();

  for (let i = 0; i < arabicDigits.length; i++) {
    result = result.replace(new RegExp(arabicDigits[i], 'g'), westernDigits[i]);
  }

  return result
    .replace(/[–—ـ_/\\]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/\s*-\s*/g, '-');
}

export interface SizeLookupResult {
  spec: BabySizeSpec | null;
  matchReason?: string;
}

/**
 * Resolves a customer size query such as "0-3", "3-6", "NB", "62", "5 أشهر", etc.
 */
export function findSizeByQuery(rawQuery: string): SizeLookupResult {
  const normalized = normalizeSizeInput(rawQuery);
  if (!normalized) return { spec: null };

  // 1. Exact code or alias match
  for (const spec of INTERNATIONAL_BABY_SIZES) {
    if (normalizeSizeInput(spec.code) === normalized || normalizeSizeInput(spec.id) === normalized) {
      return { spec, matchReason: 'تطابق مباشر مع المقاس العالمي' };
    }
    if (spec.aliases.some((alias) => normalizeSizeInput(alias) === normalized)) {
      return { spec, matchReason: 'تطابق مع المقاس العالمي' };
    }
  }

  // 2. Partial match inside code/label/aliases (e.g. "0-3m", "6-12", "3 أشهر")
  const stripped = normalized.replace(/(أشهر|اشهر|شهر|شهور|سنوات|سنة|سنه|m|y|months|years)/g, '').trim();

  for (const spec of INTERNATIONAL_BABY_SIZES) {
    if (
      normalizeSizeInput(spec.code) === stripped ||
      spec.aliases.some((a) => normalizeSizeInput(a) === stripped)
    ) {
      return { spec, matchReason: 'تطابق مع المقاس العالمي' };
    }
  }

  // 3. Range like "X-Y" (e.g. "0-6" or "6-12") -> pick best matching span
  const rangeMatch = stripped.match(/^(\d+)-(\d+)$/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);

    // Check if numbers look like EU height sizes (e.g. 56-62, 74-80)
    if (start >= 40 && end >= 44) {
      const midHeight = (start + end) / 2;
      const byHeight = findSizeByHeight(midHeight);
      if (byHeight) {
        return { spec: byHeight, matchReason: `حسب الطول الأوروبي (${start}-${end} سم)` };
      }
    }

    // Otherwise treat as months (or years if user explicitly wrote سنوات/y)
    const isYears = /(سنة|سنوات|سنه|y|t)/i.test(normalized) || (end <= 4 && start >= 2 && !normalized.includes('m'));
    const midMonths = isYears ? ((start + end) / 2) * 12 : (start + end) / 2;
    const byMonths = findSizeByMonths(midMonths);
    if (byMonths) {
      return { spec: byMonths, matchReason: `أقرب مقاس عالمي للفئة (${stripped})` };
    }
  }

  // 4. Single number: could be EU size (44..110) or age in months (0..36)
  const numMatch = stripped.match(/^(\d+(?:\.\d+)?)$/);
  if (numMatch) {
    const num = parseFloat(numMatch[1]);
    if (num >= 44 && num <= 115) {
      const byHeight = findSizeByHeight(num);
      if (byHeight) {
        return { spec: byHeight, matchReason: `حسب الطول / المقاس الأوروبي (${num} سم)` };
      }
    }
    if (num >= 0 && num <= 48) {
      const isYears = /(سنة|سنوات|سنه|y)/i.test(normalized);
      const months = isYears ? num * 12 : num;
      const byMonths = findSizeByMonths(months);
      if (byMonths) {
        return {
          spec: byMonths,
          matchReason: isYears ? `مقاس مناسب لعمر ${num} سنوات` : `مقاس مناسب لعمر ${num} أشهر`,
        };
      }
    }
  }

  // 5. Fallback substring match on labelAr
  const fuzzy = INTERNATIONAL_BABY_SIZES.find(
    (s) =>
      s.labelAr.includes(normalized) ||
      s.code.toLowerCase().includes(normalized) ||
      s.euSize.toLowerCase().includes(normalized) ||
      s.usSize.toLowerCase().includes(normalized)
  );
  if (fuzzy) {
    return { spec: fuzzy, matchReason: 'مطابقة تقريبية' };
  }

  return { spec: null };
}

export function findSizeByMonths(months: number): BabySizeSpec | null {
  if (months < 0) return INTERNATIONAL_BABY_SIZES[0];
  if (months <= 1) return INTERNATIONAL_BABY_SIZES[1]; // NB
  const exact = INTERNATIONAL_BABY_SIZES.find(
    (s) => s.id !== 'nb' && months >= s.monthsMin && months <= s.monthsMax
  );
  if (exact) return exact;
  return INTERNATIONAL_BABY_SIZES[INTERNATIONAL_BABY_SIZES.length - 1];
}

export function findSizeByHeight(heightCm: number): BabySizeSpec | null {
  if (heightCm <= 50) return INTERNATIONAL_BABY_SIZES[0];
  const found = INTERNATIONAL_BABY_SIZES.find(
    (s) => heightCm >= s.heightMinCm && heightCm <= s.heightMaxCm
  );
  if (found) return found;
  if (heightCm > 104) return INTERNATIONAL_BABY_SIZES[INTERNATIONAL_BABY_SIZES.length - 1];
  return INTERNATIONAL_BABY_SIZES[2]; // default 0-3
}

export function findSizeByWeight(weightKg: number): BabySizeSpec | null {
  if (weightKg <= 3.0) return INTERNATIONAL_BABY_SIZES[0];
  const found = INTERNATIONAL_BABY_SIZES.find(
    (s) => weightKg >= s.weightMinKg && weightKg <= s.weightMaxKg
  );
  if (found) return found;
  if (weightKg > 18) return INTERNATIONAL_BABY_SIZES[INTERNATIONAL_BABY_SIZES.length - 1];
  return INTERNATIONAL_BABY_SIZES[2];
}
