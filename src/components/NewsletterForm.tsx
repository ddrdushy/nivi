'use client';

import { useState, useTransition } from 'react';
import { subscribeNewsletter } from '@/app/actions/newsletter';

type Feedback = { kind: 'success' | 'info' | 'error'; message: string } | null;

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const fd = new FormData();
    fd.append('email', email);

    startTransition(async () => {
      const res = await subscribeNewsletter(fd);
      if (res.success) {
        setEmail('');
        setFeedback({
          kind: res.alreadySubscribed ? 'info' : 'success',
          message: res.alreadySubscribed
            ? "You're already on the list — thanks!"
            : 'Thanks for subscribing!',
        });
      } else {
        setFeedback({ kind: 'error', message: res.error });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: 0 }}>
        <input
          type="email"
          name="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          style={{
            flex: 1,
            padding: '13px 20px',
            backgroundColor: '#111',
            border: '1px solid #333',
            borderRight: 'none',
            borderRadius: '50px 0 0 50px',
            fontSize: '14px',
            color: '#fff',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="submit"
          disabled={isPending}
          style={{
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            padding: '13px 24px',
            borderRadius: '0 50px 50px 0',
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '1px',
            border: 'none',
            cursor: isPending ? 'wait' : 'pointer',
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? '…' : 'SIGN UP'}
        </button>
      </div>
      {feedback && (
        <div
          role="status"
          style={{
            fontSize: '12px',
            color:
              feedback.kind === 'error'
                ? '#fecaca'
                : feedback.kind === 'info'
                  ? '#d6d3d1'
                  : '#bbf7d0',
          }}
        >
          {feedback.message}
        </div>
      )}
    </form>
  );
}
