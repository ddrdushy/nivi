import { Suspense } from 'react';
import Link from 'next/link';
import ResetPasswordForm from './ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="container" style={{ padding: '80px 24px', maxWidth: '480px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '16px' }}>Reset Password</h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '32px' }}>
        Pick a new password for your account.
      </p>

      <Suspense fallback={<div style={{ textAlign: 'center' }}>Loading…</div>}>
        <ResetPasswordForm />
      </Suspense>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px' }}>
        <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
