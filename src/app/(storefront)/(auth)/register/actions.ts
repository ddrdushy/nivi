'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().optional().default(''),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function registerUser(formData: FormData) {
  try {
    const data = schema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return { error: 'Email is already registered' };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: {
        name: data.name || null,
        email: data.email,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    });

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { error: err.issues.map((i) => i.message).join('; ') };
    }
    return { error: err instanceof Error ? err.message : 'Registration failed' };
  }
}
