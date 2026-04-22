'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/account'); // Redirect to dashboard
      router.refresh(); // ensure navbar updates
    }
  };

  return (
    <div className="container" style={{ padding: '80px 24px', maxWidth: '500px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Welcome Back</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {error && <div style={{ color: '#EC6B81', textAlign: 'center', fontWeight: '700' }}>{error}</div>}
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase' }}>Email Address</label>
          <input 
            type="email" 
            required 
            className="input-base" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase' }}>Password</label>
            <Link href="/forgot-password" style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600 }}>
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            required
            className="input-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
          Sign In
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--color-text-muted)' }}>
        Don&apos;t have an account? <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: '700' }}>Create one here</Link>
      </div>
    </div>
  );
}
