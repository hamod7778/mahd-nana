import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('query')?.trim() || '';

    if (!rawQuery) {
      return NextResponse.json({ error: 'يرجى إدخال رقم الطلب الكامل أو رقم الجوال' }, { status: 400 });
    }

    // Clean input
    const cleanCode = rawQuery.replace('#', '').trim().toUpperCase();
    const formattedCode = cleanCode.startsWith('YMN-') ? cleanCode : `YMN-${cleanCode}`;

    // Clean phone (digits only)
    const digitsOnly = rawQuery.replace(/[^0-9]/g, '');

    // Security & Privacy rule: Require full order code or full phone number (at least 8 digits)
    const isFullCode = cleanCode.length >= 4;
    const isFullPhone = digitsOnly.length >= 8;

    if (!isFullCode && !isFullPhone) {
      return NextResponse.json(
        { error: 'لحماية خصوصية العملاء، يرجى كتابة كود الطلب بالكامل (مثال: YMN-92841) أو رقم الجوال بالكامل.' },
        { status: 400 }
      );
    }

    const orConditions: any[] = [
      { orderCode: { equals: cleanCode } },
      { orderCode: { equals: formattedCode } },
    ];

    if (isFullPhone) {
      const localPhoneNoZero = digitsOnly.replace(/^967/, '').replace(/^0+/, '');
      orConditions.push(
        { customerPhone: { equals: digitsOnly } },
        { customerPhone: { equals: `0${localPhoneNoZero}` } },
        { customerPhone: { equals: `967${localPhoneNoZero}` } },
        { customerPhone: { equals: localPhoneNoZero } }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: orConditions,
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: 'لم يتم العثور على طلب بهذه البيانات. يرجى التأكد من كتابة رقم الطلب أو رقم الجوال بالكامل.' },
        { status: 404 }
      );
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء البحث عن الطلب' }, { status: 500 });
  }
}
