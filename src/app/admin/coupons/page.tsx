import { PrismaClient } from '@prisma/client';
import { createCoupon, deleteCoupon } from './actions';

const prisma = new PrismaClient();

export default async function CouponsAdminPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="admin-page-title">Discount Coupons</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Create and manage promotional codes and discount rules.</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Create Form */}
        <div className="stat-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '24px', fontWeight: '700' }}>Create Promo Code</h2>
          <form action={createCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: '#6b7280' }}>Code (e.g. SUMMER10)</label>
              <input type="text" name="code" required className="input-base" style={{ borderRadius: '4px' }} placeholder="SUMMER2024" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: '#6b7280' }}>Discount Type</label>
              <select name="discountType" required className="input-base" style={{ borderRadius: '4px' }}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (Rs.)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: '#6b7280' }}>Value</label>
              <input type="number" name="value" step="0.01" required className="input-base" style={{ borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', color: '#6b7280' }}>Total Usage Limit (Optional)</label>
              <input type="number" name="usageLimit" placeholder="Unlimited" className="input-base" style={{ borderRadius: '4px' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '12px', borderRadius: '4px', width: '100%' }}>Create Coupon</button>
          </form>
        </div>

        {/* List */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Value</th>
                <th style={{ textAlign: 'right' }}>Usage Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--color-primary)', letterSpacing: '0.5px' }}>{coupon.code}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600' }}>
                      {coupon.discountType === 'PERCENTAGE' ? `${coupon.value}%` : `Rs. ${coupon.value.toLocaleString()}`}
                    </span>
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
                    <form action={deleteCoupon.bind(null, coupon.id)}>
                      <button type="submit" style={{ color: '#dc2626', fontWeight: '600', fontSize: '13px', background: 'none', border: 'none', cursor: 'pointer' }}>Revoke</button>
                    </form>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No coupons created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
