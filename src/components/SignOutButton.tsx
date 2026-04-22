'use client';

import { signOut } from 'next-auth/react';

type Variant = 'outline' | 'subtle';

export default function SignOutButton({
  variant = 'outline',
  callbackUrl = '/login',
}: {
  variant?: Variant;
  callbackUrl?: string;
}) {
  const className = variant === 'outline' ? 'btn-outline' : undefined;
  const baseStyle: React.CSSProperties =
    variant === 'outline'
      ? { padding: '8px 16px', fontSize: '12px', borderWidth: 1 }
      : {
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#6b7280',
          background: 'transparent',
          border: '1px solid transparent',
          borderRadius: '4px',
          cursor: 'pointer',
        };

  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl })}
      className={className}
      style={baseStyle}
    >
      Sign Out
    </button>
  );
}
