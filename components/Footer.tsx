
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram, Facebook, Youtube, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';

const SOCIAL = {
  x: import.meta.env.VITE_SOCIAL_X_URL as string | undefined,
  instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM_URL as string | undefined,
  linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN_URL as string | undefined,
  facebook: import.meta.env.VITE_SOCIAL_FACEBOOK_URL as string | undefined,
  youtube: import.meta.env.VITE_SOCIAL_YOUTUBE_URL as string | undefined
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4">
             <Link to="/" className="flex items-center gap-3 mb-6 group">
              <Logo className="w-8 h-8" />
              <span className="text-2xl font-display font-bold text-white tracking-tight group-hover:text-brand-300 transition-colors">
                INTERWEBB
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Wales-based digital engineering studio. We build the future of the web for brands that dare to be different.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-bold font-display mb-6">SITEMAP</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-mono">
              <li><Link to="/" className="hover:text-brand-300 transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-brand-300 transition-colors">Services</Link></li>
              <li><Link to="/work" className="hover:text-brand-300 transition-colors">Work</Link></li>
              <li><Link to="/about" className="hover:text-brand-300 transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-brand-300 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-white font-bold font-display mb-6">LEGAL</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-mono">
              <li><Link to="/privacy" className="hover:text-brand-300 transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-300 transition-colors">Terms</Link></li>
              <li><Link to="/cookies" className="hover:text-brand-300 transition-colors">Cookies</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-white font-bold font-display mb-6">CONNECT</h4>
            <div className="flex gap-4 mb-8">
              {SOCIAL.x && (
                <a
                  href={SOCIAL.x}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Interwebb UK on X"
                  className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-brand-300 hover:text-black transition-all"
                >
                  <Twitter size={18} />
                </a>
              )}
              {SOCIAL.linkedin && (
                <a
                  href={SOCIAL.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Interwebb UK on LinkedIn"
                  className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-brand-300 hover:text-black transition-all"
                >
                  <Linkedin size={18} />
                </a>
              )}
              {SOCIAL.instagram && (
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Interwebb UK on Instagram"
                  className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-brand-300 hover:text-black transition-all"
                >
                  <Instagram size={18} />
                </a>
              )}
              {SOCIAL.facebook && (
                <a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Interwebb UK on Facebook"
                  className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-brand-300 hover:text-black transition-all"
                >
                  <Facebook size={18} />
                </a>
              )}
              {SOCIAL.youtube && (
                <a
                  href={SOCIAL.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Interwebb UK on YouTube"
                  className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-brand-300 hover:text-black transition-all"
                >
                  <Youtube size={18} />
                </a>
              )}
            </div>
            <div className="p-4 border border-white/10 bg-white/5 flex justify-between items-center group cursor-pointer hover:border-brand-300/50 transition-colors">
               <span className="text-slate-400 text-sm group-hover:text-white">hello@interwebb.uk</span>
               <ArrowUpRight className="text-brand-300 w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-xs font-mono uppercase">
            © {new Date().getFullYear()} Interwebb UK Ltd.
          </p>
          <div className="flex gap-2 items-center">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-xs text-slate-500 font-mono">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
