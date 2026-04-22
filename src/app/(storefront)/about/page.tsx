import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn how Nivi Organics sources single-origin essential oils, raw butters, and herbal powders directly from growers around the world.',
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ backgroundColor: '#f9f9f9', padding: '80px 0', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <p style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Our Story</p>
          <h1 style={{ fontSize: '48px', color: 'var(--color-text-main)', marginBottom: '16px', fontWeight: '800' }}>About Nivi Organics</h1>
          <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Born from a passion for nature and a belief that beauty should be pure, honest, and sustainable.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Our Mission</p>
            <h2 style={{ fontSize: '36px', color: 'var(--color-text-main)', marginBottom: '20px', lineHeight: 1.2 }}>Pure Ingredients,<br />Real Results</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: 1.9, marginBottom: '16px' }}>
              At Nivi Organics, we source only the finest botanicals — cold-pressed oils, wild-harvested butters, and hand-selected herbal powders — directly from trusted growers across Sri Lanka and beyond.
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: 1.9 }}>
              Every product is formulated without synthetic additives, parabens, or harsh chemicals. We believe your skin deserves the very best that nature can offer.
            </p>
          </div>
          <div style={{
            aspectRatio: '1/1',
            backgroundColor: '#fce4e8',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '80px',
          }}>🌿</div>
        </div>
      </section>

      {/* Values */}
      <section style={{ backgroundColor: '#f9f9f9', padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', color: 'var(--color-text-main)' }}>Our Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { icon: '🌱', title: '100% Natural', desc: 'Every ingredient is sourced from nature — no synthetics, no shortcuts.' },
              { icon: '♻️', title: 'Sustainable', desc: 'Eco-friendly packaging and ethical sourcing from small family farms.' },
              { icon: '🐰', title: 'Cruelty Free', desc: 'Never tested on animals. Certified cruelty-free across all products.' },
              { icon: '🔬', title: 'Lab Tested', desc: 'All products are independently tested for purity and efficacy.' },
              { icon: '🤝', title: 'Fair Trade', desc: 'We pay fair prices to every farmer and supplier in our supply chain.' },
              { icon: '💚', title: 'Community First', desc: 'A portion of every sale supports rural women-led farming cooperatives.' },
            ].map((v, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 24px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>{v.icon}</div>
                <h3 style={{ fontSize: '18px', color: 'var(--color-text-main)', marginBottom: '10px' }}>{v.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', color: 'var(--color-text-main)', marginBottom: '8px' }}>Meet the Team</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '48px' }}>The passionate people behind Nivi Organics</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { name: 'Nivi Perera', role: 'Founder & CEO', emoji: '👩‍💼' },
              { name: 'Ashan Fernando', role: 'Head of Formulations', emoji: '👨‍🔬' },
              { name: 'Dilani Ranasinghe', role: 'Sourcing & Sustainability', emoji: '👩‍🌾' },
            ].map((p, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100px', height: '100px',
                  borderRadius: '50%',
                  backgroundColor: '#fce4e8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '48px',
                  margin: '0 auto 16px',
                }}>{p.emoji}</div>
                <h4 style={{ fontSize: '16px', color: 'var(--color-text-main)', fontWeight: '700' }}>{p.name}</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-primary)', marginTop: '4px' }}>{p.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
