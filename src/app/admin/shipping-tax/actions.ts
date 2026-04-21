'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createShippingZone(formData: FormData) {
  const name = formData.get('name') as string;
  const regions = formData.get('regions') as string;
  const baseRate = parseFloat(formData.get('baseRate') as string);
  
  await prisma.shippingZone.create({
    data: { name, regions, baseRate }
  });

  revalidatePath('/admin/shipping-tax');
}

export async function deleteShippingZone(id: string) {
  await prisma.shippingZone.delete({ where: { id } });
  revalidatePath('/admin/shipping-tax');
}

export async function createTaxZone(formData: FormData) {
  const name = formData.get('name') as string;
  const region = formData.get('region') as string;
  const rate = parseFloat(formData.get('rate') as string);
  
  await prisma.taxZone.create({
    data: { name, region, rate }
  });

  revalidatePath('/admin/shipping-tax');
}

export async function deleteTaxZone(id: string) {
  await prisma.taxZone.delete({ where: { id } });
  revalidatePath('/admin/shipping-tax');
}
