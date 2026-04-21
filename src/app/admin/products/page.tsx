import { PrismaClient } from '@prisma/client';

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Products (Variations)</h1>
        <button className="btn-primary">+ Add New Product</button>
      </div>
      
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#f9f9f9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <th style={{ padding: '16px 24px', fontWeight: '700' }}>Name</th>
              <th style={{ padding: '16px 24px', fontWeight: '700' }}>Category</th>
              <th style={{ padding: '16px 24px', fontWeight: '700' }}>Variations</th>
              <th style={{ padding: '16px 24px', fontWeight: '700' }}>Price</th>
              <th style={{ padding: '16px 24px', fontWeight: '700' }}>Stock</th>
              <th style={{ padding: '16px 24px', fontWeight: '700' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '14px' }}>
                <td style={{ padding: '16px 24px', fontWeight: '700' }}>{product.name}</td>
                <td style={{ padding: '16px 24px', color: 'var(--color-text-muted)' }}>
                  {product.category?.name || 'Uncategorized'}
                </td>
                <td style={{ padding: '16px 24px' }}>{product.variations.length} Options</td>
                <td style={{ padding: '16px 24px' }}>Rs. {product.price}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    border: '1px solid var(--color-border)',
                    color: product.stock > 0 ? '#0F0F0F' : '#EC6B81',
                    fontSize: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <button style={{ color: 'var(--color-text-main)', fontWeight: '700', marginRight: '16px', fontSize: '12px', textTransform: 'uppercase' }}>Edit</button>
                  <button style={{ color: '#EC6B81', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
