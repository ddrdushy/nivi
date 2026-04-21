import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function CustomersPage() {
  const users = await prisma.user.findMany({
    include: {
      orders: {
        where: {
          status: { in: ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED'] }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="admin-page-title">Customers CRM</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Manage and track your customer lifetime value and activity.</p>
        </div>
        <button className="btn-primary" style={{ borderRadius: '4px', fontSize: '13px' }}>+ Add Customer</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Orders</th>
              <th style={{ textAlign: 'right' }}>Lifetime Spend</th>
              <th>Joined</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  No customers found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const totalSpend = user.orders.reduce((sum, order) => sum + order.total, 0);
                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                          {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#111827' }}>{user.name || 'Guest Customer'}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>Active</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>{user.orders.length}</td>
                    <td style={{ textAlign: 'right', fontWeight: '700' }}>Rs. {totalSpend.toLocaleString()}</td>
                    <td style={{ fontSize: '13px', color: '#6b7280' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link href={`/admin/customers/${user.id}`} style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: '600' }}>View Details</Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
