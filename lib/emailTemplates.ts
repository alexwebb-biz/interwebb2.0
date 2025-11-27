type BasicContact = {
  name: string;
  email: string;
  budget?: string;
  message?: string;
  subject?: string;
};

export const renderUserEmail = (payload: Pick<BasicContact, 'name' | 'email'>) => `
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
        Built by Interwebb · London, UK
      </div>
    </div>
  </div>
`;

export const renderOwnerEmail = (payload: Required<Pick<BasicContact, 'name' | 'email' | 'budget' | 'message'>>) => `
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

export const renderAdminReplyEmail = (payload: { toName: string; body: string; subject?: string }) => `
  <div style="font-family: 'Inter', Arial, sans-serif; background:#0f172a; color:#e2e8f0; padding:32px;">
    <div style="max-width:640px;margin:0 auto;border:1px solid rgba(255,255,255,0.06);background:linear-gradient(145deg,#0f172a 0%,#0b1224 50%,#0f172a 100%);">
      <div style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.06);">
        <p style="color:#67e8f9;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">Interwebb Response</p>
        <h1 style="font-size:22px;line-height:1.4;color:#fff;margin:0;">${payload.subject || 'Reply from the team'}</h1>
      </div>
      <div style="padding:24px 28px;">
        <p style="margin:0 0 12px;font-size:16px;">Hi ${payload.toName},</p>
        <div style="color:#cbd5e1;font-size:15px;line-height:1.7;white-space:pre-line;">
          ${payload.body}
        </div>
      </div>
      <div style="padding:18px 28px;border-top:1px solid rgba(255,255,255,0.06);color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.16em;">
        Built by Interwebb · London, UK
      </div>
    </div>
  </div>
`;
