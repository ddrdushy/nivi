'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function placeOrder(orderData: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  subtotal: number;
  total: number;
  shippingTotal: number;
  taxTotal: number;
  paymentMethod: string;
  items: {
    productId: string;
    variationId?: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
}) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const order = await tx.order.create({
        data: {
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone,
          address: orderData.address,
          subtotal: orderData.subtotal,
          taxTotal: orderData.taxTotal,
          shippingTotal: orderData.shippingTotal,
          total: orderData.total,
          paymentMethod: orderData.paymentMethod,
          status: 'PENDING',
          items: {
            create: orderData.items.map(item => ({
              productId: item.productId,
              variationId: item.variationId,
              productName: item.productName,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });

      // 2. Update Stock
      for (const item of orderData.items) {
        if (item.variationId) {
          // Update Variation Stock
          const variation = await tx.productVariation.update({
            where: { id: item.variationId },
            data: {
              stock: { decrement: item.quantity }
            }
          });
          if (variation.stock < 0) {
            throw new Error(`Insufficient stock for ${item.productName} (Option: ${variation.optionName})`);
          }
        } else {
          // Update Base Product Stock
          const product = await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity }
            }
          });
          if (product.stock < 0) {
            throw new Error(`Insufficient stock for ${item.productName}`);
          }
        }
      }

      return order;
    });

    return { success: true, orderId: result.id };
  } catch (error: any) {
    console.error('Checkout error:', error);
    return { success: false, error: error.message || 'Something went wrong during checkout.' };
  }
}
