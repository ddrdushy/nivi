import { PrismaClient } from '@prisma/client';
import { createShippingZone, deleteShippingZone, createTaxZone, deleteTaxZone } from './actions';

const prisma = new PrismaClient();

export default async function ShippingTaxAdminPage() {
  const shippingZones = await prisma.shippingZone.findMany();
  const taxZones = await prisma.taxZone.findMany();

  return (
    <div>
      <h1 style={{ fontSize: '24px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '32px' }}>Shipping & Tax Zones</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(350px, 1fr)', gap: '32px' }}>
        
        {/* Shipping Panel */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Shipping Constraints</h2>
          
          <form action={createShippingZone} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            <input type="text" name="name" placeholder="Zone Name (e.g. US Flat)" required className="input-base" style={{ borderRadius: '0' }} />
            <input type="text" name="regions" placeholder="Target Regions (e.g. CA, NY)" required className="input-base" style={{ borderRadius: '0' }} />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>Rs.</span>
              <input type="number" name="baseRate" step="0.01" placeholder="Shipping Cost Rate" required className="input-base" style={{ borderRadius: '0' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ borderRadius: '0', padding: '10px' }}>Add Zone</button>
          </form>

          {shippingZones.map(zone => (
            <div key={zone.id} style={{ padding: '12px', border: '1px solid var(--color-border)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>{zone.name}</strong>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{zone.regions} | Rs. {zone.baseRate}</span>
              </div>
              <form action={async () => { 'use server'; await deleteShippingZone(zone.id); }}>
                <button style={{ color: '#EC6B81', fontSize: '12px', fontWeight: '700' }}>Del</button>
              </form>
            </div>
          ))}
        </div>

        {/* Tax Panel */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Tax Regions</h2>
          
          <form action={createTaxZone} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            <input type="text" name="name" placeholder="Tax Config Name" required className="input-base" style={{ borderRadius: '0' }} />
            <input type="text" name="region" placeholder="Target Region Code" required className="input-base" style={{ borderRadius: '0' }} />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="number" name="rate" step="0.01" placeholder="Tax Rate" required className="input-base" style={{ borderRadius: '0' }} />
              <span style={{ fontSize: '14px', fontWeight: '700' }}>%</span>
            </div>
            <button type="submit" className="btn-primary" style={{ borderRadius: '0', padding: '10px' }}>Add Tax Rule</button>
          </form>

          {taxZones.map(tax => (
            <div key={tax.id} style={{ padding: '12px', border: '1px solid var(--color-border)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>{tax.name}</strong>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{tax.region} | {tax.rate}%</span>
              </div>
              <form action={async () => { 'use server'; await deleteTaxZone(tax.id); }}>
                <button style={{ color: '#EC6B81', fontSize: '12px', fontWeight: '700' }}>Del</button>
              </form>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
