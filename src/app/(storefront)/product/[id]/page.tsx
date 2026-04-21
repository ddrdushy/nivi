import Link from 'next/link';
import ProductInterface from './ProductInterface';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { 
      category: true,
      variations: true 
    }
  });

  if (!product) return notFound();

  return (
    <div className="container" style={{ padding: '80px 24px' }}>
      <Link href="/" style={{ color: 'var(--color-primary)', marginBottom: '32px', display: 'inline-block', fontWeight: '700', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>
        ← Back to Shop
      </Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '64px', alignItems: 'start' }}>
        {/* Product Image Panel */}
        {product.imageUrl ? (
          <div style={{ aspectRatio: '1/1', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div style={{
            aspectRatio: '1/1',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '120px'
          }}>
            🧴
          </div>
        )}

        {/* Product Details - Client Interactivity */}
        <ProductInterface product={product} />
      </div>
    </div>
  );
}
