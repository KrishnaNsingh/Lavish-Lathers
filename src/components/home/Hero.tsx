import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const { setFilterCategory } = useApp();

  const slides = [
    {
      id: 'minimal-luxury-canvas',
      isFullBleed: true, // Specific flag for the background image style
      topText: 'A T E L I E R',
      mainText: 'PURE ESSENCE',
      accentText: '— RESPLENDENT SKIN —',
      subText: 'UNCOMPROMISED BOTANICAL PURITY CURED FOR DISCRIMINATING PATRONS.',
      buttonText: 'SHOP THE COLLECTION',
      category: 'Gift Boxes',
      textColor: 'text-brand-cream',
      goldText: 'text-[#D4AF37]',
      imageUrl: 'https://res.cloudinary.com/dzowyrkcg/image/upload/v1780561928/Gemini_Generated_Image_l4edk5l4edk5l4ed_s60kir.png',
      imageAlt: 'Luxury artistic lifestyle background layout',
    },
    {
      id: 'cured-saponification',
      isFullBleed: false,
      topText: 'C U R E D  F O R',
      mainText: '6 WEEKS',
      accentText: '— BOTANICAL BARS —',
      subText: 'RICH NATURAL BOTANICAL GLYCERIN & KASHMIRI SAFFRON.',
      buttonText: 'EXPLORE NOW',
      category: 'Herbal Soaps',
      bgGradient: 'from-[#2F1713] via-[#43231E] to-[#2F1713]',
      textColor: 'text-brand-cream',
      goldText: 'text-[#D4AF37]',
      imageUrl: 'https://images.unsplash.com/photo-1607006342411-92447c05b579?auto=format&fit=crop&q=80&w=850',
      imageAlt: 'Classic cedar soap blocks with golden leaf labels',
    },
    {
      id: 'brand-heritage-showcase',
      isBrandLogoCentric: true, // Flags center alignment with the custom brand asset
      topText: 'T H E  L U X E  A Y U R V E D A',
      mainText: 'HERITAGE',
      accentText: '— LAVISH LATHERS —',
      subText: 'ANCIENT ALCHEMY JOINED WITH SIX-WEEK COLD SAPONIFICATION CHAMBER CRAFT.',
      buttonText: 'DISCOVER OUR STORY',
      category: 'Essential Oils',
      bgGradient: 'from-[#0C0B0A] via-[#171514] to-[#0C0B0A]',
      textColor: 'text-brand-cream',
      goldText: 'text-[#E6C15C]',
      imageUrl: 'https://res.cloudinary.com/dzowyrkcg/image/upload/v1780560403/WhatsApp_Image_2026-06-04_at_13.35.43_hlpdxl.jpg',
      imageAlt: 'Lavish Lathers Circular Brand Emblem',
    }
  ];

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handleExplore = (category: string) => {
    setFilterCategory(category);
    navigate('/shop');
  };

  return (
    <div className="bg-[#FAF7F2] text-brand-black">

      {/* --- MODULE 1: REWORKED LUXURY CAROUSEL HERO SECTION --- */}
      <section className="relative overflow-hidden w-full h-screen transition-all duration-700 ease-in-out">
        
        {/* Render Carousel Slides */}
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlide;
          
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out flex items-center ${
                slide.isFullBleed ? 'bg-black' : `bg-gradient-to-r ${slide.bgGradient}`
              } ${
                isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-98 pointer-events-none'
              }`}
            >
              {/* Full-bleed Graphic Slide Option Background Layer */}
              {slide.isFullBleed && (
                <div className="absolute inset-0 w-full h-full z-0">
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.imageAlt}
                    className="w-full h-full object-cover opacity-60 transition-transform duration-[6000s] ease-linear scale-100 group-hover:scale-105"
                  />
                  {/* Rich premium ambient dimming veil overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
                </div>
              )}

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center relative z-10">
                
                {/* Condition 1: Handle Brand Logo Centric Layout Slide */}
                {slide.isBrandLogoCentric ? (
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-12 pt-24 w-full">
                    <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 aspect-square rounded-full overflow-hidden border border-brand-gold/30 shadow-2xl shrink-0 bg-black">
                      <img 
                        src={slide.imageUrl} 
                        alt={slide.imageAlt} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center text-center lg:text-left space-y-6 max-w-xl">
                      <div className="inline-flex justify-center lg:justify-start items-center space-x-2 text-[10px] uppercase tracking-[0.35em] text-[#FAF7F2]/60 font-sans-poppins font-medium">
                        <span>Luxe Ayurveda Formulation</span>
                        <span>&bull;</span>
                        <span className={slide.goldText}>100% Organic</span>
                      </div>
                      <div className="space-y-3">
                        <span className="block text-xs sm:text-sm tracking-[0.5em] font-sans-poppins uppercase text-brand-cream/80 leading-none">{slide.topText}</span>
                        <h1 className="font-serif-playfair text-4xl sm:text-5xl lg:text-6xl font-light tracking-[0.06em] uppercase text-brand-cream leading-none">{slide.mainText}</h1>
                        <span className={`block text-xs sm:text-sm font-sans-poppins tracking-[0.35em] uppercase font-bold ${slide.goldText}`}>{slide.accentText}</span>
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-brand-cream/70 font-light font-sans-poppins pt-2 leading-relaxed">{slide.subText}</p>
                      </div>
                      <div className="pt-2 font-sans-poppins">
                        <button
                          onClick={() => handleExplore(slide.category)}
                          className="py-3 px-8 bg-[#D4AF37] hover:bg-[#FAF7F2] hover:text-brand-black text-brand-black text-[11px] font-bold uppercase tracking-[0.3em] rounded-none transition-all duration-300 shadow-xl border border-[#D4AF37] hover:scale-[1.02] cursor-pointer"
                        >
                          {slide.buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Condition 2: Regular Left-Aligned & Full Bleed Layout Grid Structure */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full pt-32 sm:pt-40 lg:pt-28">
                    
                    {/* Left Typography Column Block */}
                    <div className={`flex flex-col justify-center space-y-6 pt-4 sm:pt-0 ${slide.isFullBleed ? 'lg:col-span-8 text-center lg:text-left' : 'lg:col-span-6 text-center lg:text-left'}`}>
                      <div className="inline-flex justify-center lg:justify-start items-center space-x-2 text-[10px] uppercase tracking-[0.35em] text-[#FAF7F2]/60 font-sans-poppins font-medium">
                        <span>Luxe Ayurveda Formulation</span>
                        <span>&bull;</span>
                        <span className={slide.goldText}>100% Organic</span>
                      </div>

                      <div className="space-y-3">
                        <span className="block text-xs sm:text-sm tracking-[0.5em] font-sans-poppins uppercase text-brand-cream/80 leading-none">
                          {slide.topText}
                        </span>
                        <h1 className="font-serif-playfair text-4xl sm:text-5xl lg:text-7xl font-light tracking-[0.06em] uppercase text-brand-cream leading-none">
                          {slide.mainText}
                        </h1>
                        <span className={`block text-xs sm:text-sm font-sans-poppins tracking-[0.35em] uppercase font-bold ${slide.goldText}`}>
                          {slide.accentText}
                        </span>
                        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-brand-cream/70 font-light font-sans-poppins max-w-lg mx-auto lg:mx-0 pt-2 leading-relaxed">
                          {slide.subText}
                        </p>
                      </div>

                      <div className="pt-2 font-sans-poppins">
                        <button
                          onClick={() => handleExplore(slide.category)}
                          className="py-3 px-8 bg-[#D4AF37] hover:bg-[#FAF7F2] hover:text-brand-black text-brand-black text-[11px] font-bold uppercase tracking-[0.3em] rounded-none transition-all duration-300 shadow-xl border border-[#D4AF37] hover:scale-[1.02] cursor-pointer"
                          id={`explore-slide-${slide.id}`}
                        >
                          {slide.buttonText}
                        </button>
                      </div>
                    </div>

                    {/* Right Split Block Preview Image (Omitted for minimal full bleed background styles) */}
                    {!slide.isFullBleed && (
                      <div className="lg:col-span-6 hidden lg:flex justify-end p-2 h-full items-center">
                        <div className="relative aspect-[4/3] w-full max-w-lg rounded-none overflow-hidden shadow-2xl border border-brand-gold/25 group bg-black">
                          <img
                            src={slide.imageUrl}
                            alt={slide.imageAlt}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>
          );
        })}

        {/* --- CAROUSEL MANUAL SLIDER ARROWS --- */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border border-brand-cream/15 bg-brand-black/20 hover:bg-brand-gold hover:text-brand-black text-[#FAF7F2] transition-all cursor-pointer focus:outline-none"
          aria-label="Previous slide"
          id="btn-slide-prev"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border border-brand-cream/15 bg-brand-black/20 hover:bg-brand-gold hover:text-brand-black text-[#FAF7F2] transition-all cursor-pointer focus:outline-none"
          aria-label="Next slide"
          id="btn-slide-next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* --- CAROUSEL SLIM BOTTOM PROGRESS BARS --- */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3.5">
          {slides.map((_, idx) => (
            <button
               key={idx}
               onClick={() => setActiveSlide(idx)}
               className="group flex flex-col focus:outline-none cursor-pointer"
               id={`bullet-slide-${idx}`}
            >
              <div className="h-[2px] w-12 bg-brand-cream/35 transition-all relative overflow-hidden group-hover:bg-brand-cream/65">
                <div 
                  className={`absolute top-0 left-0 h-full bg-[#D4AF37] transition-all duration-500 ${
                    idx === activeSlide ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            </button>
          ))}
        </div>

      </section>

      {/* --- MODULE 2: SUITE OF THREE KEY FORMULATIONS --- */}
      <section className="py-16 bg-brand-cream border-b border-brand-beige/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.4em] font-sans-poppins font-bold text-brand-gold uppercase block">
              OUR PRESCRIPTIONS
            </span>
            <h2 className="font-serif-playfair text-3xl sm:text-4xl text-brand-black leading-tight tracking-wide font-light">
              Compounded Formulations Made Simple
            </h2>
            <div className="h-[1px] w-12 bg-brand-gold mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Lavender Serenity Bar */}
            <div className="bg-[#FAF7F2] rounded-[2.5rem] border border-brand-beige/25 p-6 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-brand-ivory relative">
                  <img 
                    src="https://images.unsplash.com/photo-1607006342411-92447c05b579?auto=format&fit=crop&q=80&w=500" 
                    alt="Lavender shea" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#EAE3D8] text-[#5E513A] text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full font-sans-poppins">
                    Sleep & Soothe
                  </span>
                </div>
                <h3 className="font-serif-playfair text-lg text-brand-black font-semibold">Lavender & Shea Butter Comfort Bar</h3>
                <p className="text-xs text-[#0B0B0B]/60 leading-relaxed font-sans-inter">
                  Formulated to relieve sensory stress and hydrate sensitive epidermis. Rich in cold-process natural glycerin.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-brand-beige/10 flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-wider text-brand-black/45 font-sans-poppins">Price per bar</span>
                  <span className="font-serif-cormorant italic font-bold text-lg text-brand-black">₹1,490</span>
                </div>
                <button 
                  onClick={() => handleExplore('Herbal Soaps')}
                  className="w-full py-3 bg-brand-black hover:bg-brand-gold hover:text-brand-black text-[#FAF7F2] text-[10px] font-sans-poppins tracking-widest uppercase font-bold rounded-xl transition-all cursor-pointer"
                >
                  Configure Bar
                </button>
              </div>
            </div>

            {/* Card 2: Kashmiri Saffron Cleanser */}
            <div className="bg-[#FAF7F2] rounded-[2.5rem] border border-brand-beige/25 p-6 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-brand-ivory relative">
                  <img 
                    src="https://images.unsplash.com/photo-1605264964521-300ed3f3149b?auto=format&fit=crop&q=80&w=500" 
                    alt="Saffron Mysore" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#EAE3D8] text-[#5E513A] text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full font-sans-poppins">
                    Golden Radiance
                  </span>
                </div>
                <h3 className="font-serif-playfair text-lg text-brand-black font-semibold">Kashmiri Saffron & Sandalwood Cleanser</h3>
                <p className="text-xs text-[#0B0B0B]/60 leading-relaxed font-sans-inter">
                  Specifically compounds active crocin from rare saffron threads to eliminate skin dullness and restore dynamic glow.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-brand-beige/10 flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-wider text-brand-black/45 font-sans-poppins">Price per bar</span>
                  <span className="font-serif-cormorant italic font-bold text-lg text-brand-black">₹1,990</span>
                </div>
                <button 
                  onClick={() => handleExplore('Herbal Soaps')}
                  className="w-full py-3 bg-brand-black hover:bg-brand-gold hover:text-brand-black text-[#FAF7F2] text-[10px] font-sans-poppins tracking-widest uppercase font-bold rounded-xl transition-all cursor-pointer"
                >
                  Configure Bar
                </button>
              </div>
            </div>

            {/* Card 3: Jasmine & Rosehip Gold Elixir */}
            <div className="bg-[#FAF7F2] rounded-[2.5rem] border border-brand-beige/25 p-6 hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-brand-ivory relative">
                  <img 
                    src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=500" 
                    alt="Rosehip Elixir" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#EAE3D8] text-[#5E513A] text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full font-sans-poppins">
                    Youth Renewal
                  </span>
                </div>
                <h3 className="font-serif-playfair text-lg text-brand-black font-semibold">Jasmine & Rosehip Botanical Gold Elixir</h3>
                <p className="text-xs text-[#0B0B0B]/60 leading-relaxed font-sans-inter">
                  Designed as a luxurious nightly facial companion representing elite hydration oils from Moroccan blooming jasmines.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-brand-beige/10 flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-wider text-brand-black/45 font-sans-poppins">Price per elixir</span>
                  <span className="font-serif-cormorant italic font-bold text-lg text-brand-black">₹3,990</span>
                </div>
                <button 
                  onClick={() => handleExplore('Essential Oils')}
                  className="w-full py-3 bg-brand-black hover:bg-brand-gold hover:text-brand-black text-[#FAF7F2] text-[10px] font-sans-poppins tracking-widest uppercase font-bold rounded-xl transition-all cursor-pointer"
                >
                  Configure Bar
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- MODULE 3: TARGETED CONCIERGE BRAND BANNER --- */}
      <section className="py-20 bg-[#F5EFE6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text list */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <div className="space-y-4">
                <span className="text-[10px] tracking-[0.4em] font-sans-poppins font-bold text-brand-gold uppercase">
                  INDIVIDUAL CLINICAL QUALITY
                </span>
                <h2 className="font-serif-playfair text-3xl sm:text-4xl lg:text-5xl text-[#0B0B0B] leading-tight font-medium">
                  Nourish your skin with a routine formulated for you.
                </h2>
                <p className="text-xs sm:text-sm text-[#0B0B0B]/70 leading-relaxed font-light font-sans-inter">
                  Skincare isn't mass-produced. We custom design wedding event sets, curated wax-stamped luxury favor gift boxes, and daily therapy profiles. Speak directly with our cottage soapmakers.
                </p>
              </div>

              <div className="space-y-4 border-t border-brand-beige/40 pt-6 font-sans-inter">
                
                {/* Point 1 */}
                <div className="flex items-start space-x-3 text-sm">
                  <span className="text-brand-gold font-mono text-xs font-bold mt-1">01/</span>
                  <div className="space-y-0.5">
                    <h4 className="font-serif-playfair text-base text-[#0B0B0B] font-semibold">Same-Day Soapmaker Consultation</h4>
                    <p className="text-xs text-[#0B0B0B]/60 font-light">Speak with us about customized ribbons, labels, or essential oil concentrations directly.</p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex items-start space-x-3 text-sm border-t border-brand-beige/15 pt-4">
                  <span className="text-brand-gold font-mono text-xs font-bold mt-1">02/</span>
                  <div className="space-y-0.5">
                    <h4 className="font-serif-playfair text-base text-[#0B0B0B] font-semibold">Rare Active Crocin &amp; Squalene Carriers</h4>
                    <p className="text-xs text-[#0B0B0B]/60 font-light">Every batch is verified through independent skin-irritant assessments to establish optimal barrier safety.</p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex items-start space-x-3 text-sm border-t border-brand-beige/15 pt-4">
                  <span className="text-brand-gold font-mono text-xs font-bold mt-1">03/</span>
                  <div className="space-y-0.5">
                    <h4 className="font-serif-playfair text-base text-[#0B0B0B] font-semibold">100% Biodegradable, Non-Stripping Lathers</h4>
                    <p className="text-xs text-[#0B0B0B]/60 font-light font-sans-inter">Protects standard rivers and personal drains while nourishing and smoothing your body and face.</p>
                  </div>
                </div>

              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-4 font-sans-poppins">
                <button
                  onClick={() => navigate('/contact')}
                  className="py-3.5 px-8 bg-brand-black hover:bg-brand-gold hover:text-brand-black text-brand-cream text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md cursor-pointer"
                  id="clinical-contact-btn"
                >
                  Start Concierge Intake
                </button>
                
                <button
                  onClick={() => navigate('/about')}
                  className="py-3.5 px-8 bg-transparent hover:bg-brand-pink/30 text-brand-black border border-brand-black/20 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
                  id="clinical-about-btn"
                >
                  See Curing Craft
                </button>
              </div>

            </div>

            {/* Right side portrait photography representation */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="aspect-[3/4] w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl border-8 border-[#FAF7F2] relative group">
                <img
                  src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800"
                  alt="Aesthetic skincare routine"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Image Label Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-brand-black/75 backdrop-blur-sm p-4 rounded-2xl text-left border border-brand-gold/25">
                  <span className="text-[10px] text-brand-gold tracking-widest uppercase font-sans-poppins font-semibold">
                    100% Traceable Sourcing
                  </span>
                  <h4 className="font-serif-playfair text-sm text-[#FAF7F2] font-semibold mt-0.5">
                    Hand-harvested in Oregon cottages
                  </h4>
                  <p className="text-[10.5px] text-[#FAF7F2]/75 mt-1 leading-normal font-light font-sans-inter">
                    Every botanical element has been traced from standard local organic petals to your customized ribbon box.
                  </p>
                </div>
              </div>

              {/* Behind decorative glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-brand-gold/5 blur-3xl -z-10 rounded-full" />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}