import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'All pages on the Nivi Organics store, grouped for easy navigation.',
};

const sitemapLinks = [
  {
    category: '🛍️ Shopping',
    links: [
      { label: 'Home', href: '/' },
      { label: 'All Products', href: '/' },
      { label: 'Essential Oils', href: '/' },
      { label: 'Raw Butters', href: '/' },
      { label: 'Herbal Powders', href: '/' },
      { label: 'New Arrivals', href: '/' },
    ],
  },
  {
    category: '👤 Account',
    links: [
      { label: 'Login', href: '/login' },
      { label: 'Register', href: '/register' },
      { label: 'My Account', href: '/account' },
      { label: 'Order History', href: '/account' },
      { label: 'Checkout', href: '/checkout' },
    ],
  },
  {
    category: '📦 Orders & Shipping',
    links: [
      { label: 'Shipping Policy', href: '/shipping' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'Track Order', href: '/account' },
    ],
  },
  {
    category: '📋 Legal',
    links: [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
  {
    category: '🏢 Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div>
      <section style={{ backgroundColor: '#f9f9f9', padding: '60px 0', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <h1 style={{ fontSize: '40px', color: 'var(--color-text-main)', marginBottom: '8px', fontWeight: '800' }}>Sitemap</h1>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Find every page on the Nivi Organics website</p>
        </div>
      </section>

      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '40px' }}>
            {sitemapLinks.map((section) => (
              <div key={section.category}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '16px', paddingBottom: '10px', borderBottom: '2px solid var(--color-primary)', display: 'inline-block' }}>
                  {section.category}
                </h2>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} style={{ fontSize: '14px', color: 'var(--color-text-muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--color-primary)', fontSize: '10px' }}>▶</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
