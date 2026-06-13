import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const { setFilterCategory } = useApp();

  const slides = [
    {
      id: "minimal-luxury-canvas",
      isFullBleed: true, // Specific flag for the background image style
      topText: "A T E L I E R",
      mainText: "PURE ESSENCE",
      accentText: "— RESPLENDENT SKIN —",
      subText:
        "UNCOMPROMISED BOTANICAL PURITY CURED FOR DISCRIMINATING PATRONS.",
      buttonText: "SHOP THE COLLECTION",
      category: "All",
      textColor: "text-brand-cream",
      goldText: "text-[#D4AF37]",
      imageUrl:
        "https://res.cloudinary.com/dzowyrkcg/image/upload/v1780561928/Gemini_Generated_Image_l4edk5l4edk5l4ed_s60kir.png",
      imageAlt: "Luxury artistic lifestyle background layout",
    },
    {
      id: "cured-saponification",
      isFullBleed: false,
      topText: "C U R E D  F O R",
      mainText: "6 WEEKS",
      accentText: "— BOTANICAL BARS —",
      subText: "RICH NATURAL BOTANICAL GLYCERIN & KASHMIRI SAFFRON.",
      buttonText: "EXPLORE NOW",
      category: "Herbal Soaps",
      bgGradient: "from-[#2F1713] via-[#43231E] to-[#2F1713]",
      textColor: "text-brand-cream",
      goldText: "text-[#D4AF37]",
      imageUrl:
        "https://res.cloudinary.com/dzowyrkcg/image/upload/v1780560107/359007946961d42f3e5cc8ccedc8a0b3_eja1w3.jpg",
      imageAlt: "Classic cedar soap blocks with golden leaf labels",
    },
    {
      id: "brand-heritage-showcase",
      isBrandLogoCentric: true, // Flags center alignment with the custom brand asset
      topText: "T H E  L U X E  A Y U R V E D A",
      mainText: "HERITAGE",
      accentText: "— LAVISH LATHERS —",
      subText:
        "ANCIENT ALCHEMY JOINED WITH SIX-WEEK COLD SAPONIFICATION CHAMBER CRAFT.",
      buttonText: "DISCOVER OUR STORY",
      category: "Essential Oils",
      bgGradient: "from-[#0C0B0A] via-[#171514] to-[#0C0B0A]",
      textColor: "text-brand-cream",
      goldText: "text-[#E6C15C]",
      imageUrl:
        "https://res.cloudinary.com/dzowyrkcg/image/upload/v1780560403/WhatsApp_Image_2026-06-04_at_13.35.43_hlpdxl.jpg",
      imageAlt: "Lavish Lathers Circular Brand Emblem",
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

  const handleExplore = (category: string) => {
    setFilterCategory(category);
    navigate("/shop");
  };

  return (
    <div className="bg-[#FAF7F2] text-brand-black">
      {/* --- MODULE 1: REWORKED LUXURY CAROUSEL HERO SECTION --- */}
      <section className="relative overflow-hidden w-full h-[85vh] sm:h-screen border-b border-[#EAE3D2] antialiased">
        {/* Render Carousel Slides */}
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlide;

          // Condition checks to configure global text theme parameters per slide asset
          const isDarkSlide = slide.id === "brand-heritage-showcase";
          const hasImageBackground =
            slide.isFullBleed || slide.id === "cured-saponification";

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out flex items-center ${
                isDarkSlide
                  ? "bg-[#0C0B0A]" // Elegant deep charcoal background for the logo slide
                  : "bg-[#FFFDF9]" // Crisp, bright warm luxury ivory background for product slides
              } ${
                isActive
                  ? "opacity-100 z-10 scale-100"
                  : "opacity-0 z-0 scale-100 pointer-events-none"
              }`}
            >
              {/* Dynamic Image Background Layer Container */}
              {hasImageBackground && (
                <div className="absolute inset-0 w-full h-full z-0">
                  <img
                    src={
                      slide.id === "cured-saponification"
                        ? "https://res.cloudinary.com/dzowyrkcg/image/upload/v1780560107/359007946961d42f3e5cc8ccedc8a0b3_eja1w3.jpg"
                        : slide.imageUrl
                    }
                    alt={slide.imageAlt}
                    className="w-full h-full object-cover opacity-95"
                  />
                </div>
              )}

              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full h-full flex flex-col justify-center relative z-10">
                {/* Condition 1: Handle Brand Logo Centric Layout Slide */}
                {slide.isBrandLogoCentric ? (
                  <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 pt-16 w-full">
                    <div className="w-44 h-44 sm:w-60 sm:h-60 md:w-72 md:h-72 aspect-square rounded-full overflow-hidden border border-[#C5A059]/40 p-2 bg-[#0C0B0A] shadow-xl shrink-0">
                      <img
                        src={slide.imageUrl}
                        alt={slide.imageAlt}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    {/* 💡 TEXT VISIBILITY FIX (DARK SLIDE): Swapped out dark text for high-contrast radiant text fields */}
                    <div className="flex flex-col justify-center text-center lg:text-left space-y-5 max-w-xl text-[#FFFDF9]">
                      <span className="text-[10px] sm:text-[11px] tracking-[0.4em] text-[#C5A059] font-medium uppercase block font-sans-poppins">
                        {slide.topText}
                      </span>
                      <div className="space-y-2">
                        <h2 className="font-serif-playfair text-4xl sm:text-5xl lg:text-6xl font-normal text-[#FFFDF9] italic leading-tight">
                          {slide.mainText}
                        </h2>

                        <div className="h-[1px] w-16 bg-[#C5A059] mx-auto lg:mx-0 my-3" />
                        <span className="block text-xs sm:text-sm tracking-[0.3em] font-medium uppercase text-[#C5A059] font-sans-poppins">
                          {slide.accentText}
                        </span>
                        <p className="text-xs text-neutral-300 tracking-[0.1em] font-light max-w-md mx-auto lg:mx-0 pt-2 leading-relaxed font-sans-inter normal-case">
                          {slide.subText}
                        </p>
                      </div>
                      <div className="pt-4">
                        <button
                          onClick={() => handleExplore(slide.category)}
                          className="py-3 px-10 bg-[#FFFDF9] hover:bg-[#C5A059] text-[#1A1A1A] text-[11px] font-medium tracking-[0.25em] font-sans-poppins transition-all duration-300 shadow-md uppercase border border-[#FFFDF9] hover:border-[#C5A059] cursor-pointer"
                        >
                          {slide.buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Condition 2: Full Bleed Background Canvas Grids */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full pt-16">
                    <div className="flex flex-col justify-center space-y-5 lg:col-span-8 text-center lg:text-left">
                      {/* 💡 TEXT VISIBILITY FIX (LIGHT SLIDES): Styled texts with high-contrast rich Charcoal colors to keep them beautifully sharp against the images */}
                      <span className="text-[10px] sm:text-[11px] tracking-[0.4em] text-[#8C6D3A] font-semibold uppercase block font-sans-poppins">
                        {slide.topText}
                      </span>
                      <div className="space-y-2">
                        <h1 className="font-serif-playfair text-4xl sm:text-6xl lg:text-7xl font-normal text-[#1A1A1A] italic leading-none">
                          {slide.mainText}
                        </h1>
                        <div className="h-[1px] w-16 bg-[#C5A059] mx-auto lg:mx-0 my-3" />
                        <span className="block text-xs sm:text-sm tracking-[0.3em] font-bold uppercase text-[#1A1A1A] font-sans-poppins">
                          {slide.accentText}
                        </span>
                        <p className="text-xs text-[#1A1A1A] tracking-[0.1em] font-medium max-w-lg mx-auto lg:mx-0 pt-2 leading-relaxed font-sans-inter normal-case">
                          {slide.subText}
                        </p>
                      </div>
                      <div className="pt-4">
                        <button
                          onClick={() => handleExplore(slide.category)}
                          className="py-3 px-10 bg-[#1A1A1A] hover:bg-[#C5A059] text-white hover:text-[#1A1A1A] text-[11px] font-medium tracking-[0.25em] font-sans-poppins transition-all duration-300 shadow-md uppercase border border-[#1A1A1A] hover:border-[#C5A059] cursor-pointer"
                          id={`explore-slide-${slide.id}`}
                        >
                          {slide.buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* --- CAROUSEL MANUAL NAVIGATION SYSTEM --- */}
        {/* --- CAROUSEL MANUAL NAVIGATION SYSTEM --- */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-transparent text-[#1A1A1A]/60 hover:text-[#C5A059] transition-all cursor-pointer focus:outline-none backdrop-blur-xs rounded-full hover:bg-[#FFFDF9]/10"
          aria-label="Previous slide"
          id="btn-slide-prev"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-transparent text-[#1A1A1A]/60 hover:text-[#C5A059] transition-all cursor-pointer focus:outline-none backdrop-blur-xs rounded-full hover:bg-[#FFFDF9]/10"
          aria-label="Next slide"
          id="btn-slide-next"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.5]" />
        </button>

        {/* --- MANUAL CAROUSEL INDEX TICKERS --- */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-4">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className="group flex flex-col focus:outline-none cursor-pointer"
              id={`bullet-slide-${idx}`}
            >
              <div className="h-[2px] w-10 bg-[#EAE3D2] relative overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-[#C5A059] transition-all duration-500 ${
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
                    src="https://res.cloudinary.com/dzowyrkcg/image/upload/v1780576883/Gemini_Generated_Image_rtc2i7rtc2i7rtc2_eeaoyr.png"
                    alt="Lavender shea"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#EAE3D8] text-[#5E513A] text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full font-sans-poppins">
                    Sleep & Soothe
                  </span>
                </div>
                <h3 className="font-serif-playfair text-lg text-brand-black font-semibold">
                  Cocoa & Shea Butter Comfort Bar
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
                    ₹199
                  </span>
                </div>
                <button
                  onClick={() => handleExplore("Herbal Soaps")}
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
                    src="https://res.cloudinary.com/dzowyrkcg/image/upload/v1780578665/Gemini_Generated_Image_ey0u5jey0u5jey0u_yzlmm1.png"
                    alt="Saffron Mysore"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-[#EAE3D8] text-[#5E513A] text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full font-sans-poppins">
                    Golden Radiance
                  </span>
                </div>
                <h3 className="font-serif-playfair text-lg text-brand-black font-semibold">
                  Mongo and Shea Cleanser
                </h3>
                <p className="text-xs text-[#0B0B0B]/60 leading-relaxed font-sans-inter">
                  Nourishing butters are known for their deep moisturizing properties, working together to hydrate and pamper your skin.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-brand-beige/10 flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-wider text-brand-black/45 font-sans-poppins">
                    Price per bar
                  </span>
                  <span className="font-serif-cormorant italic font-bold text-lg text-brand-black">
                    ₹199
                  </span>
                </div>
                <button
                  onClick={() => handleExplore("Herbal Soaps")}
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
                  onClick={() => handleExplore("Essential Oils")}
                  className="w-full py-3 bg-brand-black hover:bg-brand-gold hover:text-brand-black text-[#FAF7F2] text-[10px] font-sans-poppins tracking-widest uppercase font-bold rounded-xl transition-all cursor-pointer"
                >
                  Configure Bar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODULE 3: ARTISANAL SKIN ADVANTAGES (FOREST ESSENTIALS STYLING) --- */}
      {/* --- MODULE 3: THE BALANCED AYURVEDIC SKIN DISCOVERY ADVANTAGES --- */}
      <section className="py-24 bg-[#FFFDF9] border-b border-[#EAE3D2] relative overflow-hidden antialiased">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* LEFT COLUMN: Core Skin Science Workspace */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="space-y-4">
                <span className="text-[10px] tracking-[0.35em] font-medium text-[#C5A059] uppercase block font-sans-poppins">
                  THE ANATOMY OF SYSTEMIC GLOW
                </span>
                <h2 className="font-serif-playfair text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] font-light leading-tight italic tracking-wide">
                  Rooted in therapeutic botanical precision.
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light font-sans-inter max-w-2xl pt-2">
                  Our multi-week cold curing cycle changes how standard
                  cleansers behave. Instead of stripping your cellular structure
                  with synthetic sulfates, our slow curing timeline protects
                  delicate raw botanicals to lock in therapeutic advantages for
                  all skin types.
                </p>
              </div>

              {/* Spectrum of Advantages Feature List Container */}
              <div className="space-y-6 border-t border-[#EAE3D2]/40 pt-6">
                {/* Advantage Point 01 */}
                <div className="flex items-start space-x-4">
                  <span className="text-[#C5A059]/70 font-mono text-xs font-light mt-1 tracking-wider">
                    01/
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-serif-playfair text-base text-[#1A1A1A] font-normal tracking-wide">
                      Glycerin-Enriched Moisture Retention (Herbal Bars)
                    </h4>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed font-sans-inter max-w-xl">
                      Our base cold saponification preserves pure, natural
                      humectants. It draws surrounding atmospheric moisture
                      straight to your body matrix, preventing that tight,
                      dehydrated sensation common with mass-produced
                      alternatives.
                    </p>
                  </div>
                </div>

                {/* Advantage Point 02 */}
                <div className="flex items-start space-x-4 border-t border-[#EAE3D2]/40 pt-5">
                  <span className="text-[#C5A059]/70 font-mono text-xs font-light mt-1 tracking-wider">
                    02/
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-serif-playfair text-base text-[#1A1A1A] font-normal tracking-wide">
                      Melanin &amp; Tone Balance Calibration (Saffron &amp;
                      Sandalwood)
                    </h4>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed font-sans-inter max-w-xl">
                      Infused with raw crocin compounds extracted from premium
                      saffron filaments, these bars soothe underlying
                      micro-irritations, minimize environmental dark spots, and
                      clear tired surface cells.
                    </p>
                  </div>
                </div>

                {/* Advantage Point 03 */}
                <div className="flex items-start space-x-4 border-t border-[#EAE3D2]/40 pt-5">
                  <span className="text-[#C5A059]/70 font-mono text-xs font-light mt-1 tracking-wider">
                    03/
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-serif-playfair text-base text-[#1A1A1A] font-normal tracking-wide">
                      Essential Elasticity Boost (Botanical Elixirs)
                    </h4>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed font-sans-inter max-w-xl">
                      Enriched with therapeutic carrier lipids like Rosehip and
                      pure Squalane, our oils closely mirror your skin's natural
                      sebum. They reinforce your moisture barrier to prevent
                      premature aging and environmental stress.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Call to Actions Buttons matching image_4cfe29.jpg */}
              <div className="flex flex-wrap gap-4 pt-6">
                <button
                  onClick={() => navigate("/shop")}
                  className="py-3 px-10 bg-[#1A1A1A] hover:bg-[#C5A059] text-[#FFFDF9] hover:text-[#1A1A1A] text-[10px] font-medium tracking-[0.2em] font-sans-poppins uppercase transition-all duration-300 rounded-none cursor-pointer"
                >
                  SHOP ALL FORMULATIONS
                </button>

                <button
                  onClick={() => navigate("/about")}
                  className="py-3 px-10 bg-transparent hover:bg-black/5 text-[#1A1A1A] border border-[#EAE3D2] text-[10px] font-medium tracking-[0.2em] font-sans-poppins uppercase transition-all duration-300 rounded-none cursor-pointer"
                >
                  OUR EXTRACTION PROCESS
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Industry-Grade Framed Display matching image_4cfe29.jpg layout */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
              <div className="aspect-[3/4] w-full max-w-sm overflow-hidden border border-[#EAE3D2] p-4 bg-white relative shadow-xs">
                <img
                  src="https://res.cloudinary.com/dzowyrkcg/image/upload/v1780566679/c0aa348810b0849898263bdd5ef961c0_aqmopi.jpg"
                  alt="Artisanal Hand-crafted Herbal Skin Radiance Display"
                  className="w-full h-full object-cover grayscale-[8%] contrast-[102%]"
                />

                {/* 
      ✨ TEXT BACKGROUND REMOVAL FIX: 
      Completely stripped background properties to let the portrait text layer rest natively on the canvas.
      Reconfigured the core typography colors to high-contrast variables for absolute visibility.
    */}
                <div className="absolute bottom-8 left-10 right-10 text-left pointer-events-none">
                  <span className="text-[9px] text-[#C5A059] tracking-[0.25em] font-semibold uppercase block font-sans-poppins">
                    100% ORGANIC INGREDIENT MATRICES
                  </span>
                  <h4 className="font-serif-playfair text-base text-[#dfdddd] font-medium mt-1 italic tracking-wide">
                    Artisanal Batch Integrity
                  </h4>
                  <p className="text-[11px] text-neutral-100 font-light mt-2 leading-relaxed font-sans-inter">
                    From our hand-molded specialty curations to our classical
                    square blocks, every single shape variation contains the
                    same uncompromised herbal core designed to keep your skin
                    deeply radiant and healthy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
