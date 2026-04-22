import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

type ProductStats = {
  id: string;
  name: string;
  totalRevenue: number;
  totalSales: number;
  imageUrl?: string | null;
};

export default function TopProducts({ products }: { products: ProductStats[] }) {
  return (
    <div className="admin-table-container">
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '16px', margin: 0 }}>Top Performing Products</h3>
        <Link href="/admin/products" style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: '600' }}>View All</Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th style={{ textAlign: 'right' }}>Sales</th>
            <th style={{ textAlign: 'right' }}>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative', width: '32px', height: '32px', borderRadius: '4px', backgroundColor: '#f3f4f6', overflow: 'hidden' }}>
                    {product.imageUrl && (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="32px"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '13px' }}>{product.name}</span>
                </div>
              </td>
              <td style={{ textAlign: 'right' }}>{product.totalSales}</td>
              <td style={{ textAlign: 'right', fontWeight: '700' }}>Rs. {product.totalRevenue.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
