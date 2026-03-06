import { useState } from 'react';
import { Phone, Mail, CreditCard, MapPin, Send, Loader2 } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Footer() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate network request
    setTimeout(() => {
      setFormState('success');
      // Reset after 3 seconds
      setTimeout(() => setFormState('idle'), 3000);
    }, 1500);
  };

  return (
    <footer id="contact" className="bg-zinc-900 border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          
          {/* Brand & Contact - Spans 7 columns */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-white">ASWAD</h2>
                <p className="text-orange-500 font-medium">CREATIVES</p>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                Professional branding solutions for businesses of all sizes. 
                We bring your vision to life with creative excellence.
              </p>
              
              <div className="pt-4 space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Payment Methods</h3>
                <div className="flex flex-wrap gap-3">
                  {CONTACT_INFO.paymentMethods.map((method, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 flex items-center gap-2">
                      <CreditCard className="w-3 h-3" />
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold text-white mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-3 text-zinc-400 hover:text-orange-400 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-orange-500/10 flex items-center justify-center transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span>{CONTACT_INFO.phone}</span>
                </a>
                <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 text-zinc-400 hover:text-orange-400 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-orange-500/10 flex items-center justify-center transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>{CONTACT_INFO.email}</span>
                </a>
                <div className="flex items-center gap-3 text-zinc-400">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span>Addis Ababa, Ethiopia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Spans 5 columns */}
          <div className="lg:col-span-5 bg-zinc-800/30 p-6 rounded-2xl border border-white/5">
            <h3 className="text-xl font-bold text-white mb-2">Send us a Message</h3>
            <p className="text-zinc-400 text-sm mb-6">Have a project in mind? Let's talk.</p>
            
            {formState === 'success' ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <Send className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Message Sent!</h4>
                <p className="text-zinc-400">We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-medium text-zinc-400 uppercase">Name</label>
                    <input 
                      id="name"
                      required
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-medium text-zinc-400 uppercase">Email</label>
                    <input 
                      id="email"
                      type="email"
                      required
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-medium text-zinc-400 uppercase">Message</label>
                  <textarea 
                    id="message"
                    required
                    rows={4}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={formState === 'submitting'}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6"
                >
                  {formState === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

        </div>
        
        <div className="border-t border-white/5 pt-8 text-center text-zinc-600 text-sm">
          © {new Date().getFullYear()} Aswad Creatives. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
