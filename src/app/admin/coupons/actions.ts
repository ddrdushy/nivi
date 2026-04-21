'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createCoupon(formData: FormData) {
  const code = formData.get('code') as string;
  const discountType = formData.get('discountType') as string;
  const value = parseFloat(formData.get('value') as string);
  const usageLimitStr = formData.get('usageLimit') as string;
  
  const usageLimit = usageLimitStr ? parseInt(usageLimitStr) : null;

  await prisma.coupon.create({
    data: {
      code: code.toUpperCase(),
      discountType,
      value,
      usageLimit
    }
  });

  revalidatePath('/admin/coupons');
}

export async function deleteCoupon(id: string) {
  await prisma.coupon.delete({ where: { id } });
  revalidatePath('/admin/coupons');
}
