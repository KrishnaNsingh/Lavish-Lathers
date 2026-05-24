import React from 'react';
import { Pencil, Check, Gift, Sparkles, AlertCircle } from 'lucide-react';

interface CustomMessageFormProps {
  giftNote: string;
  setGiftNote: (note: string) => void;
  giftRecipient: string;
  setGiftRecipient: (name: string) => void;
  isGift: boolean;
  setIsGift: (isGift: boolean) => void;
}

export default function CustomMessageForm({
  giftNote,
  setGiftNote,
  giftRecipient,
  setGiftRecipient,
  isGift,
  setIsGift
}: CustomMessageFormProps) {
  
  return (
    <div className="bg-brand-cream border border-brand-beige/30 p-6 rounded-3xl text-left space-y-6 shadow-sm">
      
      {/* Header with Gift Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Gift className="h-5 w-5 text-brand-gold" />
          <h4 className="font-serif-playfair text-lg text-brand-black tracking-wide font-medium">
            Personalize This Gift
          </h4>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isGift}
            onChange={(e) => setIsGift(e.target.checked)}
            className="sr-only peer"
            id="gifting-message-checkbox"
          />
          <div className="w-11 h-6 bg-brand-beige/40 rounded-full peer peer-focus:ring-1 peer-focus:ring-brand-gold peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-brand-gold after:border-brand-beige after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-black" />
          <span className="ml-3 text-xs uppercase tracking-widest font-sans-poppins font-medium text-brand-black/70">
            {isGift ? "Active" : "Add Message"}
          </span>
        </label>
      </div>

      {isGift ? (
        <div className="space-y-5 animate-fade-in">
          
          {/* Brief notification */}
          <div className="flex items-center space-x-2 bg-brand-pink/40 border border-brand-beige/30 p-2.5 rounded-xl text-brand-black/70 text-[11px] font-sans-inter">
            <AlertCircle className="h-4 w-4 text-brand-gold shrink-0" />
            <span>This dedicated message is printed on a textured scroll with a real gold wax seal and bound to your gift.</span>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/60 mb-1.5 font-medium">
                Recipient Name
              </label>
              <input
                type="text"
                placeholder="e.g. My Dear Clarissa"
                value={giftRecipient}
                onChange={(e) => setGiftRecipient(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                maxLength={40}
                id="recipient-name-input"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/60 mb-1.5 font-medium">
                Your Custom Message
              </label>
              <textarea
                rows={3}
                placeholder="Type your heartfelt wishes here... e.g. May this pure lavender essence bring you serene nights and beautiful mornings."
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all resize-none"
                maxLength={250}
                id="gifting-message-textarea"
              />
              <div className="flex justify-between items-center text-[10px] text-brand-black/45 mt-1">
                <span>Maximum 250 characters</span>
                <span>{250 - giftNote.length} characters remaining</span>
              </div>
            </div>
          </div>

          {/* BRONZE CALLIGRAPHIC LIVE PREVIEW (Highly unique design!) */}
          <div className="pt-2">
            <span className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/50 mb-3 font-medium">
              Live Scroll Presentation Preview
            </span>

            {/* Cotton Scroll Box */}
            <div className="relative bg-[#FCFAF5] border border-dashed border-brand-gold/40 p-6 rounded-2xl shadow-inner text-center overflow-hidden">
              
              {/* Wax Seal Overlay (Breathtaking details!) */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-pink/10 rounded-full pointer-events-none blur-md" />
              <div className="absolute top-4 right-4 flex flex-col items-center">
                
                {/* 3D Styled Wax seal graphic */}
                <div className="h-10 w-10 bg-radial-gradient from-red-600 to-red-800 rounded-full shadow-md border-2 border-amber-500/35 flex items-center justify-center relative rotate-12">
                  <div className="h-8 w-8 rounded-full border border-dashed border-amber-300/30 flex items-center justify-center">
                    <span className="font-serif-playfair text-[8px] text-amber-300 font-bold">LL</span>
                  </div>
                </div>
                <span className="text-[7px] text-brand-black/40 font-mono tracking-widest uppercase mt-1">WAX SEALED</span>
              </div>

              {/* Silk Ribbon Graphic */}
              <div className="absolute left-6 top-0 bottom-0 w-3 bg-red-800/80 opacity-60 pointer-events-none" />

              {/* Scroll Content Context */}
              <div className="pl-6 pr-4 space-y-3 relative z-10">
                <div className="text-[10px] text-brand-gold tracking-[0.25em] font-sans-poppins uppercase">
                  Exquisite Keepsake scroll
                </div>

                {giftRecipient ? (
                  <h5 className="font-serif-cormorant italic text-lg text-brand-black font-semibold">
                    {giftRecipient},
                  </h5>
                ) : (
                  <p className="font-serif-cormorant italic text-sm text-brand-black/30">
                    [Recipient Name]
                  </p>
                )}

                {giftNote ? (
                  <p className="font-serif-cormorant italic text-md text-brand-black/85 leading-relaxed py-1 px-2 whitespace-pre-wrap font-light">
                    &ldquo;{giftNote}&rdquo;
                  </p>
                ) : (
                  <p className="font-serif-cormorant italic text-sm text-brand-black/35 py-1">
                    Your beautiful written card will display here. Packaged with love in ivory linen boxes.
                  </p>
                )}

                <div className="pt-2 flex justify-center">
                  <span className="font-sans-poppins text-[7px] tracking-[0.3em] font-semibold text-brand-gold-light bg-brand-black/90 px-3 py-1 rounded-full uppercase border border-brand-gold/15">
                     Will be included with your order
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="py-2 text-center border border-dashed border-brand-beige/40 rounded-2xl bg-[#FCFAF5]/50 cursor-pointer hover:bg-[#FCFAF5] transition-all" onClick={() => setIsGift(true)}>
          <p className="font-sans-inter text-xs text-brand-black/50 font-light">
             Want this item customized as a gift? Toggle above to generate an elegant scroll.
          </p>
        </div>
      )}

    </div>
  );
}
