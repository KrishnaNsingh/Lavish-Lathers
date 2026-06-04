import React from "react";
import { Instagram, Heart, MessageCircle, Sparkles } from "lucide-react";
import { INSTAGRAM_POSTS } from "../data";

export default function SocialGallery() {
  return (
    <section className="py-20 bg-brand-cream border-t border-brand-beige/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center space-x-1.5 text-brand-gold text-xs font-semibold tracking-widest uppercase font-sans-poppins">
            <Instagram className="h-4 w-4" />
            <span>@lavishlathersbyesther</span>
          </div>
          <h2 className="font-serif-playfair text-3xl sm:text-4xl text-brand-black tracking-tight font-light">
            Sights from our Soapmaking Sanctuary
          </h2>
          <p className="font-sans-inter text-xs text-brand-black/50 font-light pr-2">
            Follow our digital journal for a daily look inside cold-process
            pours, floral foraging, and custom packaging wax seals.
          </p>
        </div>

        {/* Instagrid layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-brand-ivory cursor-pointer shadow-xs border border-brand-beige/10"
              onClick={() => {
                alert(
                  `Instagram caption:\n"${post.caption}"\n\nCome and follow our journey on @LavishLathers.Atelier to receive exclusive coupons!`,
                );
              }}
              id={`ig-hover-${post.id}`}
            >
              {/* Product Photo */}
              <img
                src={post.image}
                alt="Artisan Soap Aesthetics"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-110"
              />

              {/* Hover Dark Overlay containing active likes and descriptions */}
              <div className="absolute inset-0 bg-brand-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-left z-10">
                {/* Highlight Icon */}
                <div className="flex justify-end">
                  <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
                </div>

                {/* Caption Snippets */}
                <p className="text-[11px] text-brand-cream/80 font-sans-inter font-light line-clamp-3 leading-relaxed mb-4">
                  {post.caption}
                </p>

                {/* Interactions Stats */}
                <div className="flex items-center space-x-4 text-xs font-sans-poppins text-brand-gold/90 font-semibold border-t border-brand-cream/10 pt-2.5">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3.5 w-3.5 fill-current text-red-400" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-brand-cream">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>

              {/* Glass subtle border sheen */}
              <div className="absolute inset-2 border border-brand-cream/0 group-hover:border-brand-cream/20 rounded-xl transition-all pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
