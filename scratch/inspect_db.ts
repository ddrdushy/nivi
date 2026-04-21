import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany({
    include: {
      images: true,
      category: true,
    }
  });

  console.log('--- CATEGORIES ---');
  console.log(JSON.stringify(categories, null, 2));
  console.log('\n--- PRODUCTS ---');
  console.log(JSON.stringify(products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category.name,
    imageCount: p.images.length
  })), null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
