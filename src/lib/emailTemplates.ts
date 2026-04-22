type OrderItem = {
  productName: string;
  quantity: number;
  price: number;
};

type OrderForEmail = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  address?: string | null;
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  total: number;
  status: string;
  paymentMethod: string;
};

const money = (n: number) => `Rs. ${n.toLocaleString()}`;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return c;
    }
  });
}

function renderItems(items: OrderItem[]): { html: string; text: string } {
  const html = items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(i.productName)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${money(i.price * i.quantity)}</td>
      </tr>`,
    )
    .join('');
  const text = items.map((i) => `  • ${i.productName} × ${i.quantity} — ${money(i.price * i.quantity)}`).join('\n');
  return { html, text };
}

function shell(inner: string): string {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#faf8f6;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#33271a;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <h1 style="font-family:Georgia,serif;font-weight:600;color:#33271a;margin:0 0 8px;">🌿 Nivi Organics</h1>
    ${inner}
    <p style="font-size:11px;color:#9ca3af;margin-top:32px;text-align:center;">Pure. Natural. Potent.</p>
  </div></body></html>`;
}

export function customerOrderConfirmation(order: OrderForEmail): { subject: string; html: string; text: string } {
  const shortId = order.id.slice(0, 8).toUpperCase();
  const items = renderItems(order.items);

  const html = shell(`
    <p style="font-size:15px;">Hi ${escapeHtml(order.customerName.split(' ')[0] || 'there')},</p>
    <p>Thank you for your order! We've received it and it's being prepared.</p>
    <div style="background:#fff;border:1px solid #e2d9d0;border-radius:6px;padding:20px;margin:24px 0;">
      <div style="font-size:12px;color:#7a6a5a;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Order #${shortId}</div>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px;">
        <thead>
          <tr style="font-size:11px;color:#7a6a5a;text-transform:uppercase;letter-spacing:1px;">
            <th style="text-align:left;padding:8px 0;border-bottom:1px solid #e2d9d0;">Item</th>
            <th style="text-align:center;padding:8px 0;border-bottom:1px solid #e2d9d0;">Qty</th>
            <th style="text-align:right;padding:8px 0;border-bottom:1px solid #e2d9d0;">Line Total</th>
          </tr>
        </thead>
        <tbody>${items.html}</tbody>
      </table>
      <table style="width:100%;margin-top:16px;font-size:14px;">
        <tr><td style="padding:4px 0;">Subtotal</td><td style="padding:4px 0;text-align:right;">${money(order.subtotal)}</td></tr>
        ${order.discountTotal > 0 ? `<tr><td style="padding:4px 0;color:#d098a2;">Discount</td><td style="padding:4px 0;text-align:right;color:#d098a2;">− ${money(order.discountTotal)}</td></tr>` : ''}
        <tr><td style="padding:4px 0;">Shipping</td><td style="padding:4px 0;text-align:right;">${money(order.shippingTotal)}</td></tr>
        <tr><td style="padding:4px 0;">Tax</td><td style="padding:4px 0;text-align:right;">${money(order.taxTotal)}</td></tr>
        <tr style="font-weight:700;font-size:16px;"><td style="padding:8px 0;border-top:1px solid #e2d9d0;">Total</td><td style="padding:8px 0;border-top:1px solid #e2d9d0;text-align:right;">${money(order.total)}</td></tr>
      </table>
    </div>
    ${order.address ? `<p style="font-size:13px;color:#7a6a5a;"><strong>Shipping to:</strong><br/>${escapeHtml(order.address)}</p>` : ''}
    <p style="font-size:13px;color:#7a6a5a;">Payment: ${order.paymentMethod === 'MANUAL' ? 'Cash on Delivery' : escapeHtml(order.paymentMethod)}</p>
    <p>We'll email you again once your order has shipped. If you have any questions, just reply to this message.</p>
  `);

  const text = `Hi ${order.customerName.split(' ')[0] || 'there'},

Thank you for your order #${shortId}. Here's what you ordered:

${items.text}

Subtotal: ${money(order.subtotal)}
${order.discountTotal > 0 ? `Discount: -${money(order.discountTotal)}\n` : ''}Shipping: ${money(order.shippingTotal)}
Tax: ${money(order.taxTotal)}
Total: ${money(order.total)}

${order.address ? `Shipping to: ${order.address}\n` : ''}Payment: ${order.paymentMethod === 'MANUAL' ? 'Cash on Delivery' : order.paymentMethod}

We'll email you again once your order has shipped.

— Nivi Organics`;

  return { subject: `Order confirmed · #${shortId}`, html, text };
}

