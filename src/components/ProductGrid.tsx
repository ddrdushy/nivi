'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from './ProductCard';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: { id: string; name: string } | null;
};

type Category = { id: string; name: string };

const ALL = 'All';

export default function ProductGrid({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  const [active, setActive] = useState<string>(() => {
    if (initialCategory && categories.some((c) => c.name === initialCategory)) {
      return initialCategory;
    }
    return ALL;
  });

  // Keep the tab in sync if the user navigates with different category params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.some((c) => c.name === cat)) setActive(cat);
    if (!cat) setActive(ALL);
  }, [searchParams, categories]);

  const visible = useMemo(() => {
    if (active === ALL) return products;
    return products.filter((p) => p.category?.name === active);
  }, [active, products]);

  const tabs = [ALL, ...categories.map((c) => c.name)];

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-muted)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
        <p style={{ fontSize: '16px', marginBottom: '8px', fontWeight: 600 }}>No products yet</p>
        <p style={{ fontSize: '13px' }}>
          Add products from the{' '}
          <Link href="/admin/products" style={{ color: 'var(--color-primary)' }}>
            Admin panel
          </Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="category-tabs">
        {tabs.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setActive(name)}
            className={`category-tab${active === name ? ' active' : ''}`}
          >
            {name}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-muted)', fontSize: '14px' }}>
          No products in this category yet.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
