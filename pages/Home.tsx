import React from "react";
import Hero from "../components/Hero";
import { ArrowUpRight, Check, Layers, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { WorkPeekModal } from "../components/WorkPeekModal";
import { WorkItem, workItems } from "../data/work";

const Home: React.FC = () => {
  const [active, setActive] = React.useState<WorkItem | null>(null);
  const projects = workItems.slice(0, 4);

  const pricing = [
    {
      name: "STARTER",
      price: "£599.00",
      desc: "Perfect for startups needing a professional, high-impact presence.",
      features: [
        "Custom UI/UX Design",
        "5-Page React Website",
        "CMS Integration",
        "Basic SEO Setup",
        "1 Month Support",
        "Basic Analytics"
      ],
      highlight: false
    },
    {
      name: "GROWTH",
      price: "£999.00",
      desc: "For businesses ready to scale with advanced functionality.",
      features: [
        "Strategy Workshop",
        "10+ Pages / Blog",
        "Advanced Animations",
        "Conversion Optimization",
        "Analytics Dashboard",
        "3 Months Support"
      ],
      highlight: true
    },
    {
      name: "ENTERPRISE",
      price: "£1499.00",
      desc: "Complex platforms and bespoke digital products.",
      features: [
        "Full Product Design",
        "Custom Web App (SaaS)",
        "API Integrations",
        "Scalable Cloud Arch.",
        "Dedicated Team",
        "SLA Support"
      ],
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Hero />

      {/* Intro Text */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-4xl text-slate-300 font-light leading-relaxed max-w-4xl">
            Interwebb is a Wales-based digital product studio. We simplify the complex, building <span className="text-white font-medium">websites and applications</span> that drive real business growth.
          </h2>
        </div>
      </section>

      {/* Recent Work */}
      <section className="py-24 border-b border-white/5 relative">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-900/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <span className="text-brand-300 font-mono text-xs tracking-widest uppercase mb-2 block">Selected Output</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white">LATEST WORK</h2>
            </div>
            <Link to="/work" className="hidden md:flex items-center gap-2 text-white hover:text-brand-300 transition-colors font-bold uppercase tracking-wide text-sm">
              Full Portfolio <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {projects.map((p) => (
              <div key={p.title} className="group cursor-pointer">
                <div
                  className="relative overflow-hidden bg-slate-900 border border-white/10 mb-6 aspect-[16/10] group/video"
                  style={{ boxShadow: p.accent ? `0 0 0 1px ${p.accent}22` : undefined }}
                >
                  <div
                    className="absolute inset-x-6 top-4 h-1 rounded-full"
                    style={{ background: p.accent || "#67e8f9" }}
                  ></div>

                  <iframe
                    src={p.liveUrl}
                    title={`${p.title} live preview`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full border-0 pointer-events-none transition-transform duration-700 group-hover/video:scale-105 group-hover/video:grayscale-0"
                    allow="clipboard-write; encrypted-media; accelerometer; gyroscope; picture-in-picture; fullscreen"
                  ></iframe>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity duration-300"></div>

                  <div className="absolute inset-0 flex flex-col justify-end p-5 gap-3 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-200">
                      <span className="px-2 py-1 bg-white/10 border border-white/10 uppercase tracking-[0.18em]">Peek live</span>
                      <span className="text-slate-300 line-clamp-1">{p.metric || p.role}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 font-semibold uppercase tracking-wider text-xs shadow-lg hover:-translate-y-0.5 transition-transform"
                      >
                        View Live
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => setActive(p)}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-white/40 text-white uppercase tracking-wider text-xs backdrop-blur-sm hover:text-brand-300 hover:border-brand-300 transition-colors"
                      >
                        Peek
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-start border-t border-white/10 pt-4">
                   <div>
                      <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-brand-300 transition-colors">{p.title}</h3>
                      <span className="text-slate-500 text-sm font-mono uppercase">{p.client} � {p.tags.slice(0, 2).join(" / ")}</span>
                   </div>
                   <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-brand-300 group-hover:text-black group-hover:border-brand-300 transition-all">
                      <ArrowUpRight size={16} />
                   </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 md:hidden">
             <Link to="/work" className="w-full block text-center py-4 border border-white/10 text-white font-bold uppercase">
               View All Projects
             </Link>
          </div>
        </div>
      </section>

      {/* Pricing / Investment Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white bg-[length:30px_30px] opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-brand-300 font-mono text-xs tracking-widest uppercase mb-2 block">Investment</span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">TRANSPARENT PRICING</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Clear, fixed-cost packages for every stage of business growth. No hidden fees.
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
                <div className="text-3xl font-mono text-brand-300 mb-4">{tier.price}</div>
                <p className="text-slate-400 text-sm mb-8 h-10">{tier.desc}</p>
                
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <Check size={16} className="text-brand-300 mt-0.5 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/contact" 
                  className={`block w-full py-3 text-center font-bold uppercase text-sm tracking-wider border transition-all ${
                    tier.highlight
                      ? "bg-brand-300 border-brand-300 text-black hover:bg-brand-400"
                      : "bg-transparent border-white/20 text-white hover:border-brand-300 hover:text-brand-300"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 px-6 text-center border-t border-white/5 bg-gradient-to-b from-slate-950 to-slate-900">
         <div className="max-w-4xl mx-auto">
           <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-8 leading-tight">
             READY TO UPGRADE <br />
             YOUR <span className="text-brand-300">DIGITAL PRESENCE?</span>
           </h2>
           <div className="flex flex-col md:flex-row justify-center gap-4">
             <Link to="/contact" className="inline-flex justify-center items-center px-10 py-5 bg-brand-300 text-black font-bold text-lg uppercase tracking-wide hover:bg-brand-400 transition-all">
               Initiate Project
             </Link>
             <Link to="/services" className="inline-flex justify-center items-center px-10 py-5 bg-transparent border border-white/20 text-white font-bold text-lg uppercase tracking-wide hover:bg-white/5 transition-all">
               Explore Services
             </Link>
           </div>
         </div>
      </section>

      <WorkPeekModal active={active} onClose={() => setActive(null)} />
    </div>
  );
};

export default Home;
