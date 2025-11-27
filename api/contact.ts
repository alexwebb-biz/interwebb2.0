import nodemailer from 'nodemailer';
import { upsertThread, insertMessage } from '../lib/inbox.js';
import { renderUserEmail, renderOwnerEmail } from '../lib/emailTemplates.js';

interface ContactPayload {
  name?: string;
  email?: string;
  budget?: string;
  message?: string;
}

const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM', 'MAIL_TO'] as const;
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.warn(`Contact API misconfiguration. Missing env vars: ${missingEnv.join(', ')}`);
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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (missingEnv.length) {
    res.status(500).json({ error: 'Server email config incomplete' });
    return;
  }

  const payload: ContactPayload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {});

  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const budget = payload.budget?.trim() || 'Not provided';
  const message = payload.message?.trim();

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const subject = `New contact: ${name}`;
    const mailFrom = process.env.MAIL_FROM as string;
    const mailTo = process.env.MAIL_TO as string;

    const ownerMail = {
      from: mailFrom,
      to: mailTo,
      subject,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\n${message}`,
      html: renderOwnerEmail({ name, email, budget, message })
    };

    const userMail = {
      from: mailFrom,
      to: email,
      subject: 'We received your message — Interwebb',
      text: `Hi ${name},\n\nThanks for reaching out. We've received your message and will respond within one business day.\n\nWhile you wait you can reply to this email with more detail.\n\nInterwebb`,
      html: renderUserEmail({ name, email })
    };

    let threadId: string | null = null;
    try {
      threadId = await upsertThread({
        userEmail: email,
        userName: name,
        subject,
        status: 'open',
        preferredChannel: 'email',
        metadata: { budget }
      });

      await insertMessage({
        threadId,
        senderType: 'user',
        channel: 'email',
        body: message,
        metadata: { budget }
      });
    } catch (dbErr) {
      console.warn('Contact API: DB not configured or failed, proceeding with email only.', dbErr);
    }

    await Promise.all([transporter.sendMail(ownerMail), transporter.sendMail(userMail)]);

    res.status(200).json({ ok: true, threadId });
  } catch (err) {
    console.error('Contact API error', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
}
