'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';

const ALLOWED_KEYS = [
  'PAYMENT_MANUAL_ENABLED',
  'PAYMENT_STRIPE_ENABLED',
  'PAYMENT_STRIPE_KEY',
  'PAYMENT_PAYPAL_ENABLED',
  'PAYMENT_PAYPAL_KEY',
  'PAYMENT_RAZORPAY_ENABLED',
  'PAYMENT_RAZORPAY_KEY',
] as const;

export async function updatePaymentSettings(formData: FormData) {
  await requireAdmin();

  for (const key of ALLOWED_KEYS) {
    const isToggle = key.endsWith('_ENABLED');
    const raw = formData.get(key);
    const value = isToggle ? (raw === 'on' ? 'true' : 'false') : String(raw ?? '');

    await prisma.storeSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  revalidatePath('/admin/settings');
  revalidatePath('/checkout');
}
