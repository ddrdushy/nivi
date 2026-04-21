'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createCoupon(formData: FormData) {
  const code = (formData.get('code') as string).toUpperCase();
  const discountType = formData.get('discountType') as string;
  const value = parseFloat(formData.get('value') as string);
  const usageLimit = formData.get('usageLimit') ? parseInt(formData.get('usageLimit') as string) : null;
  const expiryDate = formData.get('expiryDate') ? new Date(formData.get('expiryDate') as string) : null;
  const minOrderAmount = formData.get('minOrderAmount') ? parseFloat(formData.get('minOrderAmount') as string) : 0;

  try {
    await prisma.coupon.create({
      data: {
        code,
        discountType,
        value,
        usageLimit,
        expiryDate,
        minOrderAmount,
        isActive: true
      }
    });

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCouponStatus(id: string, isActive: boolean) {
  try {
    await prisma.coupon.update({
      where: { id },
      data: { isActive }
    });
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCoupon(id: string) {
  try {
    await prisma.coupon.delete({
      where: { id }
    });

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
