'use server';

import { prisma } from '@/lib/prisma';

export type WishlistProduct = {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: { name: string } | null;
};

export async function getWishlistProducts(ids: string[]): Promise<WishlistProduct[]> {
  if (!ids.length) return [];
  // Cap to prevent abuse if someone forges a huge list client-side.
  const safeIds = ids.slice(0, 200);
  const products = await prisma.product.findMany({
    where: { id: { in: safeIds } },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      imageUrl: true,
      category: { select: { name: true } },
    },
  });
  // Preserve the client-supplied ordering (newest-added first, etc.).
  const byId = new Map(products.map((p) => [p.id, p]));
  return safeIds.map((id) => byId.get(id)).filter((p): p is WishlistProduct => !!p);
}
