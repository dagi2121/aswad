import { Check, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  gradient: string;
  popular?: boolean;
  delay?: number;
}

export function PricingCard({ title, price, description, features, gradient, popular, delay = 0 }: PricingCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative flex flex-col p-6 rounded-2xl shadow-xl border border-white/10 overflow-hidden group hover:scale-105 transition-transform duration-300",
        popular ? "bg-zinc-900 ring-2 ring-orange-500 scale-105 z-10" : "bg-zinc-900/80 backdrop-blur-sm"
      )}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          POPULAR
        </div>
      )}
      
      <div className={cn("absolute inset-0 opacity-10 bg-gradient-to-br", gradient)} />
      
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-orange-400">{price}</span>
        </div>
        <p className="text-zinc-400 text-sm mb-6 italic">{description}</p>
        
        <div className="flex-grow space-y-3 mb-8">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-zinc-300">
              <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <Button className={cn("w-full font-bold", popular ? "bg-orange-500 hover:bg-orange-600" : "bg-zinc-700 hover:bg-zinc-600")}>
          Choose Plan
        </Button>
      </div>
    </motion.div>
  );
}
