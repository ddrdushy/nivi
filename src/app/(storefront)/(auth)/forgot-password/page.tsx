'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '@/app/actions/password-reset';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('email', email);
    startTransition(async () => {
      await requestPasswordReset(fd);
      setSent(true);
    });
  };

  return (
    <div className="container" style={{ padding: '80px 24px', maxWidth: '480px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '16px' }}>Forgot Password</h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '32px' }}>
        Enter the email you used to sign up and we&apos;ll send you a reset link.
      </p>

      {sent ? (
        <div
          style={{
            padding: '24px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            textAlign: 'center',
            backgroundColor: '#fff',
          }}
        >
          <p style={{ fontSize: '15px', marginBottom: '12px' }}>
            If an account exists for that email, a reset link is on its way.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            The link expires in 30 minutes. Didn&apos;t get anything? Check your spam folder or try again.
          </p>
          <div style={{ marginTop: '24px' }}>
            <Link href="/login" className="btn-outline" style={{ padding: '10px 24px' }}>
              Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="email"
            required
            autoFocus
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base"
          />
          <button
            type="submit"
            disabled={isPending || !email}
            className="btn-primary"
            style={{ padding: '14px 32px' }}
          >
            {isPending ? 'Sending…' : 'Send reset link'}
          </button>
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px' }}>
            Remembered it?{' '}
            <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
