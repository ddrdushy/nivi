import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CheckoutFlow from './CheckoutFlow';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  const settings = await prisma.storeSetting.findMany();
  const shippingZones = await prisma.shippingZone.findMany();
  const taxZones = await prisma.taxZone.findMany();

  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, phone: true },
      })
    : null;

  const getSetting = (key: string, defaultValue = '') =>
    settings.find(s => s.key === key)?.value || defaultValue;

  const paymentConfig = {
    manual: getSetting('PAYMENT_MANUAL_ENABLED') === 'true',
    stripe: getSetting('PAYMENT_STRIPE_ENABLED') === 'true',
    paypal: getSetting('PAYMENT_PAYPAL_ENABLED') === 'true',
    razorpay: getSetting('PAYMENT_RAZORPAY_ENABLED') === 'true',
  };

  const customer = user
    ? { name: user.name ?? '', email: user.email, phone: user.phone ?? '' }
    : null;

  return (
    <div className="container" style={{ padding: '80px 24px', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '40px', textAlign: 'center', fontSize: '32px', textTransform: 'uppercase', letterSpacing: '1px' }}>Checkout</h1>
      <CheckoutFlow
        paymentConfig={paymentConfig}
        shippingZones={shippingZones}
        taxZones={taxZones}
        isLoggedIn={!!session?.user?.id}
        customer={customer}
      />
    </div>
  );
}
