'use server';

import { prisma } from '@/lib/prisma';

export async function validateCoupon(code: string, subtotal: number) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return { success: false, error: 'Invalid coupon code.' };
    }

    if (!coupon.isActive) {
      return { success: false, error: 'This coupon is no longer active.' };
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { success: false, error: 'This coupon has expired.' };
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return { success: false, error: 'This coupon has reached its usage limit.' };
    }

    if (subtotal < (coupon.minOrderAmount || 0)) {
      return { success: false, error: `Minimum order amount for this coupon is Rs. ${coupon.minOrderAmount?.toLocaleString()}.` };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * coupon.value) / 100;
    } else {
      discountAmount = coupon.value;
    }

    return { 
      success: true, 
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
        discountAmount
      }
    };
  } catch (error: any) {
    return { success: false, error: 'Failed to validate coupon.' };
  }
}

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
  couponId?: string;
  discountTotal?: number;
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
          discountTotal: orderData.discountTotal || 0,
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

      // 2. Wrap up Coupon Usage
      if (orderData.couponId) {
        await tx.coupon.update({
          where: { id: orderData.couponId },
          data: {
            usageCount: { increment: 1 }
          }
        });
      }

      // 3. Update Stock
      for (const item of orderData.items) {
        if (item.variationId) {
          const variation = await tx.productVariation.update({
            where: { id: item.variationId },
            data: { stock: { decrement: item.quantity } }
          });
          if (variation.stock < 0) throw new Error(`Insufficient stock for ${item.productName}`);
        } else {
          const product = await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } }
          });
          if (product.stock < 0) throw new Error(`Insufficient stock for ${item.productName}`);
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
