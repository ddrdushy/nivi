import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import OrderStatusUpdater from './OrderStatusUpdater';

const prisma = new PrismaClient();

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING:   { bg: '#fef3c7', color: '#92400e' },
  PAID:      { bg: '#d1fae5', color: '#065f46' },
  SHIPPED:   { bg: '#dbeafe', color: '#1e40af' },
  DELIVERED: { bg: '#ede9fe', color: '#5b21b6' },
  CANCELLED: { bg: '#fee2e2', color: '#991b1b' },
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true }
      },
      user: true,
    }
  });

  if (!order) return notFound();

  const statusStyle = STATUS_COLORS[order.status] || { bg: '#f3f4f6', color: '#374151' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <Link href="/admin/orders" style={{ color: 'var(--color-text-muted)', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            ← Back to Orders
          </Link>
          <h1 className="admin-page-title">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="status-badge" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color, padding: '6px 16px', fontSize: '13px' }}>
            {order.status}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

        {/* Left — Order Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="admin-table-container">
            <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)', fontWeight: '700', fontSize: '15px' }}>
              Order Items ({order.items.length})
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{ textAlign: 'center' }}>Qty</th>
                  <th style={{ textAlign: 'right' }}>Unit Price</th>
                  <th style={{ textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {(item.product as any)?.imageUrl && (
                          <img
                            src={(item.product as any).imageUrl}
                            alt={item.productName}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: '600' }}>{item.productName}</div>
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>ID: {item.productId.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right' }}>Rs. {item.price.toLocaleString()}</td>
                    <td style={{ textAlign: 'right', fontWeight: '700' }}>Rs. {(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ padding: '20px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280' }}>
                <span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              {order.discountTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-primary)' }}>
                  <span>Discount</span><span>- Rs. {order.discountTotal.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280' }}>
                <span>Shipping</span><span>Rs. {order.shippingTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280' }}>
                <span>Tax</span><span>Rs. {order.taxTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '4px', color: 'var(--color-dark)' }}>
                <span>Total</span><span>Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Status Updater (Client Component) */}
          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />

          {/* Customer Info */}
          <div className="stat-card" style={{ padding: '20px' }}>
            <div style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', color: '#6b7280' }}>Customer</div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{order.customerName}</div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>{order.customerEmail}</div>
            {order.customerPhone && <div style={{ fontSize: '13px', color: '#6b7280' }}>{order.customerPhone}</div>}
            {order.user && (
              <Link href={`/admin/customers/${order.user.id}`} style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: '600', marginTop: '12px', display: 'inline-block' }}>
                View Customer Profile →
              </Link>
            )}
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="stat-card" style={{ padding: '20px' }}>
              <div style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', color: '#6b7280' }}>Shipping Address</div>
              <div style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>{order.address}</div>
            </div>
          )}

          {/* Payment Method */}
          <div className="stat-card" style={{ padding: '20px' }}>
            <div style={{ fontWeight: '700', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', color: '#6b7280' }}>Payment</div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>{order.paymentMethod === 'MANUAL' ? 'Cash on Delivery' : order.paymentMethod}</div>
            {order.couponCode && <div style={{ fontSize: '12px', color: 'var(--color-primary)', marginTop: '6px' }}>Coupon: {order.couponCode}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
