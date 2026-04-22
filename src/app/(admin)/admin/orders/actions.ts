'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';
import { z } from 'zod';

const statusSchema = z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']);

const updateSchema = z.object({
  status: statusSchema,
  trackingNumber: z.string().trim().optional().default(''),
  trackingUrl: z.string().trim().optional().default(''),
});

type Result = { success: true } | { success: false; error: string };

export async function updateOrderStatus(
  orderId: string,
  input: { status: string; trackingNumber?: string; trackingUrl?: string },
): Promise<Result> {
  try {
    await requireAdmin();
    const parsed = updateSchema.parse(input);

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: parsed.status,
        trackingNumber: parsed.trackingNumber || null,
        trackingUrl: parsed.trackingUrl || null,
      },
    });
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/account/orders/${orderId}`);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed';
    return { success: false, error: msg };
  }
}
