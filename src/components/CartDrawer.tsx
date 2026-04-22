'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
    }}>
      {/* Overlay */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '450px',
        height: '100%',
        backgroundColor: '#fff',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideIn 0.3s ease-out',
      }}>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}} />

        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Your Cart ({totalItems})
          </h2>
          <button 
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '24px', color: 'var(--color-text-main)' }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '80px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Your cart is empty.</p>
              <button 
                onClick={onClose}
                className="btn-primary" 
                style={{ padding: '12px 32px', fontSize: '14px' }}
              >
                Go Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '24px' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="80px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', fontSize: '32px' }}>🧴</div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{item.name}</h4>
                    {item.variationName && (
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Option: {item.variationName}</p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ padding: '4px 10px', border: 'none', background: 'none', cursor: 'pointer' }}
                        >-</button>
                        <span style={{ padding: '0 8px', fontSize: '12px', fontWeight: '700' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{ padding: '4px 10px', border: 'none', background: 'none', cursor: 'pointer' }}
                        >+</button>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700' }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EC6B81', fontSize: '18px' }}
                    title="Remove item"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--color-border)', backgroundColor: '#fcfcfc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '18px', fontWeight: '700' }}>
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Shipping and taxes calculated at checkout.
            </p>
            <div style={{ display: 'grid', gap: '12px' }}>
              <Link 
                href="/checkout" 
                onClick={onClose}
                className="btn-primary" 
                style={{ textAlign: 'center', padding: '16px', fontSize: '14px' }}
              >
                Checkout Now
              </Link>
              <button 
                onClick={onClose}
                className="btn-outline" 
                style={{ width: '100%', padding: '14px', fontSize: '14px' }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
