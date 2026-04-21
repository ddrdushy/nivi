'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('nivi_cookies_accepted');
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('nivi_cookies_accepted', 'true');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('nivi_cookies_accepted', 'false');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      backgroundColor: '#111',
      borderTop: '3px solid var(--color-primary)',
      padding: '20px 0',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <p style={{ color: '#fff', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
            🍪 We use cookies to enhance your browsing experience, serve personalised ads or content, and analyse our traffic. By clicking <strong>"Accept All"</strong>, you consent to our use of cookies.{' '}
            <Link href="/privacy" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
              Privacy Policy
            </Link>{' '}·{' '}
            <Link href="/cookies" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
              Cookie Policy
            </Link>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
          <button
            onClick={decline}
            style={{
              padding: '10px 24px',
              borderRadius: '50px',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#ccc',
              fontSize: '13px',
              fontWeight: '600',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            Decline
          </button>
          <button
            onClick={accept}
            style={{
              padding: '10px 28px',
              borderRadius: '50px',
              backgroundColor: 'var(--color-primary)',
              border: 'none',
              color: '#fff',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              letterSpacing: '0.5px',
            }}
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
