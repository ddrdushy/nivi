import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import OrderStatusTimeline from '@/components/OrderStatusTimeline';

export const metadata: Metadata = {
  title: 'Order details',
  robots: { index: false, follow: false },
};

export default async function CustomerOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (session.user.role === 'ADMIN') {
    // Admins should see admin view, not the customer one.
    const { id } = await params;
    redirect(`/admin/orders/${id}`);
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!order || order.userId !== session.user.id) return notFound();

  const shortId = order.id.slice(0, 8).toUpperCase();

  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: '900px' }}>
      <Link
        href="/account"
        style={{
          color: 'var(--color-primary)',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          display: 'inline-block',
          marginBottom: '24px',
        }}
      >
        ← Back to my account
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Order #{shortId}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
            Placed on {order.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ fontSize: '22px', fontWeight: 700 }}>Rs. {order.total.toLocaleString()}</div>
      </div>

      {/* ─── Status timeline ─── */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '8px' }}>Status</h2>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
          <OrderStatusTimeline status={order.status} />
        </div>
      </section>

      {/* ─── Tracking ─── */}
      {(order.trackingNumber || order.trackingUrl) && (
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '8px' }}>Tracking</h2>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#fff',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              {order.trackingNumber && (
                <>
                  <div
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--color-text-muted)',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    Tracking number
                  </div>
                  <div style={{ fontSize: '16px', fontFamily: 'monospace', fontWeight: 600 }}>
                    {order.trackingNumber}
                  </div>
                </>
              )}
            </div>
            {order.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '13px' }}
              >
                Track Package →
              </a>
            )}
          </div>
        </section>
      )}

      {/* ─── Items ─── */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '8px' }}>Items ({order.items.length})</h2>
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          {order.items.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                borderTop: i === 0 ? 'none' : '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '64px',
                  height: '64px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  backgroundColor: '#fafafa',
                  flexShrink: 0,
                  border: '1px solid var(--color-border)',
                }}
              >
                {item.product?.imageUrl ? (
                  <Image
                    src={item.product.imageUrl}
                    alt={item.productName}
                    fill
                    sizes="64px"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🧴</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.productName}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Qty {item.quantity} × Rs. {item.price.toLocaleString()}
                </div>
              </div>
              <div style={{ fontWeight: 700 }}>
                Rs. {(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Summary + shipping ─── */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <div style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
          <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
            Payment
          </h3>
          <div style={{ fontSize: '14px', fontWeight: 600 }}>
            {order.paymentMethod === 'MANUAL' ? 'Cash on Delivery' : order.paymentMethod}
          </div>
          <div style={{ marginTop: '12px', fontSize: '13px', display: 'grid', gap: '4px', color: 'var(--color-text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            {order.discountTotal > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-primary)' }}>
                <span>Discount</span><span>− Rs. {order.discountTotal.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping</span><span>Rs. {order.shippingTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax</span><span>Rs. {order.taxTotal.toLocaleString()}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--color-border)',
                paddingTop: '8px',
                marginTop: '4px',
                fontWeight: 700,
                fontSize: '14px',
                color: 'var(--color-text-main)',
              }}
            >
              <span>Total</span><span>Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {order.address && (
          <div style={{ padding: '20px', backgroundColor: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
            <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
              Shipping to
            </h3>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>{order.customerName}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{order.address}</div>
            {order.customerPhone && (
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                {order.customerPhone}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
