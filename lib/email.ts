import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@example.com';
const BUSINESS = process.env.BUSINESS_NAME ?? 'AutoCash Buyers';
const REPLY_TO = process.env.REPLY_TO_EMAIL ?? FROM;

export interface LeadEmailData {
  fullName: string;
  email: string;
  year: number;
  make: string;
  model: string;
  trim?: string | null;
}

export async function sendSellerConfirmation(lead: LeadEmailData): Promise<void> {
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
    <p style="margin-top: 24px;">Thanks again,<br><strong>The ${BUSINESS} Team</strong></p>
    <div class="footer">
      This email was sent because you submitted a vehicle offer request at ${BUSINESS}.<br>
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
The ${BUSINESS} Team
  `.trim();

  await resend.emails.send({
    from: `${BUSINESS} <${FROM}>`,
    to: lead.email,
    replyTo: REPLY_TO,
    subject: `We received your offer request for your ${vehicleLabel}`,
    html,
    text,
  });
}
