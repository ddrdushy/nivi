import { prisma } from '@/lib/prisma';
import { updatePaymentSettings } from './actions';
import EmailSettingsForm from './EmailSettingsForm';
import { loadEmailSettings, PROVIDER_PRESETS } from '@/lib/email';

export default async function SettingsPage() {
  const settings = await prisma.storeSetting.findMany();

  const getSetting = (key: string, defaultValue = '') =>
    settings.find((s) => s.key === key)?.value || defaultValue;

  const manualEnabled = getSetting('PAYMENT_MANUAL_ENABLED') === 'true';
  const stripeEnabled = getSetting('PAYMENT_STRIPE_ENABLED') === 'true';
  const stripeKey = getSetting('PAYMENT_STRIPE_KEY');
  const paypalEnabled = getSetting('PAYMENT_PAYPAL_ENABLED') === 'true';
  const paypalKey = getSetting('PAYMENT_PAYPAL_KEY');
  const razorpayEnabled = getSetting('PAYMENT_RAZORPAY_ENABLED') === 'true';
  const razorpayKey = getSetting('PAYMENT_RAZORPAY_KEY');

  const email = await loadEmailSettings();
  const presets = Object.entries(PROVIDER_PRESETS).map(([value, preset]) => ({
    value,
    label: preset?.label ?? 'Custom SMTP',
    host: preset?.host ?? '',
    port: preset?.port ?? 587,
    secure: preset?.secure ?? false,
    help: preset?.help,
  }));

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Store Settings</h1>

      <div style={{ display: 'grid', gap: '32px', maxWidth: '720px' }}>
        {/* ─── PAYMENT GATEWAYS ─── */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ marginBottom: '24px' }}>Payment Gateways</h2>
          <form action={updatePaymentSettings}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500 }}>
                <input type="checkbox" name="PAYMENT_MANUAL_ENABLED" defaultChecked={manualEnabled} />
                Cash on Delivery (Manual)
              </label>
              <p style={{ marginTop: '4px', fontSize: '14px', color: 'var(--color-text-muted)', paddingLeft: '28px' }}>
                Allow customers to pay when the package is delivered.
              </p>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '24px 0' }} />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500 }}>
                <input type="checkbox" name="PAYMENT_STRIPE_ENABLED" defaultChecked={stripeEnabled} />
                Stripe Gateway
              </label>
              <p style={{ marginTop: '4px', fontSize: '14px', color: 'var(--color-text-muted)', paddingLeft: '28px' }}>
                Accept Credit Cards via Stripe.
              </p>
            </div>
            <div style={{ paddingLeft: '28px' }}>
              <input name="PAYMENT_STRIPE_KEY" type="text" className="input-base" defaultValue={stripeKey} placeholder="Stripe Public Key" />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '24px 0' }} />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500 }}>
                <input type="checkbox" name="PAYMENT_PAYPAL_ENABLED" defaultChecked={paypalEnabled} />
                PayPal Gateway
              </label>
              <p style={{ marginTop: '4px', fontSize: '14px', color: 'var(--color-text-muted)', paddingLeft: '28px' }}>
                Accept Payments via PayPal.
              </p>
            </div>
            <div style={{ paddingLeft: '28px' }}>
              <input name="PAYMENT_PAYPAL_KEY" type="text" className="input-base" defaultValue={paypalKey} placeholder="PayPal Client ID" />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '24px 0' }} />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500 }}>
                <input type="checkbox" name="PAYMENT_RAZORPAY_ENABLED" defaultChecked={razorpayEnabled} />
                Razorpay Gateway
              </label>
              <p style={{ marginTop: '4px', fontSize: '14px', color: 'var(--color-text-muted)', paddingLeft: '28px' }}>
                Accept Payments via Razorpay.
              </p>
            </div>
            <div style={{ paddingLeft: '28px' }}>
              <input name="PAYMENT_RAZORPAY_KEY" type="text" className="input-base" defaultValue={razorpayKey} placeholder="Razorpay Key ID" />
            </div>

            <div style={{ marginTop: '32px' }}>
              <button type="submit" className="btn-primary">Save Payment Settings</button>
            </div>
          </form>
        </div>

        {/* ─── EMAIL ─── */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 style={{ marginBottom: '24px' }}>Email (SMTP)</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Used for password reset, order confirmations, and any transactional message the store sends.
          </p>
          <EmailSettingsForm current={email} presets={presets} />
        </div>
      </div>
    </div>
  );
}
