import React, { useState } from 'react';
import { Mail, MapPin, ArrowRight } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', budget: '5k-10k', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formState)
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to send message right now.');
      }

      setSubmitted(true);
      setFormState({ name: '', email: '', budget: '5k-10k', message: '' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Info Section */}
          <div>
            <span className="text-brand-300 font-mono text-xs tracking-widest uppercase mb-4 block">Initiate Sequence</span>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8">LET'S BUILD <br/>THE FUTURE.</h1>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed border-l border-brand-300 pl-6">
              Ready to upgrade your digital presence? Fill out the form or drop us an email. We reply to all inquiries within 24 hours.
            </p>

            <div className="space-y-10 font-mono text-sm">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center text-brand-300">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase mb-1">Email</h3>
                  <p className="text-slate-400">hello@interwebb.uk</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 border border-white/10 flex items-center justify-center text-brand-300">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase mb-1">HQ</h3>
                  <p className="text-slate-400">Shoreditch, London, UK</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white/5 border border-white/10 p-8 md:p-12 backdrop-blur-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-brand-300/10 blur-xl"></div>
             
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 border-2 border-brand-300 text-brand-300 rounded-full flex items-center justify-center mb-6">
                  <Check size={32} />
                </div>
                <h3 className="text-3xl font-display font-bold text-white mb-2">RECEIVED</h3>
                <p className="text-slate-400 max-w-md">
                  We have your query and a confirmation email is on its way. Expect a tailored response within one working day.
                </p>
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="mt-8 text-white border-b border-white hover:text-brand-300 hover:border-brand-300 transition-colors pb-1"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                    <label htmlFor="name" className="block text-xs font-mono uppercase text-slate-500 mb-2">Name</label>
                    <input 
                        type="text" 
                        id="name"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({...formState, name: e.target.value})}
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-brand-300 transition-colors placeholder-slate-700"
                        placeholder="JOHN DOE"
                    />
                    </div>
                    <div>
                    <label htmlFor="email" className="block text-xs font-mono uppercase text-slate-500 mb-2">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-brand-300 transition-colors placeholder-slate-700"
                        placeholder="JOHN@COMPANY.COM"
                    />
                    </div>
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-xs font-mono uppercase text-slate-500 mb-2">Estimated Budget</label>
                  <select
                    id="budget"
                    value={formState.budget}
                    onChange={(e) => setFormState({...formState, budget: e.target.value})}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-brand-300 transition-colors"
                  >
                      <option value="2k-5k" className="bg-slate-900">£2k - £5k</option>
                      <option value="5k-10k" className="bg-slate-900">£5k - £10k</option>
                      <option value="10k-25k" className="bg-slate-900">£10k - £25k</option>
                      <option value="25k+" className="bg-slate-900">£25k+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono uppercase text-slate-500 mb-2">Project Details</label>
                  <textarea 
                    id="message"
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-brand-300 transition-colors placeholder-slate-700 resize-none"
                    placeholder="Tell us about your vision..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-300 hover:bg-brand-400 text-black font-bold uppercase tracking-wide transition-all flex justify-center items-center gap-2 group"
                >
                  {isSubmitting ? 'TRANSMITTING...' : 'SEND MESSAGE'}
                  {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
                {error && (
                  <p className="text-red-300 text-sm text-center mt-4">{error}</p>
                )}
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
// Helper component for success state checkmark
const Check = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default Contact;
