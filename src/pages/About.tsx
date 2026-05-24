import React, { useEffect } from 'react';
import { Quote, Sparkles } from 'lucide-react';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FAF7F2] py-32 text-brand-black text-left font-sans-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.45em] font-sans-poppins font-semibold text-brand-gold">
             Our Unhurried Roots
          </span>
          <h1 className="font-serif-playfair text-4xl sm:text-5xl tracking-tight leading-tight text-brand-black font-light font-semibold">
              The Art of Saponification <br />
              <span className="italic font-serif-cormorant text-brand-gold font-normal">&amp; Heartfelt Souvenirs</span>
          </h1>
          <div className="h-[1px] w-12 bg-brand-gold mx-auto my-4" />
          <p className="font-sans-inter text-sm text-brand-black/60 font-light leading-relaxed">
             Tracing back to traditional family recipes, Lavish Lathers was created to elevate daily hygiene into an exquisite, restorative sensory retreat.
          </p>
        </div>

        {/* IMAGE AND STORY BLOCK 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-24">
          <div className="md:col-span-6 space-y-6">
            <span className="text-[10px] text-brand-gold uppercase tracking-widest font-sans-poppins font-bold">I. Tradition of Curing</span>
            <h2 className="font-serif-playfair text-2xl sm:text-3xl text-brand-black leading-tight tracking-wide font-light">
               Why Cold-Process Matters
            </h2>
            <p className="text-xs sm:text-sm text-brand-black/70 leading-relaxed font-light font-sans-inter">
               Commercial soaps are mass-manufactured in hours using high heating pots that boil out natural glycerin, replacing it with synthetic sulfate lathering agents. This damages the skin's defense mechanisms.
            </p>
            <p className="text-xs sm:text-sm text-brand-black/70 leading-relaxed font-light font-sans-inter">
               At Lavish Lathers, we use traditional cold process saponification. Hand-poured fats, direct botanicals, and unrefined African shea butter combine at room temperature. This retains 100% of the moisturizing botanical glycerin.
            </p>
            <div className="border-l-2 border-brand-gold pl-4 italic text-lg text-brand-black/85 font-serif-cormorant font-serif-cormorant">
               “We measure curing times in phases, not hours. The result is a hard, exceptionally long-lasting block with a density unlike typical bars.”
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-xl border border-brand-beige/20 relative group">
              <img
                src="https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=800"
                alt="Preparing soap ingredients in wooden vats"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-brand-black/10 mix-blend-multiply pointer-events-none" />
            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-24 bg-brand-cream border border-brand-beige/25 p-8 rounded-[2.5rem] shadow-sm">
          <div className="text-center space-y-2">
            <h3 className="font-serif-playfair text-4xl text-brand-gold font-light">6 Weeks</h3>
            <span className="text-[9px] uppercase tracking-widest text-brand-black/50 font-sans-poppins font-medium block">Curing Chamber Quarantine</span>
            <p className="text-xs text-brand-black/60 font-light px-4 leading-normal font-sans-inter">Our items develop structural density in cedar vaults before they leave our workshop.</p>
          </div>

          <div className="text-center space-y-2 border-y sm:border-y-0 sm:border-x border-brand-beige/20 py-6 sm:py-0">
            <h3 className="font-serif-playfair text-4xl text-brand-gold font-light">100%</h3>
            <span className="text-[9px] uppercase tracking-widest text-brand-black/50 font-sans-poppins font-medium block">Botanical Formulation</span>
            <p className="text-xs text-brand-black/60 font-light px-4 leading-normal font-sans-inter">Zero testing on animals, zero petrochemical color solvents or paraben detergents.</p>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-serif-playfair text-4xl text-brand-gold font-light">Wax-Sealed</h3>
            <span className="text-[9px] uppercase tracking-widest text-brand-black/50 font-sans-poppins font-medium block">Personalized Ribbon wrap</span>
            <p className="text-xs text-brand-black/60 font-light px-4 leading-normal font-sans-inter">Every souvenir box features a customized Cotton scroll stamped with warm wax seals.</p>
          </div>
        </div>

        {/* IMAGE AND STORY BLOCK 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-16">
          <div className="md:col-span-6 order-last md:order-first">
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-xl border border-brand-beige/20 relative group">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800"
                alt="Finishing luxurious souvenir orders"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-brand-black/10 mix-blend-multiply pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-6 space-y-6">
            <span className="text-[10px] text-brand-gold uppercase tracking-widest font-sans-poppins font-bold">II. Keepsakes &amp; Living Memory</span>
            <h2 className="font-serif-playfair text-2xl sm:text-3xl text-brand-black leading-tight tracking-wide font-light">
               Souvenirs with Soul
            </h2>
            <p className="text-xs sm:text-sm text-brand-black/70 leading-relaxed font-light font-sans-inter">
               Hygiene can also represent a beautiful token of celebration. Our Hand-Carved Lace Hearts and Gold Leaf Soap Curios are engineered to capture life's celebrations.
            </p>
            <p className="text-xs sm:text-sm text-brand-black/70 leading-relaxed font-light font-sans-inter">
               We weave Damascus rose extract and amber elements into clay structures, capturing active perfumes. Resting in guest powder rooms, our souvenirs double as passive, aromatic air-fragrancers for several months.
            </p>
            <ul className="space-y-2.5 font-sans-inter text-xs text-brand-black/80 font-sans-inter">
              <li className="flex items-center space-x-2.5">
                 <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                 <span>Wedding favor custom ribbons</span>
              </li>
              <li className="flex items-center space-x-2.5">
                 <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                 <span>Annversary and Bridal collection boxes</span>
              </li>
              <li className="flex items-center space-x-2.5">
                 <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                 <span>Bespoke corporate gifting chests</span>
              </li>
            </ul>
          </div>
        </div>

        {/* VISION BLOCK DARK */}
        <div className="bg-[#0B0B0B] text-brand-cream p-8 sm:p-12 rounded-[2.5rem] text-center space-y-6 mt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-gold/5 blur-xl" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <Quote className="h-10 w-10 text-brand-gold/30 mx-auto" />
            <h3 className="font-serif-playfair text-2xl sm:text-3xl tracking-wide font-light text-brand-cream">
               “True luxury lies in the trace of hands that care.”
            </h3>
            <p className="text-xs text-brand-cream/60 leading-relaxed font-light font-sans-inter">
               We harvest each marigold petal and trim each ribbon right in our small farm cottage. We believe in providing exquisite products while maintaining a gentle, zero-waste footprint on our shared earth.
            </p>
            <div className="pt-2 flex justify-center space-x-3 text-[10px] text-brand-gold uppercase tracking-widest font-sans-poppins font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Cured with love in Oregon, USA</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
