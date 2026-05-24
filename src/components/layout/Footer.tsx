import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Sparkles, Send, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Footer() {
  const { setFilterCategory } = useApp();
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setSuccess(false), 4000);
  };

  const handleCategoryClick = (cat: string) => {
    setFilterCategory(cat);
    navigate('/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B0B0B] text-brand-cream pt-20 pb-10 border-t border-brand-cream/10 relative overflow-hidden text-left font-sans-inter">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-32 bg-brand-gold/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-brand-cream/10">
          
          {/* SECTION 1: Brand & Philosophy Descriptions */}
          <div className="md:col-span-4 space-y-6">
            <Link 
              to="/"
              className="flex items-center space-x-2 text-left group focus:outline-none"
              id="footer-logo-btn"
            >
              <Leaf className="h-5 w-5 text-brand-gold group-hover:rotate-12 transition-transform duration-500" />
              <span className="font-serif-playfair text-xl tracking-[0.2em] uppercase text-brand-cream group-hover:text-brand-gold transition-colors font-light">
                Lavish Lathers
              </span>
            </Link>

            <p className="text-xs text-brand-cream/65 leading-relaxed font-light">
              We translate centuries of unhurried cold-process soapmaking into premium botanical skincare and exquisite hand-carved keepsakes bound with silk ribbons. Craft takes absolute patience; luxury takes time.
            </p>

            <div className="flex items-center space-x-2 text-[10px] text-brand-gold font-sans-poppins font-semibold uppercase tracking-widest pt-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Free Souvenir Gifting Wrapping Included</span>
            </div>
          </div>

          {/* SECTION 2: Quick Links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-serif-playfair text-sm text-brand-cream tracking-widest uppercase pb-1 border-b border-brand-cream/10 font-bold">
               Curation
            </h4>
            <ul className="space-y-2 text-xs font-sans-poppins text-brand-cream/70 font-light uppercase tracking-widest">
              <li>
                <button
                  onClick={() => handleCategoryClick('Herbal Soaps')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Herbal Soaps
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Essential Oils')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Essential Oils
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Gift Boxes')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Gift Boxes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Souvenirs')}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer"
                >
                  Keepsake Souvenirs
                </button>
              </li>
            </ul>
          </div>

          {/* SECTION 3: Brand Story */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-serif-playfair text-sm text-brand-cream tracking-widest uppercase pb-1 border-b border-brand-cream/10 font-bold">
               Reflections
            </h4>
            <ul className="space-y-2 text-xs font-sans-poppins text-brand-cream/70 font-light uppercase tracking-widest text-left">
              <li>
                <Link to="/about" className="hover:text-brand-gold transition-colors block">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-gold transition-colors block">
                  Concierge Contacts
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    alert("Lavish Lathers operates with physical ateliers in Sisters, OR and Beverly Hills, CA. Tours of our cedarwood drying tunnels can be booked by registered wholesale patrons.");
                  }}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer block"
                >
                  Atelier Locations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    alert("Lavish Lathers provides custom-labeled wedding favors. Order volumes of 50-500 bars receive complimentary stamp mould design engineering!");
                  }}
                  className="hover:text-brand-gold transition-colors text-left cursor-pointer block"
                >
                  Wedding &amp; Favors
                </button>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-brand-gold text-brand-gold/60 text-xs transition-colors block mt-2 pt-2 border-t border-brand-cream/10">
                  Admin Portal &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* SECTION 4: Premium Newsletter Signup */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif-playfair text-sm text-brand-cream tracking-widest uppercase pb-1 border-b border-brand-cream/10 font-bold">
               Patron Registry Newsletter
            </h4>
            <p className="text-xs text-brand-cream/60 leading-relaxed font-light">
               Register your email address to receive notices regarding limited edition cures, seasonal soap cario carvings, and digital unboxing previews.
            </p>

            {success ? (
              <p className="text-xs text-emerald-300 font-sans-inter font-medium animate-fade-in">
                 Success: Your email has been added to the Lavish Ledger patronage list. Welcome.
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                <input
                  type="email"
                  required
                  placeholder="patron@gmail.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 text-xs px-4 py-3 rounded-xl bg-[#141414] border border-brand-cream/10 text-brand-cream placeholder-brand-cream/35 focus:outline-none focus:border-brand-gold"
                  id="newsletter-email-input"
                />
                <button
                  type="submit"
                  className="bg-brand-gold hover:bg-brand-cream text-brand-black p-3 rounded-xl transition-all cursor-pointer"
                  title="Subscribe"
                  id="newsletter-submit-btn"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* BOTTOM SECTION FOOTER */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans-poppins text-brand-cream/45 font-light uppercase tracking-wider">
          <div className="flex flex-wrap items-center gap-1.5 justify-center sm:justify-start">
             <span>&copy; 2026 Lavish Lathers Boutique. All Rights Reserved.</span>
             <span>|</span>
             <button onClick={() => alert("Lavish Lathers respects privacy. We do not sell or trade guest checkout details.")} className="hover:text-brand-cream transition-colors cursor-pointer">Privacy Policy</button>
             <span>|</span>
             <button onClick={() => alert("Terms: Formulas require unhurried delivery conditions. Returns accepted within 15 days of unboxing.")} className="hover:text-brand-cream transition-colors cursor-pointer">Terms of Patronage</button>
          </div>

          <div className="flex items-center space-x-1">
             <span>Formulated with</span>
             <Heart className="h-3 w-3 fill-current text-[#D4AF37]" />
             <span>&amp; Red Clays</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
