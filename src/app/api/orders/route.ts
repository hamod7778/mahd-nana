import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, city, address, notes, exchangeAccountName, items, shippingFee: rawShippingFee } = body;

    if (!customerName || !customerPhone || !city || !address || !items || !items.length) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    // Generate unique orderCode YMN-XXXXX
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const orderCode = `YMN-${randomCode}`;

    // Subtotal of items
    const itemsSubtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );

    const shippingFee = typeof rawShippingFee === 'number' ? rawShippingFee : parseFloat(rawShippingFee) || 0;
    const totalAmount = itemsSubtotal + shippingFee;

    // Save order in DB
    const order = await prisma.order.create({
      data: {
        orderCode,
        customerName,
        customerPhone,
        city,
        address,
        notes: notes || '',
        exchangeAccountName: exchangeAccountName || 'تحويل صرافة محلي',
        totalAmount,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId || null,
            productName: item.productName,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Fetch store settings for whatsapp number
    const settings = await prisma.storeSettings.findFirst();
    const whatsappNum = settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '967771234567';

    // Format WhatsApp message
    const itemsListStr = items
      .map(
        (i: any, index: number) =>
          `  ${index + 1}. ${i.productName} (العدد: ${i.quantity}) - ${i.price * i.quantity} ر.س`
      )
      .join('\n');

    const shippingFeeStr = shippingFee > 0 ? `${shippingFee} ر.س` : 'مجاني ✨';

    const whatsappMessage = 
`👶 *طلب جديد من متجر مهد ونعناع* 👶
----------------------------------------
*رقم الطلب:* #${orderCode}
*اسم العميل:* ${customerName}
*رقم الجوال:* ${customerPhone}
*المحافظة/المدينة:* ${city}
*العنوان التفصيلي:* ${address}
${notes ? `*ملاحظات:* ${notes}\n` : ''}----------------------------------------
🛍️ *تفاصيل المنتجات:*
${itemsListStr}

📦 *مجموع المنتجات:* ${itemsSubtotal} ر.س
🚚 *رسوم التوصيل (${city}):* ${shippingFeeStr}
💰 *المبلغ النهائي المطلوب تحويله:* ${totalAmount} ر.س (ريال سعودي)
💳 *طريقة الدفع المختارة:* ${exchangeAccountName}
----------------------------------------
📌 *خطوات إكمال الطلب:*
يرجى إرسال صورة إيصال التحويل المالي عبر هذا الشات لتأكيد طلبك وتجهيزه للشحن فوراً! 🧾✨`;

    const encodedText = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodedText}`;

    return NextResponse.json({
      order,
      whatsappUrl,
      orderCode,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
