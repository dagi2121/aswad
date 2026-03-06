import { motion } from 'motion/react';
import { Image, Share2, Video, FileCode, CheckCircle2 } from 'lucide-react';

const icons = {
  Image,
  Share2,
  Video,
  FileCode
};

interface AddOnProps {
  title: string;
  price: string;
  icon: string;
  delay?: number;
}

export function AddOnCard({ title, price, icon, delay = 0 }: AddOnProps) {
  // @ts-ignore
  const Icon = icons[icon] || CheckCircle2;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/50 border border-white/5 hover:bg-zinc-800 transition-colors"
    >
      <div className="p-3 rounded-full bg-zinc-900 text-orange-400">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-orange-400 font-bold">{price}</p>
      </div>
    </motion.div>
  );
}
