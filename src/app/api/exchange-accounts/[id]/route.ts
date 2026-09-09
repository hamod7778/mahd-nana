export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { name, accountName, accountNumber, instructions, isActive, logoUrl } = body;

    const account = await prisma.exchangeAccount.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(accountName && { accountName }),
        ...(accountNumber && { accountNumber }),
        ...(instructions !== undefined && { instructions }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(logoUrl !== undefined && { logoUrl }),
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update exchange account' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.exchangeAccount.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete exchange account' }, { status: 500 });
  }
}
