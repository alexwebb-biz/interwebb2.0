import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import ReactGA from 'react-ga4';

type AuditFormState = {
  name: string;
  businessName: string;
  trade: string;
  websiteUrl: string;
  email: string;
  phone: string;
  message: string;
};

const INITIAL_STATE: AuditFormState = {
  name: '',
  businessName: '',
  trade: '',
  websiteUrl: '',
  email: '',
  phone: '',
  message: '',
};

const TRADE_OPTIONS = [
  'Plumbing',
  'Electrical',
  'Building',
  'Roofing',
  'Landscaping',
  'Decorating',
  'Heating',
  'General contracting',
  'Other trade',
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normaliseUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(normaliseUrl(value));
    return Boolean(url.hostname.includes('.'));
  } catch {
    return false;
  }
}

export function AuditEnquiryForm() {
  const [formState, setFormState] = useState<AuditFormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField =
    (field: keyof AuditFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormState((current) => ({ ...current, [field]: event.target.value }));
    };

  const validate = () => {
    if (!formState.name.trim()) return 'Please enter your name.';
    if (!formState.businessName.trim()) return 'Please enter your business name.';
    if (!formState.trade.trim()) return 'Please choose your trade.';
    if (!isValidUrl(formState.websiteUrl)) return 'Please enter a valid website URL.';
    if (!emailPattern.test(formState.email.trim())) return 'Please enter a valid email address.';
    if (!formState.phone.trim()) return 'Please enter your phone number.';
    if (!formState.message.trim()) return 'Please tell us what is not working with your current website.';
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const websiteUrl = normaliseUrl(formState.websiteUrl);
    const message = [
      'Free trades website audit request',
      '',
      `Business: ${formState.businessName.trim()}`,
      `Trade: ${formState.trade.trim()}`,
      `Website: ${websiteUrl}`,
      `Phone: ${formState.phone.trim()}`,
      '',
      'What is not working:',
      formState.message.trim(),
    ].join('\n');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name.trim(),
          email: formState.email.trim(),
          budget: 'Free trades website audit',
          message,
          source: 'web-design-for-trades',
          businessName: formState.businessName.trim(),
          trade: formState.trade.trim(),
          websiteUrl,
          phone: formState.phone.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to send the audit request right now.');
      }

      ReactGA.event('generate_lead', {
        form_name: 'trades_website_audit',
        page_location: window.location.pathname,
      });

      setSubmitted(true);
      setFormState(INITIAL_STATE);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-brand-300/40 bg-brand-300/10 p-8 md:p-10 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-brand-300 text-brand-300">
          <Check size={26} />
        </div>
        <h3 className="font-display text-3xl font-bold text-white">Audit request received</h3>
        <p className="mx-auto mt-3 max-w-xl text-slate-300">
          We have your details. We will review the site and send practical improvements you can use to get more enquiries.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 border-b border-white/40 pb-1 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-brand-300 hover:text-brand-300"
        >
          Send another audit request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm md:p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Name" htmlFor="audit-name">
          <input
            id="audit-name"
            type="text"
            required
            value={formState.name}
            onChange={updateField('name')}
            className="w-full border-b border-white/20 bg-transparent py-3 text-white outline-none transition-colors placeholder:text-slate-700 focus:border-brand-300"
            placeholder="John Smith"
          />
        </Field>

        <Field label="Business name" htmlFor="audit-business">
          <input
            id="audit-business"
            type="text"
            required
            value={formState.businessName}
            onChange={updateField('businessName')}
            className="w-full border-b border-white/20 bg-transparent py-3 text-white outline-none transition-colors placeholder:text-slate-700 focus:border-brand-300"
            placeholder="Smith Heating"
          />
        </Field>

        <Field label="Trade" htmlFor="audit-trade">
          <select
            id="audit-trade"
            required
            value={formState.trade}
            onChange={updateField('trade')}
            className="w-full border-b border-white/20 bg-transparent py-3 text-white outline-none transition-colors focus:border-brand-300"
          >
            <option value="" className="bg-slate-950">
              Select your trade
            </option>
            {TRADE_OPTIONS.map((trade) => (
              <option key={trade} value={trade} className="bg-slate-950">
                {trade}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Website URL" htmlFor="audit-website">
          <input
            id="audit-website"
            type="text"
            required
            inputMode="url"
            value={formState.websiteUrl}
            onChange={updateField('websiteUrl')}
            className="w-full border-b border-white/20 bg-transparent py-3 text-white outline-none transition-colors placeholder:text-slate-700 focus:border-brand-300"
            placeholder="yourbusiness.co.uk"
          />
        </Field>

        <Field label="Email" htmlFor="audit-email">
          <input
            id="audit-email"
            type="text"
            required
            value={formState.email}
            onChange={updateField('email')}
            className="w-full border-b border-white/20 bg-transparent py-3 text-white outline-none transition-colors placeholder:text-slate-700 focus:border-brand-300"
            placeholder="you@business.co.uk"
          />
        </Field>

        <Field label="Phone" htmlFor="audit-phone">
          <input
            id="audit-phone"
            type="tel"
            required
            value={formState.phone}
            onChange={updateField('phone')}
            className="w-full border-b border-white/20 bg-transparent py-3 text-white outline-none transition-colors placeholder:text-slate-700 focus:border-brand-300"
            placeholder="Mobile or office number"
          />
        </Field>
      </div>

      <Field label="What is not working with your current website?" htmlFor="audit-message" className="mt-6">
        <textarea
          id="audit-message"
          required
          rows={4}
          value={formState.message}
          onChange={updateField('message')}
          className="w-full resize-none border-b border-white/20 bg-transparent py-3 text-white outline-none transition-colors placeholder:text-slate-700 focus:border-brand-300"
          placeholder="Low enquiries, poor mobile layout, slow pages, weak calls to action..."
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-sm bg-brand-300 px-6 py-4 font-bold uppercase tracking-wide text-black transition-all hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Sending audit request...' : 'Get my free audit'}
        {!isSubmitting && <ArrowRight size={18} />}
      </button>

      {error && <p className="mt-4 text-center text-sm text-red-300">{error}</p>}
      <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
        {"No spam. I'll only use this to look at your site and reply."}
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  className = '',
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block font-mono text-xs uppercase tracking-widest text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}
