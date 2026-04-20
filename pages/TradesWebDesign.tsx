import React from 'react';
import { ArrowDown, ArrowRight, Check, PhoneCall, Search, ShieldCheck, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuditEnquiryForm } from '../components/AuditEnquiryForm';

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
  'Your website looks dated compared with local competitors.',
  'It is awkward to use on mobile when customers need help fast.',
  'Visitors are not turning into calls or quote requests.',
  'The site does not clearly show what you do or where you work.',
  'Reviews, photos, accreditations, and trust signals are hard to find.',
  'Contact details are buried instead of being one tap away.',
];

const packageItems = [
  'Up to 5 focused pages',
  'Custom modern design',
  'Mobile responsive build',
  'Service area structure',
  'Quote or contact form',
  'Click-to-call buttons',
  'WhatsApp-ready contact route',
  'Reviews and trust section',
  'Local SEO basics',
  'Analytics setup',
];

const reasons = [
  {
    title: 'Built for enquiries',
    copy: 'Pages are structured around calls, quote forms, service areas, and fast decisions.',
    icon: PhoneCall,
  },
  {
    title: 'Performance first',
    copy: 'Clean development keeps the site fast, stable, and easy to expand later.',
    icon: Wrench,
  },
  {
    title: 'Local SEO-ready',
    copy: 'Headings, page structure, and service copy support searches like plumber website design and builder website design.',
    icon: Search,
  },
  {
    title: 'Trust made obvious',
    copy: 'Reviews, accreditations, recent work, and contact options sit where customers expect them.',
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    question: 'How long does a trades website build take?',
    answer: 'Most starter websites take two to four weeks once the content, photos, and service details are ready.',
  },
  {
    question: 'Can you redesign an existing site?',
    answer: 'Yes. We can keep what is useful, replace what is slowing enquiries down, and move the site onto a cleaner structure.',
  },
  {
    question: 'Can you help with SEO?',
    answer: 'Yes. Every build includes local SEO basics, and service area pages can be added when you are ready to grow coverage.',
  },
  {
    question: 'Do you write the content?',
    answer: 'Yes. We can turn your services, locations, reviews, and photos into clear website copy customers understand quickly.',
  },
  {
    question: 'Can you host and maintain the site too?',
    answer: 'Yes. Hosting, maintenance, updates, and analytics reporting can be added after the build.',
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
              Interwebb for local trades
            </p>
            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl">
              Web Design for Trades Businesses That Want More Calls
            </h1>
            <p className="mt-8 max-w-2xl border-l border-brand-300/70 pl-6 text-lg leading-relaxed text-slate-300 md:text-xl">
              We create professional, mobile-friendly websites for plumbers, electricians, builders, roofers and other
              trades so more visitors turn into quote requests.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={scrollToAudit}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-brand-300 px-7 py-4 font-bold uppercase tracking-wide text-black transition-all hover:bg-brand-400"
              >
                Get a Free Website Audit
                <ArrowRight size={18} />
              </button>
              <a
                href="#package"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/25 px-7 py-4 font-bold uppercase tracking-wide text-white transition-colors hover:border-brand-300 hover:text-brand-300"
              >
                See What's Included
                <ArrowDown size={18} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-white/10 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brand-300">Trades we work with</p>
              <h2 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
                Websites for local service businesses.
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
            <p className="font-mono text-xs uppercase tracking-widest text-brand-300">What costs you enquiries</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">
              A weak website loses the job before the phone rings.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              If your site looks dated, loads slowly, or makes it hard for people to contact you, it could be costing
              you local work every week.
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
                A fixed starting point, not a confusing menu.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                Whether you need plumber website design, electrician website design, builder website design, roofing
                website design, or another trade site, the first job is simple: make your business easy to trust and
                easy to contact.
              </p>
              <button
                type="button"
                onClick={scrollToAudit}
                className="mt-8 inline-flex items-center gap-2 rounded-sm bg-brand-300 px-7 py-4 font-bold uppercase tracking-wide text-black transition-colors hover:bg-brand-400"
              >
                Get a Free Website Audit
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
            <p className="font-mono text-xs uppercase tracking-widest text-brand-300">Why choose Interwebb</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">
              Modern websites with a development-first mindset.
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
              Want to know what is costing you enquiries?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-400">
              Send your current website and we will show you quick improvements that could help generate more calls,
              quote requests, and booked jobs.
            </p>
            <div className="mt-8 space-y-4 border-l border-white/10 pl-6 text-slate-300">
              <p>Useful for websites for trades businesses that feel slow, dated, unclear, or hard to contact from mobile.</p>
              <p>Delivered as a short written breakdown, scorecard, or quick video where useful.</p>
            </div>
          </div>
          <AuditEnquiryForm />
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-300">FAQ</p>
          <h2 className="mt-4 font-display text-4xl font-bold text-white md:text-6xl">Straight answers before you enquire.</h2>
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
            Request a free audit and get practical improvements for your trade website.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Clear advice first. A fixed-price website build only makes sense after the biggest enquiry leaks are obvious.
          </p>
          <button
            type="button"
            onClick={scrollToAudit}
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-sm bg-brand-300 px-8 py-4 font-bold uppercase tracking-wide text-black transition-colors hover:bg-brand-400"
          >
            Get a Free Website Audit
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/95 p-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={scrollToAudit}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-brand-300 px-5 py-3 text-sm font-bold uppercase tracking-wide text-black"
        >
          Get a Free Website Audit
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TradesWebDesign;