export function adminOrderNotification(order: OrderForEmail): { subject: string; html: string; text: string } {
  const shortId = order.id.slice(0, 8).toUpperCase();
  const items = renderItems(order.items);

  const html = shell(`
    <p style="font-size:15px;"><strong>New order #${shortId}</strong></p>
    <div style="background:#fff;border:1px solid #e2d9d0;border-radius:6px;padding:20px;margin:16px 0;">
      <table style="width:100%;font-size:14px;">
        <tr><td style="padding:4px 0;color:#7a6a5a;">Customer</td><td style="padding:4px 0;text-align:right;"><strong>${escapeHtml(order.customerName)}</strong></td></tr>
        <tr><td style="padding:4px 0;color:#7a6a5a;">Email</td><td style="padding:4px 0;text-align:right;">${escapeHtml(order.customerEmail)}</td></tr>
        ${order.customerPhone ? `<tr><td style="padding:4px 0;color:#7a6a5a;">Phone</td><td style="padding:4px 0;text-align:right;">${escapeHtml(order.customerPhone)}</td></tr>` : ''}
        ${order.address ? `<tr><td style="padding:4px 0;color:#7a6a5a;">Shipping</td><td style="padding:4px 0;text-align:right;">${escapeHtml(order.address)}</td></tr>` : ''}
        <tr><td style="padding:4px 0;color:#7a6a5a;">Payment</td><td style="padding:4px 0;text-align:right;">${escapeHtml(order.paymentMethod)}</td></tr>
      </table>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:14px;">
        <thead>
          <tr style="font-size:11px;color:#7a6a5a;text-transform:uppercase;letter-spacing:1px;">
            <th style="text-align:left;padding:8px 0;border-bottom:1px solid #e2d9d0;">Item</th>
            <th style="text-align:center;padding:8px 0;border-bottom:1px solid #e2d9d0;">Qty</th>
            <th style="text-align:right;padding:8px 0;border-bottom:1px solid #e2d9d0;">Line</th>
          </tr>
        </thead>
        <tbody>${items.html}</tbody>
      </table>
      <p style="margin-top:12px;text-align:right;font-size:16px;font-weight:700;">Total: ${money(order.total)}</p>
    </div>
    <p style="font-size:13px;">View + fulfil in the admin panel.</p>
  `);

  const text = `New order #${shortId}

Customer: ${order.customerName} <${order.customerEmail}>
${order.customerPhone ? `Phone: ${order.customerPhone}\n` : ''}${order.address ? `Shipping: ${order.address}\n` : ''}Payment: ${order.paymentMethod}

Items:
${items.text}

Total: ${money(order.total)}`;

  return { subject: `New order · #${shortId} · ${money(order.total)}`, html, text };
}

type PasswordResetInput = {
  name?: string | null;
  resetUrl: string;
  expiresInMinutes: number;
};

export function passwordResetEmail(input: PasswordResetInput): { subject: string; html: string; text: string } {
  const greetingName = input.name ? escapeHtml(input.name.split(' ')[0]) : 'there';

  const html = shell(`
    <p style="font-size:15px;">Hi ${greetingName},</p>
    <p>Someone (hopefully you) asked to reset the password on your Nivi Organics account.</p>
    <p style="margin:24px 0;">
      <a href="${input.resetUrl}" style="background:#d098a2;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:600;letter-spacing:1px;text-transform:uppercase;font-size:13px;">Reset Password</a>
    </p>
    <p style="font-size:13px;color:#7a6a5a;">Or paste this link in your browser:<br/><span style="word-break:break-all;">${escapeHtml(input.resetUrl)}</span></p>
    <p style="font-size:13px;color:#7a6a5a;">This link expires in ${input.expiresInMinutes} minutes. If you didn't request a password reset, you can safely ignore this email.</p>
  `);

  const text = `Hi ${input.name ? input.name.split(' ')[0] : 'there'},

Someone asked to reset the password on your Nivi Organics account. Follow this link to set a new one (expires in ${input.expiresInMinutes} minutes):

${input.resetUrl}

If you didn't request a password reset, ignore this email.

— Nivi Organics`;

  return { subject: 'Reset your Nivi Organics password', html, text };
}
