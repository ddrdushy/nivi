'use client';

import { useState, useTransition } from 'react';
import { updateEmailSettings, sendTestEmail } from './actions';

type Preset = {
  value: string;
  label: string;
  host: string;
  port: number;
  secure: boolean;
  help?: string;
};

type Current = {
  enabled: boolean;
  provider: string;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromAddress: string;
  orderNotifyEmail: string;
};

export default function EmailSettingsForm({
  current,
  presets,
}: {
  current: Current;
  presets: Preset[];
}) {
  const [enabled, setEnabled] = useState(current.enabled);
  const [provider, setProvider] = useState(current.provider);
  const [host, setHost] = useState(current.host);
  const [port, setPort] = useState(String(current.port || 587));
  const [secure, setSecure] = useState(current.secure);
  const [user, setUser] = useState(current.user);
  const [pass, setPass] = useState('');
  const [fromName, setFromName] = useState(current.fromName);
  const [fromAddress, setFromAddress] = useState(current.fromAddress);
  const [orderNotifyEmail, setOrderNotifyEmail] = useState(current.orderNotifyEmail);
  const [saveStatus, setSaveStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [isSaving, startSave] = useTransition();

  // Test-send state
  const [testTo, setTestTo] = useState('');
  const [testStatus, setTestStatus] = useState<null | { ok: boolean; msg: string }>(null);
  const [isTesting, startTest] = useTransition();

  const hasStoredPass = current.pass.length > 0;

  const onProviderChange = (nextValue: string) => {
    setProvider(nextValue);
    const preset = presets.find((p) => p.value === nextValue);
    if (preset && nextValue !== 'CUSTOM') {
      setHost(preset.host);
      setPort(String(preset.port));
      setSecure(preset.secure);
    }
  };

  const helpText = presets.find((p) => p.value === provider)?.help;

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveStatus(null);
    const fd = new FormData(e.currentTarget);

    startSave(async () => {
      try {
        await updateEmailSettings(fd);
        setPass(''); // reset so the field shows "(unchanged)" again
        setSaveStatus({ ok: true, msg: 'Saved.' });
      } catch (err) {
        setSaveStatus({ ok: false, msg: err instanceof Error ? err.message : 'Failed to save' });
      }
    });
  };

  const handleTest = () => {
    setTestStatus(null);
    const fd = new FormData();
    fd.append('to', testTo);
    startTest(async () => {
      const res = await sendTestEmail(fd);
      if (res.success) {
        setTestStatus({ ok: true, msg: `Sent (id: ${res.messageId.slice(0, 24)}…).` });
      } else {
        setTestStatus({ ok: false, msg: res.error });
      }
    });
  };

  const inputStyle: React.CSSProperties = { borderRadius: '4px', fontSize: '14px' };
  const rowStyle: React.CSSProperties = { display: 'grid', gap: '8px', marginBottom: '16px' };
  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: 'var(--color-text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  return (
    <>
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 500 }}>
            <input
              type="checkbox"
              name="EMAIL_ENABLED"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            Enable outgoing email
          </label>
          <p style={{ marginTop: '4px', fontSize: '13px', color: 'var(--color-text-muted)', paddingLeft: '28px' }}>
            When off, the store will skip sending transactional emails.
          </p>
        </div>

        <div style={rowStyle}>
          <label style={labelStyle}>Provider</label>
          <select
            name="EMAIL_PROVIDER"
            value={provider}
            onChange={(e) => onProviderChange(e.target.value)}
            className="input-base"
            style={inputStyle}
          >
            {presets.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          {helpText && (
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{helpText}</p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>SMTP Host</label>
            <input
              name="EMAIL_HOST"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="input-base"
              style={{ ...inputStyle, marginTop: '8px' }}
              placeholder="smtp.example.com"
            />
          </div>
          <div>
            <label style={labelStyle}>Port</label>
            <input
              name="EMAIL_PORT"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="input-base"
              style={{ ...inputStyle, marginTop: '8px' }}
              placeholder="587"
            />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', paddingTop: '28px' }}>
            <input
              type="checkbox"
              name="EMAIL_SECURE"
              checked={secure}
              onChange={(e) => setSecure(e.target.checked)}
            />
            TLS
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Username</label>
            <input
              name="EMAIL_USER"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="input-base"
              style={{ ...inputStyle, marginTop: '8px' }}
              placeholder="you@gmail.com"
              autoComplete="off"
            />
          </div>
          <div>
            <label style={labelStyle}>Password / API Key</label>
            <input
              type="password"
              name="EMAIL_PASS"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="input-base"
              style={{ ...inputStyle, marginTop: '8px' }}
              placeholder={hasStoredPass ? '(unchanged — leave blank to keep)' : 'App password or API key'}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>From Name</label>
            <input
              name="EMAIL_FROM_NAME"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="input-base"
              style={{ ...inputStyle, marginTop: '8px' }}
              placeholder="Nivi Organics"
            />
          </div>
          <div>
            <label style={labelStyle}>From Address</label>
            <input
              name="EMAIL_FROM_ADDRESS"
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              className="input-base"
              style={{ ...inputStyle, marginTop: '8px' }}
              placeholder="hello@niviorganics.com"
            />
          </div>
        </div>

        <div style={rowStyle}>
          <label style={labelStyle}>Order Notification Email</label>
          <input
            name="ORDER_NOTIFY_EMAIL"
            type="email"
            value={orderNotifyEmail}
            onChange={(e) => setOrderNotifyEmail(e.target.value)}
            className="input-base"
            style={inputStyle}
            placeholder="orders@niviorganics.com"
          />
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Where new-order alerts are sent. Leave blank to fall back to From Address.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Email Settings'}
          </button>
          {saveStatus && (
            <span style={{ fontSize: '13px', color: saveStatus.ok ? '#065f46' : '#dc2626' }}>
              {saveStatus.msg}
            </span>
          )}
        </div>
      </form>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '32px 0' }} />

      <div>
        <label style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>Send a test email</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="email"
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
            className="input-base"
            style={{ ...inputStyle, flex: 1 }}
            placeholder="destination@example.com"
          />
          <button
            type="button"
            onClick={handleTest}
            className="btn-outline"
            disabled={isTesting || !testTo}
            style={{ borderRadius: '4px' }}
          >
            {isTesting ? 'Sending…' : 'Send Test'}
          </button>
        </div>
        {testStatus && (
          <p
            style={{
              fontSize: '13px',
              marginTop: '8px',
              color: testStatus.ok ? '#065f46' : '#dc2626',
            }}
          >
            {testStatus.msg}
          </p>
        )}
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
          Uses the currently-saved settings. Save first if you changed anything above.
        </p>
      </div>
    </>
  );
}
