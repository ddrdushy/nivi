'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function bulkDeleteProducts(ids: string[]) {
  try {
    await prisma.product.deleteMany({
      where: { id: { in: ids } }
    });
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function bulkUpdateProductStock(ids: string[], stock: number) {
  try {
    await prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { stock }
    });
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);
  const imageUrl = formData.get('imageUrl') as string;
  const categoryId = formData.get('categoryId') as string;

  try {
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        imageUrl: imageUrl || null,
        categoryId: categoryId || null,
      }
    });

    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);
  const imageUrl = formData.get('imageUrl') as string;
  const categoryId = formData.get('categoryId') as string;

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        imageUrl: imageUrl || null,
        categoryId: categoryId || null,
      }
    });

    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    });
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
