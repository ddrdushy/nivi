'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { getWishlistProducts, type WishlistProduct } from '@/app/actions/wishlist';

export default function WishlistView() {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<WishlistProduct[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const ids = useMemo(() => wishlist.map((w) => w.id), [wishlist]);
  const idsKey = ids.join(',');

  useEffect(() => {
    let cancelled = false;
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    setError(null);
    getWishlistProducts(ids)
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((e) => {
        if (!cancelled) {
          console.error(e);
          setError('Failed to load wishlist items.');
          setProducts([]);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleMoveToCart = (p: WishlistProduct) => {
    if (p.stock <= 0) return;
    addToCart(
      {
        id: p.id,
        productId: p.id,
        name: p.name,
        price: p.price,
        imageUrl: p.imageUrl || undefined,
        maxStock: p.stock,
      },
      1,
    );
    toggleWishlist({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl || undefined });
    showToast(`${p.name} added to cart`);
  };

  if (products === null) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading your wishlist…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', border: '1px solid #EC6B81', backgroundColor: '#fff5f6', color: '#EC6B81' }}>
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center', border: '1px dashed var(--color-border)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>♡</div>
        <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Your wishlist is empty</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          Save the products you love by tapping the heart on any item.
        </p>
        <Link href="/" className="btn-primary" style={{ padding: '12px 32px', borderRadius: 0 }}>
          Browse Products
        </Link>
      </div>
    );
  }

  const missingCount = wishlist.length - products.length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', fontSize: '14px', color: 'var(--color-text-muted)' }}>
        <span>{products.length} item{products.length === 1 ? '' : 's'}</span>
        <button
          onClick={() => {
            if (confirm('Remove all items from your wishlist?')) clearWishlist();
          }}
          className="btn-outline"
          style={{ padding: '6px 14px', fontSize: '12px', borderRadius: 0 }}
        >
          Clear wishlist
        </button>
      </div>

      {missingCount > 0 && (
        <div style={{ padding: '12px 16px', backgroundColor: '#fffbeb', border: '1px solid #facc15', color: '#713f12', fontSize: '13px', marginBottom: '16px' }}>
          {missingCount} item{missingCount === 1 ? ' is' : 's are'} no longer available and {missingCount === 1 ? 'has' : 'have'} been hidden.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {products.map((p) => {
          const outOfStock = p.stock <= 0;
          return (
            <div key={p.id} style={{ border: '1px solid var(--color-border)', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
              <Link href={`/product/${p.id}`} style={{ display: 'block', position: 'relative', aspectRatio: '1/1', backgroundColor: '#fafafa', borderBottom: '1px solid var(--color-border)' }}>
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.name} fill sizes="260px" style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>🧴</div>
                )}
                {outOfStock && (
                  <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', backgroundColor: '#EC6B81', color: '#fff', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Out of stock
                  </span>
                )}
              </Link>

              <div style={{ padding: '16px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {p.category?.name ?? 'Product'}
                </p>
                <Link href={`/product/${p.id}`}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{p.name}</h3>
                </Link>
                <div style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>
                  Rs. {p.price.toLocaleString()}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button
                    className="btn-primary"
                    onClick={() => handleMoveToCart(p)}
                    disabled={outOfStock}
                    style={{ flex: 1, padding: '10px', fontSize: '12px', borderRadius: 0, opacity: outOfStock ? 0.5 : 1 }}
                  >
                    {outOfStock ? 'Unavailable' : 'Move to Cart'}
                  </button>
                  <button
                    onClick={() => toggleWishlist({ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl || undefined })}
                    title="Remove from wishlist"
                    style={{ border: '1px solid var(--color-border)', backgroundColor: '#fff', padding: '0 12px', cursor: 'pointer', fontSize: '16px' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#1f2937', color: '#fff', padding: '12px 20px', fontSize: '13px', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 50 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
