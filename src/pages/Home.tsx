import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import FeaturedCollections from '../components/home/FeaturedCollections';
import BestSellers from '../components/home/BestSellers';
import SouvenirSection from '../components/home/SouvenirSection';
import AboutSection from '../components/home/AboutSection';
import SocialGallery from '../components/home/SocialGallery';
import TestimonialSection from '../components/home/TestimonialSection';

export default function Home() {
  // Ensure we start at the top of the viewport when loading or returning to the home screen
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full flex flex-col overflow-hidden relative" id="layout-home-view">
      
      {/* 1. Immersive Full-Height Cinematic Hero Slider */}
      <Hero />

      {/* 2. Premium Core Suite Formula Prescription Highlights */}
      {/* (Bundled inside the Hero component as Module 2 for structural seamless flow) */}

      {/* 3. Symmetrical Editorial Collections Bento Grid */}
      <FeaturedCollections />

      {/* 4. Famous Patrons Best-Sellers Catalog */}
      <BestSellers />

      {/* 5. Gifting & Keepsake Souvenirs Atelier */}
      <SouvenirSection />

      {/* 6. Multi-Image Storytelling Segment */}
      <AboutSection />

      {/* 7. Patron Reviews Card Deck */}
      <TestimonialSection />

      {/* 8. Instagram Curio Gallery Grid */}
      <SocialGallery />

    </div>
  );
}
