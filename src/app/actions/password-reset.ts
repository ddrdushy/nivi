'use server';

import { prisma } from '@/lib/prisma';
import { sendEmail, loadEmailSettings } from '@/lib/email';
import { passwordResetEmail } from '@/lib/emailTemplates';
import { SITE_URL } from '@/lib/jsonLd';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { z } from 'zod';

const TOKEN_TTL_MINUTES = 30;

function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
});

// Always returns the same shape regardless of whether the email exists, so the
// public form cannot be used to enumerate registered accounts.
export async function requestPasswordReset(formData: FormData): Promise<{ sent: true }> {
  const parsed = requestSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) return { sent: true };

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { sent: true };

  // Mark any outstanding tokens for this user as used so we only have one live.
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  const rawToken = crypto.randomBytes(32).toString('base64url');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  const settings = await loadEmailSettings();
  if (settings.enabled) {
    const resetUrl = `${SITE_URL}/reset-password?token=${rawToken}`;
    const tpl = passwordResetEmail({ name: user.name, resetUrl, expiresInMinutes: TOKEN_TTL_MINUTES });
    const res = await sendEmail({ to: user.email, subject: tpl.subject, html: tpl.html, text: tpl.text });
    if (!res.ok) console.error('Password reset email failed:', res.error);
  } else {
    console.warn('Password reset requested but email is disabled. Token (dev only):', rawToken);
  }

  return { sent: true };
}

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type ResetResult = { success: true } | { success: false; error: string };

export async function resetPassword(formData: FormData): Promise<ResetResult> {
  const parsed = resetSchema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const { token, password } = parsed.data;
  const tokenHash = hashToken(token);
  const now = new Date();

  const stored = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!stored || stored.usedAt || stored.expiresAt < now) {
    return { success: false, error: 'This reset link is invalid or has expired.' };
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { id: stored.userId }, data: { password: hashed } }),
    prisma.passwordResetToken.update({ where: { id: stored.id }, data: { usedAt: now } }),
  ]);

  return { success: true };
}
