'use client';

import { useState, useTransition } from 'react';
import { updateUserRole } from '../actions';

type Role = 'ADMIN' | 'CUSTOMER';

export default function RoleToggle({
  userId,
  currentRole,
  isSelf,
}: {
  userId: string;
  currentRole: Role;
  isSelf: boolean;
}) {
  const [role, setRole] = useState<Role>(currentRole);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const target: Role = role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
  const label = target === 'ADMIN' ? 'Promote to admin' : 'Demote to customer';

  const handleClick = () => {
    setError(null);
    const confirmMsg =
      target === 'ADMIN'
        ? 'Give this user full admin access to the store?'
        : 'Revoke admin access from this user?';
    if (!confirm(confirmMsg)) return;

    startTransition(async () => {
      const res = await updateUserRole(userId, target);
      if (res.success) {
        setRole(target);
      } else {
        setError(res.error);
      }
    });
  };

  if (isSelf) {
    return (
      <div>
        <div
          style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: role === 'ADMIN' ? '#fee2e2' : '#e0e7ff',
            color: role === 'ADMIN' ? '#dc2626' : '#4338ca',
            padding: '2px 8px',
            borderRadius: '10px',
            marginBottom: '6px',
          }}
        >
          {role}
        </div>
        <div style={{ fontSize: '11px', color: '#9ca3af' }}>
          You can&apos;t change your own role. Ask another admin.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'inline-block',
          fontSize: '11px',
          fontWeight: 700,
          backgroundColor: role === 'ADMIN' ? '#fee2e2' : '#e0e7ff',
          color: role === 'ADMIN' ? '#dc2626' : '#4338ca',
          padding: '2px 8px',
          borderRadius: '10px',
          marginBottom: '10px',
        }}
      >
        {role}
      </div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="btn-outline"
        style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px', display: 'block' }}
      >
        {isPending ? 'Updating…' : label}
      </button>
      {error && (
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#dc2626' }}>{error}</div>
      )}
    </div>
  );
}
