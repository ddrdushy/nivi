import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function OrdersAdminPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="admin-page-title">Orders Management</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Track sales, manage fulfillments, and update order statuses.</p>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Total</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}> No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#111827' }}>#{order.id.slice(0, 8).toUpperCase()}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>{order.items.length} items</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{order.customerName}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{order.customerEmail}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '700' }}>
                    Rs. {order.total.toLocaleString()}
                  </td>
                  <td style={{ fontSize: '13px', color: '#6b7280' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/admin/orders/${order.id}`} style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: '600' }}>View Details</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
