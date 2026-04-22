'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({ email: z.string().trim().toLowerCase().email('Enter a valid email') });

type Result = { success: true; alreadySubscribed: boolean } | { success: false; error: string };

export async function subscribeNewsletter(formData: FormData): Promise<Result> {
  try {
    const { email } = schema.parse({ email: formData.get('email') });

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      return { success: true, alreadySubscribed: true };
    }

    await prisma.newsletterSubscriber.create({ data: { email } });
    return { success: true, alreadySubscribed: false };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message ?? 'Invalid email' };
    }
    return { success: false, error: err instanceof Error ? err.message : 'Failed to subscribe' };
  }
}
