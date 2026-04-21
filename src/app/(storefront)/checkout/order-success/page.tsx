'use client';

import Link from 'next/link';

export default function OrderSuccessPage() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '120px 24px' }}>
      <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎉</div>
      <h1 style={{ fontSize: '36px', marginBottom: '16px' }}>Order Placed Successfully!</h1>
      <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
        Thank you for shopping with Nivi Organics. Your order has been received and is being processed for delivery.
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Link href="/" className="btn-primary" style={{ padding: '14px 40px' }}>
          Back to Shop
        </Link>
        <Link href="/account" className="btn-outline" style={{ padding: '14px 40px' }}>
          View Order History
        </Link>
      </div>
    </div>
  );
}
