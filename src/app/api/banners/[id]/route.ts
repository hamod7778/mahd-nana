export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const { title, subtitle, badge, image, linkUrl, sortOrder } = body;

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        title,
        subtitle: subtitle !== undefined ? subtitle : undefined,
        badge: badge !== undefined ? badge : undefined,
        image,
        linkUrl: linkUrl !== undefined ? linkUrl : undefined,
        sortOrder: typeof sortOrder === 'number' ? sortOrder : undefined,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.banner.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
