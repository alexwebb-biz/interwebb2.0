import React from "react";
import { ArrowUpRight } from "lucide-react";
import { WorkItem } from "../data/work";

type WorkPeekModalProps = {
  active: WorkItem | null;
  onClose: () => void;
};

export const WorkPeekModal: React.FC<WorkPeekModalProps> = ({ active, onClose }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6 py-10">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="space-y-1">
            <p className="text-brand-300 font-mono text-xs tracking-widest uppercase">{active.client}</p>
            <h3 className="text-white text-2xl font-display font-bold">{active.title}</h3>
            {active.metric && <p className="text-slate-400 text-sm">{active.metric}</p>}
          </div>
          <div className="flex gap-2">
            <a
              href={active.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white text-slate-900 font-semibold uppercase tracking-wider shadow hover:-translate-y-0.5 transition-transform"
            >
              Open live
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="px-3 py-2 text-sm text-slate-300 hover:text-white border border-white/20 rounded-md"
            >
              Close
            </button>
          </div>
        </div>

        <div className="relative aspect-[16/10] bg-slate-950 border-b border-white/10">
          <iframe
            src={active.liveUrl}
            title={active.title}
            className="w-full h-full"
            loading="lazy"
            allow="clipboard-write; encrypted-media; accelerometer; gyroscope; picture-in-picture"
          ></iframe>
        </div>

        <div className="grid md:grid-cols-3 gap-6 px-6 py-5">
          <div className="md:col-span-2 space-y-3">
            <p className="text-slate-200 font-semibold">What we shipped</p>
            <p className="text-slate-400 leading-relaxed">{active.desc}</p>
          </div>
          <div className="space-y-3">
            <p className="text-slate-200 font-semibold">Stack</p>
            <div className="flex flex-wrap gap-2">
              {active.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-white/5 border border-white/10 text-slate-200 text-[11px] font-mono uppercase tracking-[0.18em]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
