import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, shippingFee, isActive } = body;

    const governorate = await prisma.governorate.update({
      where: { id: params.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(shippingFee !== undefined && { shippingFee: parseFloat(shippingFee) || 0 }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json(governorate);
  } catch (error) {
    console.error('Error updating governorate:', error);
    return NextResponse.json({ error: 'Failed to update governorate' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.governorate.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting governorate:', error);
    return NextResponse.json({ error: 'Failed to delete governorate' }, { status: 500 });
  }
}
