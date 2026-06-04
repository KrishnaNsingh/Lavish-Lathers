import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Leaf, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-[#FAF7F2] relative overflow-hidden border-t border-brand-beige/20">
      
      {/* Structural Spacing and Gradients */}
      <div className="absolute top-1/2 left-[-15%] w-[40%] h-[40%] bg-brand-pink/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT: Stunning Editorial Double Image Layout */}
          <div className="lg:col-span-6 relative flex flex-col sm:flex-row gap-6 items-stretch">
            
            {/* Image 1: Preparing Botanicals */}
            <div className="w-full sm:w-[55%] aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-xl border border-brand-cream/80 relative group">
              <img
                src="https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=600"
                alt="Slow distillation and herbal infusions preparation"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-brand-black/10 mix-blend-multiply pointer-events-none" />
            </div>

            {/* Image 2: Stack of cured soaps offset vertically */}
            <div className="w-full sm:w-[45%] aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-lg border border-brand-cream/80 relative sm:translate-y-12 group">
              <img
                src="https://res.cloudinary.com/dzowyrkcg/image/upload/v1780575392/4769675475445dde557a7776326025f4_qazwfu.jpg"
                alt="Curing cold process blocks in dark pine vaults"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-brand-black/10 mix-blend-multiply pointer-events-none" />
            </div>

            {/* Floating Label */}
            <div className="absolute top-1/2 right-4 bg-brand-black text-brand-cream px-5 py-3 rounded-2xl shadow-lg z-20 flex items-center space-x-2 border border-brand-gold/20 hover:scale-105 transition-transform">
              <span className="text-xl font-serif-playfair text-brand-gold">6</span>
              <span className="text-[10px] uppercase font-sans-poppins tracking-widest font-semibold text-brand-cream/90 leading-tight">Weeks of <br />Curing</span>
            </div>

          </div>

          {/* RIGHT: Editorial Craft Story */}
          <div className="lg:col-span-6 flex flex-col space-y-8 text-left">
            <div className="space-y-4">
              <span className="text-[11px] uppercase tracking-[0.4em] font-sans-poppins font-semibold text-brand-gold">
                The Heritage of Slow Craft
              </span>
              <h2 className="font-serif-playfair text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-tight leading-tight font-light font-medium">
                Handcrafted with Love, <br />
                <span className="italic font-serif-cormorant text-brand-gold font-normal">Cured in Unhurried Silence</span>
              </h2>
              <div className="h-[1px] w-12 bg-brand-gold my-4" />
            </div>

            <p className="font-sans-inter text-sm text-brand-black/70 leading-relaxed font-light">
              Lavish Lathers is born from a desire to return back to traditional soapmaking. We reject chemical surfactants, artificial foaming agents, and mass-market speed. Instead, we use cold-process oil saponification.
            </p>

            <blockquote className="border-l-2 border-brand-gold pl-4 py-1 italic font-serif-cormorant text-lg text-brand-black/85">
              “Every block represents an individual design of botanical nature—marbled, poured, pressed, and trimmed by hands that value fine luxury art.”
            </blockquote>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-sans-inter text-xs text-brand-black/80">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                <span>100% natural, nourishing herbal oils</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                <span>Zero petroleum-derived sulfates</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                <span>Scented only with native botanical absolute oils</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-brand-gold shrink-0" />
                <span>Silk ribbons &amp; FSC certified wood packing</span>
              </div>
            </div>

            <div className="pt-2 font-sans-poppins">
              <button
                onClick={() => navigate('/about')}
                className="group flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-brand-black hover:text-brand-gold transition-colors cursor-pointer"
                id="storytelling-more-btn"
              >
                <span>Read Full Storytelling Journey</span>
                <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
