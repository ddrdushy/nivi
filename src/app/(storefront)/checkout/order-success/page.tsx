'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function AccountNotice() {
  const sp = useSearchParams();
  const account = sp.get('account');

  if (account === 'new') {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto 32px', padding: '16px 20px', backgroundColor: '#f5f8ef', border: '1px solid var(--color-primary)', color: '#2f4a12', fontSize: '14px', textAlign: 'left' }}>
        <strong>Your account has been created.</strong>
        <div style={{ marginTop: '6px' }}>
          You can sign in with your email and password any time to view orders and track deliveries.
        </div>
      </div>
    );
  }

  if (account === 'linked') {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto 32px', padding: '16px 20px', backgroundColor: '#fffbeb', border: '1px solid #facc15', color: '#713f12', fontSize: '14px', textAlign: 'left' }}>
        <strong>This email already has an account.</strong>
        <div style={{ marginTop: '6px' }}>
          We've linked this order to it. <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Log in</Link> to see your full order history.
        </div>
      </div>
    );
  }

  return null;
}

export default function OrderSuccessPage() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '120px 24px' }}>
      <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎉</div>
      <h1 style={{ fontSize: '36px', marginBottom: '16px' }}>Order Placed Successfully!</h1>
      <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
        Thank you for shopping with Nivi Organics. Your order has been received and is being processed for delivery.
      </p>
      <Suspense fallback={null}>
        <AccountNotice />
      </Suspense>
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
