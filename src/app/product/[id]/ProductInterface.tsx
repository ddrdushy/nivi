'use client';

import { useState } from 'react';

type Variation = {
  id: string;
  optionName: string;
  price: number;
  stock: number;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: { name: string } | null;
  variations: Variation[];
};

export default function ProductInterface({ product }: { product: Product }) {
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    product.variations.length > 0 ? product.variations[0] : null
  );

  const displayPrice = selectedVariation ? selectedVariation.price : product.price;
  const displayStock = selectedVariation ? selectedVariation.stock : product.stock;

  return (
    <div>
      <div style={{ marginBottom: '8px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
        {product.category?.name || 'Category'}
      </div>
      <h1 style={{ fontSize: '40px', marginBottom: '16px', lineHeight: 1.1 }}>{product.name}</h1>
      <div style={{ fontSize: '28px', color: 'var(--color-primary)', fontWeight: '700', marginBottom: '32px' }}>
        Rs. {displayPrice}
      </div>
      
      <div style={{ fontSize: '14px', lineHeight: 1.8, marginBottom: '48px', color: 'var(--color-text-muted)' }}>
        {product.description}
      </div>

      {product.variations.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' }}>Select Option</label>
          <select 
            className="input-base" 
            style={{ width: '100%' }}
            value={selectedVariation?.id || ''}
            onChange={(e) => {
              const v = product.variations.find(v => v.id === e.target.value);
              if (v) setSelectedVariation(v);
            }}
          >
            {product.variations.map(v => (
              <option key={v.id} value={v.id}>{v.optionName} - Rs. {v.price}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px', display: 'flex', gap: '16px' }}>
        <button className="btn-outline" style={{ padding: '0 24px', letterSpacing: '1px', fontSize: '18px' }}>
          - 1 +
        </button>
        <button className="btn-primary" style={{ flex: 1, padding: '16px 0', fontSize: '14px' }}>
          Add to Cart
        </button>
      </div>
      
      <div style={{ marginTop: '24px', fontSize: '14px', fontWeight: '700', color: displayStock > 0 ? 'var(--color-text-main)' : '#EC6B81' }}>
        {displayStock > 0 ? `✓ IN STOCK (${displayStock})` : '✗ OUT OF STOCK'}
      </div>
    </div>
  );
}
