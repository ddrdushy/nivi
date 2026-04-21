'use client';

import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
    category?: { name: string } | null;
    stock: number;
  };
};

export default function ProductCard({ product }: Props) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isFavorite = isInWishlist(product.id);

  return (
    <div className="product-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Link href={`/product/${product.id}`} style={{ display: 'block', flex: 1 }}>
        <span className="badge-new">New</span>
        
        {/* Image */}
        {product.imageUrl ? (
          <div style={{ aspectRatio: '1/1', borderBottom: '1px solid var(--color-border)', width: '100%', overflow: 'hidden' }}>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
              className="card-img"
            />
          </div>
        ) : (
          <div style={{
            aspectRatio: '1/1',
            backgroundColor: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px',
            borderBottom: '1px solid var(--color-border)',
          }}>
            🧴
          </div>
        )}
      </Link>

      {/* Hover actions */}
      <div className="card-actions">
        <button 
          className="card-action-btn" 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist({
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl || undefined
            });
          }}
          style={{ color: isFavorite ? 'var(--color-primary)' : 'inherit' }}
          title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
        <button 
          className="card-action-btn" 
          title="Quick Add"
          onClick={(e) => {
            e.preventDefault();
            if (product.stock > 0) {
              addToCart({
                id: product.id,
                productId: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl || undefined,
                maxStock: product.stock
              }, 1);
            }
          }}
          disabled={product.stock <= 0}
          style={{ opacity: product.stock > 0 ? 1 : 0.5 }}
        >
          🛒
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          {product.category?.name || 'Category'}
        </p>
        <Link href={`/product/${product.id}`} style={{ display: 'block' }}>
          <h3 style={{ fontSize: '15px', marginBottom: '12px', fontWeight: '600' }}>{product.name}</h3>
        </Link>
        <div style={{ marginBottom: '12px' }} className="stars">★★★★★</div>
        <div style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '16px' }}>
          Rs. {product.price.toLocaleString()}
        </div>
        
        {product.stock <= 0 && (
          <div style={{ fontSize: '10px', color: '#EC6B81', fontWeight: '700', marginTop: '8px', textTransform: 'uppercase' }}>
            Out of Stock
          </div>
        )}
      </div>

      <style jsx>{`
        .product-card:hover .card-img {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
