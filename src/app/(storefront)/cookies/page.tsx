import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How Nivi Organics uses cookies and similar technologies on this website.',
};

function LegalPage({ title, lastUpdated, children }: { title: string; lastUpdated: string; children: React.ReactNode }) {
  return (
    <div>
      <section style={{ backgroundColor: '#f9f9f9', padding: '60px 0', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <h1 style={{ fontSize: '40px', color: 'var(--color-text-main)', marginBottom: '8px', fontWeight: '800' }}>{title}</h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Last updated: {lastUpdated}</p>
        </div>
      </section>
      <section style={{ padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <div style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: '1.9' }}>{children}</div>
        </div>
      </section>
    </div>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ fontSize: '20px', color: 'var(--color-text-main)', marginBottom: '12px', fontWeight: '700' }}>{title}</h2>
      {children}
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="April 21, 2026">
      <Section title="What Are Cookies?">
        <p>Cookies are small text files placed on your device when you visit a website. They help websites remember your preferences, keep you logged in, and provide analytics data to improve the website experience.</p>
      </Section>
      <Section title="How We Use Cookies">
        <p>Nivi Organics uses cookies for the following purposes:</p>
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { type: '🔧 Strictly Necessary', desc: 'These cookies are essential for the website to function. They enable core features like shopping cart and account login. These cannot be disabled.' },
            { type: '📊 Analytics & Performance', desc: 'We use cookies to understand how visitors interact with our website (e.g., pages visited, time spent). This helps us improve our site. Data is anonymised.' },
            { type: '🎯 Marketing & Targeting', desc: 'These cookies track your browsing across sites to show you relevant ads. We use these only with your consent.' },
            { type: '⚙️ Functional', desc: 'These cookies remember your preferences (e.g., language, region) to provide a more personalised experience.' },
          ].map((c, i) => (
            <div key={i} style={{ padding: '16px 20px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: '#fafafa' }}>
              <p style={{ fontWeight: '700', color: 'var(--color-text-main)', marginBottom: '6px', fontSize: '14px' }}>{c.type}</p>
              <p style={{ fontSize: '14px' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Managing Cookies">
        <p>You can control and manage cookies through our cookie consent banner when you first visit our website. You can also manage cookie settings through your browser:</p>
        <ul style={{ paddingLeft: '24px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
          <li><strong>Firefox:</strong> Options → Privacy & Security</li>
          <li><strong>Safari:</strong> Preferences → Privacy</li>
          <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
        </ul>
        <p style={{ marginTop: '12px' }}>Please note that disabling certain cookies may affect website functionality.</p>
      </Section>
      <Section title="Third-Party Cookies">
        <p>We may use third-party services including Google Analytics, Stripe, and Meta Pixel that set their own cookies. These are governed by the respective third parties&apos; privacy policies.</p>
      </Section>
      <Section title="Contact Us">
        <p>If you have questions about our use of cookies, please <a href="/contact" style={{ color: 'var(--color-primary)' }}>contact us</a>.</p>
      </Section>
    </LegalPage>
  );
}
