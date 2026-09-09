import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 جاري تحديث البيانات وإضافة الصور المتعددة للمنتجات...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.exchangeAccount.deleteMany();
  await prisma.storeSettings.deleteMany();

  await prisma.storeSettings.create({
    data: {
      storeName: 'متجر بيبي يمن | Baby Yemen Store',
      whatsappNumber: '967771234567',
      announcementText: '🚚 توصيل سريع لجميع المحافظات اليمنية (صنعاء، عدن، تعز، إب، حضرموت...) | 💳 الدفع بالتحويل لشبكات الصرافة (بالريال السعودي)',
      heroTitle: 'كل ما يحتاجه طفلك الصغير من أرقى التشكيلات 👶✨',
      heroSubtitle: 'أطقم ملابس مريحة، مستلزمات العناية والتغذية، وأسرة نوم آمنة بأسعار مميزة للسوق اليمني',
    },
  });

  const exchangeAccounts = [
    {
      name: 'شركة النجم للصرافة',
      accountName: 'متجر بيبي يمن لمستلزمات المواليد',
      accountNumber: '771234567',
      instructions: 'يرجى التحويل باسم المستفيد أعلاه، وإرسال صورة الإيصال ورقم الطلب على الواتساب.',
      isActive: true,
    },
    {
      name: 'شركة العمقي وإخوانه للصرافة',
      accountName: 'متجر بيبي يمن - الإدارة',
      accountNumber: '102938475',
      instructions: 'التحويل لحساب العمقي وتزويدنا برقم السند عبر الواتساب لتأكيد الطلب فوراً.',
      isActive: true,
    },
    {
      name: 'بنك الكريمي للتمويل الأصغر (حاسب)',
      accountName: 'متجر بيبي يمن',
      accountNumber: '30495821',
      instructions: 'التحويل عبر خدمة كاست أو تطبيق حاسب أو فروع الكريمي، بالريال السعودي.',
      isActive: true,
    },
    {
      name: 'شركة سويد وإخوانه للصرافة',
      accountName: 'مركز مستلزمات الأطفال',
      accountNumber: '779876543',
      instructions: 'إرسال حوالة باسم المركز وإرفاق الصورة بالواتساب مع رقم الطلب.',
      isActive: true,
    },
  ];

  for (const acc of exchangeAccounts) {
    await prisma.exchangeAccount.create({ data: acc });
  }

  const categories = [
    {
      name: 'ملابس مواليد',
      slug: 'baby-clothing',
      icon: 'Shirt',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'عناية وتغذية',
      slug: 'care-and-feeding',
      icon: 'Milk',
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'أسرة وغرف النوم',
      slug: 'cribs-and-nursery',
      icon: 'BedDouble',
      image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'عربات ومقاعد سفر',
      slug: 'strollers-and-car-seats',
      icon: 'Baby',
      image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'ألعاب وتنمية مهارات',
      slug: 'toys-and-development',
      icon: 'Gamepad2',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'طقومات وهدايا مواليد',
      slug: 'baby-gift-sets',
      icon: 'Gift',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const createdCategories = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    createdCategories[cat.slug] = created.id;
  }

  const products = [
    {
      name: 'حقيبة مستلزمات الأم والطفل متعددة الجيوب',
      slug: 'diaper-maternity-bag-multi-pocket',
      description: 'حقيبة ظهر عصرية وعملية جداً للأم، مزودة بجيب حراري للرضاعات، مقاومة للماء مع فتحة واسعة وسعة كبيرة.',
      price: 110,
      oldPrice: 140,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80'
      ]),
      categoryId: createdCategories['care-and-feeding'],
      stock: 15,
      featured: true,
      badge: 'عملية جداً 🎒',
    },
    {
      name: 'طقم بربتوز قطن عضوي للمواليد (5 قطع)',
      slug: 'organic-cotton-onesie-set-5pcs',
      description: 'طقم متكامل من القطن العضوي 100% ناعم ولطيف جداً على بشرة حديثي الولادة. يشمل 5 قطع ملونة بألوان هادئة ومريحة.',
      price: 65,
      oldPrice: 85,
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'
      ]),
      categoryId: createdCategories['baby-clothing'],
      stock: 18,
      featured: true,
      badge: 'الأكثر مبيعاً 🔥',
    },
    {
      name: 'سرير مواليد خشب خيزران هزاز مع ناموسية',
      slug: 'wooden-rocking-baby-crib-mosquitonet',
      description: 'سرير هزاز أنيق مصنع من خشب الطبيعي الفاخر، مزود بناموسية حماية ومفرش قطني ناعم مريح لراحة الطفل وأمانه.',
      price: 340,
      oldPrice: 410,
      image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'
      ]),
      categoryId: createdCategories['cribs-and-nursery'],
      stock: 6,
      featured: true,
      badge: 'خصم مميز 🏷️',
    },
    {
      name: 'عربة أطفال خفيفة الوزن سهلة للطي والتحرك',
      slug: 'lightweight-foldable-baby-stroller',
      description: 'عربة أطفال فائقة الخفة والمتانة مناسبة للسفر والتنقل في كافة المحافظات اليمنية. حزام أمان خماسي النقاط ومظلة شمسية.',
      price: 210,
      oldPrice: 260,
      image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
      ]),
      categoryId: createdCategories['strollers-and-car-seats'],
      stock: 8,
      featured: true,
      badge: 'جديد ✨',
    },
    {
      name: 'طقم تعقيم ورضاعات صحية مضادة للمغص (4 رضاعات)',
      slug: 'anti-colic-baby-bottles-set-4pcs',
      description: 'مجموعة رضاعات صحية خالية من البيسفينول (BPA Free) بتصميم يحكي حلمة الأم ويقضي على مغص وغازات المواليد.',
      price: 95,
      oldPrice: 120,
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'
      ]),
      categoryId: createdCategories['care-and-feeding'],
      stock: 25,
      featured: true,
      badge: 'موصى به 👍',
    },
    {
      name: 'صندوق هدايا مواليد فاخر (أرنب قطني + طقم ملابس)',
      slug: 'luxury-baby-gift-box-bunny-set',
      description: 'هدية راقية جداً للمواليد الجدد. تشمل لعبة دبدوب أرنب قطني، طقم بربتوز شتوي ناعم، قبعة، وجوارب في تغليف إهداء أنيق.',
      price: 130,
      oldPrice: 160,
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
      ]),
      categoryId: createdCategories['baby-gift-sets'],
      stock: 12,
      featured: true,
      badge: 'هدية ممتازة 🎁',
    },
  ];

  for (const prod of products) {
    await prisma.product.create({ data: prod });
  }

  console.log('✅ تم إضافة المنتجات والصور المتعددة بنجاح!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
