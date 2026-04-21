import { PrismaClient } from '@prisma/client';
import { createCoupon, deleteCoupon } from './actions';

const prisma = new PrismaClient();

export default async function CouponsAdminPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Discount Coupons</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Create Form */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Create Promo Code</h2>
          <form action={createCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Code (e.g. SUMMER10)</label>
              <input type="text" name="code" required className="input-base" style={{ borderRadius: '0' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Discount Type</label>
              <select name="discountType" required className="input-base" style={{ borderRadius: '0' }}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (Rs.)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Value</label>
              <input type="number" name="value" step="0.01" required className="input-base" style={{ borderRadius: '0' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Total Usage Limit (Optional)</label>
              <input type="number" name="usageLimit" placeholder="Unlimited" className="input-base" style={{ borderRadius: '0' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '16px', borderRadius: '0' }}>Create Coupon</button>
          </form>
        </div>

        {/* List */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#f9f9f9', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <th style={{ padding: '16px 24px', fontWeight: '700' }}>Code</th>
                <th style={{ padding: '16px 24px', fontWeight: '700' }}>Value</th>
                <th style={{ padding: '16px 24px', fontWeight: '700' }}>Usage limit</th>
                <th style={{ padding: '16px 24px', fontWeight: '700' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '14px' }}>
                  <td style={{ padding: '16px 24px', fontWeight: '700', color: 'var(--color-primary)' }}>{coupon.code}</td>
                  <td style={{ padding: '16px 24px' }}>
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.value}%` : `Rs. ${coupon.value}`}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    {coupon.usageLimit ? `${coupon.usageCount} / ${coupon.usageLimit}` : `${coupon.usageCount} / ∞`}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <form action={async () => {
                      'use server';
                      await deleteCoupon(coupon.id);
                    }}>
                      <button style={{ color: '#EC6B81', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase' }}>Revoke</button>
                    </form>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>No coupons created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
