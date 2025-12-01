import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import InteractiveQuote from "../components/InteractiveQuote";
import { packageTiers, PackageTier } from "../data/pricing";

const formatPrice = (value: number | undefined | null) =>
  "£" + Number(value ?? 0).toLocaleString("en-GB", { maximumFractionDigits: 0 });

const Pricing: React.FC = () => {
  const [pricing, setPricing] = React.useState<PackageTier[]>(packageTiers);

  React.useEffect(() => {
    const loadPricing = async () => {
      try {
        const res = await fetch("/api/pricing");
        if (!res.ok) return;
        const data = await res.json().catch(() => ({}));
        if (Array.isArray(data?.tiers)) {
          setPricing(data.tiers);
        }
      } catch {
        // keep fallback
      }
    };
    loadPricing();
  }, []);
  return (
    <div className="min-h-screen bg-slate-950">
      <section className="pt-28 pb-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.18em] text-slate-200">
              <Sparkles className="w-4 h-4 text-brand-300" />
              Pricing & Packages
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
              Pick a pre-built package or build your own.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-2xl">
              Three ready-to-roll bundles, plus a configure-your-own option for the extras you need.
              Transparent pricing, no surprises.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand-300 text-black font-bold uppercase tracking-wide rounded-sm hover:bg-brand-400 transition"
              >
                Talk to us
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/work"
                className="inline-flex items-center gap-2 px-5 py-3 border border-white/15 text-white font-semibold uppercase tracking-wide rounded-sm hover:border-brand-300 hover:text-brand-300 transition"
              >
                See recent work
              </Link>
            </div>
          </div>
          <div className="p-6 border border-white/10 bg-slate-900/60 rounded-lg">
            <p className="text-sm text-slate-300 mb-3 font-semibold uppercase tracking-[0.18em]">
              Snapshot
            </p>
            <ul className="space-y-3 text-slate-200 text-sm">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-brand-300 mt-0.5" />
                Pre-built packages for fast starts.
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-brand-300 mt-0.5" />
                Configure-your-own for bespoke needs.
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-brand-300 mt-0.5" />
                Support and retainers to keep things humming.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <InteractiveQuote />

      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand-300 font-mono text-xs tracking-widest uppercase mb-2 block">
              Pre-built packages
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Prefer a bundle? Start here.
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Clear inclusions and pricing. If you need to tweak, use the configure-your-own above or
              mention it in your note.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {pricing.map((tier, i) => (
              <div
                key={i}
                className={`relative p-8 border ${
                  tier.highlight
                    ? "bg-white/5 border-brand-300/50 shadow-[0_0_30px_-10px_rgba(190,242,100,0.3)]"
                    : "bg-slate-950 border-white/10"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-300 text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-display font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-3xl font-mono text-brand-300 mb-4">{formatPrice(tier.price)}</div>
                <p className="text-slate-400 text-sm mb-8 h-10">{tier.description}</p>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check size={16} className="text-brand-300 mt-0.5 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3">
                  <Link
                    to="/contact"
                    className={`block w-full py-3 text-center font-bold uppercase text-sm tracking-wider border transition-all ${
                      tier.highlight
                        ? "bg-brand-300 border-brand-300 text-black hover:bg-brand-400"
                        : "bg-transparent border-white/20 text-white hover:border-brand-300 hover:text-brand-300"
                    }`}
                  >
                    Select package
                  </Link>
                  <Link
                    to="/contact"
                    className="text-center text-xs uppercase tracking-[0.2em] text-slate-400 hover:text-brand-300 transition"
                  >
                    Ask about tweaks
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center border-t border-white/5 bg-slate-950">
        <div className="max-w-4xl mx-auto space-y-6">
          <h3 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
            Want a second opinion on scope?
          </h3>
          <p className="text-slate-400">
            We can review your shortlist in a quick call and recommend the simplest path to launch.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex justify-center items-center px-8 py-4 bg-brand-300 text-black font-bold text-sm uppercase tracking-wide hover:bg-brand-400 transition-all"
            >
              Book a call
            </Link>
            <Link
              to="/services"
              className="inline-flex justify-center items-center px-8 py-4 border border-white/15 text-white font-bold text-sm uppercase tracking-wide hover:border-brand-300 hover:text-brand-300 transition-all"
            >
              View services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
