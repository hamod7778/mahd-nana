import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.storeSettings.findFirst();

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          storeName: 'متجر بيبي يمن | Baby Yemen Store',
          whatsappNumber: '967771234567',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch store settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { storeName, whatsappNumber, announcementText, heroTitle, heroSubtitle } = body;

    let settings = await prisma.storeSettings.findFirst();

    if (settings) {
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data: {
          ...(storeName && { storeName }),
          ...(whatsappNumber && { whatsappNumber }),
          ...(announcementText !== undefined && { announcementText }),
          ...(heroTitle !== undefined && { heroTitle }),
          ...(heroSubtitle !== undefined && { heroSubtitle }),
        },
      });
    } else {
      settings = await prisma.storeSettings.create({
        data: {
          storeName: storeName || 'متجر بيبي يمن',
          whatsappNumber: whatsappNumber || '967771234567',
          announcementText,
          heroTitle,
          heroSubtitle,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update store settings' }, { status: 500 });
  }
}
