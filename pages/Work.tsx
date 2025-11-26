import React from "react";
import { ArrowUpRight } from "lucide-react";
import { WorkPeekModal } from "../components/WorkPeekModal";
import { WorkItem, workItems } from "../data/work";

const Work: React.FC = () => {
  const [active, setActive] = React.useState<WorkItem | null>(null);

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">CASE STUDIES</h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            A collection of our most impactful work. We take pride in delivering excellence across every pixel and line of code.
          </p>
        </div>

        <div className="space-y-32">
          {workItems.map((work, idx) => (
            <div key={work.title} className="group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className={`lg:col-span-7 ${idx % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                  <div
                    className="relative overflow-hidden border border-white/10 bg-slate-900 group/video aspect-[16/10]"
                    style={{ boxShadow: work.accent ? `0 0 0 1px ${work.accent}22` : undefined }}
                  >
                    <div
                      className="absolute inset-x-6 top-6 h-1 rounded-full"
                      style={{ background: work.accent || "#67e8f9" }}
                    ></div>
                    <iframe
                      src={work.liveUrl}
                      title={`${work.title} live preview`}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 w-full h-full border-0 pointer-events-none transition-transform duration-700 group-hover/video:scale-105 grayscale group-hover/video:grayscale-0"
                      allow="clipboard-write; encrypted-media; accelerometer; gyroscope; picture-in-picture; fullscreen"
                    ></iframe>

                    <div
                      className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity duration-500"
                    ></div>

                    <div className="absolute inset-0 flex flex-col justify-end p-6 gap-3 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-200">
                        <span className="px-2 py-1 bg-white/10 border border-white/10 uppercase tracking-[0.18em]">Peek live</span>
                        <span className="text-slate-300">{work.metric}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={work.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 font-semibold uppercase tracking-wider text-xs shadow-lg hover:-translate-y-0.5 transition-transform"
                        >
                          View Live
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => setActive(work)}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-white/40 text-white uppercase tracking-wider text-xs backdrop-blur-sm hover:text-brand-300 hover:border-brand-300 transition-colors"
                        >
                          Peek
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`lg:col-span-5 ${idx % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="flex items-center gap-4 mb-4">
                     <span className="text-brand-300 font-mono text-xs tracking-widest uppercase">{work.client}</span>
                     <div className="h-px bg-white/10 flex-grow"></div>
                     {work.role && (
                       <span className="px-3 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-mono uppercase tracking-[0.2em]">
                         {work.role}
                       </span>
                     )}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">{work.title}</h2>
                  <p className="text-slate-400 text-lg mb-6 leading-relaxed">{work.desc}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {work.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <a
                      href={work.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white font-bold uppercase tracking-wider border-b border-brand-300 pb-1 hover:text-brand-300 transition-colors inline-flex items-center gap-2"
                    >
                      View Live
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => setActive(work)}
                      className="text-slate-300 font-bold uppercase tracking-wider border-b border-white/30 pb-1 hover:text-brand-300 hover:border-brand-300 transition-colors"
                    >
                      Peek inside
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WorkPeekModal active={active} onClose={() => setActive(null)} />
    </div>
  );
};

export default Work;
