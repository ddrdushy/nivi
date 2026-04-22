'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth-guard';
import { z } from 'zod';
import { EMAIL_SETTING_KEYS, loadEmailSettings, sendEmailWithSettings } from '@/lib/email';

const PAYMENT_KEYS = [
  'PAYMENT_MANUAL_ENABLED',
  'PAYMENT_STRIPE_ENABLED',
  'PAYMENT_STRIPE_KEY',
  'PAYMENT_PAYPAL_ENABLED',
  'PAYMENT_PAYPAL_KEY',
  'PAYMENT_RAZORPAY_ENABLED',
  'PAYMENT_RAZORPAY_KEY',
] as const;

export async function updatePaymentSettings(formData: FormData) {
  await requireAdmin();

  for (const key of PAYMENT_KEYS) {
    const isToggle = key.endsWith('_ENABLED');
    const raw = formData.get(key);
    const value = isToggle ? (raw === 'on' ? 'true' : 'false') : String(raw ?? '');

    await prisma.storeSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  revalidatePath('/admin/settings');
  revalidatePath('/checkout');
}

const UNCHANGED_SENTINEL = '__keep__';

const emailFormSchema = z.object({
  EMAIL_ENABLED: z.boolean(),
  EMAIL_PROVIDER: z.string().min(1),
  EMAIL_HOST: z.string().trim(),
  EMAIL_PORT: z.string().trim(),
  EMAIL_SECURE: z.boolean(),
  EMAIL_USER: z.string().trim(),
  EMAIL_PASS: z.string(),
  EMAIL_FROM_NAME: z.string().trim(),
  EMAIL_FROM_ADDRESS: z.string().trim(),
});

export async function updateEmailSettings(formData: FormData) {
  await requireAdmin();

  const parsed = emailFormSchema.parse({
    EMAIL_ENABLED: formData.get('EMAIL_ENABLED') === 'on',
    EMAIL_PROVIDER: formData.get('EMAIL_PROVIDER') || 'CUSTOM',
    EMAIL_HOST: formData.get('EMAIL_HOST') ?? '',
    EMAIL_PORT: formData.get('EMAIL_PORT') ?? '587',
    EMAIL_SECURE: formData.get('EMAIL_SECURE') === 'on',
    EMAIL_USER: formData.get('EMAIL_USER') ?? '',
    EMAIL_PASS: formData.get('EMAIL_PASS') ?? '',
    EMAIL_FROM_NAME: formData.get('EMAIL_FROM_NAME') ?? '',
    EMAIL_FROM_ADDRESS: formData.get('EMAIL_FROM_ADDRESS') ?? '',
  });

  // Password field is shown empty — only overwrite on explicit non-empty input.
  const existing = await loadEmailSettings();
  const nextPass = parsed.EMAIL_PASS === '' || parsed.EMAIL_PASS === UNCHANGED_SENTINEL
    ? existing.pass
    : parsed.EMAIL_PASS;

  const pairs: Array<[(typeof EMAIL_SETTING_KEYS)[number], string]> = [
    ['EMAIL_ENABLED', parsed.EMAIL_ENABLED ? 'true' : 'false'],
    ['EMAIL_PROVIDER', parsed.EMAIL_PROVIDER],
    ['EMAIL_HOST', parsed.EMAIL_HOST],
    ['EMAIL_PORT', parsed.EMAIL_PORT],
    ['EMAIL_SECURE', parsed.EMAIL_SECURE ? 'true' : 'false'],
    ['EMAIL_USER', parsed.EMAIL_USER],
    ['EMAIL_PASS', nextPass],
    ['EMAIL_FROM_NAME', parsed.EMAIL_FROM_NAME],
    ['EMAIL_FROM_ADDRESS', parsed.EMAIL_FROM_ADDRESS],
  ];

  for (const [key, value] of pairs) {
    await prisma.storeSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  revalidatePath('/admin/settings');
}

const testEmailSchema = z.object({
  to: z.string().email(),
});

type TestEmailResult =
  | { success: true; messageId: string }
  | { success: false; error: string };

export async function sendTestEmail(formData: FormData): Promise<TestEmailResult> {
  try {
    await requireAdmin();
    const { to } = testEmailSchema.parse({ to: formData.get('to') });
    const settings = await loadEmailSettings();

    const res = await sendEmailWithSettings(settings, {
      to,
      subject: `Nivi Organics — test email`,
      text: `This is a test email sent from your store's email configuration at ${new Date().toISOString()}. If you received this, SMTP is working.`,
      html: `<p>This is a test email sent from your store's email configuration at <strong>${new Date().toLocaleString()}</strong>.</p><p>If you received this, SMTP is working.</p>`,
    });

    if (res.ok) {
      return { success: true, messageId: res.messageId };
    }
    return { success: false, error: res.error };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? 'Invalid input' };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed' };
  }
}
