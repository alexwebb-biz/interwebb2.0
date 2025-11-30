import nodemailer from 'nodemailer';
import { upsertThread, insertMessage } from '../lib/inbox.js';
import { renderOwnerQuoteEmail, renderUserQuoteEmail } from '../lib/emailTemplates.js';

type IncomingItem = {
  id?: string;
  name?: string;
  price?: number;
};

type QuotePayload = {
  email?: string;
  items?: IncomingItem[];
  total?: number;
  totalOneOff?: number;
  monthlyTotal?: number;
  note?: string;
};

const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'MAIL_TO'] as const;
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.warn(`Quote API misconfiguration. Missing env vars: ${missingEnv.join(', ')}`);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const formatPrice = (value: number) => `£${value.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (missingEnv.length) {
    res.status(500).json({ error: 'Server email config incomplete' });
    return;
  }

  const payload: QuotePayload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const email = payload.email?.trim();
  const note = payload.note?.trim();
  const items = Array.isArray(payload.items) ? payload.items.filter((i) => i?.name) : [];
  const totalOneOff = Number(payload.totalOneOff ?? payload.total ?? 0);
  const monthlyTotal = Number(payload.monthlyTotal ?? 0);

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  if (!items.length) {
    res.status(400).json({ error: 'At least one item must be selected' });
    return;
  }

  const prettyItems = items.map((item) => {
    const name = item.name?.toString().trim() || 'Untitled';
    const price = typeof item.price === 'number' ? formatPrice(item.price) : 'N/A';
    return `${name} — ${price}`;
  });

  const subject = `Quote builder request (${items[0]?.name || 'Custom'})`;
  const mailFrom = process.env.MAIL_FROM as string;
  const mailTo = process.env.MAIL_TO as string;

  try {
    let threadId: string | null = null;
    try {
      threadId = await upsertThread({
        userEmail: email,
        subject,
        status: 'open',
        preferredChannel: 'email',
        metadata: { source: 'quote', totalOneOff, monthlyTotal, items }
      });

      await insertMessage({
        threadId,
        senderType: 'user',
        channel: 'email',
        body: `Quote builder submission\nEmail: ${email}\nTotal: ${formatPrice(totalOneOff)}\nItems:\n- ${prettyItems.join(
          '\n- '
        )}${monthlyTotal ? `\nMonthly: ${formatPrice(monthlyTotal)} / month` : ''}${
          note ? `\n\nNote:\n${note}` : ''
        }`,
        metadata: { totalOneOff, monthlyTotal, items, note }
      });
    } catch (dbErr) {
      console.warn('Quote API: DB not configured or failed, proceeding with email only.', dbErr);
    }

    const ownerMail = {
      from: mailFrom,
      to: mailTo,
      subject,
      replyTo: email,
      text: `Email: ${email}\nTotal: ${formatPrice(totalOneOff)}${
        monthlyTotal ? `\nMonthly: ${formatPrice(monthlyTotal)} / month` : ''
      }\nItems:\n- ${prettyItems.join('\n- ')}${note ? `\n\nNote:\n${note}` : ''}`,
      html: renderOwnerQuoteEmail({
        email,
        items: prettyItems,
        total: formatPrice(totalOneOff),
        monthly: monthlyTotal ? `${formatPrice(monthlyTotal)} / month` : undefined,
        note
      })
    };

    const userMail = {
      from: mailFrom,
      to: email,
      subject: 'We received your selections — Interwebb',
      text: `We have your quote request.\n\nItems:\n- ${prettyItems.join(
        '\n- '
      )}\n\nEstimated total: ${formatPrice(totalOneOff)}${
        monthlyTotal ? `\nMonthly: ${formatPrice(monthlyTotal)} / month` : ''
      }\n\nWe will reply shortly to confirm details.`,
      html: renderUserQuoteEmail({
        email,
        total: formatPrice(totalOneOff),
        monthly: monthlyTotal ? `${formatPrice(monthlyTotal)} / month` : undefined,
        items: prettyItems
      })
    };

    await Promise.all([transporter.sendMail(ownerMail), transporter.sendMail(userMail)]);

    res.status(200).json({ ok: true, threadId });
  } catch (err) {
    console.error('Quote API error', err);
    res.status(500).json({ error: 'Failed to send request' });
  }
}
