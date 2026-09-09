import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_YEMENI_GOVERNORATES = [
  { name: 'صنعاء (أمانة العاصمة)', shippingFee: 15, isActive: true },
  { name: 'عدن', shippingFee: 20, isActive: true },
  { name: 'تعز', shippingFee: 20, isActive: true },
  { name: 'إب', shippingFee: 15, isActive: true },
  { name: 'حضرموت (المكلا / سيئون)', shippingFee: 10, isActive: true },
  { name: 'الحديدة', shippingFee: 20, isActive: true },
  { name: 'ذمار', shippingFee: 15, isActive: true },
  { name: 'مأرب', shippingFee: 20, isActive: true },
  { name: 'شبوة', shippingFee: 15, isActive: true },
  { name: 'صعدة', shippingFee: 25, isActive: true },
  { name: 'المهرة', shippingFee: 25, isActive: true },
  { name: 'لحج', shippingFee: 20, isActive: true },
  { name: 'أبين', shippingFee: 20, isActive: true },
  { name: 'البيضاء', shippingFee: 20, isActive: true },
  { name: 'عمران', shippingFee: 15, isActive: true },
  { name: 'حجة', shippingFee: 20, isActive: true },
  { name: 'الضالع', shippingFee: 20, isActive: true },
  { name: 'المحويت', shippingFee: 20, isActive: true },
];

export async function GET() {
  try {
    let governorates = await prisma.governorate.findMany({
      orderBy: { name: 'asc' },
    });

    if (governorates.length === 0) {
      await prisma.governorate.createMany({
        data: DEFAULT_YEMENI_GOVERNORATES,
      });
      governorates = await prisma.governorate.findMany({
        orderBy: { name: 'asc' },
      });
    }

    return NextResponse.json(governorates);
  } catch (error) {
    console.error('Error fetching governorates:', error);
    return NextResponse.json({ error: 'Failed to fetch governorates' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, shippingFee, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: 'Governorate name is required' }, { status: 400 });
    }

    const governorate = await prisma.governorate.create({
      data: {
        name: name.trim(),
        shippingFee: typeof shippingFee === 'number' ? shippingFee : parseFloat(shippingFee) || 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json(governorate);
  } catch (error) {
    console.error('Error creating governorate:', error);
    return NextResponse.json({ error: 'Failed to create governorate' }, { status: 500 });
  }
}
