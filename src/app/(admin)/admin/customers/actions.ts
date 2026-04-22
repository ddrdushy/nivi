'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';
import { z } from 'zod';

const roleSchema = z.enum(['ADMIN', 'CUSTOMER']);

type Result = { success: true } | { success: false; error: string };

export async function updateUserRole(userId: string, role: 'ADMIN' | 'CUSTOMER'): Promise<Result> {
  try {
    const session = await requireAdmin();
    const validRole = roleSchema.parse(role);

    if (session.user.id === userId) {
      return { success: false, error: "You can't change your own role. Ask another admin." };
    }

    // Protect against removing the last admin in the system.
    if (validRole === 'CUSTOMER') {
      const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      if (target?.role === 'ADMIN') {
        const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
        if (adminCount <= 1) {
          return { success: false, error: 'At least one admin must remain in the system.' };
        }
      }
    }

    await prisma.user.update({ where: { id: userId }, data: { role: validRole } });
    revalidatePath(`/admin/customers/${userId}`);
    revalidatePath('/admin/customers');
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update role';
    return { success: false, error: msg };
  }
}
