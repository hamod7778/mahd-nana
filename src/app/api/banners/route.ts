import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

const DEFAULT_BANNERS = [
  {
    title: 'أطقم قطنية فاخرة للرضع',
    subtitle: 'خامات مريحة ولطيفة جداً على بشرة المولود',
    badge: 'تشكيلة المواليد الجدد 2026',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    sortOrder: 1,
  },
  {
    title: 'أسرة نوم ومفارش هزازة خشبية',
    subtitle: 'تصاميم خيزران ناعمة مع ناموسية حماية',
    badge: 'راحة وأمان 😴✨',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
    sortOrder: 2,
  },
  {
    title: 'عربات أطفال خفيفة الوزن ومقاعد سفر',
    subtitle: 'سهلة الطي ومثالية لجميع الرحلات باليمن',
    badge: 'سهولة التنقل والسفر 👶🚚',
    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
    sortOrder: 3,
  },
  {
    title: 'أطقم رضاعات معقمة ومستلزمات العناية',
    subtitle: 'خالية من البيسفينول وموصى بها للأمهات',
    badge: 'تغذية صحية ومضادة للمغص 🍼',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    sortOrder: 4,
  },
];

export async function GET() {
  try {
    let banners = await prisma.banner.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    if (banners.length === 0) {
      await prisma.banner.createMany({
        data: DEFAULT_BANNERS,
      });
      banners = await prisma.banner.findMany({
        orderBy: { sortOrder: 'asc' },
      });
    }

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, subtitle, badge, image, linkUrl, sortOrder } = body;

    if (!title || !image) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle: subtitle || '',
        badge: badge || '',
        image,
        linkUrl: linkUrl || '',
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}
