import React from 'react';
import { ArrowRight, Check, PhoneCall, Search, ShieldCheck, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuditEnquiryForm } from '../components/AuditEnquiryForm';

const PHONE = '07765 718094';
const PHONE_TEL = 'tel:+447765718094';
const CIS_URL = 'https://cis19th.vercel.app';

const trades = [
  'Plumbers',
  'Electricians',
  'Builders',
  'Roofers',
  'Landscapers',
  'Decorators',
  'Heating engineers',
  'General contractors',
];

const problems = [
  'Your van looks the part. The website looks like 2014.',
  'It\u2019s a nightmare on a phone, which is how most people find you.',
  'Reviews and Gas Safe / NICEIC sit on Facebook, not on the site.',
  'You cover a real patch. The site doesn\u2019t say where.',
  'The quote form is buried under waffle.',
  'You\u2019re paying for a site that doesn\u2019t earn its keep.',
];

const packageItems = [
  'Up to 5 pages',
  'Tap-to-call and WhatsApp',
  'Quote form',
  'Your services, your area, your reviews',
  'Photos of real jobs',
  'Local Google basics',
  'We write the words',
];

const reasons = [
  {
    title: 'Built for calls, not a portfolio.',
    copy: 'Pages are built so someone can ring you, not admire a studio site.',
    icon: PhoneCall,
  },
  {
    title: 'Fast on a phone. That\u2019s the job.',
    copy: 'Most people find you on a phone. If they can\u2019t tap the number, they ring the next van.',
    icon: Wrench,
  },
  {
    title: 'Trust where they look.',
    copy: 'Your reviews and tickets sit where a customer actually looks.',
    icon: Search,
  },
  {
    title: 'Wrexham-based.',
    copy: `You can ring ${PHONE}.`,
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    question: 'How much is it?',
    answer:
      '\u00a349 a month. No setup. Hosting is in. If you pay subs, CIS is free for 90 days, then \u00a39 (so \u00a358 if you keep both).',
  },
  {
    question: 'How long to get it live?',
    answer: 'Two to four weeks once we\u2019ve got photos, services, and where you cover.',
  },
  {
    question: 'Can you redo the site I\u2019ve got?',
    answer: 'Yes. Keep what\u2019s working, bin what isn\u2019t, put the number at the top.',
  },
  {
    question: 'Do you write the words?',
    answer: 'Yes. You talk like you talk on the job. We put that on the page.',
  },
  {
    question: 'What if I pay subcontractors?',
    answer:
      'Join the CIS list. It\u2019s a subbie register and a reminder before the 19th, not a tax robot. 90 days free with the site, then \u00a39.',
  },
];

