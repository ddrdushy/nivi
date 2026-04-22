import { prisma } from '@/lib/prisma';
import StatCard from '@/components/admin/StatCard';
import SalesChart from '@/components/admin/SalesChart';
import TopProducts from '@/components/admin/TopProducts';

export default async function DashboardPage() {
  // 1. Fetch Real Stats
  const productsCount = await prisma.product.count();
  const ordersCount = await prisma.order.count();
  const customersCount = await prisma.user.count(); // Assuming registered users as customers
  
  const validOrders = await prisma.order.findMany({
    where: {
      status: { in: ['PAID', 'SHIPPED', 'DELIVERED', 'COMPLETED'] }
    },
    include: {
      items: true
    }
  });
  
  const totalRevenue = validOrders.reduce((sum, order) => sum + order.total, 0);
  const aov = ordersCount > 0 ? totalRevenue / ordersCount : 0;

  // 2. Aggregate Top Products (Manual group by for simplicity)
  const productStats: Record<string, { id: string, name: string, rev: number, sales: number, img?: string | null }> = {};
  
  validOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productStats[item.productId]) {
        productStats[item.productId] = { 
          id: item.productId, 
          name: item.productName, 
          rev: 0, 
          sales: 0 
        };
      }
      productStats[item.productId].rev += item.price * item.quantity;
      productStats[item.productId].sales += item.quantity;
    });
  });

  const topProductsList = Object.values(productStats)
    .sort((a, b) => b.rev - a.rev)
    .slice(0, 5);

  // 3. Real Chart Data (Last 7 days)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: days[d.getDay()],
      fullDate: d.toISOString().split('T')[0],
      revenue: 0,
      orders: 0
    };
  });

  validOrders.forEach(order => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    const dayData = last7Days.find(d => d.fullDate === orderDate);
    if (dayData) {
      dayData.revenue += order.total;
      dayData.orders += 1;
    }
  });

  const lowStockThreshold = 5;
  const lowStockProducts = await prisma.product.count({
    where: { stock: { lte: lowStockThreshold } }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="admin-page-title">Store Overview</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '4px' }}>Export CSV</button>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '4px' }}>New Order</button>
        </div>
      </div>

      {/* Counter Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <StatCard label="Total Revenue" value={`Rs. ${totalRevenue.toLocaleString()}`} icon="💰" />
        <StatCard label="Total Orders" value={ordersCount} icon="📦" />
        <StatCard label="Customers" value={customersCount} icon="👥" />
        <StatCard label="Avg. Order Value" value={`Rs. ${aov.toLocaleString()}`} icon="📈" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Sales Chart Panel */}
        <div className="glass-panel" style={{ padding: '24px', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '16px', margin: 0 }}>Revenue Trend</h3>
            <select style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #e1e4e8', borderRadius: '4px' }}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>Visual representation of sales performance over the week.</p>
          <SalesChart data={last7Days} />
        </div>

        {/* Top Products Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <TopProducts products={topProductsList as any} />
          
          {/* Quick Tasks */}
          <div className="glass-panel" style={{ padding: '24px', background: 'white', flex: 1 }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 16px' }}>Store Health</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: '13px' }}>Low Stock Products</span>
                <span style={{ 
                  backgroundColor: lowStockProducts > 0 ? '#fee2e2' : '#f3f4f6', 
                  color: lowStockProducts > 0 ? '#dc2626' : '#6b7280', 
                  padding: '2px 8px', 
                  borderRadius: '10px', 
                  fontSize: '11px', 
                  fontWeight: '700' 
                }}>
                  {lowStockProducts} Alerts
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: '13px' }}>Pending Orders</span>
                <span style={{ 
                  backgroundColor: ordersCount > 0 ? '#fef3c7' : '#f3f4f6', 
                  color: ordersCount > 0 ? '#92400e' : '#6b7280', 
                  padding: '2px 8px', 
                  borderRadius: '10px', 
                  fontSize: '11px', 
                  fontWeight: '700' 
                }}>
                  {ordersCount} New
                </span>
              </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px' }}>Unresolved Tickets</span>
                <span style={{ backgroundColor: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
