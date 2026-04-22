import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds',
  description: 'How to return a Nivi Organics order and what qualifies for a refund within our 9-day return window.',
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

export default function ReturnsPage() {
  return (
    <LegalPage title="Returns & Refunds" lastUpdated="April 21, 2026">
      <div style={{
        backgroundColor: '#fce4e8',
        borderLeft: '4px solid var(--color-primary)',
        padding: '16px 20px',
        borderRadius: '0 8px 8px 0',
        marginBottom: '40px',
        fontSize: '14px',
        color: 'var(--color-text-main)',
      }}>
        🌿 We want you to love every Nivi Organics product. If you&apos;re not 100% satisfied, we&apos;re here to help.
      </div>

      <Section title="Return Eligibility">
        <p>We accept returns within <strong>14 days</strong> of the delivery date, provided that:</p>
        <ul style={{ paddingLeft: '24px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>The product is unused, unopened, and in its original packaging</li>
          <li>The product has not been damaged due to misuse</li>
          <li>Proof of purchase is provided</li>
        </ul>
        <p style={{ marginTop: '12px' }}>Due to hygiene reasons, we cannot accept returns on opened skincare or wellness products unless they are faulty.</p>
      </Section>

      <Section title="How to Initiate a Return">
        <ol style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <li>Email us at <a href="mailto:hello@niviorganics.com" style={{ color: 'var(--color-primary)' }}>hello@niviorganics.com</a> with your order number and reason for return.</li>
          <li>We will respond within 24–48 hours with return instructions.</li>
          <li>Ship the item(s) back to us at the address provided. Customers are responsible for return shipping costs unless the item is defective.</li>
          <li>Once we receive and inspect the return, we will process your refund.</li>
        </ol>
      </Section>

      <Section title="Refund Processing">
        <p>Approved refunds will be credited to your original payment method within <strong>5–7 business days</strong>. You will receive a confirmation email when your refund has been processed. Please note that your bank may take additional time to post the credit.</p>
      </Section>

      <Section title="Damaged or Defective Items">
        <p>If your order arrives damaged or defective, please contact us within <strong>48 hours</strong> of delivery with photos of the damage. We will arrange a full replacement or refund at no cost to you.</p>
      </Section>

      <Section title="Exchanges">
        <p>At this time, we do not offer direct exchanges. If you wish to exchange an item, please return the original item and place a new order for the desired product.</p>
      </Section>

      <Section title="Non-Returnable Items">
        <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>Opened or used products</li>
          <li>Gift cards and promotional items</li>
          <li>Items purchased on final sale</li>
        </ul>
      </Section>
    </LegalPage>
  );
}
