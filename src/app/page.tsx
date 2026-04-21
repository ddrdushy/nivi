import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function HomePage() {
  const products = await prisma.product.findMany({
    include: { category: true }
  });

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        padding: '140px 0', 
        backgroundColor: 'var(--color-secondary)',
        borderBottom: '1px solid var(--color-border)',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '60px', color: 'var(--color-text-main)', marginBottom: '24px', letterSpacing: '2px' }}>
              NATURAL LUXURY.
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--color-text-main)', marginBottom: '40px', letterSpacing: '0.5px' }}>
              Experience the finest essential oils, raw butters, and luxury powders sourced directly from nature.
            </p>
            <Link href="#products" className="btn-primary">
              Shop Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="container" style={{ padding: '80px 24px' }}>
        <h2 style={{ fontSize: '34px', textAlign: 'center', marginBottom: '48px', color: 'var(--color-text-main)' }}>
          FEATURED PRODUCTS
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} style={{ display: 'block' }}>
              <div className="product-card">
                <div style={{ 
                  aspectRatio: '1/1', 
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-sm)', 
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--color-border)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Placeholder for Images */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: 'var(--color-text-muted)'
                  }}>
                    <span style={{ fontSize: '2rem' }}>🖼️</span>
                  </div>
                </div>
                
                <h3 style={{ fontSize: '18px', marginBottom: '8px', fontWeight: '700' }}>{product.name}</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '16px' }}>Rs. {product.price}</span>
                  <span className="btn-outline" style={{ padding: '6px 16px', fontSize: '10px', borderWidth: '1px' }}>
                    View
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
