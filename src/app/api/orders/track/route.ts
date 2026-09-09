import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim();

    if (!query) {
      return NextResponse.json({ error: 'يرجى إدخال رقم الطلب أو رقم الجوال' }, { status: 400 });
    }

    // Clean query: strip # if user entered #YMN-12345
    const cleanCode = query.replace('#', '').toUpperCase();

    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { orderCode: { equals: cleanCode } },
          { orderCode: { contains: cleanCode } },
          { customerPhone: { contains: query } },
        ],
      },
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: 'لم يتم العثور على طلب بهذا الرقم أو الجوال' }, { status: 404 });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء البحث عن الطلب' }, { status: 500 });
  }
}
