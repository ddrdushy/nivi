'use client';

import { useState, useTransition } from 'react';
import { createAddress, deleteAddress, setDefaultAddress } from './actions';

type Address = {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefault: false,
};

export default function AddressBook({ addresses }: { addresses: Address[] }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'isDefault') {
        if (v) fd.append(k, 'on');
      } else {
        fd.append(k, String(v));
      }
    });

    startTransition(async () => {
      const res = await createAddress(fd);
      if (res.success) {
        setForm(INITIAL_FORM);
        setShowForm(false);
      } else {
        setError(res.error);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this address?')) return;
    startTransition(async () => {
      const res = await deleteAddress(id);
      if (!res.success) alert(res.error);
    });
  };

  const handleSetDefault = (id: string) => {
    startTransition(async () => {
      const res = await setDefaultAddress(id);
      if (!res.success) alert(res.error);
    });
  };

  const input = (name: keyof typeof form, placeholder: string, required = true) => (
    <input
      className="input-base"
      style={{ borderRadius: '4px', fontSize: '14px' }}
      placeholder={placeholder}
      required={required}
      value={form[name] as string}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
    />
  );

  return (
    <section style={{ marginTop: '48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '24px' }}>Saved Addresses</h3>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className={showForm ? 'btn-outline' : 'btn-primary'}
          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '4px' }}
        >
          {showForm ? 'Cancel' : '+ Add Address'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            border: '1px solid var(--color-border)',
            padding: '24px',
            marginBottom: '24px',
            borderRadius: 'var(--radius-sm)',
            display: 'grid',
            gap: '12px',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          {input('firstName', 'First name *')}
          {input('lastName', 'Last name *')}
          <div style={{ gridColumn: 'span 2' }}>{input('street', 'Street address *')}</div>
          {input('city', 'City *')}
          {input('state', 'State / Region', false)}
          {input('postalCode', 'Postal code *')}
          {input('country', 'Country *')}

          <label style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            />
            Set as my default shipping address
          </label>

          {error && (
            <div style={{ gridColumn: 'span 2', color: '#dc2626', fontSize: '13px', padding: '8px 12px', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ padding: '10px 20px', borderRadius: '4px' }}>
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="btn-primary" style={{ padding: '10px 20px', borderRadius: '4px' }}>
              {isPending ? 'Saving…' : 'Save Address'}
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div style={{ padding: '32px', border: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          You haven&apos;t saved any addresses yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              style={{
                border: '1px solid var(--color-border)',
                padding: '20px',
                borderRadius: 'var(--radius-sm)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {addr.isDefault && (
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    color: 'var(--color-primary)',
                    backgroundColor: 'var(--color-secondary)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  Default
                </span>
              )}
              <div style={{ fontWeight: 700 }}>{addr.firstName} {addr.lastName}</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {addr.street}
                <br />
                {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postalCode}
                <br />
                {addr.country}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', fontWeight: 600 }}>
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={isPending}
                    style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    Set as default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(addr.id)}
                  disabled={isPending}
                  style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 'auto' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
