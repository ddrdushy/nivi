'use client';

import { useState } from 'react';
import { updateOrderStatus } from '../actions';

const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING: { bg: '#fef3c7', color: '#92400e' },
  PAID: { bg: '#d1fae5', color: '#065f46' },
  SHIPPED: { bg: '#dbeafe', color: '#1e40af' },
  DELIVERED: { bg: '#ede9fe', color: '#5b21b6' },
  CANCELLED: { bg: '#fee2e2', color: '#991b1b' },
};

const TRACKING_STATUSES = new Set(['SHIPPED', 'DELIVERED']);

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  currentTrackingNumber,
  currentTrackingUrl,
}: {
  orderId: string;
  currentStatus: string;
  currentTrackingNumber: string | null;
  currentTrackingUrl: string | null;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState(currentTrackingNumber ?? '');
  const [trackingUrl, setTrackingUrl] = useState(currentTrackingUrl ?? '');
  const [loading, setLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dirty =
    status !== currentStatus ||
    trackingNumber !== (currentTrackingNumber ?? '') ||
    trackingUrl !== (currentTrackingUrl ?? '');

  const handleUpdate = async () => {
    if (!dirty) return;
    setLoading(true);
    setErrorMsg(null);
    setSavedMsg(null);
    const res = await updateOrderStatus(orderId, {
      status,
      trackingNumber: trackingNumber.trim(),
      trackingUrl: trackingUrl.trim(),
    });
    if (res.success) {
      setSavedMsg('✓ Saved');
      setTimeout(() => setSavedMsg(null), 2500);
    } else {
      setErrorMsg(res.error);
    }
    setLoading(false);
  };

  const style = STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#374151' };
  const showTracking = TRACKING_STATUSES.has(status);

  return (
    <div className="stat-card" style={{ padding: '20px' }}>
      <div style={{ fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', color: '#6b7280' }}>
        Update Status
      </div>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="input-base"
        style={{
          borderRadius: '4px',
          marginBottom: '12px',
          backgroundColor: style.bg,
          color: style.color,
          fontWeight: 700,
          border: `1px solid ${style.color}30`,
        }}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {showTracking && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
          <input
            className="input-base"
            style={{ borderRadius: '4px', fontSize: '13px' }}
            placeholder="Tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <input
            className="input-base"
            style={{ borderRadius: '4px', fontSize: '13px' }}
            placeholder="Tracking URL (optional)"
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
          />
        </div>
      )}

      {errorMsg && (
        <div style={{ marginBottom: '8px', fontSize: '12px', color: '#dc2626' }}>{errorMsg}</div>
      )}

      <button
        onClick={handleUpdate}
        disabled={loading || !dirty}
        className="btn-primary"
        style={{ width: '100%', borderRadius: '4px', opacity: dirty ? 1 : 0.5 }}
      >
        {loading ? 'Saving…' : savedMsg ?? 'Save'}
      </button>
    </div>
  );
}
