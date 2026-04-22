import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ProductInterface from './ProductInterface';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { JsonLd, SITE_URL } from '@/lib/jsonLd';

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return { title: 'Product not found' };
  }

  const description =
    product.description.length > 160
      ? `${product.description.slice(0, 157).trimEnd()}…`
      : product.description;

  const image = product.imageUrl ? `${SITE_URL}${product.imageUrl}` : undefined;

  return {
    title: product.name,
    description,
    openGraph: {
      type: 'website',
      title: product.name,
      description,
      url: `${SITE_URL}/product/${product.id}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variations: true,
    },
  });

  if (!product) return notFound();

  const lowestVariationPrice =
    product.variations.length > 0
      ? Math.min(...product.variations.map((v) => v.price))
      : product.price;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl ? `${SITE_URL}${product.imageUrl}` : undefined,
    sku: product.id,
    category: product.category?.name,
    brand: { '@type': 'Brand', name: 'Nivi Organics' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'LKR',
      price: lowestVariationPrice,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/product/${product.id}`,
    },
  };

  return (
    <div className="container" style={{ padding: '80px 24px' }}>
      <JsonLd data={productJsonLd} />

      <Link
        href="/"
        style={{
          color: 'var(--color-primary)',
          marginBottom: '32px',
          display: 'inline-block',
          fontWeight: 700,
          textTransform: 'uppercase',
          fontSize: '12px',
          letterSpacing: '1px',
        }}
      >
        ← Back to Shop
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '64px', alignItems: 'start' }}>
        {/* Product Image Panel */}
        {product.imageUrl ? (
          <div style={{ position: 'relative', aspectRatio: '1/1', border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 560px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div
            style={{
              aspectRatio: '1/1',
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '120px',
            }}
          >
            🧴
          </div>
        )}

        {/* Product Details - Client Interactivity */}
        <ProductInterface product={product} />
      </div>
    </div>
  );
}
