import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FAF7F2] py-32 text-brand-black text-left font-sans-inter antialiased min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        
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
            Privacy Policy
          </h1>
          <p className="font-sans-inter text-xs text-brand-black/55 max-w-xl font-light leading-relaxed">
            Last updated: June 2026. This charter governs how your patron interactions are safely compiled inside our systems.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 bg-brand-cream border border-brand-beige/25 p-8 sm:p-10 rounded-[2.5rem] shadow-sm text-sm text-brand-black/80 font-light leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif-playfair text-xl text-brand-black font-semibold">1. Data Collection Integrity</h2>
            <p>
              Lavish Lathers respects patron anonymity. We only collect guest checkout parameters (such as your full name, dispatch destination address, phone contact, and digital mailing path) explicitly required to complete your customized compounding orders or to sync updates through our WhatsApp concierge stream.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-playfair text-xl text-brand-black font-semibold">2. Information Safeguards</h2>
            <p>
              We firmly maintain an absolute anti-broker promise: <strong>We do not sell, barter, lease, or trade your guest data layer to any marketing conglomerates.</strong> Your address infrastructure is transmitted strictly to encrypted transit courier nodes to manage ribbon wrapper handovers flawlessly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-playfair text-xl text-brand-black font-semibold">3. Gateway and Token Security</h2>
            <p>
              Financial validation sequences are managed live via the Razorpay API stack over SSL encrypted pathways. Your physical credit card data or UPI strings are never viewed, intercepted, or archived inside our core Express database endpoints.
            </p>
          </section>

          <div className="flex items-center space-x-2 text-[10px] text-brand-black/45 justify-center pt-4 border-t border-brand-beige/20 leading-normal font-sans-poppins font-bold">
            <ShieldCheck className="h-4.5 w-4.5 text-brand-gold shrink-0" />
            <span>Encrypted Privacy Validation Complete</span>
          </div>
        </div>

      </div>
    </div>
  );
}