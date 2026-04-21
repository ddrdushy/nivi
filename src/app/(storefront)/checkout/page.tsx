import { prisma } from '@/lib/prisma';
import CheckoutFlow from './CheckoutFlow';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const settings = await prisma.storeSetting.findMany();
  const shippingZones = await prisma.shippingZone.findMany();
  const taxZones = await prisma.taxZone.findMany();
  
  const getSetting = (key: string, defaultValue = '') => 
    settings.find(s => s.key === key)?.value || defaultValue;

  const paymentConfig = {
    manual: getSetting('PAYMENT_MANUAL_ENABLED') === 'true',
    stripe: getSetting('PAYMENT_STRIPE_ENABLED') === 'true',
    paypal: getSetting('PAYMENT_PAYPAL_ENABLED') === 'true',
    razorpay: getSetting('PAYMENT_RAZORPAY_ENABLED') === 'true',
  };

  return (
    <div className="container" style={{ padding: '80px 24px', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '40px', textAlign: 'center', fontSize: '32px', textTransform: 'uppercase', letterSpacing: '1px' }}>Checkout</h1>
      <CheckoutFlow paymentConfig={paymentConfig} shippingZones={shippingZones} taxZones={taxZones} />
    </div>
  );
}
