export default function ContactPage() {
  return (
    <div>
      <section style={{ backgroundColor: '#f9f9f9', padding: '80px 0', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <p style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>Get In Touch</p>
          <h1 style={{ fontSize: '48px', color: 'var(--color-text-main)', marginBottom: '16px', fontWeight: '800' }}>Contact Us</h1>
          <p style={{ fontSize: '16px', color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
            Have a question about your order or our products? We&apos;re here to help.
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '60px' }}>
          {/* Info */}
          <div>
            <h2 style={{ fontSize: '24px', color: 'var(--color-text-main)', marginBottom: '32px' }}>Our Details</h2>
            {[
              { icon: '📍', label: 'Address', value: '45 Galle Road, Colombo 03, Sri Lanka' },
              { icon: '📞', label: 'Phone', value: '+94 11 234 5678' },
              { icon: '✉️', label: 'Email', value: 'hello@niviorganics.com' },
              { icon: '🌐', label: 'Website', value: 'www.niviorganics.com' },
              { icon: '🕐', label: 'Hours', value: 'Mon–Fri: 9AM – 6PM' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '28px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '44px', height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#fce4e8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', flexShrink: 0,
                }}>{item.icon}</div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{item.label}</p>
                  <p style={{ fontSize: '15px', color: 'var(--color-text-main)' }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ backgroundColor: '#f9f9f9', padding: '40px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: '22px', color: 'var(--color-text-main)', marginBottom: '28px' }}>Send a Message</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-main)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>First Name</label>
                  <input className="input-base" type="text" placeholder="Nivi" style={{ backgroundColor: '#fff' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-main)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Last Name</label>
                  <input className="input-base" type="text" placeholder="Perera" style={{ backgroundColor: '#fff' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-main)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Email</label>
                <input className="input-base" type="email" placeholder="you@example.com" style={{ backgroundColor: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-main)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Subject</label>
                <input className="input-base" type="text" placeholder="Order enquiry" style={{ backgroundColor: '#fff' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-main)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>Message</label>
                <textarea className="input-base" rows={5} placeholder="How can we help you?" style={{ backgroundColor: '#fff', resize: 'vertical', borderRadius: '12px' }} />
              </div>
              <button className="btn-primary" style={{ alignSelf: 'flex-start', padding: '14px 36px' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
