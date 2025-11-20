import React from 'react';
import { Monitor, Smartphone, PenTool, Search, Server, Shield, Code2, Database, Share2 } from 'lucide-react';
import { Service } from '../types';

const Services: React.FC = () => {
  const servicesList: Service[] = [
    {
      id: '1',
      title: 'Web Development',
      description: 'High-performance JAMstack websites built with React, Next.js, and Tailwind. Optimized for Core Web Vitals.',
      icon: <Code2 className="w-8 h-8 text-brand-300" />
    },
    {
      id: '2',
      title: 'App Development',
      description: 'Native and cross-platform mobile applications using React Native. Seamless iOS and Android experiences.',
      icon: <Smartphone className="w-8 h-8 text-brand-300" />
    },
    {
      id: '3',
      title: 'UI/UX Design',
      description: 'User-centric interface design, prototyping, and design systems. We focus on conversion and usability.',
      icon: <PenTool className="w-8 h-8 text-brand-300" />
    },
    {
      id: '4',
      title: 'Technical SEO',
      description: 'Code-level optimization to ensure your site ranks. Schema markup, fast load times, and semantic HTML.',
      icon: <Search className="w-8 h-8 text-brand-300" />
    },
    {
      id: '5',
      title: 'Backend API',
      description: 'Scalable Node.js and Python architectures. REST and GraphQL APIs designed for heavy loads.',
      icon: <Server className="w-8 h-8 text-brand-300" />
    },
    {
      id: '6',
      title: 'Cybersecurity',
      description: 'Security audits, penetration testing, and best-practice implementation to protect user data.',
      icon: <Shield className="w-8 h-8 text-brand-300" />
    }
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 border-b border-white/10 pb-10">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">CAPABILITIES</h1>
          <p className="text-xl text-slate-400 max-w-2xl">
            We offer a full-stack digital service. From the first line of code to the final pixel, we ensure excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {servicesList.map((service) => (
            <div 
              key={service.id} 
              className="bg-slate-950 p-10 hover:bg-slate-900 transition-colors group"
            >
              <div className="mb-6 p-3 bg-white/5 w-fit border border-white/10 group-hover:border-brand-300/50 transition-colors">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold font-display text-white mb-4 group-hover:text-brand-300 transition-colors">{service.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div>
             <h3 className="text-3xl font-display font-bold text-white mb-6">THE STACK</h3>
             <p className="text-slate-400 mb-8">
               We only use modern, industry-standard technologies to ensure your product is scalable, secure, and maintainable.
             </p>
             <div className="flex flex-wrap gap-3">
               {['React', 'TypeScript', 'Node.js', 'MySQL', 'AWS', 'Docker', 'Tailwind CSS', 'Framer Motion'].map(tech => (
                 <span key={tech} className="px-4 py-2 border border-white/10 text-slate-300 font-mono text-sm">
                   {tech}
                 </span>
               ))}
             </div>
           </div>
           <div className="h-64 bg-grid-white bg-[length:20px_20px] border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-32 h-32 border border-brand-300/30 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-20 h-20 bg-brand-300/10 rounded-full backdrop-blur-sm"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Services;