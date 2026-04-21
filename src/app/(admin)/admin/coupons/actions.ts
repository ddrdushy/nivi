'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';
import { z } from 'zod';

const couponSchema = z.object({
  code: z.string().min(2).transform((s) => s.toUpperCase()),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.coerce.number().positive(),
  usageLimit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : null)),
  expiryDate: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : null)),
  minOrderAmount: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : 0)),
});

export async function createCoupon(formData: FormData) {
  try {
    await requireAdmin();
    const data = couponSchema.parse({
      code: formData.get('code'),
      discountType: formData.get('discountType'),
      value: formData.get('value'),
      usageLimit: formData.get('usageLimit'),
      expiryDate: formData.get('expiryDate'),
      minOrderAmount: formData.get('minOrderAmount'),
    });

    await prisma.coupon.create({
      data: { ...data, isActive: true },
    });

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create coupon';
    return { success: false, error: msg };
  }
}

export async function updateCouponStatus(id: string, isActive: boolean) {
  try {
    await requireAdmin();
    await prisma.coupon.update({ where: { id }, data: { isActive } });
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed';
    return { success: false, error: msg };
  }
}

export async function deleteCoupon(id: string) {
  try {
    await requireAdmin();
    await prisma.coupon.delete({ where: { id } });
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed';
    return { success: false, error: msg };
  }
}
