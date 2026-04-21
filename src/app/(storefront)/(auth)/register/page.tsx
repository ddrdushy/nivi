'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from './actions';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const res = await registerUser(formData);

    if (res?.error) {
      setError(res.error);
    } else {
      // Auto-login after successful registration
      await signIn('credentials', {
        redirect: false,
        email,
        password
      });
      router.push('/account');
      router.refresh();
    }
  };

  return (
    <div className="container" style={{ padding: '80px 24px', maxWidth: '500px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Create Account</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {error && <div style={{ color: '#EC6B81', textAlign: 'center', fontWeight: '700' }}>{error}</div>}
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase' }}>Full Name</label>
          <input 
            name="name"
            type="text" 
            required 
            className="input-base" 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase' }}>Email Address</label>
          <input 
            name="email"
            type="email" 
            required 
            className="input-base" 
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase' }}>Password</label>
          <input 
            name="password"
            type="password" 
            required 
            className="input-base" 
            minLength={6}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
          Create Profile
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--color-text-muted)' }}>
        Already have an account? <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: '700' }}>Sign In</Link>
      </div>
    </div>
  );
}
