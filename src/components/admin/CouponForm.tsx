'use client';

import { useState } from 'react';
import { createCoupon } from '@/app/(admin)/admin/coupons/actions';

export default function CouponForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setMessage(null);
    
    const result = await createCoupon(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Coupon created successfully!' });
      (document.getElementById('coupon-form') as HTMLFormElement)?.reset();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to create coupon.' });
    }
    setIsLoading(false);
  };

  return (
    <div className="stat-card" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '16px', marginBottom: '24px', fontWeight: '700' }}>Create Promo Code</h2>
      <form id="coupon-form" action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: '#6b7280' }}>Code</label>
          <input type="text" name="code" required className="input-base" style={{ borderRadius: '4px' }} placeholder="SUMMER2024" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: '#6b7280' }}>Type</label>
            <select name="discountType" required className="input-base" style={{ borderRadius: '4px' }}>
              <option value="PERCENTAGE">%</option>
              <option value="FIXED">Flat</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: '#6b7280' }}>Value</label>
            <input type="number" name="value" step="0.01" required className="input-base" style={{ borderRadius: '4px' }} />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: '#6b7280' }}>Min. Spend (Optional)</label>
          <input type="number" name="minOrderAmount" defaultValue="0" className="input-base" style={{ borderRadius: '4px' }} placeholder="Rs. 0" />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: '#6b7280' }}>Expiry Date (Optional)</label>
          <input type="date" name="expiryDate" className="input-base" style={{ borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: '#6b7280' }}>Usage Limit</label>
          <input type="number" name="usageLimit" placeholder="Unlimited" className="input-base" style={{ borderRadius: '4px' }} />
        </div>
        
        {message && (
          <div style={{ 
            padding: '12px', 
            borderRadius: '4px', 
            fontSize: '13px',
            backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: message.type === 'success' ? '#059669' : '#dc2626',
            border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`
          }}>
            {message.type === 'success' ? '✓' : '✗'} {message.text}
          </div>
        )}

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isLoading}
          style={{ 
            marginTop: '12px', 
            borderRadius: '4px', 
            width: '100%',
            opacity: isLoading ? 0.7 : 1 
          }}
        >
          {isLoading ? 'Creating...' : 'Create Coupon'}
        </button>
      </form>
    </div>
  );
}
