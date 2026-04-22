import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Nivi Organics collects, uses, and protects your personal data.',
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
          <div style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: '1.9' }}>
            {children}
          </div>
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

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="April 21, 2026">
      <Section title="1. Introduction">
        <p>Nivi Organics (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect your data when you visit our website or make a purchase.</p>
      </Section>

      <Section title="2. Information We Collect">
        <p style={{ marginBottom: '12px' }}>We collect information you provide directly to us, including:</p>
        <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>Name, email address, phone number</li>
          <li>Billing and shipping address</li>
          <li>Payment information (processed securely via payment gateways)</li>
          <li>Order history and preferences</li>
          <li>Messages sent through our contact form</li>
        </ul>
        <p style={{ marginTop: '12px' }}>We also automatically collect certain technical data including IP address, browser type, and pages visited via cookies and analytics tools.</p>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>To process and fulfil your orders</li>
          <li>To send order confirmations and shipping updates</li>
          <li>To provide customer support</li>
          <li>To send promotional emails (if you have opted in)</li>
          <li>To improve our website and customer experience</li>
          <li>To comply with legal obligations</li>
        </ul>
      </Section>

      <Section title="4. Sharing Your Information">
        <p>We do not sell or rent your personal data. We may share your information with trusted third parties including payment processors (Stripe, Razorpay), shipping providers, and analytics services — only as necessary to operate our business and serve you.</p>
      </Section>

      <Section title="5. Cookies">
        <p>We use cookies to enhance your experience on our website. You can control and manage cookies through your browser settings. For more information, see our <a href="/cookies" style={{ color: 'var(--color-primary)' }}>Cookie Policy</a>.</p>
      </Section>

      <Section title="6. Data Retention">
        <p>We retain your personal data for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your account and data at any time by contacting us.</p>
      </Section>

      <Section title="7. Your Rights">
        <p>You have the right to access, correct, or delete your personal data; object to or restrict processing; request data portability; and withdraw consent at any time. Contact us at hello@niviorganics.com to exercise these rights.</p>
      </Section>

      <Section title="8. Security">
        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse. All payment transactions are encrypted using SSL technology.</p>
      </Section>

      <Section title="9. Contact Us">
        <p>If you have any questions about this Privacy Policy, please <a href="/contact" style={{ color: 'var(--color-primary)' }}>contact us</a> at hello@niviorganics.com or write to us at 45 Galle Road, Colombo 03, Sri Lanka.</p>
      </Section>
    </LegalPage>
  );
}
