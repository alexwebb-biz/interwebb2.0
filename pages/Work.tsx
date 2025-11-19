import React from 'react';

const Work: React.FC = () => {
  const works = [
    {
      client: "FINTECH SOLUTIONS",
      title: "Banking Dashboard v2",
      desc: "A complete redesign of a legacy banking portal focussing on accessibility and speed.",
      tags: ["UX/UI", "React", "Security"],
      image: "https://picsum.photos/800/600?random=10"
    },
    {
      client: "ECOLIFE",
      title: "Sustainable Commerce",
      desc: "E-commerce platform with custom 3D product configurators.",
      tags: ["Shopify Plus", "WebGL", "Brand"],
      image: "https://picsum.photos/800/600?random=11"
    },
    {
      client: "STARTUP AI",
      title: "Marketing Automation",
      desc: "SaaS landing page and application dashboard for an AI unicorn.",
      tags: ["Next.js", "Tailwind", "SaaS"],
      image: "https://picsum.photos/800/600?random=12"
    },
    {
      client: "GALLERY X",
      title: "Virtual Exhibition",
      desc: "Immersive 3D gallery experience for digital artists.",
      tags: ["Three.js", "WebGL", "Design"],
      image: "https://picsum.photos/800/600?random=13"
    }
  ];

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
          {works.map((work, idx) => (
            <div key={idx} className="group">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className={`lg:col-span-7 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="relative overflow-hidden border border-white/10 bg-slate-900">
                    <div className="absolute inset-0 bg-brand-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay"></div>
                    <img 
                      src={work.image} 
                      alt={work.title} 
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                    />
                  </div>
                </div>
                
                <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="flex items-center gap-4 mb-4">
                     <span className="text-brand-300 font-mono text-xs tracking-widest uppercase">{work.client}</span>
                     <div className="h-px bg-white/10 flex-grow"></div>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">{work.title}</h2>
                  <p className="text-slate-400 text-lg mb-8 leading-relaxed">{work.desc}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {work.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-xs font-mono uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button className="text-white font-bold uppercase tracking-wider border-b border-brand-300 pb-1 hover:text-brand-300 transition-colors">
                    View Case Study
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;