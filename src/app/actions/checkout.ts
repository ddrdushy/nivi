'use server';

import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail, loadEmailSettings } from '@/lib/email';
import { customerOrderConfirmation, adminOrderNotification } from '@/lib/emailTemplates';

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
  password?: string;
  items: {
    productId: string;
    variationId?: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
}) {
  try {
    const email = orderData.customerEmail.trim().toLowerCase();
    const phone = orderData.customerPhone.trim();
    const name = orderData.customerName.trim();

    if (!email) return { success: false, error: 'Email is required.' };
    if (!phone) return { success: false, error: 'Phone number is required.' };
    if (!name) return { success: false, error: 'Name is required.' };

    const session = await getServerSession(authOptions);
    const existingUser = await prisma.user.findUnique({ where: { email } });

    let userId: string | null = null;
    let accountCreated = false;
    let linkedExistingAccount = false;

    if (session?.user?.id) {
      // Logged in: always link to current session user, regardless of email typed.
      userId = session.user.id;
      // Backfill name/phone on the user if missing.
      await prisma.user.update({
        where: { id: userId },
        data: {
          phone: phone,
          ...(name && !session.user.name ? { name } : {}),
        },
      });
    } else if (existingUser) {
      // Guest checkout with an email that already has an account.
      // Link the order to that account but do NOT touch their password.
      userId = existingUser.id;
      linkedExistingAccount = true;
      if (!existingUser.phone) {
        await prisma.user.update({ where: { id: userId }, data: { phone } });
      }
    } else {
      // New guest — require password to create an account.
      const password = orderData.password ?? '';
      if (password.length < 6) {
        return { success: false, error: 'Please choose a password (at least 6 characters) to create your account.' };
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const created = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          phone,
          role: 'CUSTOMER',
        },
      });
      userId = created.id;
      accountCreated = true;
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Order
      const order = await tx.order.create({
        data: {
          userId,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
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

    // Fire-and-forget emails — never block the sale if SMTP is down/misconfigured.
    void sendOrderEmails(result.id).catch((e) => console.error('Order emails failed:', e));

    return { success: true, orderId: result.id, accountCreated, linkedExistingAccount };
  } catch (error: any) {
    console.error('Checkout error:', error);
    return { success: false, error: error.message || 'Something went wrong during checkout.' };
  }
}

async function sendOrderEmails(orderId: string): Promise<void> {
  const settings = await loadEmailSettings();
  if (!settings.enabled) return;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return;

  const orderForEmail = {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    address: order.address,
    items: order.items.map((i) => ({ productName: i.productName, quantity: i.quantity, price: i.price })),
    subtotal: order.subtotal,
    discountTotal: order.discountTotal,
    taxTotal: order.taxTotal,
    shippingTotal: order.shippingTotal,
    total: order.total,
    status: order.status,
    paymentMethod: order.paymentMethod,
  };

  // Customer confirmation
  const customer = customerOrderConfirmation(orderForEmail);
  const customerRes = await sendEmail({
    to: order.customerEmail,
    subject: customer.subject,
    html: customer.html,
    text: customer.text,
  });
  if (!customerRes.ok) console.error('Customer order email failed:', customerRes.error);

  // Admin notification
  const notifySetting = await prisma.storeSetting.findUnique({ where: { key: 'ORDER_NOTIFY_EMAIL' } });
  const notifyTo = notifySetting?.value?.trim() || settings.fromAddress;
  if (!notifyTo) return;

  const admin = adminOrderNotification(orderForEmail);
  const adminRes = await sendEmail({
    to: notifyTo,
    subject: admin.subject,
    html: admin.html,
    text: admin.text,
  });
  if (!adminRes.ok) console.error('Admin order email failed:', adminRes.error);
}
