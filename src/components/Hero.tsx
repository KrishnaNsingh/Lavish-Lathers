import React, { useState, useEffect } from "react";
import { Star, Check, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroProps {
  setCurrentPage: (page: string) => void;
  setFilterCategory: (category: string) => void;
}

export default function Hero({ setCurrentPage, setFilterCategory }: HeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: "travel-luxuries",
      topText: "L I T T L E",
      mainText: "LUXURIES",
      accentText: "— TO GO —",
      subText: "YOUR DAILY RITUALS IN PERFECT TRAVEL SIZES.",
      buttonText: "EXPLORE NOW",
      category: "Gift Boxes",
      bgGradient: "from-[#0A1C3E] via-[#0E2C5A] to-[#0A1C3E]",
      textColor: "text-brand-cream",
      goldText: "text-[#D4AF37]",
      imageUrl:
        "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=850",
      imageAlt: "Luxury boutique leather vanity setup with gold vials",
    },
    {
      id: "hair-masque",
      topText: "T A K E   Y O U R",
      mainText: "TIME",
      accentText: "— HAIR RITUALS —",
      subText: "HAIR REPAIR MASQUE JAPAPATTI & BRAHMI.",
      buttonText: "EXPLORE NOW",
      category: "Essential Oils",
      bgGradient: "from-[#1C2016] via-[#2A3122] to-[#1C2016]",
      textColor: "text-brand-cream",
      goldText: "text-[#E6C15C]",
      imageUrl:
        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=850",
      imageAlt: "Ayurvedic botanical hair scalp treatment session",
    },
    {
      id: "cured-saponification",
      topText: "C U R E D   F O R",
      mainText: "6 WEEKS",
      accentText: "— BOTANICAL BARS —",
      subText: "RICH NATURAL BOTANICAL GLYCERIN & Kashmiri SAFFRON.",
      buttonText: "EXPLORE NOW",
      category: "Herbal Soaps",
      bgGradient: "from-[#2F1713] via-[#43231E] to-[#2F1713]",
      textColor: "text-brand-cream",
      goldText: "text-[#D4AF37]",
      imageUrl:
        "https://images.unsplash.com/photo-1607006342411-92447c05b579?auto=format&fit=crop&q=80&w=850",
      imageAlt: "Classic cedar soap blocks with golden leaf labels",
    },
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

  return (
    <div className="bg-[#FAF7F2] text-brand-black">
      {/* --- MODULE 1: FOREST ESSENTIALS CAROUSEL HERO SECTION --- */}
      <section className="relative overflow-hidden w-full h-screen transition-all duration-700 ease-in-out">
        {/* Render Carousel Slides */}
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full bg-gradient-to-r ${slide.bgGradient} transition-all duration-1000 ease-in-out flex items-center ${
                isActive
                  ? "opacity-100 z-10 scale-100"
                  : "opacity-0 z-0 scale-98 pointer-events-none"
              }`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full pt-32 sm:pt-40 lg:pt-28">
                  {/* Left alignment - Majestic Text styling from Forest Essentials */}
                  <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left space-y-6 pt-4 sm:pt-0">
                    {/* Minimal Category indicator */}
                    <div className="inline-flex justify-center lg:justify-start items-center space-x-2 text-[10px] uppercase tracking-[0.35em] text-[#FAF7F2]/60 font-sans-poppins font-medium">
                      <span>Luxe Ayurveda Formulation</span>
                      <span>&bull;</span>
                      <span className={slide.goldText}>100% Organic</span>
                    </div>

                    {/* Highly-aligned typography block */}
                    <div className="space-y-3">
                      <span className="block text-xs sm:text-sm tracking-[0.5em] font-sans-poppins uppercase text-brand-cream/80 leading-none">
                        {slide.topText}
                      </span>
                      <h1 className="font-serif-playfair text-4xl sm:text-5xl lg:text-7xl font-light tracking-[0.06em] uppercase text-brand-cream leading-none">
                        {slide.mainText}
                      </h1>
                      <span
                        className={`block text-xs sm:text-sm font-sans-poppins tracking-[0.35em] uppercase font-bold ${slide.goldText}`}
                      >
                        {slide.accentText}
                      </span>
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-brand-cream/70 font-light font-sans-poppins max-w-md mx-auto lg:mx-0 pt-2 leading-relaxed">
                        {slide.subText}
                      </p>
                    </div>

                    {/* Gold Button alignment */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setFilterCategory(slide.category);
                          setCurrentPage("shop");
                        }}
                        className="py-3 px-8 bg-[#D4AF37] hover:bg-[#FAF7F2] hover:text-brand-black text-brand-black text-[11px] font-sans-poppins font-bold uppercase tracking-[0.3em] rounded-none transition-all duration-300 shadow-xl border border-[#D4AF37] hover:scale-[1.02]"
                        id={`explore-slide-${slide.id}`}
                      >
                        {slide.buttonText}
                      </button>
                    </div>
                  </div>

                  {/* Right alignment - Luxury setup picture */}
                  <div className="lg:col-span-6 hidden lg:flex justify-end p-2 h-full items-center">
                    <div className="relative aspect-[4/3] w-full max-w-lg rounded-none overflow-hidden shadow-2xl border border-brand-gold/25 group bg-black">
                      <img
                        src={slide.imageUrl}
                        alt={slide.imageAlt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                      />
                      {/* Rich ambient gold overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
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
              className="group flex flex-col focus:outline-none"
              id={`bullet-slide-${idx}`}
            >
              {/* Progress Bar line style */}
              <div className="h-[2px] w-12 bg-brand-cream/35 transition-all relative overflow-hidden group-hover:bg-brand-cream/65">
                <div
                  className={`absolute top-0 left-0 h-full bg-[#D4AF37] transition-all duration-500 ${
                    idx === activeSlide ? "w-full" : "w-0"
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
                <h3 className="font-serif-playfair text-lg text-brand-black font-semibold">
                  Lavender & Shea Butter Comfort Bar
                </h3>
                <p className="text-xs text-[#0B0B0B]/60 leading-relaxed font-sans-inter">
                  Formulated to relieve sensory stress and hydrate sensitive
                  epidermis. Rich in cold-process natural glycerin.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-brand-beige/10 flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-wider text-brand-black/45 font-sans-poppins">
                    Price per bar
                  </span>
                  <span className="font-serif-cormorant italic font-bold text-lg text-brand-black">
                    ₹1,490
                  </span>
                </div>
                <button
                  onClick={() => {
                    setFilterCategory("Herbal Soaps");
                    setCurrentPage("shop");
                  }}
                  className="w-full py-3 bg-brand-black hover:bg-brand-gold hover:text-brand-black text-[#FAF7F2] text-[10px] font-sans-poppins tracking-widest uppercase font-bold rounded-xl transition-all"
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
                <h3 className="font-serif-playfair text-lg text-brand-black font-semibold">
                  Kashmiri Saffron & Sandalwood Cleanser
                </h3>
                <p className="text-xs text-[#0B0B0B]/60 leading-relaxed font-sans-inter">
                  Specifically compounds active crocin from rare saffron threads
                  to eliminate skin dullness and restore dynamic glow.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-brand-beige/10 flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-wider text-brand-black/45 font-sans-poppins">
                    Price per bar
                  </span>
                  <span className="font-serif-cormorant italic font-bold text-lg text-brand-black">
                    ₹1,990
                  </span>
                </div>
                <button
                  onClick={() => {
                    setFilterCategory("Herbal Soaps");
                    setCurrentPage("shop");
                  }}
                  className="w-full py-3 bg-brand-black hover:bg-brand-gold hover:text-brand-black text-[#FAF7F2] text-[10px] font-sans-poppins tracking-widest uppercase font-bold rounded-xl transition-all"
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
                <h3 className="font-serif-playfair text-lg text-brand-black font-semibold">
                  Jasmine & Rosehip Botanical Gold Elixir
                </h3>
                <p className="text-xs text-[#0B0B0B]/60 leading-relaxed font-sans-inter">
                  Designed as a luxurious nightly facial companion representing
                  elite hydration oils from Moroccan blooming jasmines.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-brand-beige/10 flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-wider text-brand-black/45 font-sans-poppins">
                    Price per elixir
                  </span>
                  <span className="font-serif-cormorant italic font-bold text-lg text-brand-black">
                    ₹3,990
                  </span>
                </div>
                <button
                  onClick={() => {
                    setFilterCategory("Essential Oils");
                    setCurrentPage("shop");
                  }}
                  className="w-full py-3 bg-brand-black hover:bg-brand-gold hover:text-brand-black text-[#FAF7F2] text-[10px] font-sans-poppins tracking-widest uppercase font-bold rounded-xl transition-all"
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
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* TOP HEADER SEGMENT */}
              <div className="space-y-2">
                <span className="text-[10px] tracking-[0.3em] font-sans-poppins font-medium text-[#C5A059] uppercase block">
                  I. THE AYURVEDIC DIFFERENCE
                </span>
                <h2 className="font-serif-playfair text-3xl sm:text-4xl text-[#1A1A1A] font-normal tracking-wide leading-tight">
                  Why Cold-Process Matters
                </h2>
                <div className="h-[1px] w-12 bg-[#C5A059] mt-3" />
              </div>

              {/* INTRODUCTORY PARAGRAPHS */}
              <div className="space-y-4 text-xs sm:text-sm text-neutral-500 font-light font-sans-inter leading-relaxed max-w-xl">
                <p>
                  Commercial soaps are mass-manufactured in hours using high
                  heating pots that boil out natural glycerin, replacing it with
                  synthetic sulfate lathering agents. This damages the skin's
                  defense mechanisms.
                </p>
                <p>
                  At Lavish Lathers, we use traditional cold process
                  saponification. Hand-poured fats, direct botanicals, and
                  unrefined raw ingredients combine at room temperature to
                  preserve natural moisturizing matrices.
                </p>
              </div>

              {/* REWORKED PREMIUM SPECTRUM LIST SYSTEM */}
              <div className="space-y-4 border-t border-[#EAE3D2]/60 pt-5 max-w-xl">
                {/* Point 1 */}
                <div className="flex items-start space-x-3 text-sm">
                  <span className="text-[#C5A059] font-mono text-xs font-medium mt-0.5">
                    01/
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="font-serif-playfair text-base text-[#1A1A1A] font-normal">
                      Glycerin Retention
                    </h4>
                    <p className="text-xs text-neutral-400 font-light font-sans-inter">
                      Our cold cure retains 100% of its native humectants to
                      keep skin plump post-rinse.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex items-start space-x-3 text-sm border-t border-[#EAE3D2]/40 pt-3">
                  <span className="text-[#C5A059] font-mono text-xs font-medium mt-0.5">
                    02/
                  </span>
                  <div className="space-y-0.5">
                    <h4 className="font-serif-playfair text-base text-[#1A1A1A] font-normal">
                      Active Carrier Lipids
                    </h4>
                    <p className="text-xs text-neutral-400 font-light font-sans-inter">
                      Every batch protects raw botanical components without heat
                      degradation pathways.
                    </p>
                  </div>
                </div>
              </div>

              {/* MINIMAL DESIGN CTAs */}
              <div className="flex flex-wrap gap-4 pt-4 font-sans-poppins">
                <button
                  onClick={() => setCurrentPage("contact")}
                  className="py-3 px-8 bg-[#1A1A1A] hover:bg-[#C5A059] text-[#FFFDF9] hover:text-[#1A1A1A] text-[10px] font-medium tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer"
                  id="clinical-contact-btn"
                >
                  Start Concierge Intake
                </button>

                <button
                  onClick={() => setCurrentPage("about")}
                  className="py-3 px-8 bg-transparent hover:bg-black/5 text-[#1A1A1A] border border-[#EAE3D2] text-[10px] font-medium tracking-widest uppercase transition-all rounded-none cursor-pointer"
                  id="clinical-about-btn"
                >
                  See Curing Craft
                </button>
              </div>
            </div>

            {/* Right side portrait photography representation */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="aspect-[3/4] w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl border-8 border-[#FAF7F2] relative group">
                {/* Picture of model holding soap / relaxing */}
                <img
                  src="https://res.cloudinary.com/dzowyrkcg/image/upload/v1780566679/c0aa348810b0849898263bdd5ef961c0_aqmopi.jpg"
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
                  <p className="text-[10.5px] text-[#FAF7F2]/75 font-sans-inter mt-1 leading-normal font-light">
                    Every botanical element has been traced from standard local
                    organic petals to your customized ribbon box.
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
