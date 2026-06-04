import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function TermsConditions() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FAF7F2] py-32 text-brand-black text-left font-sans-inter antialiased min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center space-x-2 text-xs uppercase tracking-widest font-sans-poppins font-bold hover:text-brand-gold transition-colors focus:outline-none mb-8 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-left space-y-3 mb-12 border-b border-brand-beige/20 pb-6">
          <span className="text-[10px] uppercase tracking-[0.4em] font-sans-poppins font-semibold text-brand-gold">
            Atelier Governance
          </span>
          <h1 className="font-serif-playfair text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-wide font-light font-semibold">
            Terms &amp; Conditions
          </h1>
          <p className="font-sans-inter text-xs text-brand-black/55 max-w-xl font-light leading-relaxed">
            Last updated: June 2026. Standard usage agreements protecting batch procurement schedules.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 bg-brand-cream border border-brand-beige/25 p-8 sm:p-10 rounded-[2.5rem] shadow-sm text-sm text-brand-black/80 font-light leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif-playfair text-xl text-brand-black font-semibold">1. Unhurried Curing Mandates</h2>
            <p>
              Lavish Lathers herbal items rely completely on a dedicated six-week cold saponification curing phase. By checking out on our platform, you acknowledge that batches cannot be artificially accelerated. Delivery timelines depend implicitly on batch readiness to secure appropriate moisture bars.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-playfair text-xl text-brand-black font-semibold">2. Sovereign Dispatch Policies</h2>
            <p>
              Orders are mapped natively inside Indian logistics routes. While shipping is entirely free for curations valued over ₹6,000, standard deliveries are subject to standard transit times. Any distinct courier notes should be outlined clearly inside the packaging instructions field during your checkout flow.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-playfair text-xl text-brand-black font-semibold">3. Unboxing &amp; Return Charters</h2>
            <p>
              Due to the hyper-pure, organic nature of our formulas, returns are valid up to 15 days from delivery tracking indicators, provided the outer wax seal and artisan wrappers remain completely unopened. Broken shields are non-refundable to maintain strict hygienic code standards.
            </p>
          </section>

          <div className="flex items-center space-x-2 text-[10px] text-brand-black/45 justify-center pt-4 border-t border-brand-beige/20 leading-normal font-sans-poppins font-bold">
            <ShieldCheck className="h-4.5 w-4.5 text-brand-gold shrink-0" />
            <span>Atelier Operational Terms Active</span>
          </div>
        </div>

      </div>
    </div>
  );
}