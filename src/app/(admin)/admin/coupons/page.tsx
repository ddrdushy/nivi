import { PrismaClient } from '@prisma/client';
import CouponForm from '@/components/admin/CouponForm';
import CouponTable from '@/components/admin/CouponTable';

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
        
        {/* Create Form (Client Component) */}
        <CouponForm />

        {/* List (Client Component) */}
        <CouponTable coupons={coupons} />
      </div>
    </div>
  );
}
