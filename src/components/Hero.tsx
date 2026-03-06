import { motion } from 'motion/react';
import { Palette, Sparkles, MessageCircle } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-zinc-950 pt-20 pb-10">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-orange-600/20 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Professional Branding Services</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            ASWAD <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">CREATIVES</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Elevate your brand identity with our comprehensive design packages. 
            From logos to full social media kits, we bring your vision to life.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
            >
              View Packages
            </button>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 rounded-full bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors border border-zinc-700"
            >
              Contact Us
            </button>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => {
                const element = document.getElementById('gemini-chat-trigger');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  element.click();
                }
              }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-in-out -skew-x-12 -translate-x-full" />
              <MessageCircle className="w-6 h-6 animate-bounce" />
              <span>Get a Free Consultation</span>
            </button>
            <p className="text-zinc-500 text-sm mt-3">
              Talk to our AI assistant instantly
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
