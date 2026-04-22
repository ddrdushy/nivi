import { Suspense } from 'react';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import HeroSlider from '@/components/HeroSlider';
import CategoryTiles from '@/components/CategoryTiles';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        products: { select: { imageUrl: true }, take: 1 },
        _count: { select: { products: true } },
      },
    }),
  ]);

  const tiles = categories.map((c) => ({
    id: c.id,
    name: c.name,
    productCount: c._count.products,
    imageUrl: c.products[0]?.imageUrl ?? c.imageUrl,
  }));

  return (
    <div>
      {/* ─── HERO SLIDER ─── */}
      <HeroSlider />

      {/* ─── POPULAR CATEGORIES ─── */}
      <CategoryTiles tiles={tiles} />

      {/* ─── FEATURES STRIP ─── */}
      <section style={{ backgroundColor: 'var(--color-dark)', padding: '20px 0' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0',
        }}>
          {[
            { icon: '🚚', title: 'Free Shipping', sub: 'On all orders over Rs.5000' },
            { icon: '↩️', title: 'Free Returns', sub: 'Returns are free within 9 days' },
            { icon: '🎧', title: 'Support 24/7', sub: 'Contact us 24 hours a day' },
            { icon: '🔒', title: '100% Payment Secure', sub: 'Your payment is safe with us' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 24px',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none',
            }}>
              <div style={{
                width: '44px', height: '44px',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', flexShrink: 0,
              }}>{f.icon}</div>
              <div>
                <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>{f.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRODUCTS ─── */}
      <section id="products" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              🌿
            </p>
            <h2 style={{ fontSize: '32px', color: 'var(--color-text-main)', marginBottom: '8px' }}>Our Products</h2>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Add our products to your daily wellness line up</p>
          </div>

          <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
            <ProductGrid products={products} categories={categories} />
          </Suspense>
        </div>
      </section>

      {/* ─── BANNER SPLIT ─── */}
      <section style={{ backgroundColor: 'var(--color-secondary)', padding: '80px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
          <div style={{
            aspectRatio: '4/3',
            backgroundImage: 'url("/images/decorations/split_banner.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            border: '1px solid var(--color-border)',
          }}></div>
          <div>
            <p style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
              New Arrivals
            </p>
            <h2 style={{ fontSize: '36px', color: 'var(--color-text-main)', marginBottom: '16px', lineHeight: 1.2 }}>
              Discover Our<br />Latest Collection
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: 1.8, marginBottom: '32px' }}>
              Handpicked botanicals, cold-pressed oils and raw powders delivered straight from nature to your skin. Pure, potent and 100% organic.
            </p>
            <Link href="/" className="btn-primary" style={{ padding: '14px 32px' }}>Shop Now</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
