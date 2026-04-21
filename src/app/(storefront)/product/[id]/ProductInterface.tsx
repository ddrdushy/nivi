'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

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
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    product.variations.length > 0 ? product.variations[0] : null
  );

  const isFavorite = isInWishlist(product.id);

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
            style={{ width: '100%', borderRadius: '4px' }}
            value={selectedVariation?.id || ''}
            onChange={(e) => {
              const v = product.variations.find(v => v.id === e.target.value);
              if (v) {
                setSelectedVariation(v);
                setQuantity(1); // Reset quantity when variation changes
              }
            }}
          >
            {product.variations.map(v => (
              <option key={v.id} value={v.id}>{v.optionName} - Rs. {v.price}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' }}>Quantity</label>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '4px', width: 'fit-content' }}>
          <button 
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            style={{ padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}
          >-</button>
          <span style={{ padding: '0 20px', fontSize: '16px', fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
          <button 
            onClick={() => setQuantity(q => Math.min(displayStock, q + 1))}
            style={{ padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}
          >+</button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '32px', display: 'flex', gap: '16px' }}>
        <button 
          onClick={() => toggleWishlist({ 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            imageUrl: typeof product === 'object' && 'imageUrl' in product ? (product as any).imageUrl : undefined 
          })}
          className="btn-outline" 
          style={{ 
            padding: '0 24px', 
            fontSize: '24px', 
            color: isFavorite ? 'var(--color-primary)' : 'inherit',
            borderColor: isFavorite ? 'var(--color-primary)' : 'var(--color-border)'
          }}
          title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
        <button 
          className="btn-primary" 
          style={{ flex: 1, padding: '16px 0', fontSize: '14px', opacity: displayStock > 0 ? 1 : 0.5 }}
          disabled={displayStock <= 0}
          onClick={() => {
            addToCart({
              id: selectedVariation ? `${product.id}-${selectedVariation.id}` : product.id,
              productId: product.id,
              variationId: selectedVariation?.id,
              name: product.name,
              price: displayPrice,
              imageUrl: typeof product === 'object' && 'imageUrl' in product ? (product as any).imageUrl : undefined,
              variationName: selectedVariation?.optionName,
              maxStock: displayStock
            }, quantity);
          }}
        >
          {displayStock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
        </button>
      </div>
      
      <div style={{ marginTop: '24px', fontSize: '14px', fontWeight: '700', color: displayStock > 0 ? 'var(--color-text-main)' : '#EC6B81' }}>
        {displayStock > 0 ? `✓ IN STOCK (${displayStock})` : '✗ OUT OF STOCK'}
      </div>
    </div>
  );
}