const scrollToAudit = () => {
  document.getElementById('free-audit')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const TradesWebDesign: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <section className="relative min-h-[92svh] overflow-hidden border-b border-white/10 pt-24">
        <img
          src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=80"
          alt="Trades team reviewing building work"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />

        <div className="relative z-10 mx-auto flex min-h-[calc(92svh-6rem)] max-w-7xl items-center px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-4xl"
          >
            <p className="mb-5 font-mono text-xs uppercase tracking-widest text-brand-300">
              Interwebb for trades
            </p>
            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl">
              A site that gets the phone ringing.
            </h1>
            <p className="mt-8 max-w-2xl border-l border-brand-300/70 pl-6 text-lg leading-relaxed text-slate-300 md:text-xl">
              \u00a349 a month. No setup fee. Hosting included.
            </p>
            <p className="mt-4 max-w-2xl pl-6 text-base leading-relaxed text-slate-400 md:text-lg">
              Pay other trades? CIS reminders, 90 days free, then \u00a39.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={scrollToAudit}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand-300 px-7 py-4 font-bold uppercase tracking-wide text-black transition-all hover:bg-brand-400"
              >
                Get a free audit
                <ArrowRight size={18} />
              </button>
              <a
                href={CIS_URL}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/25 px-7 py-4 font-bold uppercase tracking-wide text-white transition-colors hover:border-brand-300 hover:text-brand-300"
              >
                Join the CIS list
                <ArrowRight size={18} />
              </a>
            </div>
            <a
              href={PHONE_TEL}
              className="mt-6 inline-block pl-0 text-lg font-semibold text-white hover:text-brand-300 sm:pl-0"
            >
              {PHONE}
            </a>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-white/10 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brand-300">Trades we work with</p>
              <h2 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
                Built for the van, not a boardroom.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-l border-white/10 pl-6 md:grid-cols-4">
              {trades.map((trade) => (
                <p key={trade} className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  {trade}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-xs uppercase tracking-widest text-brand-300">What costs you jobs</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">
              A weak website loses the job before the phone rings.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              Someone googles a plumber at 7am. If they can\u2019t tap your number, they ring the next one.
            </p>
          </motion.div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {problems.map((problem) => (
              <div key={problem} className="flex gap-4 py-5">
                <Check className="mt-1 h-5 w-5 shrink-0 text-brand-300" />
                <p className="text-slate-300">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="package" className="border-y border-white/10 bg-white/[0.03] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brand-300">Trades website package</p>
              <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">
                \u00a349 a month. That\u2019s the lot.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                A proper trades site. No setup. Hosting included. One number, tap-to-call, WhatsApp, and a quote form
                that isn\u2019t hiding.
              </p>
              <p className="mt-6 border-l border-brand-300/70 pl-6 text-base leading-relaxed text-slate-300">
                If you pay subs, add CIS 19th. Subbie list and a nag before the 19th. 90 days free with the site, then
                \u00a39. We don\u2019t file to HMRC.{' '}
                <a href={CIS_URL} className="font-semibold text-brand-300 hover:text-brand-400">
                  Join the CIS list
                </a>
                .
              </p>
              <button
                type="button"
                onClick={scrollToAudit}
                className="mt-8 inline-flex items-center gap-2 rounded-sm bg-brand-300 px-7 py-4 font-bold uppercase tracking-wide text-black transition-colors hover:bg-brand-400"
              >
                Get a free audit
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
              {packageItems.map((item) => (
                <div key={item} className="bg-slate-950 p-5">
                  <Check className="mb-4 h-5 w-5 text-brand-300" />
                  <p className="font-semibold text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-brand-300">Why Interwebb</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">
              Local, straight, and on the phone.
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-4">
            {reasons.map(({ title, copy, icon: Icon }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.45 }}
                className="bg-slate-950 p-6"
              >
                <Icon className="mb-8 h-7 w-7 text-brand-300" />
                <h3 className="font-display text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="free-audit" className="border-y border-white/10 bg-slate-900/50 py-24 scroll-mt-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-brand-300">Free 5-minute website audit</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">
              Send the site. I\u2019ll tell you what\u2019s costing you jobs.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              Five minutes. You get a short note on what\u2019s losing calls, and whether \u00a349/mo is even worth it.
            </p>
          </div>
          <AuditEnquiryForm />
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-300">FAQ</p>
          <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">Straight answers.</h2>
          <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="cursor-pointer list-none font-display text-xl font-bold text-white">
                  {faq.question}
                </summary>
                <p className="mt-4 max-w-3xl leading-relaxed text-slate-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-4xl font-bold leading-tight text-white md:text-6xl">
            Get the phone ringing. \u00a349 a month.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            No setup. Hosting included. Pay subs? CIS 90 days free, then \u00a39.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={scrollToAudit}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand-300 px-8 py-4 font-bold uppercase tracking-wide text-black transition-colors hover:bg-brand-400"
            >
              Get a free audit
              <ArrowRight size={18} />
            </button>
            <a
              href={CIS_URL}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/25 px-8 py-4 font-bold uppercase tracking-wide text-white transition-colors hover:border-brand-300 hover:text-brand-300"
            >
              Join the CIS list
              <ArrowRight size={18} />
            </a>
          </div>
          <a href={PHONE_TEL} className="mt-6 inline-block text-lg font-semibold text-white hover:text-brand-300">
            {PHONE}
          </a>
        </div>
      </section>

      <p className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        Interwebb \u00b7 Wrexham \u00b7 Sites for trades \u00b7{' '}
        <a href={PHONE_TEL} className="text-slate-400 hover:text-brand-300">
          {PHONE}
        </a>
      </p>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/95 p-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={scrollToAudit}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-brand-300 px-5 py-3 text-sm font-bold uppercase tracking-wide text-black"
        >
          Get a free audit
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TradesWebDesign;
