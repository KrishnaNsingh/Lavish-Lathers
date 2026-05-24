import React from 'react';
import { Star, Quote, Heart } from 'lucide-react';
import { TESTIMONIALS } from '../data';

export default function TestimonialSection() {
  return (
    <section className="py-24 bg-[#0B0B0B] text-brand-cream relative overflow-hidden">
      
      {/* Decorative Golden Ambient Star background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.4em] font-sans-poppins font-semibold text-brand-gold">
            Patron Reflections
          </span>
          <h2 className="font-serif-playfair text-3xl sm:text-4xl text-brand-cream tracking-tight font-light">
            Voices of Restorative Bathing
          </h2>
          <div className="h-[1px] w-12 bg-brand-gold mx-auto my-4" />
          <p className="font-sans-inter text-xs text-brand-cream/60 font-light leading-relaxed">
            Read how global collectors and skincare purists describe their unboxing, lathering, and personalized gifting experiences.
          </p>
        </div>

        {/* Testimonials List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test, index) => (
            <div
              key={test.id}
              className="bg-[#141414] border border-brand-cream/10 hover:border-brand-gold/30 p-8 rounded-[2.5rem] flex flex-col justify-between text-left relative transition-all duration-500 hover:shadow-2xl hover:shadow-brand-gold/5"
              id={`test-${test.id}`}
            >
              
              {/* Quote Mark Ornament */}
              <div className="absolute top-6 right-8 text-brand-gold/10 group-hover:text-brand-gold/20 transition-colors pointer-events-none">
                <Quote className="h-12 w-12 rotate-180" />
              </div>

              {/* Top part with ratings and comments */}
              <div className="space-y-6">
                
                {/* Gold Stars */}
                <div className="flex text-brand-gold space-x-1">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>

                {/* Testimonial message */}
                <p className="font-sans-inter text-sm text-brand-cream/80 leading-relaxed font-light">
                  &ldquo;{test.text}&rdquo;
                </p>

              </div>

              {/* Bottom author credentials */}
              <div className="pt-6 mt-8 border-t border-brand-cream/15 flex items-center justify-between">
                <div>
                  <h4 className="font-serif-playfair text-lg text-brand-cream font-medium">
                    {test.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-[10px] text-brand-gold tracking-widest uppercase font-sans-poppins mt-0.5">
                    <span>{test.role}</span>
                    <span>•</span>
                    <span className="text-brand-cream/60">{test.location}</span>
                  </div>
                </div>

                <div className="p-2 bg-[#1A1A1A] rounded-full text-brand-gold/60 border border-brand-cream/5">
                  <Heart className="h-3.5 w-3.5 fill-current text-brand-pink" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
