import nodemailer from 'nodemailer';

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

const renderUserEmail = (payload: Required<Pick<ContactPayload, 'name' | 'email'>>) => `
  <div style="font-family: 'Inter', Arial, sans-serif; background:#0f172a; color:#e2e8f0; padding:32px;">
    <div style="max-width:640px;margin:0 auto;border:1px solid rgba(255,255,255,0.06);background:linear-gradient(145deg,#0f172a 0%,#0b1224 50%,#0f172a 100%);">
      <div style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.06);">
        <p style="color:#67e8f9;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">Signal received</p>
        <h1 style="font-size:26px;line-height:1.3;color:#fff;margin:0;">We've received your query</h1>
      </div>
      <div style="padding:28px 32px;">
        <p style="margin:0 0 14px;font-size:16px;">Hi ${payload.name},</p>
        <p style="margin:0 0 14px;color:#cbd5e1;font-size:15px;line-height:1.6;">
          Thanks for reaching out to Interwebb. Your message just hit our ops console. A member of the team will reply to
          <span style="color:#67e8f9;">${payload.email}</span> within one working day.
        </p>
        <p style="margin:0 0 22px;color:#cbd5e1;font-size:15px;line-height:1.6;">
          If this is urgent, feel free to reply directly to this email and we'll expedite it.
        </p>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);padding:18px 16px;border-radius:4px;">
          <p style="margin:0;color:#94a3b8;font-size:13px;text-transform:uppercase;letter-spacing:0.12em;">Status</p>
          <p style="margin:6px 0 0;font-size:16px;color:#67e8f9;font-weight:600;">In Review</p>
        </div>
      </div>
      <div style="padding:18px 32px;border-top:1px solid rgba(255,255,255,0.06);color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.16em;">
        Built by Interwebb · london, uk
      </div>
    </div>
  </div>
`;

const renderOwnerEmail = (payload: Required<Pick<ContactPayload, 'name' | 'email' | 'budget' | 'message'>>) => `
  <div style="font-family: 'Inter', Arial, sans-serif; background:#0f172a; color:#e2e8f0; padding:32px;">
    <div style="max-width:720px;margin:0 auto;border:1px solid rgba(255,255,255,0.08);background:linear-gradient(135deg,#0f172a 0%,#0c1326 50%,#0f172a 100%);">
      <div style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;">
        <div>
          <p style="color:#67e8f9;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">New lead</p>
          <h1 style="font-size:22px;line-height:1.4;color:#fff;margin:0;">Contact form submission</h1>
        </div>
        <div style="padding:10px 14px;border:1px solid rgba(255,255,255,0.12);color:#67e8f9;text-transform:uppercase;font-size:12px;letter-spacing:0.16em;">
          Services Page
        </div>
      </div>
      <div style="padding:24px 28px;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);padding:14px 16px;">
          <p style="margin:0 0 6px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;">Name</p>
          <p style="margin:0;font-size:16px;color:#e2e8f0;">${payload.name}</p>
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);padding:14px 16px;">
          <p style="margin:0 0 6px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;">Email</p>
          <p style="margin:0;font-size:16px;color:#e2e8f0;">${payload.email}</p>
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);padding:14px 16px;">
          <p style="margin:0 0 6px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;">Budget</p>
          <p style="margin:0;font-size:16px;color:#e2e8f0;">${payload.budget}</p>
        </div>
      </div>
      <div style="padding:0 28px 28px 28px;">
        <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);padding:16px;">
          <p style="margin:0 0 10px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;">Message</p>
          <p style="margin:0;color:#e2e8f0;line-height:1.6;font-size:15px;white-space:pre-line;">${payload.message}</p>
        </div>
      </div>
    </div>
  </div>
`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (missingEnv.length) {
    res.status(500).json({ error: 'Server email config incomplete' });
    return;
  }

  const payload: ContactPayload =
    typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {});

  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const budget = payload.budget?.trim() || 'Not provided';
  const message = payload.message?.trim();

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const mailFrom = process.env.MAIL_FROM as string;
    const mailTo = process.env.MAIL_TO as string;

    const ownerMail = {
      from: mailFrom,
      to: mailTo,
      subject: `New contact: ${name}`,
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

    await Promise.all([
      transporter.sendMail(ownerMail),
      transporter.sendMail(userMail)
    ]);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact API error', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
}
