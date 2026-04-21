import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing products...');
  await prisma.productVariation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('Creating categories...');
  const oilsCategory = await prisma.category.create({ data: { name: 'Essential Oils' } });
  const buttersCategory = await prisma.category.create({ data: { name: 'Raw Butters & Waxes' } });
  const powdersCategory = await prisma.category.create({ data: { name: 'Herbal Powders' } });

  console.log('Seeding products...');

  const products = [
    {
      name: 'Luxury Stringy Henna Powder',
      description: 'Premium quality organic henna powder with high dye content and stringy consistency for perfect application.',
      price: 450,
      imageUrl: '/images/products/henna_powder.png',
      categoryId: powdersCategory.id,
      variations: [{ optionName: '1 Kg Bulk', price: 450, stock: 100 }]
    },
    {
      name: 'Eucalyptus Essential Oil',
      description: 'Refreshing and medicinal eucalyptus oil, perfect for aromatherapy and skincare.',
      price: 1550,
      imageUrl: '/images/products/eucalyptus_oil.png',
      categoryId: oilsCategory.id,
      variations: [{ optionName: '1 Litre', price: 1550, stock: 50 }]
    },
    {
      name: 'Australian Tea Tree Essential Oil',
      description: 'Pure Australian Tea Tree oil, known for its powerful antibacterial and purifying properties.',
      price: 2550,
      imageUrl: '/images/products/tea_tree_oil.png',
      categoryId: oilsCategory.id,
      variations: [{ optionName: '1 Litre', price: 2550, stock: 50 }]
    },
    {
      name: 'Bulgarian Lavender Essential Oil',
      description: 'High-grade Bulgarian lavender oil with a rich, floral aroma for relaxation and skincare.',
      price: 2750,
      imageUrl: '/images/products/lavender_oil.png',
      categoryId: oilsCategory.id,
      variations: [{ optionName: '1 Litre', price: 2750, stock: 50 }]
    },
    {
      name: 'Cajeput Essential Oil',
      description: 'Cajeput oil is valued for its antiseptic and clarifying properties.',
      price: 2850,
      imageUrl: '/images/products/cajeput_oil.png',
      categoryId: oilsCategory.id,
      variations: [{ optionName: '1 Litre', price: 2850, stock: 50 }]
    },
    {
      name: 'West African Raw organic Unrefined Ivory Shea Butter',
      description: 'Pure, unrefined ivory shea butter from West Africa, rich in vitamins and moisture.',
      price: 950,
      imageUrl: '/images/products/shea_butter.png',
      categoryId: buttersCategory.id,
      variations: [{ optionName: '1 Kg Bulk', price: 950, stock: 200 }]
    },
    {
      name: 'Double Filtered Organic Beeswax',
      description: 'Clean, double-filtered organic beeswax, ideal for balms, candles, and skincare.',
      price: 650,
      imageUrl: '/images/products/beeswax.png',
      categoryId: buttersCategory.id,
      variations: [{ optionName: '1 Kg Bulk', price: 650, stock: 100 }]
    },
    {
      name: 'Pure Rose Otto Essential Oil',
      description: 'Luxury Rose Otto oil, steam-distilled from fresh rose petals.',
      price: 18500,
      imageUrl: '/images/products/rose_oil.png',
      categoryId: oilsCategory.id,
      variations: [{ optionName: '10ml', price: 18500, stock: 10 }]
    },
    {
      name: 'Cold-Pressed Moroccan Argan Oil',
      description: 'Golden Moroccan argan oil for skin and hair health.',
      price: 5500,
      imageUrl: '/images/products/argan_oil.png',
      categoryId: oilsCategory.id,
      variations: [{ optionName: '100ml', price: 5500, stock: 20 }]
    },
    {
      name: 'Organic Kasturi Turmeric Powder',
      description: 'Traditional wild turmeric powder for a natural radiance and clear complexion.',
      price: 850,
      imageUrl: '/images/products/turmeric_powder.png',
      categoryId: powdersCategory.id,
      variations: [{ optionName: '200g', price: 850, stock: 100 }]
    }
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        categoryId: p.categoryId,
        variations: {
          create: p.variations
        }
      }
    });
  }

  console.log('✅ Database successfully seeded with real products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
