import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, receiptUrl } = body;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(receiptUrl !== undefined && { receiptUrl }),
      },
      include: { items: true },
    });

    // Generate status update message for customer
    const statusLabels: Record<string, string> = {
      PENDING: '⏳ قيد الانتظار (في انتظار إيصال التحويل)',
      VERIFIED: '💳 تم تأكيد وصول التحويل وتأكيد الطلب بنجاح',
      PREPARING: '📦 قيد التجهيز والتغليف بمتجرنا',
      SHIPPED: '🚚 تم الشحن والتسليم لمندوب التوصيل',
      DELIVERED: '✅ تم التوصيل بنجاح، نتمنى لك ولطفلك كل السعادة',
      CANCELLED: '❌ تم إلغاء الطلب',
    };

    const statusText = statusLabels[order.status] || order.status;

    const cleanCustomerPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanCustomerPhone.startsWith('967')
      ? cleanCustomerPhone
      : `967${cleanCustomerPhone.replace(/^0+/, '')}`;

    const updateMsg = `أهلاً بك عزيزي/عزيزتي ${order.customerName} 🌸\n\nنود إعلامك بتحديث حالة طلبك رقم *#${order.orderCode}* لدى متجر مهد ونعناع:\n✨ *الحالة الحالية:* ${statusText}\n\nشكراً لثقتكم بنا! ❤️`;
    const customerWhatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(updateMsg)}`;

    return NextResponse.json({
      order,
      customerWhatsappUrl,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
