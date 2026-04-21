'use client';

import { deleteCoupon, updateCouponStatus } from '@/app/(admin)/admin/coupons/actions';

type Coupon = {
  id: string;
  code: string;
  discountType: string;
  value: number;
  usageLimit: number | null;
  usageCount: number;
  expiryDate: Date | null;
  minOrderAmount: number | null;
  isActive: boolean;
}

export default function CouponTable({ coupons }: { coupons: any[] }) {
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      await deleteCoupon(id);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await updateCouponStatus(id, !currentStatus);
  };

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Value & Min. Spend</th>
            <th>Expires</th>
            <th style={{ textAlign: 'right' }}>Usage Status</th>
            <th style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => {
            const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
            return (
              <tr key={coupon.id}>
                <td>
                  <div style={{ fontWeight: '700', color: coupon.isActive && !isExpired ? 'var(--color-primary)' : '#9ca3af', letterSpacing: '0.5px' }}>
                    {coupon.code}
                  </div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>{coupon.isActive ? 'Active' : 'Disabled'}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '600' }}>
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.value}%` : `Rs. ${coupon.value.toLocaleString()}`}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>Min: Rs. {coupon.minOrderAmount?.toLocaleString() || '0'}</div>
                </td>
                <td>
                  <div style={{ fontSize: '13px', color: isExpired ? '#dc2626' : '#6b7280' }}>
                    {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                  </div>
                  {isExpired && <div style={{ fontSize: '10px', color: '#dc2626', fontWeight: '700' }}>EXPIRED</div>}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{coupon.usageCount} used</span>
                    <span className="status-badge" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                      of {coupon.usageLimit || '∞'}
                    </span>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleToggleStatus(coupon.id, coupon.isActive)}
                      style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {coupon.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                      onClick={() => handleDelete(coupon.id)}
                      style={{ color: '#dc2626', fontWeight: '600', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {coupons.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No coupons created yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
