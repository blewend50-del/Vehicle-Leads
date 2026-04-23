import { Resend } from 'resend';

const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@example.com';
const BUSINESS = process.env.BUSINESS_NAME ?? 'Progressive Motors Acquisition Team';
const REPLY_TO = process.env.REPLY_TO_EMAIL ?? FROM;
const NOTIFY_EMAIL = process.env.NOTIFICATION_EMAIL ?? '';

export interface LeadEmailData {
  fullName: string;
  email: string;
  phone: string;
  year: number;
  make: string;
  model: string;
  trim?: string | null;
  vin?: string | null;
  mileage: number;
  condition: string;
  hasAccident: boolean;
  zipCode: string;
}

export async function sendSellerConfirmation(lead: LeadEmailData): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const vehicleLabel = [lead.year, lead.make, lead.model, lead.trim]
    .filter(Boolean)
    .join(' ');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; margin: 0; padding: 20px; }
    .card { background: #fff; border-radius: 12px; max-width: 560px; margin: 0 auto; padding: 40px; }
    .logo { font-size: 22px; font-weight: 700; color: #1e3a5f; margin-bottom: 24px; }
    h1 { font-size: 24px; color: #111; margin: 0 0 16px; }
    p { font-size: 16px; color: #444; line-height: 1.6; margin: 0 0 16px; }
    .highlight { background: #f0f7ff; border-left: 4px solid #1e3a5f; padding: 16px 20px; border-radius: 6px; margin: 24px 0; }
    .highlight strong { color: #1e3a5f; }
    .footer { margin-top: 32px; font-size: 13px; color: #999; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">${BUSINESS}</div>
    <h1>We got your request, ${lead.fullName.split(' ')[0]}!</h1>
    <p>Thank you for submitting your <strong>${vehicleLabel}</strong> for a cash offer. Our team has received your information and will be in touch <strong>within 1 business hour</strong>.</p>
    <div class="highlight">
      <strong>What happens next?</strong><br><br>
      A vehicle specialist will review your details and call or text you with a <strong>no-obligation cash offer</strong>. There's nothing more you need to do right now — just keep your phone handy.
    </div>
    <p>Questions? Reply to this email or call us directly — we're happy to help.</p>
    <p style="margin-top: 24px;">Thanks again,<br><strong>The ${BUSINESS}</strong></p>
    <div class="footer">
      This email was sent because you submitted a vehicle offer request to ${BUSINESS}.<br>
      No obligation — you are free to decline any offer.
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Hi ${lead.fullName.split(' ')[0]},

Thank you for submitting your ${vehicleLabel} for a cash offer.

Our team has received your information and will be in touch within 1 business hour with a no-obligation cash offer.

Questions? Just reply to this email.

Thanks,
The ${BUSINESS}
  `.trim();

  await resend.emails.send({
    from: `${BUSINESS} <${FROM}>`,
    to: lead.email,
    reply_to: REPLY_TO,
    subject: `We received your offer request for your ${vehicleLabel}`,
    html,
    text,
  });
}

export async function sendLeadNotification(lead: LeadEmailData): Promise<void> {
  if (!process.env.RESEND_API_KEY || !NOTIFY_EMAIL) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const vehicleLabel = [lead.year, lead.make, lead.model, lead.trim].filter(Boolean).join(' ');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; margin: 0; padding: 20px; }
    .card { background: #fff; border-radius: 12px; max-width: 560px; margin: 0 auto; padding: 40px; }
    h1 { font-size: 22px; color: #1B2B4B; margin: 0 0 20px; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
    .label { font-size: 13px; color: #888; width: 140px; shrink: 0; }
    .value { font-size: 14px; color: #111; font-weight: 500; }
    .badge { display: inline-block; background: #2ECC71; color: white; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; margin-bottom: 16px; }
    .cta { display: block; margin-top: 24px; background: #1B2B4B; color: white; text-align: center; padding: 14px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🔔 New Lead</div>
    <h1>New vehicle submission received</h1>
    <div class="row"><span class="label">Name</span><span class="value">${lead.fullName}</span></div>
    <div class="row"><span class="label">Phone</span><span class="value">${lead.phone}</span></div>
    <div class="row"><span class="label">Email</span><span class="value">${lead.email}</span></div>
    <div class="row"><span class="label">ZIP Code</span><span class="value">${lead.zipCode}</span></div>
    <div class="row"><span class="label">Vehicle</span><span class="value">${vehicleLabel}</span></div>
    ${lead.vin ? `<div class="row"><span class="label">VIN</span><span class="value">${lead.vin}</span></div>` : ''}
    <div class="row"><span class="label">Mileage</span><span class="value">${lead.mileage.toLocaleString()} miles</span></div>
    <div class="row"><span class="label">Condition</span><span class="value" style="text-transform: capitalize">${lead.condition}</span></div>
    <div class="row"><span class="label">Accident History</span><span class="value">${lead.hasAccident ? 'Yes' : 'No'}</span></div>
    <a href="https://www.selltoprogressivemotors.com/admin" class="cta">View in Admin Dashboard →</a>
  </div>
</body>
</html>
  `.trim();

  await resend.emails.send({
    from: `${BUSINESS} <${FROM}>`,
    to: NOTIFY_EMAIL,
    subject: `🔔 New Lead: ${lead.fullName} — ${vehicleLabel}`,
    html,
  });
}
