'use client';

import { useState } from 'react';
import { bulkDeleteProducts, bulkUpdateProductStock } from '@/app/actions/products';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: { name: string } | null;
  variations: any[];
};

export default function ProductList({ initialProducts }: { initialProducts: Product[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === initialProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) return;
    setIsLoading(true);
    const res = await bulkDeleteProducts(selectedIds);
    if (res.success) {
      setSelectedIds([]);
    } else {
      alert('Error: ' + res.error);
    }
    setIsLoading(false);
  };

  const handleBulkOutOfStock = async () => {
    setIsLoading(true);
    const res = await bulkUpdateProductStock(selectedIds, 0);
    if (res.success) {
      setSelectedIds([]);
    } else {
      alert('Error: ' + res.error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div style={{
          position: 'sticky',
          top: '80px',
          zIndex: 10,
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>{selectedIds.length} Products Selected</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleBulkOutOfStock}
              disabled={isLoading}
              style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              Set Out of Stock
            </button>
            <button 
              onClick={handleBulkDelete}
              disabled={isLoading}
              style={{ padding: '6px 12px', background: '#fff', border: 'none', color: 'var(--color-primary)', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input type="checkbox" checked={selectedIds.length === initialProducts.length && initialProducts.length > 0} onChange={toggleSelectAll} />
              </th>
              <th>Product Details</th>
              <th>Category</th>
              <th>Variations</th>
              <th style={{ textAlign: 'right' }}>Price</th>
              <th style={{ textAlign: 'right' }}>Stock Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => toggleSelect(product.id)} />
                </td>
                <td>
                  <div style={{ fontWeight: '600', color: '#111827' }}>{product.name}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>ID: {product.id.slice(0, 8)}...</div>
                </td>
                <td style={{ fontSize: '13px', color: '#6b7280' }}>{product.category?.name || 'Uncategorized'}</td>
                <td>
                  <span style={{ fontSize: '12px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>
                    {product.variations.length} Options
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: '600' }}>Rs. {product.price.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className={`status-badge ${product.stock > 0 ? 'paid' : 'pending'}`} style={{ fontSize: '10px' }}>
                    {product.stock > 0 ? `${product.stock} IN STOCK` : 'OUT OF STOCK'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
