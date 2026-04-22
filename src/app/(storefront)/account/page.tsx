import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";
import AddressBook from "./AddressBook";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Admins don't have a customer account view — send them to the admin panel.
  if (session.user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  const userId = session.user.id;

  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
    prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { id: 'asc' }],
    }),
  ]);

  return (
    <div className="container" style={{ padding: '80px 24px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid var(--color-border)', paddingBottom: '24px' }}>
        <h1 style={{ fontSize: '32px' }}>My Account</h1>
        <SignOutButton />
      </div>

      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Welcome, {session.user?.name || session.user?.email}</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>Manage your orders and account details below.</p>
      </div>

      <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>Order History</h3>
      
      {orders.length === 0 ? (
        <div style={{ padding: '32px', border: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          You have not placed any orders yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              style={{
                display: 'block',
                border: '1px solid var(--color-border)',
                padding: '24px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#fff',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              }}
              className="order-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                <div>
                  <strong>Order #{order.id.substring(0, 8).toUpperCase()}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    {order.createdAt.toLocaleDateString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      backgroundColor: order.status === 'DELIVERED' ? '#c9d2b7' : '#E5E5E5',
                      color: '#0F0F0F',
                      fontSize: '10px',
                      fontWeight: '700',
                      letterSpacing: '1px',
                    }}
                  >
                    {order.status}
                  </span>
                  <div style={{ marginTop: '8px', fontWeight: '700' }}>Rs. {order.total}</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', color: 'var(--color-text-muted)' }}>
                <span>{order.items.length} item(s) purchased.</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '13px' }}>
                  View details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <AddressBook addresses={addresses} />
    </div>
  );
}
