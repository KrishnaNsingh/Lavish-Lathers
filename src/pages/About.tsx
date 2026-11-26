import React, { useEffect } from 'react';
import { Quote, Sparkles } from 'lucide-react';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FAF7F2] py-32 text-brand-black text-left font-sans-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        
        {/* HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.45em] font-sans-poppins font-semibold text-brand-gold">
             Our Unhurried Roots
          </span>
          <h1 className="font-serif-playfair text-4xl sm:text-5xl tracking-tight leading-tight text-brand-black font-light font-semibold">
              The Art of Saponification <br />
              <span className="italic font-serif-cormorant text-brand-gold font-normal">&amp; Heartfelt Souvenirs</span>
          </h1>
          <div className="h-[1px] w-12 bg-brand-gold mx-auto my-4" />
          <p className="font-sans-inter text-sm text-brand-black/60 font-light leading-relaxed">
             Tracing back to traditional family recipes, Lavish Lathers was created to elevate daily hygiene into an exquisite, restorative sensory retreat.
          </p>
        </div>

      </div>

      <section aria-labelledby="goa-story-title" className="relative isolate overflow-hidden lg:bg-brand-black lg:text-brand-cream">
        <video
          aria-hidden="true"
          tabIndex={-1}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          poster="https://res.cloudinary.com/dzowyrkcg/video/upload/so_1,w_1280,q_auto/v1795691191/Lavish-Lathers-at-Vibrant-Goa_vy8xue.jpg"
          src="https://res.cloudinary.com/dzowyrkcg/video/upload/v1795691191/Lavish-Lathers-at-Vibrant-Goa_vy8xue.mp4"
          onLoadedMetadata={({ currentTarget }) => {
            currentTarget.defaultPlaybackRate = 1.5;
            currentTarget.playbackRate = 1.5;
          }}
          className="pointer-events-none block aspect-video w-full bg-brand-black object-contain lg:absolute lg:inset-0 lg:h-full lg:object-cover"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block lg:bg-[linear-gradient(75deg,rgba(11,11,11,.91),rgba(11,11,11,.74)_38%,rgba(11,11,11,.10)_82%)]" />

        <div className="relative mx-auto flex max-w-7xl justify-center px-6 pb-10 pt-12 text-center sm:py-16 lg:min-h-[42rem] lg:items-end lg:justify-start lg:px-8 lg:py-20 lg:text-left">
          <div className="max-w-md">
            <p className="mb-4 flex items-center justify-center gap-3 text-[#79602c] lg:justify-start lg:text-brand-cream font-sans-poppins text-xs uppercase tracking-[0.18em]">
              <span aria-hidden="true" className="hidden h-px w-10 bg-brand-gold lg:block" />Vibrant Goa
            </p>
            <h2 id="goa-story-title" className="font-serif-playfair text-4xl leading-tight sm:text-5xl lg:text-6xl">
              From our <em className="font-serif-cormorant font-normal">atelier</em>
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-brand-black/75 sm:text-base lg:mx-0 lg:text-brand-cream">
              A glimpse of Lavish Lathers at Vibrant Goa, where the soaps and keepsakes we make by hand meet the people who take them home.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="border-y border-brand-beige/60 py-10 sm:py-14 lg:py-16">
          <section className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance font-serif-playfair text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Six weeks from pour to <em className="font-serif-cormorant font-normal">finished bar.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-brand-black/75 sm:text-base">
              We blend botanical oils and unrefined shea butter at room temperature, then pour each batch by hand.
              The bars rest for six weeks before they leave our workshop.
            </p>
          </section>
          <section className="mx-auto mt-10 grid max-w-5xl items-center gap-6 sm:mt-14 md:grid-cols-2 md:gap-12">
            <img loading="lazy" decoding="async" alt="Botanical oils and shea butter used in our soaps"
              width={800} height={500}
              src="https://res.cloudinary.com/dzowyrkcg/image/upload/c_fill,w_800,h_500,q_auto,f_auto/v1780560107/359007946961d42f3e5cc8ccedc8a0b3_eja1w3.jpg"
              className="aspect-[8/5] w-full rounded-xl object-cover" />
            <div className="max-w-md">
              <h2 className="font-serif-playfair text-3xl leading-tight sm:text-4xl">Souvenirs with soul</h2>
              <p className="mt-3 text-sm leading-7 text-brand-black/75 sm:text-base">
                A lace heart carved by hand. A ribbon chosen for a wedding. A cotton scroll sealed with wax.
                Each detail makes a small gift personal.
              </p>
            </div>
          </section>
        </div>

        {/* VISION BLOCK DARK */}
        <div className="bg-[#0B0B0B] text-brand-cream p-8 sm:p-12 rounded-[2.5rem] text-center space-y-6 mt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-gold/5 blur-xl" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <Quote className="h-10 w-10 text-brand-gold/30 mx-auto" />
            <h3 className="font-serif-playfair text-2xl sm:text-3xl tracking-wide font-light text-brand-cream">
               “True luxury lies in the trace of hands that care.”
            </h3>
            <p className="text-xs text-brand-cream/60 leading-relaxed font-light font-sans-inter">
               We harvest each marigold petal and trim each ribbon right in our small farm cottage. We believe in providing exquisite products while maintaining a gentle, zero-waste footprint on our shared earth.
            </p>
            <div className="pt-2 flex justify-center space-x-3 text-[10px] text-brand-gold uppercase tracking-widest font-sans-poppins font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Cured with love in Goa, INDIA</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
