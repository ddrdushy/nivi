import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import SignOutButton from '@/components/SignOutButton';
import './admin.css'; // We'll create specific admin styles here

export const metadata = {
  title: 'Admin - Nivi Organics',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/admin/dashboard');
  if (session.user?.role !== 'ADMIN') redirect('/');

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>NIVI ORGANICS</h2>
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin/dashboard" className="nav-link">
            <span>📊</span> Dashboard
          </Link>
          <Link href="/admin/orders" className="nav-link">
            <span>📦</span> Orders
          </Link>
          <Link href="/admin/products" className="nav-link">
            <span>🛍️</span> Products
          </Link>
          <Link href="/admin/customers" className="nav-link">
            <span>👥</span> Customers
          </Link>
          <Link href="/admin/coupons" className="nav-link">
            <span>🏷️</span> Coupons
          </Link>
          <Link href="/admin/shipping-tax" className="nav-link">
            <span>🚛</span> Shipping & Tax
          </Link>
          <Link href="/admin/settings" className="nav-link">
            <span>⚙️</span> Settings
          </Link>
          
          <Link href="/" className="nav-link return-link">
            <span>←</span> Return to Store
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Header Bar */}
        <header className="admin-header">
          <div className="admin-breadcrumb">
            <span style={{ color: '#9ca3af', fontSize: '13px' }}>Admin / Home</span>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Global Search..." 
                className="input-base" 
                style={{ padding: '8px 16px', fontSize: '13px', width: '250px' }} 
              />
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>🔍</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                title={session.user?.email ?? 'Admin'}
                style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
              >
                {(session.user?.name || session.user?.email || 'A').charAt(0).toUpperCase()}
              </div>
              <SignOutButton />
            </div>
          </div>
        </header>

        <div className="admin-page-content">
          {children}
        </div>
      </main>
    </div>
  );
}
