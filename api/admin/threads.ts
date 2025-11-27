import nodemailer from 'nodemailer';
import { listThreads, insertMessage, getThreadWithMessages } from '../../lib/inbox.js';
import { renderAdminReplyEmail } from '../../lib/emailTemplates.js';

const requireAdmin = (req: any, res: any) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
};

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
  if (!requireAdmin(req, res)) {
    return;
  }

  if (req.method === 'GET') {
    try {
      const { status, search, limit = 20, offset = 0, threadId } = req.query ?? {};

      if (threadId) {
        const data = await getThreadWithMessages(threadId as string);
        res.status(200).json(data);
        return;
      }

      const threads = await listThreads({
        status: status as string | undefined,
        search: search as string | undefined,
        limit: Number(limit),
        offset: Number(offset)
      });
      res.status(200).json({ threads });
    } catch (err) {
      console.error('Admin threads GET error', err);
      res.status(500).json({ error: 'Failed to fetch threads' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const { threadId, message, channel = 'email', toEmail, toName, subject, sendEmail = true } = body;

      if (!threadId || !message) {
        res.status(400).json({ error: 'threadId and message are required' });
        return;
      }

      if (channel === 'chat' || channel === 'both') {
        await insertMessage({
          threadId,
          senderType: 'admin',
          channel: 'chat',
          body: message,
          metadata: {}
        });
      }

      if ((channel === 'email' || channel === 'both') && toEmail && sendEmail) {
        await transporter.sendMail({
          from: process.env.MAIL_FROM,
          to: toEmail,
          subject: subject || 'Reply from Interwebb',
          html: renderAdminReplyEmail({ toName: toName || 'there', body: message, subject }),
          text: message
        });
      }

      if (channel === 'email') {
        await insertMessage({
          threadId,
          senderType: 'admin',
          channel: 'email',
          body: message,
          metadata: {}
        });
      }

      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('Admin threads POST error', err);
      res.status(500).json({ error: 'Failed to post message' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
