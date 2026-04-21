import { PrismaClient } from '@prisma/client';
import ProductList from './ProductList';

const prisma = new PrismaClient();

export default async function ProductsAdminPage() {
  const products = await prisma.product.findMany({
    include: { 
      category: true,
      variations: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="admin-page-title">Inventory Management</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Track stock levels, manage variations, and perform bulk inventory updates.</p>
        </div>
        <button className="btn-primary" style={{ borderRadius: '4px', fontSize: '13px' }}>+ Add New Product</button>
      </div>
      
      <ProductList initialProducts={products as any} />
    </div>
  );
}
