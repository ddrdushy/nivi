import { PrismaClient } from '@prisma/client';
import ProductList from './ProductList';

const prisma = new PrismaClient();

export default async function ProductsAdminPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, variations: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } })
  ]);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="admin-page-title">Inventory Management</h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Create, edit, and manage all your products and stock levels.</p>
      </div>

      <ProductList initialProducts={products as any} categories={categories} />
    </div>
  );
}
