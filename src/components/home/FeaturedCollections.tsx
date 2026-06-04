import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FeaturedCollections() {
  const navigate = useNavigate();
  const { setFilterCategory } = useApp();
  
  const categories = [
    {
      name: "Herbal Soaps",
      tagline: "Dense, 6-Week Cured Botanical Bars",
      description: "Organic daily skin-polishing cold process soaps crafted with raw African shea and cold-pressed botanical oils.",
      image: "https://res.cloudinary.com/dzowyrkcg/image/upload/v1780576883/Gemini_Generated_Image_rtc2i7rtc2i7rtc2_eeaoyr.png"
    },
    {
      name: "Essential Oils",
      tagline: "Sacred Steam-Distilled Elixirs",
      description: "Subconscious-calming and cellular-plumping oils including organic wild rosehip seed and Moroccan neroli.",
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Gift Boxes",
      tagline: "Eco-Conscious Elegant Vanities",
      description: "Handcrafted pine chests and silk-wrapped slides. Perfect for meaningful corporate or bridal gift-giving.",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Souvenirs",
      tagline: "Hand-Carved Sculptures & Keepsakes",
      description: "Emotional floral clay curios, heart lace designs, and wedding favors curated by hand in our workshop.",
      image: "https://res.cloudinary.com/dzowyrkcg/image/upload/v1780577342/b0d4e596aebd74cc5514dc3678b413f7_irsxzs.jpg"
    },
    {
      name: "Floral Collection",
      tagline: "Damascus Rose & Marigold Therapy",
      description: "An intoxicating range concentrated around pure flower distillate and dried heirloom petals.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Self Care Collection",
      tagline: "Nourishing Bathing Sanctuary Rituals",
      description: "Deep kaolin detox blocks, vetiver bath teas, and linen vanity cloths for deep-pore botanical skin therapy.",
      image: "https://res.cloudinary.com/dzowyrkcg/image/upload/v1780577581/543e0860a08171211fe906e58e0ba6da_jyb71h.jpg"
    }
  ];

  const handleCategorySelect = (categoryName: string) => {
    // Map collection names to matching product types
    let mappedCategory = categoryName;
    if (categoryName === "Floral Collection") mappedCategory = "Floral";
    if (categoryName === "Self Care Collection") mappedCategory = "Skincare";
    
    setFilterCategory(mappedCategory);
    navigate('/shop');
  };

  return (
    <section className="py-20 bg-brand-cream border-t border-brand-beige/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] uppercase tracking-[0.35em] font-sans-poppins font-semibold text-brand-gold">
            Curation of Pure Elements
          </span>
          <h2 className="font-serif-playfair text-3xl sm:text-4xl text-brand-black tracking-tight font-light">
            Featured Botanical Collections
          </h2>
          <div className="h-[1px] w-12 bg-brand-gold mx-auto my-4" />
          <p className="font-sans-inter text-sm text-brand-black/60 font-light leading-relaxed">
            Discover bespoke cold-process cleansers, steam-distilled hair &amp; face elixirs, and wax-sealed wood chests crafted in small, unhurried batches.
          </p>
        </div>

        {/* Categories Bento Grid (Forest Essentials Inspired) */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              onClick={() => handleCategorySelect(cat.name)}
              className="group cursor-pointer relative bg-brand-ivory rounded-3xl overflow-hidden shadow-md shadow-brand-black/5 aspect-[4/5] hover:shadow-xl transition-all duration-500 flex flex-col justify-end"
              id={`cat-card-${i}`}
            >
              {/* Product Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Fine editorial visual gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/99 via-brand-black/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />
              </div>

              {/* Card Label and Content (Z-10) */}
              <div className="relative z-10 p-8 text-left space-y-3">
                
                {/* Tiny Badge */}
                <span className="inline-flex items-center space-x-1.5 text-[9px] uppercase tracking-[0.25em] font-sans-poppins font-medium text-brand-gold-light/95 border-b border-brand-gold/30 pb-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>{cat.tagline}</span>
                </span>

                <h3 className="font-serif-playfair text-2xl text-brand-cream tracking-wide group-hover:text-brand-gold transition-colors font-light">
                  {cat.name}
                </h3>

                <p className="font-sans-inter text-xs text-brand-cream/70 font-light leading-relaxed mb-4 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-500 overflow-hidden">
                  {cat.description}
                </p>

                <div className="flex items-center space-x-2 text-[10px] text-brand-gold uppercase tracking-[0.2em] font-medium pt-1">
                  <span>Explore Collection</span>
                  <span className="transform translate-x-0 group-hover:translate-x-1.5 transition-transform">→</span>
                </div>

              </div>

              {/* Card Fine Border Frame */}
              <div className="absolute inset-4 border border-brand-gold/10 group-hover:border-brand-gold/40 rounded-2xl pointer-events-none transition-colors duration-500" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
