import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const productsCount = await prisma.product.count();
  const ordersCount = await prisma.order.count();
  
  // Aggregate total revenue from paid or delivered orders
  const validOrders = await prisma.order.findMany({
    where: {
      status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] }
    }
  });
  
  const totalRevenue = validOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Dashboard Overview</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--color-text-muted)' }}>Total Products</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {productsCount}
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--color-text-muted)' }}>Total Orders</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {ordersCount}
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--color-text-muted)' }}>Revenue</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            Rs. {totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
