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

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" lastUpdated="April 21, 2026">
      <Section title="1. Introduction">
        <p>Welcome to Nivi Organics (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By accessing or using our website at niviorganics.com, you agree to be bound by these Terms and Conditions. Please read them carefully before placing an order or using our services.</p>
      </Section>

      <Section title="2. Use of the Website">
        <p>You may use our website for lawful purposes only. You must not use our website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website; or in any way which is unlawful, illegal, fraudulent, or harmful.</p>
      </Section>

      <Section title="3. Orders and Payment">
        <p>All orders are subject to acceptance and availability. We reserve the right to refuse any order. Prices are listed in Sri Lankan Rupees (LKR) and are subject to change without notice. Payment must be received in full before goods are dispatched. We accept major credit cards, PayPal, and other payment methods as listed at checkout.</p>
      </Section>

      <Section title="4. Product Description">
        <p>We have made every effort to display the colours and appearance of our products as accurately as possible. However, we cannot guarantee that your device&apos;s display accurately reflects the true colour of our products. All products are described to the best of our knowledge.</p>
      </Section>

      <Section title="5. Shipping & Delivery">
        <p>We aim to dispatch all orders within 2–3 business days. Delivery times vary depending on your location. We are not responsible for delays caused by customs, postal services, or other third parties outside our control. Please refer to our <a href="/shipping" style={{ color: 'var(--color-primary)' }}>Shipping Policy</a> for full details.</p>
      </Section>

      <Section title="6. Returns & Refunds">
        <p>We offer a 14-day return policy on unopened products. Items must be returned in their original condition and packaging. Please contact us at hello@niviorganics.com to initiate a return. Refunds will be processed within 5–7 business days of receiving the returned item. See our <a href="/returns" style={{ color: 'var(--color-primary)' }}>Returns Policy</a> for full details.</p>
      </Section>

      <Section title="7. Intellectual Property">
        <p>All content on this website, including but not limited to text, images, logos, and product descriptions, is the intellectual property of Nivi Organics and is protected by applicable copyright and trademark laws.</p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>To the fullest extent permitted by law, Nivi Organics shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products.</p>
      </Section>

      <Section title="9. Governing Law">
        <p>These Terms and Conditions are governed by and construed in accordance with the laws of Sri Lanka. Any disputes shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.</p>
      </Section>

      <Section title="10. Changes to Terms">
        <p>We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Your continued use of the website following any changes constitutes your acceptance of the new terms.</p>
      </Section>

      <Section title="11. Contact">
        <p>If you have any questions about these Terms and Conditions, please <a href="/contact" style={{ color: 'var(--color-primary)' }}>contact us</a> at hello@niviorganics.com.</p>
      </Section>
    </LegalPage>
  );
}
