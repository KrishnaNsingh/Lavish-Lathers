import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Heart, Sparkles, Wand2 } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface SouvenirSectionProps {
  products?: Product[];
}

export default function SouvenirSection({ products: propProducts }: SouvenirSectionProps) {
  const navigate = useNavigate();
  const { setFilterCategory } = useApp();
  
  const [products, setProducts] = React.useState<Product[]>(propProducts || []);
  const [loading, setLoading] = React.useState(!propProducts);

  React.useEffect(() => {
    if (propProducts) {
      setProducts(propProducts);
      return;
    }
    
    // Fetch products dynamically from real backend API instead of data.ts
    const fetchSouvenirs = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed fetching souvenirs listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSouvenirs();
  }, [propProducts]);

  // Settle products that are classified as souvenir or collectible
  const souvenirs = products.filter(p => p.type === 'souvenir' || p.isCollectible).slice(0, 2);

  const handleConfigureAtelier = () => {
    setFilterCategory('Souvenirs');
    navigate('/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return null;

  return (
    <section className="py-24 bg-gradient-to-br from-[#ECE3D5]/30 via-brand-cream to-brand-ivory/60 relative overflow-hidden border-t border-brand-beige/30">
      
      {/* Decorative Ribbon Ornaments styled in elegant absolute layout divs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-brand-pink/30 to-transparent blur-2xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-radial-gradient from-brand-gold/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Luxury Styling Block - Ribbon Graphic and Headline */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-brand-cream/80 border border-brand-gold/20 px-4 py-2 rounded-full text-brand-gold text-[10px] uppercase tracking-[0.2em] font-medium shadow-xs font-sans-poppins">
            <Gift className="h-4.5 w-4.5 text-brand-gold" />
            <span>The Souvenir &amp; Gifting Atelier</span>
          </div>
          
          <h2 className="font-serif-playfair text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-tight leading-tight font-light font-medium">
            Artisanal Keepsakes <br />
            <span className="italic font-serif-cormorant text-brand-gold font-normal">To Elevate Emotional Milestones</span>
          </h2>
          
          <div className="flex items-center justify-center space-x-2 py-2">
            <span className="h-[1px] w-8 bg-brand-gold/50" />
            <Heart className="h-3 w-3 text-brand-gold fill-current" />
            <span className="h-[1px] w-8 bg-brand-gold/50" />
          </div>

          <p className="font-sans-inter text-sm text-brand-black/60 font-light leading-relaxed">
            Crafted for weddings, anniversaries, corporate caskets, and elite events. Each soap curio or lace-pressed structure is bound in silk, wax-checked, and arrives with an elegant customizable calligraphic note.
          </p>
        </div>

        {/* Dynamic Gifting Columns layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: Feature Story / Ribbon Branding Panel */}
          <div className="lg:col-span-4 space-y-8 bg-brand-cream/50 backdrop-blur-md p-8 sm:p-10 rounded-[2.5rem] border border-brand-beige/20 text-left shadow-lg shadow-brand-black/[0.02]">
            
            <div className="space-y-4">
              <h3 className="font-serif-playfair text-2xl text-brand-black tracking-wide font-light">
                Why Lavish Keepsakes?
              </h3>
              <p className="font-sans-inter text-xs text-brand-black/70 leading-relaxed font-light">
                Our luxury souvenirs are not merely functional cleansing products—they are collectible sculptures formulated with premium rose hydrosols and gold flakes that naturally freshen your personal powder rooms.
              </p>
            </div>

            <ul className="space-y-4 font-sans-inter text-xs text-brand-black/80 font-normal">
              <li className="flex items-start space-x-3">
                <span className="p-1 rounded-full bg-brand-pink text-brand-gold shrink-0 mt-0.5 font-bold">✓</span>
                <span><strong>Bespoke Satin Ribbon Trimming:</strong> Choice of royal marine, baby rose, or crisp ivory silk cords.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="p-1 rounded-full bg-brand-pink text-brand-gold shrink-0 mt-0.5 font-bold">✓</span>
                <span><strong>Anatomical Scent Diffusion:</strong> Active Damascus Rose oil emits ambient botanical aroma for up to 90 days offline.</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="p-1 rounded-full bg-brand-pink text-brand-gold shrink-0 mt-0.5 font-bold">✓</span>
                <span><strong>Prestige Wax Seals:</strong> Secured by our master artisans via authentic gold wax seal stamps.</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-brand-beige/30 font-sans-poppins">
              <button
                onClick={handleConfigureAtelier}
                className="group w-full py-4 px-6 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black rounded-full text-[10px] tracking-widest font-bold uppercase transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                id="souvenirs-atelier-btn"
              >
                <Wand2 className="h-3.5 w-3.5" />
                <span>Configure Gifting Favors</span>
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Souvenir Products Portfolio Showcase */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {souvenirs.map((product) => (
              <div
                key={product.id}
                className="group relative bg-[#FAF7F2]/80 backdrop-blur-md p-5 rounded-[2rem] border border-brand-gold/10 hover:border-brand-gold/40 hover:shadow-2xl transition-all duration-500 text-left flex flex-col justify-between"
                id={`souvenir-card-${product.id}`}
              >
                
                {/* Visual Image container with silk ribbon mockup border */}
                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-brand-ivory mb-6 border border-brand-gold/5">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-brand-black/10 pointer-events-none" />

                  {/* Elegant decorative flower emblem overlay (Reflects design parameters) */}
                  <div className="absolute inset-2 border border-brand-gold/15 rounded-[1.2rem] pointer-events-none" />

                  {/* Collector badge */}
                  <div className="absolute top-4 left-4 bg-brand-cream/90 backdrop-blur-xs text-brand-black text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-full font-medium flex items-center space-x-1 border border-brand-gold/10 shadow-xs font-sans-poppins">
                    <Sparkles className="h-2.5 w-2.5 text-brand-gold" />
                    <span>Collectible Art Piece</span>
                  </div>
                </div>

                {/* Info details */}
                <div className="space-y-3 flex-grow mb-6">
                  <h4 className="font-serif-playfair text-xl text-brand-black tracking-wide leading-snug group-hover:text-brand-gold transition-colors font-medium">
                    {product.name}
                  </h4>
                  <p className="font-sans-inter text-xs text-brand-black/60 leading-relaxed font-light line-clamp-3">
                    {product.description}
                  </p>
                </div>

                {/* Selection links */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-beige/20 font-sans-poppins">
                  <span className="font-serif-cormorant italic text-lg text-brand-black font-semibold font-serif-cormorant">
                    ₹{product.price}
                  </span>
                  
                  <button
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="text-[9px] uppercase tracking-widest font-bold bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black px-4 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    Personalize Gift
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
