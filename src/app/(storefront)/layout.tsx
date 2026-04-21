import Link from 'next/link';
import CookieBanner from '@/components/CookieBanner';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import NavIcons from '@/components/NavIcons';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <WishlistProvider>
        {/* ─── TOP NAV ─── */}
        <header style={{
          backgroundColor: 'var(--color-nav-bg)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div className="container" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '60px',
          }}>
            {/* Left Nav */}
            <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
              <Link href="/" style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>Home</Link>
              <Link href="/" style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>Collections</Link>
              <Link href="/" style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>Skin Care</Link>
              <Link href="/" style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>About Us</Link>
            </nav>

            {/* Center Logo */}
            <Link href="/" style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '24px' }}>🌿</span>
              <span style={{
                color: '#fff',
                fontSize: '22px',
                fontWeight: '700',
                letterSpacing: '2px',
              }}>
                NIVI ORGANICS
              </span>
            </Link>

            {/* Right Icons */}
            <NavIcons />
          </div>
        </header>

        {/* ─── CONTACT BAR ─── */}
        <div style={{
          backgroundColor: '#222',
          borderBottom: '1px solid #333',
        }}>
          <div className="container" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '1px',
          }}>
            {[
              { icon: '📞', text: '+94 11 234 5678  M-F 9AM–6PM' },
              { icon: '✉️', text: 'hello@niviorganics.com' },
              { icon: '💬', text: 'Virtual Chat 24/7 | Live M-F 9am–6pm' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '14px 24px',
                borderRight: i < 2 ? '1px solid #333' : 'none',
              }}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ color: '#ccc', fontSize: '13px' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <main style={{ flex: 1 }}>
          {children}
        </main>

        {/* ─── FOOTER SOCIAL + NEWSLETTER ─── */}
        <footer style={{ backgroundColor: 'var(--color-footer-bg)', padding: '60px 0 30px', color: '#ccc' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', marginBottom: '60px' }}>
            {/* Social */}
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '24px', color: '#fff' }}>
                Let&apos;s Connect On Social
              </h3>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
                {['f', '𝕏', '▶', '◉'].map((icon, i) => (
                  <a key={i} href="#" style={{
                    width: '42px', height: '42px',
                    borderRadius: '50%',
                    border: '1px solid #333',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', color: '#fff',
                    transition: 'all 0.2s ease',
                  }}>{icon}</a>
                ))}
              </div>
              <p style={{ fontSize: '13px', color: '#888', lineHeight: '1.7', maxWidth: '320px' }}>
                Follow us on your favorite platforms. Check out new launch teasers, how-to videos, and share your favorite looks.
              </p>
            </div>

            {/* Newsletter */}
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px', color: '#fff' }}>
                Sign Up For Newsletter
              </h3>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
                You may unsubscribe at any moment. For that purpose, please find our contact info in the legal notice.
              </p>
              <div style={{ display: 'flex', gap: '0' }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  style={{
                    flex: 1,
                    padding: '13px 20px',
                    backgroundColor: '#111',
                    border: '1px solid #333',
                    borderRight: 'none',
                    borderRadius: '50px 0 0 50px',
                    fontSize: '14px',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <button style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  padding: '13px 24px',
                  borderRadius: '0 50px 50px 0',
                  fontWeight: '700',
                  fontSize: '12px',
                  letterSpacing: '1px',
                  border: 'none',
                  cursor: 'pointer',
                }}>
                  SIGN UP
                </button>
              </div>
            </div>
          </div>

          <div className="container" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '60px', marginBottom: '48px', borderTop: '1px solid #222', paddingTop: '60px' }}>
            {/* Brand column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '22px' }}>🌿</span>
                <span style={{ color: '#fff', fontSize: '18px', fontWeight: '700', letterSpacing: '2px' }}>NIVI ORGANICS</span>
              </div>
              <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#888', marginBottom: '12px' }}>
                We are a brand of designers and growers that create high quality natural, organic skincare products.
              </p>
              <p style={{ fontSize: '12px', color: '#666' }}>Location: Colombo, Sri Lanka</p>
            </div>

            {/* Links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
              {[
                { title: '', links: [{ label: 'Shipping Policy', href: '/shipping' }, { label: 'Returns & Refunds', href: '/returns' }, { label: 'Track Order', href: '/account' }] },
                { title: '', links: [{ label: 'Terms & Conditions', href: '/terms' }, { label: 'Privacy Policy', href: '/privacy' }, { label: 'Cookie Policy', href: '/cookies' }] },
                { title: '', links: [{ label: 'About Us', href: '/about' }, { label: 'Contact Us', href: '/contact' }, { label: 'Sitemap', href: '/sitemap' }] },
              ].map((col, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
                    {col.links.map((link) => (
                      <Link key={link.label} href={link.href} style={{ color: '#888', fontSize: '14px', transition: 'color 0.2s' }}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid #222', paddingTop: '24px' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '12px', color: '#555' }}>
                Copyright © Nivi Organics. All Rights Reserved.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['VISA', 'MC', 'AMEX', 'STRIPE'].map(p => (
                  <span key={p} style={{
                    fontSize: '10px', fontWeight: '700',
                    border: '1px solid #333',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    color: '#666',
                  }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </footer>
        <CookieBanner />
      </WishlistProvider>
    </CartProvider>
  );
}
