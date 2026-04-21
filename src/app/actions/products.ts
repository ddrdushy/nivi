'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin, UnauthorizedError } from '@/lib/auth-guard';
import { z } from 'zod';

const variationSchema = z.object({
  id: z.string().optional(),
  optionName: z.string().min(1, 'Variation label is required'),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
});

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().trim().optional().default(''),
  categoryId: z.string().optional().default(''),
  variations: z.array(variationSchema).default([]),
});

export type ProductInput = z.infer<typeof productSchema>;

type ActionResult = { success: true } | { success: false; error: string };

function handleError(err: unknown): ActionResult {
  if (err instanceof UnauthorizedError) {
    return { success: false, error: err.message };
  }
  if (err instanceof z.ZodError) {
    return { success: false, error: err.issues.map((i) => i.message).join('; ') };
  }
  if (err instanceof Error) {
    return { success: false, error: err.message };
  }
  return { success: false, error: 'Unknown error' };
}

export async function createProduct(input: ProductInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = productSchema.parse(input);

    await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl || null,
        categoryId: data.categoryId || null,
        variations: data.variations.length
          ? {
              create: data.variations.map((v) => ({
                optionName: v.optionName,
                price: v.price,
                stock: v.stock,
              })),
            }
          : undefined,
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function updateProduct(id: string, input: ProductInput): Promise<ActionResult> {
  try {
    await requireAdmin();
    const data = productSchema.parse(input);

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          imageUrl: data.imageUrl || null,
          categoryId: data.categoryId || null,
        },
      });

      const incomingIds = data.variations.filter((v) => v.id).map((v) => v.id!) as string[];
      await tx.productVariation.deleteMany({
        where: { productId: id, id: { notIn: incomingIds.length ? incomingIds : ['__none__'] } },
      });

      for (const v of data.variations) {
        if (v.id) {
          await tx.productVariation.update({
            where: { id: v.id },
            data: { optionName: v.optionName, price: v.price, stock: v.stock },
          });
        } else {
          await tx.productVariation.create({
            data: { productId: id, optionName: v.optionName, price: v.price, stock: v.stock },
          });
        }
      }
    });

    revalidatePath('/admin/products');
    revalidatePath(`/product/${id}`);
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.product.delete({ where: { id } });
    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function bulkDeleteProducts(ids: string[]): Promise<ActionResult> {
  try {
    await requireAdmin();
    const safeIds = z.array(z.string()).nonempty().parse(ids);
    await prisma.product.deleteMany({ where: { id: { in: safeIds } } });
    revalidatePath('/admin/products');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return handleError(err);
  }
}

export async function bulkUpdateProductStock(ids: string[], stock: number): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = z
      .object({ ids: z.array(z.string()).nonempty(), stock: z.number().int().nonnegative() })
      .parse({ ids, stock });
    await prisma.product.updateMany({
      where: { id: { in: parsed.ids } },
      data: { stock: parsed.stock },
    });
    revalidatePath('/admin/products');
    return { success: true };
  } catch (err) {
    return handleError(err);
  }
}
