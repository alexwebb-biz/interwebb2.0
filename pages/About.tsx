
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Globe, Cpu, Zap } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { label: 'Projects Deployed', value: '20+', icon: <Cpu size={20} /> },
    { label: 'Years Active', value: '04', icon: <Zap size={20} /> },
    { label: 'Global Clients', value: '15+', icon: <Globe size={20} /> },
    { label: 'Team Members', value: '2', icon: <Users size={20} /> },
  ];

  const timeline = [
    {
      year: '2022',
      title: 'Freelance Front-end Web Developer',
      desc: 'Working on small projects and contributing to open-source projects.'
    },
    {
      year: '2023',
      title: 'Expanding into full stack development',
      desc: 'Moved into fullstack development, working on full stack applications with MERN stack.'
    },
    {
      year: '2024',
      title: 'Moved into App development',
      desc: 'Started working on mobile applications with React Native and supabase. Deployed multiple applications.'
    },
    {
      year: '2025',
      title: 'Re-design and re-launch of Interwebb',
      desc: 'Launched Interwebb 2.0. A high-performance digital agency site with a technical, neon-accented design system.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-brand-300/30 bg-brand-300/5 text-brand-300 text-xs font-mono mb-6 tracking-widest uppercase rounded-full">
            <span>Our DNA</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[0.9] mb-8">
            ENGINEERED FOR <br/>
            <span className="text-brand-300">EXCELLENCE.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed border-l-2 border-white/10 pl-6">
            We are not just a design agency. We are a collective of creative engineers and technical artists obsessed with the space where function meets form.
          </p>
          <p className="text-slate-500 max-w-2xl mt-6 leading-relaxed">
            Interwebb UK is based in Wales and works with UK brands on web design, web development, and performance-led digital product builds.
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <section className="border-y border-white/10 bg-white/5 mb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {stats.map((stat, index) => (
              <div key={index} className="py-12 px-6 flex flex-col items-start group hover:bg-white/5 transition-colors">
                <div className="mb-4 text-brand-300 opacity-50 group-hover:opacity-100 transition-opacity">
                  {stat.icon}
                </div>
                <span className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{stat.value}</span>
                <span className="text-xs font-mono uppercase text-slate-500 tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-4xl font-display font-bold text-white mb-6 sticky top-32">THE TIMELINE</h2>
            <p className="text-slate-400 text-sm mb-8 sticky top-48">
              A brief history of our evolution from a solo freelancer operation to a full-service digital product studio.
            </p>
          </div>
          
          <div className="lg:col-span-8 relative border-l border-white/10 pl-8 md:pl-16 space-y-20">
            {/* Timeline Line Decoration */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-brand-300 via-brand-300/20 to-transparent"></div>
            
            {timeline.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.45, ease: "easeOut" }}
                className="relative group"
              >
                {/* Dot */}
                <div className="absolute -left-[41px] md:-left-[73px] top-2 w-5 h-5 bg-slate-950 border-2 border-brand-300 rounded-full group-hover:bg-brand-300 transition-colors shadow-[0_0_15px_rgba(190,242,100,0.5)]"></div>
                
                <span className="text-brand-300 font-mono text-sm font-bold mb-2 block">{item.year}</span>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Collective / Philosophy */}
      <section className="py-24 relative overflow-hidden rounded-3xl mx-6 border border-white/10">
         <div className="absolute inset-0 bg-slate-900"></div>
         <div className="absolute inset-0 bg-grid-white bg-[length:40px_40px] opacity-[0.03]"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 blur-[100px]"></div>

         <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
           <Award className="w-12 h-12 text-brand-300 mx-auto mb-8" />
           <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">THE COLLECTIVE</h2>
           <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10">
             "We believe that code is a creative medium. In a world of templates and AI-generated content, we stand for bespoke craftsmanship. We don't just build websites; we build digital assets that appreciate in value."
           </p>
         </div>
      </section>

    </div>
  );
};

export default About;
