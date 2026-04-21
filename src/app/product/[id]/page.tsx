import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import ProductInterface from './ProductInterface';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
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
        <div style={{ 
          aspectRatio: '3/4', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)'
        }}>
           <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', opacity: 0.5 }}>
              <span style={{ fontSize: '4rem' }}>🖼️</span>
              <p style={{ marginTop: '16px', fontSize: '14px' }}>Image Placeholder</p>
           </div>
        </div>

        {/* Product Details - Client Interactivity */}
        <ProductInterface product={product} />
      </div>
    </div>
  );
}
