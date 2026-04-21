'use client';

import { useState } from 'react';
import { updateOrderStatus } from '../actions';

const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING:   { bg: '#fef3c7', color: '#92400e' },
  PAID:      { bg: '#d1fae5', color: '#065f46' },
  SHIPPED:   { bg: '#dbeafe', color: '#1e40af' },
  DELIVERED: { bg: '#ede9fe', color: '#5b21b6' },
  CANCELLED: { bg: '#fee2e2', color: '#991b1b' },
};

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpdate = async () => {
    if (status === currentStatus) return;
    setLoading(true);
    const res = await updateOrderStatus(orderId, status);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setLoading(false);
  };

  const style = STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#374151' };

  return (
    <div className="stat-card" style={{ padding: '20px' }}>
      <div style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', color: '#6b7280' }}>
        Update Status
      </div>
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="input-base"
        style={{ borderRadius: '4px', marginBottom: '12px', backgroundColor: style.bg, color: style.color, fontWeight: '700', border: `1px solid ${style.color}30` }}
      >
        {STATUSES.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="btn-primary"
        style={{ width: '100%', borderRadius: '4px', opacity: status === currentStatus ? 0.5 : 1 }}
      >
        {loading ? 'Saving…' : saved ? '✓ Saved!' : 'Save Status'}
      </button>
    </div>
  );
}
