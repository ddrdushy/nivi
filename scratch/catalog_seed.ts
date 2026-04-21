import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING CATALOG SEEDING ---');

  // 1. Create Categories
  const categoryData = [
    { name: 'Serums & Elixirs', description: 'Potent botanical blends for targeted facial care.' },
    { name: 'Essential Oils', description: 'Pure, high-grade oils for aromatherapy and holistic wellness.' },
    { name: 'Body Rituals', description: 'Nourishing treatments for a spa-like experience at home.' },
    { name: 'Ritual Powders', description: 'Traditional herbal powders for custom masks and treatments.' },
  ];

  const categories: any = {};
  for (const cat of categoryData) {
    categories[cat.name] = await prisma.category.create({ data: cat });
    console.log(`Created category: ${cat.name}`);
  }

  // 2. Create Products
  const productsData = [
    {
      name: 'Midnight Rose Serum',
      description: 'A luxurious overnight serum infused with pure Bulgarian Rose and Marula oil. Regenerates skin while you sleep for a radiant morning glow.',
      price: 4500,
      stock: 50,
      categoryId: categories['Serums & Elixirs'].id,
      imageUrl: '/products/midnight_rose_serum.png'
    },
    {
      name: 'Kumkumadi Glow Elixir',
      description: 'The ancient Ayurvedic secret for brightening skin. 100% natural blend with pure Saffron, Sandalwood, and 26 rare herbs.',
      price: 5800,
      stock: 30,
      categoryId: categories['Serums & Elixirs'].id,
      imageUrl: '/products/kumkumadi_elixir.png'
    },
    {
      name: 'Lavender Bliss Essential Oil',
      description: 'Pure, organic French Lavender oil. Perfect for relaxation, sleep, and calming the mind. Steam-distilled for maximum potency.',
      price: 1800,
      stock: 100,
      categoryId: categories['Essential Oils'].id,
      imageUrl: '/products/lavender_bliss_oil.png',
      variations: [
        { optionName: '10ml', price: 1800, stock: 60 },
        { optionName: '30ml', price: 4200, stock: 40 }
      ]
    },
    {
      name: 'Peppermint Refresh Mist',
      description: 'A revitalizing face and body spray with pure Peppermint and Aloe Vera. Instantly cools and awakens the senses.',
      price: 2200,
      stock: 75,
      categoryId: categories['Essential Oils'].id,
      imageUrl: '/products/peppermint_mist.png'
    },
    {
      name: 'Himalayan Pink Salt Scrub',
      description: 'Detoxifying body polish with fine pink salt crystals and essential oils. Removes dead skin and leaves limbs silky smooth.',
      price: 3200,
      stock: 45,
      categoryId: categories['Body Rituals'].id,
      imageUrl: '/products/pink_salt_scrub.png'
    },
    {
      name: 'Coco-Shea Whipped Butter',
      description: 'Ultra-nourishing body butter with raw Shea and Coconut. Melts into skin for 24-hour hydration and a soft tropical scent.',
      price: 3800,
      stock: 40,
      categoryId: categories['Body Rituals'].id,
      imageUrl: '/products/coco_shea_butter.png'
    },
    {
      name: 'Turmeric Brightening Mask',
      description: 'Organic Wild Turmeric and Sandalwood powder. Mix with water or rose water for a traditional brightening facial ritual.',
      price: 2500,
      stock: 60,
      categoryId: categories['Ritual Powders'].id,
      imageUrl: '/products/turmeric_mask.png'
    }
  ];

  for (const prod of productsData) {
    const { variations, ...productInfo } = prod as any;
    const product = await prisma.product.create({
      data: {
        ...productInfo,
        variations: variations ? {
          create: variations
        } : undefined
      }
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log('--- SEEDING COMPLETE ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
