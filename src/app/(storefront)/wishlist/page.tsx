import type { Metadata } from 'next';
import WishlistView from './WishlistView';

export const metadata: Metadata = {
  title: 'My Wishlist',
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <div className="container" style={{ padding: '80px 24px', maxWidth: '1100px' }}>
      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '24px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', textTransform: 'uppercase', letterSpacing: '1px' }}>My Wishlist</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '8px', fontSize: '14px' }}>
          Items you've saved for later. Your wishlist is stored on this device.
        </p>
      </div>
      <WishlistView />
    </div>
  );
}
