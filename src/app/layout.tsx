import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Nivi Organics | Premium Natural Skincare",
  description: "High-end natural skincare, essential oils, and organic powders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header style={{ 
          padding: '24px 0', 
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: '#FFFFFF',
          zIndex: 100
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-text-main)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Nivi Organics
            </Link>
            <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <Link href="/" style={{ fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Shop</Link>
              <Link href="/account" style={{ fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Account</Link>
              <Link href="/cart" style={{ fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Cart (0)</Link>
              <Link href="/admin" className="btn-outline" style={{ padding: '8px 24px', fontSize: '12px' }}>Admin</Link>
            </nav>
          </div>
        </header>

        <main style={{ flex: 1 }}>
          {children}
        </main>

        <footer style={{ padding: '80px 0 60px', backgroundColor: '#0F0F0F', color: '#FFFFFF', marginTop: 'auto' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ marginBottom: '24px', fontSize: '24px', letterSpacing: '1px', textTransform: 'uppercase' }}>Nivi Organics</h3>
              <p style={{ opacity: 0.7, maxWidth: '300px', fontSize: '14px', lineHeight: '1.8' }}>
                Pure, natural, and potent skincare and essential oils crafted for your ultimate wellbeing. Follow us on our journey to natural luxury.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '80px' }}>
              <div>
                <h4 style={{ marginBottom: '24px', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px' }}>Shop Collection</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', opacity: 0.7, fontSize: '14px' }}>
                  <Link href="/" style={{ color: '#FFFFFF' }}>Essential Oils</Link>
                  <Link href="/" style={{ color: '#FFFFFF' }}>Herbal Powders</Link>
                  <Link href="/" style={{ color: '#FFFFFF' }}>Raw Butters</Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
