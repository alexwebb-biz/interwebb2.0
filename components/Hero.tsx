import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 border-b border-white/5">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 bg-grid-white bg-[length:50px_50px] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-500/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border-l-2 border-brand-300 bg-white/5 text-brand-300 text-xs font-mono mb-8 tracking-widest uppercase">
              <span>System Online v2.0</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[0.9] mb-8 tracking-tight">
              DIGITAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-200 to-white">
                ENGINEERING
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed border-l border-white/10 pl-6">
              We design and build high-performance digital products for forward-thinking brands. Merging aesthetic precision with robust code.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="px-8 py-4 bg-brand-300 hover:bg-brand-400 text-black font-bold rounded-sm flex items-center gap-2 transition-all hover:translate-x-1">
                Start Project <ArrowRight size={20} />
              </Link>
              <Link to="/work" className="px-8 py-4 bg-transparent border border-white/20 hover:border-brand-300 hover:text-brand-300 text-white font-bold rounded-sm transition-all">
                View Case Studies
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-4 hidden lg:block">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.4 }}
             className="grid grid-cols-1 gap-4"
           >
             <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-sm">
               <Cpu className="text-brand-300 w-8 h-8 mb-4" />
               <h3 className="text-white font-bold font-display mb-1">Development</h3>
               <p className="text-slate-400 text-sm">React, Node, Next.js architecture.</p>
             </div>
             <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-sm ml-8">
               <Globe className="text-brand-300 w-8 h-8 mb-4" />
               <h3 className="text-white font-bold font-display mb-1">Digital Strategy</h3>
               <p className="text-slate-400 text-sm">SEO, Growth, Analytics.</p>
             </div>
             <div className="p-6 bg-white/5 border border-white/10 backdrop-blur-sm">
               <Zap className="text-brand-300 w-8 h-8 mb-4" />
               <h3 className="text-white font-bold font-display mb-1">Performance</h3>
               <p className="text-slate-400 text-sm">Optimized for speed and scale.</p>
             </div>
           </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 text-xs font-mono"
      >
        SCROLL TO EXPLORE
      </motion.div>
    </section>
  );
};

export default Hero;