import nodemailer, { type Transporter } from 'nodemailer';
import { prisma } from '@/lib/prisma';

const KEYS = [
  'EMAIL_ENABLED',
  'EMAIL_PROVIDER',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_SECURE',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_FROM_NAME',
  'EMAIL_FROM_ADDRESS',
] as const;

export type EmailSettingKey = (typeof KEYS)[number];

export const EMAIL_SETTING_KEYS: readonly EmailSettingKey[] = KEYS;

export type EmailSettings = {
  enabled: boolean;
  provider: string;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromAddress: string;
};

// Preset SMTP configs. Selecting a preset in the UI auto-fills host/port/secure;
// users can still override for edge cases.
export const PROVIDER_PRESETS: Record<
  string,
  { host: string; port: number; secure: boolean; label: string; help?: string } | null
> = {
  CUSTOM: null, // leave everything manual
  GMAIL: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    label: 'Gmail',
    help: 'Use an App Password (not your regular password). 2FA must be enabled on the Google account.',
  },
  YAHOO: {
    host: 'smtp.mail.yahoo.com',
    port: 587,
    secure: false,
    label: 'Yahoo Mail',
    help: 'Generate an App Password under Account Security.',
  },
  OUTLOOK: {
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    label: 'Outlook / Hotmail',
  },
  SENDGRID: {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    label: 'SendGrid',
    help: 'Use "apikey" as the username and your API key as the password.',
  },
  MAILGUN: {
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    label: 'Mailgun',
  },
  RESEND: {
    host: 'smtp.resend.com',
    port: 587,
    secure: false,
    label: 'Resend',
    help: 'Use "resend" as the username and your API key as the password.',
  },
};

export async function loadEmailSettings(): Promise<EmailSettings> {
  const rows = await prisma.storeSetting.findMany({ where: { key: { in: [...KEYS] } } });
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    enabled: map.get('EMAIL_ENABLED') === 'true',
    provider: map.get('EMAIL_PROVIDER') || 'CUSTOM',
    host: map.get('EMAIL_HOST') || '',
    port: parseInt(map.get('EMAIL_PORT') || '587', 10),
    secure: map.get('EMAIL_SECURE') === 'true',
    user: map.get('EMAIL_USER') || '',
    pass: map.get('EMAIL_PASS') || '',
    fromName: map.get('EMAIL_FROM_NAME') || '',
    fromAddress: map.get('EMAIL_FROM_ADDRESS') || '',
  };
}

let cached: { key: string; transporter: Transporter } | null = null;

function settingsKey(s: EmailSettings): string {
  return [s.host, s.port, s.secure, s.user, s.pass].join('|');
}

function buildTransporter(s: EmailSettings): Transporter {
  return nodemailer.createTransport({
    host: s.host,
    port: s.port,
    secure: s.secure,
    auth: s.user || s.pass ? { user: s.user, pass: s.pass } : undefined,
  });
}

async function getTransporter(settings?: EmailSettings): Promise<Transporter> {
  const s = settings ?? (await loadEmailSettings());
  const key = settingsKey(s);
  if (cached && cached.key === key) return cached.transporter;
  const transporter = buildTransporter(s);
  cached = { key, transporter };
  return transporter;
}

export type SendEmailInput = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
};

export async function sendEmail(
  input: SendEmailInput,
): Promise<{ ok: true; messageId: string } | { ok: false; error: string }> {
  const settings = await loadEmailSettings();
  if (!settings.enabled) {
    return { ok: false, error: 'Email is disabled in store settings' };
  }
  if (!settings.host || !settings.fromAddress) {
    return { ok: false, error: 'Email settings are incomplete (host and from address required)' };
  }

  try {
    const transporter = await getTransporter(settings);
    const info = await transporter.sendMail({
      from: settings.fromName
        ? `"${settings.fromName}" <${settings.fromAddress}>`
        : settings.fromAddress,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to send email' };
  }
}

// Used by the settings page to test a new config before the values are committed.
export async function sendEmailWithSettings(
  settings: EmailSettings,
  input: SendEmailInput,
): Promise<{ ok: true; messageId: string } | { ok: false; error: string }> {
  if (!settings.host || !settings.fromAddress) {
    return { ok: false, error: 'Host and from-address are required' };
  }
  try {
    const transporter = buildTransporter(settings);
    const info = await transporter.sendMail({
      from: settings.fromName
        ? `"${settings.fromName}" <${settings.fromAddress}>`
        : settings.fromAddress,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to send email' };
  }
}
