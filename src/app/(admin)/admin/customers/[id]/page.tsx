import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        include: { items: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    notFound();
  }

  const validOrders = user.orders.filter(o => ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED'].includes(o.status));
  const totalSpent = validOrders.reduce((sum, o) => sum + o.total, 0);
  const aov = validOrders.length > 0 ? totalSpent / validOrders.length : 0;

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <Link href="/admin/customers" style={{ color: 'var(--color-primary)', fontSize: '14px', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
          ← Back to Customers
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
              {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="admin-page-title" style={{ marginBottom: '4px' }}>{user.name || 'Guest Customer'}</h1>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Customer since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '4px', fontSize: '13px' }}>Edit Profile</button>
            <button className="btn-primary" style={{ padding: '8px 16px', borderRadius: '4px', fontSize: '13px' }}>Send Email</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div className="stat-card" style={{ padding: '24px' }}>
          <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>Total Spent</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>Rs. {totalSpent.toLocaleString()}</div>
        </div>
        <div className="stat-card" style={{ padding: '24px' }}>
          <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>Total Orders</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>{user.orders.length}</div>
        </div>
        <div className="stat-card" style={{ padding: '24px' }}>
          <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>Avg. Order Value</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>Rs. {aov.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
        <div className="admin-table-container">
          <h2 style={{ fontSize: '16px', padding: '20px 24px', margin: 0, borderBottom: '1px solid #f0f0f0', fontWeight: '700' }}>Order History</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {user.orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link href={`/admin/orders/${order.id}`} style={{ fontWeight: '700', color: 'var(--color-primary)', textDecoration: 'none' }}>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Link>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{order.items.length} items</div>
                  </td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '600' }}>Rs. {order.total.toLocaleString()}</td>
                  <td style={{ fontSize: '13px', color: '#6b7280' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {user.orders.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No orders found for this customer.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="stat-card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '14px', marginBottom: '20px', fontWeight: '700', textTransform: 'uppercase', color: '#6b7280' }}>Customer Information</h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Email Address</label>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>{user.email}</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Member Status</label>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>Verified Member</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Role</label>
                <div style={{ 
                  display: 'inline-block',
                  fontSize: '11px', 
                  fontWeight: '700', 
                  backgroundColor: user.role === 'ADMIN' ? '#fee2e2' : '#e0e7ff',
                  color: user.role === 'ADMIN' ? '#dc2626' : '#4338ca',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
