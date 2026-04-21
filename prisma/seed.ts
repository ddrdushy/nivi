import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial Nivi Organics data...');

  // Create Store Settings
  await prisma.storeSetting.upsert({
    where: { key: 'STORE_NAME' },
    update: {},
    create: { key: 'STORE_NAME', value: 'Nivi Organics' }
  });

  await prisma.storeSetting.upsert({
    where: { key: 'CURRENCY' },
    update: {},
    create: { key: 'CURRENCY', value: 'Rs.' }
  });

  await prisma.storeSetting.upsert({
    where: { key: 'PAYMENT_MANUAL_ENABLED' },
    update: {},
    create: { key: 'PAYMENT_MANUAL_ENABLED', value: 'true' }
  });

  // Create Categories
  const categoryOils = await prisma.category.create({
    data: {
      name: 'Essential Oils',
      description: 'Pure, natural, and potent essential oils.',
    }
  });

  const categoryButters = await prisma.category.create({
    data: {
      name: 'Butters & Waxes',
      description: 'Organic raw butters and double-filtered waxes.',
    }
  });

  const categoryPowders = await prisma.category.create({
    data: {
      name: 'Herbal Powders',
      description: 'Luxury organic powders for skin and hair.',
    }
  });

  // Create Products
  const products = [
    {
      name: 'Luxury Stringy Henna Powder',
      description: 'Premium henna powder for luxurious color and care.',
      price: 450,
      stock: 100,
      categoryId: categoryPowders.id,
    },
    {
      name: 'Eucalyptus Essential Oil',
      description: 'Refreshing and purifying essential oil (1 Litre).',
      price: 1550,
      stock: 50,
      categoryId: categoryOils.id,
    },
    {
      name: 'Australian Tea Tree Essential Oil',
      description: 'Potent and cleansing essential oil (1 Litre).',
      price: 2550,
      stock: 50,
      categoryId: categoryOils.id,
    },
    {
      name: 'Bulgarian Lavender Essential Oil',
      description: 'Calming and relaxing premium essential oil (1 Litre).',
      price: 2750,
      stock: 50,
      categoryId: categoryOils.id,
    },
    {
      name: 'Cajeput Essential Oil',
      description: 'Energizing and relieving essential oil (1 Litre).',
      price: 2850,
      stock: 40,
      categoryId: categoryOils.id,
    },
    {
      name: 'West African Raw Organic Unrefined Ivory Shea Butter',
      description: 'Deeply moisturizing raw organic shea butter.',
      price: 950,
      stock: 80,
      categoryId: categoryButters.id,
    },
    {
      name: 'Double Filtered Organic Beeswax',
      description: 'Pure and clean double-filtered organic beeswax.',
      price: 650,
      stock: 90,
      categoryId: categoryButters.id,
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
