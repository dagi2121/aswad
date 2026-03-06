import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { PricingCard } from '@/components/PricingCard';
import { AddOnCard } from '@/components/AddOns';
import { Footer } from '@/components/Footer';
import { GeminiChat } from '@/components/GeminiChat';
import { Portfolio } from '@/components/Portfolio';
import { BookingModal } from '@/components/BookingModal';
import { PRICING_PACKAGES, ADD_ONS } from '@/lib/utils';

export function Home() {
  const [selectedPackage, setSelectedPackage] = useState<{ title: string; price: string } | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-orange-500/30">
      <Hero />
      
      <main className="space-y-24 pb-24">
        {/* Portfolio Section */}
        <Portfolio />

        {/* Pricing Section */}
        <section id="pricing" className="container mx-auto px-4 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">Choose Your Package</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Select the perfect branding solution for your business. Transparent pricing, no hidden fees.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_PACKAGES.map((pkg, index) => (
              <PricingCard 
                key={index}
                {...pkg}
                delay={index * 0.1}
                onSelect={() => setSelectedPackage({ title: pkg.title, price: pkg.price })}
              />
            ))}
          </div>
        </section>

        {/* Add-ons Section */}
        <section id="addons" className="max-w-4xl mx-auto space-y-8 px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Add-On Services</h3>
            <p className="text-zinc-400">Customize your package with these extras</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ADD_ONS.map((addon, index) => (
              <AddOnCard 
                key={index}
                {...addon}
                delay={0.3 + (index * 0.1)}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <GeminiChat />
      
      <BookingModal 
        isOpen={!!selectedPackage} 
        onClose={() => setSelectedPackage(null)} 
        selectedPackage={selectedPackage} 
      />
    </div>
  );
}
