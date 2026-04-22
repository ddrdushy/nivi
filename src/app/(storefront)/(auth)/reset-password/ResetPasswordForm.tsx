'use client';

import { useState, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/app/actions/password-reset';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!token) {
    return (
      <div
        style={{
          padding: '24px',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
          backgroundColor: '#fff',
        }}
      >
        <p style={{ fontSize: '14px' }}>This reset link is missing a token. Please request a new one.</p>
        <div style={{ marginTop: '16px' }}>
          <Link href="/forgot-password" className="btn-outline" style={{ padding: '10px 20px' }}>
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div
        style={{
          padding: '24px',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
          backgroundColor: '#fff',
        }}
      >
        <p style={{ fontSize: '15px', marginBottom: '12px', color: '#065f46' }}>
          ✓ Password updated. You can sign in with your new password.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="btn-primary"
          style={{ padding: '10px 24px' }}
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords don’t match.');
      return;
    }

    const fd = new FormData();
    fd.append('token', token);
    fd.append('password', password);

    startTransition(async () => {
      const res = await resetPassword(fd);
      if (res.success) setDone(true);
      else setError(res.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <input
        type="password"
        required
        minLength={6}
        autoFocus
        placeholder="New password (min. 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-base"
        autoComplete="new-password"
      />
      <input
        type="password"
        required
        minLength={6}
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="input-base"
        autoComplete="new-password"
      />
      {error && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
          }}
        >
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={isPending || !password || !confirm}
        className="btn-primary"
        style={{ padding: '14px 32px' }}
      >
        {isPending ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  );
}
