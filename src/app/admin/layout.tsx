import Link from 'next/link';
import './admin.css'; // We'll create specific admin styles here

export const metadata = {
  title: 'Admin - Nivi Organics',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar glass-panel">
        <div className="sidebar-header">
          <h2>Nivi Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin/dashboard" className="nav-link">Dashboard</Link>
          <Link href="/admin/products" className="nav-link">Products</Link>
          <Link href="/admin/settings" className="nav-link">Settings</Link>
          <Link href="/" className="nav-link return-link">← Storefront</Link>
        </nav>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
