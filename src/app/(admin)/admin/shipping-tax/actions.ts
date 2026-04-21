'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';
import { z } from 'zod';

const shippingSchema = z.object({
  name: z.string().min(1),
  regions: z.string().min(1),
  baseRate: z.coerce.number().nonnegative(),
});

const taxSchema = z.object({
  name: z.string().min(1),
  region: z.string().min(1),
  rate: z.coerce.number().nonnegative(),
});

export async function createShippingZone(formData: FormData) {
  await requireAdmin();
  const data = shippingSchema.parse({
    name: formData.get('name'),
    regions: formData.get('regions'),
    baseRate: formData.get('baseRate'),
  });
  await prisma.shippingZone.create({ data });
  revalidatePath('/admin/shipping-tax');
}

export async function deleteShippingZone(id: string) {
  await requireAdmin();
  await prisma.shippingZone.delete({ where: { id } });
  revalidatePath('/admin/shipping-tax');
}

export async function createTaxZone(formData: FormData) {
  await requireAdmin();
  const data = taxSchema.parse({
    name: formData.get('name'),
    region: formData.get('region'),
    rate: formData.get('rate'),
  });
  await prisma.taxZone.create({ data });
  revalidatePath('/admin/shipping-tax');
}

export async function deleteTaxZone(id: string) {
  await requireAdmin();
  await prisma.taxZone.delete({ where: { id } });
  revalidatePath('/admin/shipping-tax');
}
