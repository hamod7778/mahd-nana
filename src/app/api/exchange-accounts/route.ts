import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const accounts = await prisma.exchangeAccount.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch exchange accounts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, accountName, accountNumber, instructions, isActive, logoUrl } = body;

    if (!name || !accountName || !accountNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const account = await prisma.exchangeAccount.create({
      data: {
        name,
        accountName,
        accountNumber,
        instructions: instructions || '',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        logoUrl: logoUrl || '',
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create exchange account' }, { status: 500 });
  }
}
