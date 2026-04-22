'use server';

import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth-guard';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional().default(''),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().default(false),
});

type Result = { success: true } | { success: false; error: string };

function handleError(err: unknown): Result {
  if (err instanceof z.ZodError) {
    return { success: false, error: err.issues.map((i) => i.message).join('; ') };
  }
  return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
}

export async function createAddress(formData: FormData): Promise<Result> {
  try {
    const session = await requireUser();
    const userId = session.user.id;

    const data = addressSchema.parse({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      street: formData.get('street'),
      city: formData.get('city'),
      state: formData.get('state'),
      postalCode: formData.get('postalCode'),
      country: formData.get('country'),
      isDefault: formData.get('isDefault') === 'on',
    });

    await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      const existingCount = await tx.address.count({ where: { userId } });
      await tx.address.create({
        data: {
          userId,
          ...data,
          // If this is the user's first address, default it automatically.
          isDefault: data.isDefault || existingCount === 0,
        },
      });
    });

    revalidatePath('/account');
    return { success: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function deleteAddress(id: string): Promise<Result> {
  try {
    const session = await requireUser();
    const userId = session.user.id;

    // Authorize: must belong to caller
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return { success: false, error: 'Address not found' };
    }

    await prisma.address.delete({ where: { id } });
    revalidatePath('/account');
    return { success: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function setDefaultAddress(id: string): Promise<Result> {
  try {
    const session = await requireUser();
    const userId = session.user.id;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return { success: false, error: 'Address not found' };
    }

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      }),
      prisma.address.update({ where: { id }, data: { isDefault: true } }),
    ]);

    revalidatePath('/account');
    return { success: true };
  } catch (err) {
    return handleError(err);
  }
}
