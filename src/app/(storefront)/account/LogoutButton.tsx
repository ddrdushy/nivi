'use client';

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="btn-outline" 
      style={{ padding: '8px 16px', fontSize: '12px', borderWidth: '1px' }}
    >
      Sign Out
    </button>
  );
}
