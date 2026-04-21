import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DEFAULT_STOCK = 50;

async function main() {
  console.log('Clearing existing catalog...');
  await prisma.productVariation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('Creating categories...');
  const oils = await prisma.category.create({ data: { name: 'Essential Oils' } });
  const butters = await prisma.category.create({ data: { name: 'Raw Butters & Waxes' } });
  const powders = await prisma.category.create({ data: { name: 'Herbal Powders' } });

  console.log('Seeding 7 products with variations...');

  const products = [
    {
      name: 'Luxury Stringy Henna Powder',
      description: 'Premium quality organic henna powder with high dye content and stringy consistency for perfect application.',
      imageUrl: '/images/products/henna_powder.png',
      categoryId: powders.id,
      basePrice: 450,
      variations: [
        { optionName: '250g', price: 150 },
        { optionName: '500g', price: 260 },
        { optionName: '1 Kg', price: 450 },
      ],
    },
    {
      name: 'Eucalyptus Essential Oil',
      description: 'Refreshing and medicinal eucalyptus oil, perfect for aromatherapy and skincare.',
      imageUrl: '/images/products/eucalyptus_oil.png',
      categoryId: oils.id,
      basePrice: 1550,
      variations: [
        { optionName: '50ml', price: 120 },
        { optionName: '100ml', price: 220 },
        { optionName: '250ml', price: 500 },
        { optionName: '1 Litre', price: 1550 },
      ],
    },
    {
      name: 'Australian Tea Tree Essential Oil',
      description: 'Pure Australian Tea Tree oil, known for its powerful antibacterial and purifying properties.',
      imageUrl: '/images/products/tea_tree_oil.png',
      categoryId: oils.id,
      basePrice: 2550,
      variations: [
        { optionName: '50ml', price: 180 },
        { optionName: '100ml', price: 340 },
        { optionName: '250ml', price: 790 },
        { optionName: '1 Litre', price: 2550 },
      ],
    },
    {
      name: 'Bulgarian Lavender Essential Oil',
      description: 'High-grade Bulgarian lavender oil with a rich, floral aroma for relaxation and skincare.',
      imageUrl: '/images/products/lavender_oil.png',
      categoryId: oils.id,
      basePrice: 2750,
      variations: [
        { optionName: '50ml', price: 200 },
        { optionName: '100ml', price: 370 },
        { optionName: '250ml', price: 850 },
        { optionName: '1 Litre', price: 2750 },
      ],
    },
    {
      name: 'Cajeput Essential Oil',
      description: 'Cajeput oil is valued for its antiseptic and clarifying properties.',
      imageUrl: '/images/products/cajeput_oil.png',
      categoryId: oils.id,
      basePrice: 2850,
      variations: [
        { optionName: '50ml', price: 210 },
        { optionName: '100ml', price: 390 },
        { optionName: '250ml', price: 880 },
        { optionName: '1 Litre', price: 2850 },
      ],
    },
    {
      name: 'West African Raw Organic Unrefined Ivory Shea Butter',
      description: 'Pure, unrefined ivory shea butter from West Africa, rich in vitamins and moisture.',
      imageUrl: '/images/products/shea_butter.png',
      categoryId: butters.id,
      basePrice: 950,
      variations: [
        { optionName: '250g', price: 300 },
        { optionName: '500g', price: 540 },
        { optionName: '1 Kg', price: 950 },
      ],
    },
    {
      name: 'Double Filtered Organic Beeswax',
      description: 'Clean, double-filtered organic beeswax, ideal for balms, candles, and skincare.',
      imageUrl: '/images/products/beeswax.png',
      categoryId: butters.id,
      basePrice: 650,
      variations: [
        { optionName: '250g', price: 210 },
        { optionName: '500g', price: 370 },
        { optionName: '1 Kg', price: 650 },
      ],
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.basePrice,
        stock: DEFAULT_STOCK * p.variations.length,
        imageUrl: p.imageUrl,
        categoryId: p.categoryId,
        variations: {
          create: p.variations.map((v) => ({
            optionName: v.optionName,
            price: v.price,
            stock: DEFAULT_STOCK,
          })),
        },
      },
    });
  }

  console.log('Seeding admin user...');
  const adminEmail = 'admin@niviorganics.com';
  const adminPassword = 'admin123';
  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN', password: hashed },
    create: {
      email: adminEmail,
      password: hashed,
      name: 'Store Admin',
      role: 'ADMIN',
    },
  });

  console.log('Seeding default store settings...');
  const defaults: Array<[string, string]> = [
    ['PAYMENT_MANUAL_ENABLED', 'true'],
    ['PAYMENT_STRIPE_ENABLED', 'false'],
    ['PAYMENT_STRIPE_KEY', ''],
    ['PAYMENT_PAYPAL_ENABLED', 'false'],
    ['PAYMENT_PAYPAL_KEY', ''],
    ['PAYMENT_RAZORPAY_ENABLED', 'false'],
    ['PAYMENT_RAZORPAY_KEY', ''],
  ];
  for (const [key, value] of defaults) {
    await prisma.storeSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  console.log('Done.');
  console.log(`Admin login → ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
