'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updatePaymentSettings(formData: FormData) {
  const settings = [
    { key: 'PAYMENT_MANUAL_ENABLED', val: formData.get('PAYMENT_MANUAL_ENABLED') === 'on' ? 'true' : 'false' },
    { key: 'PAYMENT_STRIPE_ENABLED', val: formData.get('PAYMENT_STRIPE_ENABLED') === 'on' ? 'true' : 'false' },
    { key: 'PAYMENT_STRIPE_KEY', val: formData.get('PAYMENT_STRIPE_KEY') as string || '' },
    { key: 'PAYMENT_PAYPAL_ENABLED', val: formData.get('PAYMENT_PAYPAL_ENABLED') === 'on' ? 'true' : 'false' },
    { key: 'PAYMENT_PAYPAL_KEY', val: formData.get('PAYMENT_PAYPAL_KEY') as string || '' },
    { key: 'PAYMENT_RAZORPAY_ENABLED', val: formData.get('PAYMENT_RAZORPAY_ENABLED') === 'on' ? 'true' : 'false' },
    { key: 'PAYMENT_RAZORPAY_KEY', val: formData.get('PAYMENT_RAZORPAY_KEY') as string || '' },
  ];

  for (const setting of settings) {
    await prisma.storeSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.val },
      create: { key: setting.key, value: setting.val }
    });
  }

  revalidatePath('/admin/settings');
  revalidatePath('/checkout');
}
