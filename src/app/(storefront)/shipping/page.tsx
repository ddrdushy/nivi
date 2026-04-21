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

export default function ShippingPage() {
  return (
    <LegalPage title="Shipping & Delivery" lastUpdated="April 21, 2026">
      <Section title="Processing Time">
        <p>All orders are processed within 2–3 business days (Monday–Friday, excluding public holidays). Orders placed on weekends or holidays will be processed on the next business day. You will receive a confirmation email once your order has been dispatched.</p>
      </Section>
      <Section title="Domestic Shipping (Sri Lanka)">
        <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden', marginTop: '8px' }}>
          {[
            { zone: 'Colombo City', time: '1–2 Business Days', cost: 'Rs. 250' },
            { zone: 'Western Province', time: '2–3 Business Days', cost: 'Rs. 350' },
            { zone: 'Other Provinces', time: '3–5 Business Days', cost: 'Rs. 450' },
            { zone: 'Orders over Rs. 5,000', time: 'All Zones', cost: 'FREE' },
          ].map((row, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
              padding: '14px 20px',
              backgroundColor: i % 2 === 0 ? '#fafafa' : '#fff',
              borderBottom: i < 3 ? '1px solid var(--color-border)' : 'none',
              fontSize: '14px',
            }}>
              <span style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>{row.zone}</span>
              <span>{row.time}</span>
              <span style={{ color: row.cost === 'FREE' ? 'var(--color-primary)' : 'inherit', fontWeight: row.cost === 'FREE' ? '700' : '400' }}>{row.cost}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="International Shipping">
        <p>We currently ship to selected countries in South Asia and the Middle East. International shipping rates and delivery times are calculated at checkout based on your location. Import duties and taxes are the responsibility of the customer.</p>
      </Section>
      <Section title="Order Tracking">
        <p>Once your order is shipped, you will receive a tracking number via email. You can track your order through our courier partner&apos;s website or by logging into your <a href="/account" style={{ color: 'var(--color-primary)' }}>account dashboard</a>.</p>
      </Section>
      <Section title="Failed Deliveries">
        <p>If a delivery attempt fails and the package is returned to us, we will contact you to arrange redelivery. Additional shipping charges may apply for re-shipment.</p>
      </Section>
    </LegalPage>
  );
}
