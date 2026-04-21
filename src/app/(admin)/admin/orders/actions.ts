'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';
import { z } from 'zod';

const statusSchema = z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']);

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await requireAdmin();
    const parsed = statusSchema.parse(status);
    await prisma.order.update({
      where: { id: orderId },
      data: { status: parsed },
    });
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed';
    return { success: false, error: msg };
  }
}
