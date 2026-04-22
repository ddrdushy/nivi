'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useState } from 'react';
import CartDrawer from './CartDrawer';

type UserRole = 'ADMIN' | 'CUSTOMER';

export default function NavIcons({ role }: { role: UserRole | null }) {
  const { totalItems, subtotal } = useCart();
  const { wishlist } = useWishlist();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const accountPill = (() => {
    if (role === 'ADMIN') {
      return { href: '/admin/dashboard', label: 'Admin' };
    }
    if (role === 'CUSTOMER') {
      return { href: '/account', label: 'Account' };
    }
    return { href: '/login', label: 'Login' };
  })();

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button style={{ color: '#fff', fontSize: '18px', border: 'none', background: 'none', cursor: 'pointer' }}>🔍</button>
        
        <Link href="/wishlist" style={{ color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>
          <span style={{ fontSize: '18px' }}>♡</span>
          {wishlist.length > 0 && (
            <span style={{ 
              position: 'absolute',
              top: '-8px',
              right: '-10px',
              backgroundColor: 'var(--color-primary)', 
              borderRadius: '50%', 
              width: '18px', height: '18px',
              fontSize: '10px', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {wishlist.length}
            </span>
          )}
        </Link>

        <button 
          onClick={() => setIsCartOpen(true)}
          style={{ color: '#fff', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: '18px' }}>🛒</span>
            {totalItems > 0 && (
              <span style={{ 
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                backgroundColor: 'var(--color-primary)', 
                borderRadius: '50%', 
                width: '18px', height: '18px',
                fontSize: '10px', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {totalItems}
              </span>
            )}
          </div>
          <span style={{ fontSize: '13px', fontWeight: '500' }}>Rs. {subtotal.toLocaleString()}</span>
        </button>

        <Link href={accountPill.href} style={{
          color: '#fff',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '4px',
          padding: '4px 10px',
          transition: 'all 0.2s',
        }}>{accountPill.label}</Link>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
