import React from 'react';
import { CheckCircle2, Gift, Send, Calendar, Printer, MessageSquare, Sparkles } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationViewProps {
  order: Order;
  onContinueShopping: () => void;
}

export default function OrderConfirmationView({
  order,
  onContinueShopping
}: OrderConfirmationViewProps) {
  
  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="bg-gradient-to-b from-brand-pink/20 via-brand-cream to-[#FAF7F2] py-20 min-h-screen text-brand-black font-sans-inter">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8 animate-fade-in">
        
        {/* Large Decorative Centered Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-brand-gold/15 blur-xl animate-pulse" />
          <CheckCircle2 className="h-16 w-16 text-brand-gold relative z-10 stroke-[1.2]" />
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.45em] font-sans-poppins font-bold text-brand-gold block">
            Your Order is being Cured
          </span>
          <h1 className="font-serif-playfair text-3xl sm:text-4xl lg:text-5xl text-brand-black leading-tight font-light">
            Thank you for your patronage
          </h1>
          <p className="font-sans-inter text-xs text-brand-black/60 max-w-lg mx-auto font-light leading-relaxed">
            Your payment has been cleared via our secure Razorpay gateway. Our master artisans have locked in your inventory slots and are preparing your customized ribbon boxes.
          </p>
        </div>

        {/* Core Order Info Card */}
        <div className="bg-brand-cream border border-brand-beige/35 p-6 sm:p-8 rounded-[2.5rem] shadow-lg text-left space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-beige/25 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-brand-black/45 block mb-0.5">Order Reference ID</span>
              <span className="font-mono text-sm text-brand-black font-bold tracking-wider">{order._id}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-brand-black/45 block mb-0.5">Transaction Reference ID</span>
              <span className="font-mono text-xs text-brand-black/65">{order.payment?.razorpayPaymentId || "N/A"}</span>
            </div>
          </div>

          {/* Delivery estimate */}
          <div className="flex items-start space-x-3 bg-brand-pink/40 border border-brand-beige/20 p-4 rounded-2xl">
            <Calendar className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-sans-poppins font-semibold uppercase tracking-wider text-[10px] text-brand-black">Estimated Dispatch &amp; Delivery Date</span>
              <p className="text-brand-black/75">
                Being small-batch products, your selections will undergo secondary curation checks and ship out within 48 hours. Estimated to cuddle your doorstep in <strong>4-7 business days</strong>.
              </p>
            </div>
          </div>

          {/* SOUVENIRS / GIVING DETAILS SCROLL PREVIEWS (Reflects functional parameters) */}
          <div className="space-y-4">
            <h3 className="font-serif-playfair text-xl text-brand-black tracking-wide font-medium flex items-center space-x-2">
              <Gift className="h-4.5 w-4.5 text-brand-gold" />
              <span>Scroll Memorandums Checked</span>
            </h3>

            <div className="space-y-3">
              {order.items.some(it => it.isGift) ? (
                order.items.filter(it => it.isGift).map((giftItem, idx) => (
                  <div key={idx} className="bg-[#FAF7F2] border border-dashed border-red-500/20 p-4 rounded-xl flex items-start gap-4">
                    
                    {/* Tiny visual Wax Seal Stamp Indicator */}
                    <div className="h-6 w-6 rounded-full bg-red-800 shrink-0 flex items-center justify-center font-bold text-amber-300 text-[8px] leading-none shadow-md">
                      LL
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-sans-poppins font-medium uppercase text-[9px] tracking-wider text-brand-gold">
                        Attached Scroll for: {giftItem.giftRecipient || 'My Recipient'} &bull; {giftItem.name}
                      </p>
                      <p className="font-serif-cormorant italic text-sm text-brand-black/85 leading-relaxed bg-brand-cream p-2 rounded-lg border border-brand-beige/20">
                        &ldquo;{giftItem.giftNote || 'No message provided'}&rdquo;
                      </p>
                    </div>

                  </div>
                ))
              ) : (
                <p className="text-xs text-brand-black/50 italic font-light">
                   No specific custom message was added. Your products arrive standard-wrapped in clean botanical muslin baggies.
                </p>
              )}
            </div>
          </div>

          {/* Order Totals Summary */}
          <div className="border-t border-brand-beige/20 pt-4 text-xs space-y-2">
             <div className="flex justify-between text-brand-black/60">
                <span>Guest Email Contact</span>
                <span className="font-semibold text-brand-black">{order.customer.email}</span>
             </div>
             <div className="flex justify-between text-brand-black/60">
                <span>Contact Phone</span>
                <span className="font-semibold text-brand-black">{order.customer.phone}</span>
             </div>
             <div className="flex justify-between text-brand-black/60">
                <span>Dispatched Address</span>
                <span className="font-semibold text-brand-black text-right max-w-[220px] truncate">{order.shippingAddress.street}, {order.shippingAddress.city}</span>
             </div>
             <div className="flex justify-between text-brand-black/90 pt-2 border-t border-brand-beige/10 font-sans-poppins font-semibold">
                <span>Final Clearance Total</span>
                <span className="text-brand-gold font-bold">₹{order.pricing.total.toFixed(2)}</span>
             </div>
          </div>

        </div>

        {/* Buttons choices */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onContinueShopping}
            className="w-full sm:w-auto py-4 px-8 bg-brand-black hover:bg-brand-gold hover:text-brand-black text-brand-cream rounded-full font-sans-poppins text-xs font-bold uppercase tracking-widest transition-colors duration-300 shadow-md focus:outline-none"
            id="order-confirm-continue"
          >
             Continue Botanical Shopping
          </button>

          <button
            onClick={() => {
              alert("Lavish Lathers WhatsApp concierge channel: +91 89712 91063-CONCIERGE.\nQuote your Order ID: " + order._id + " to request silk ribbon design selections!");
            }}
            className="w-full sm:w-auto py-4 px-8 bg-transparent hover:bg-brand-pink border border-brand-black/20 text-brand-black rounded-full font-sans-poppins text-xs font-bold uppercase tracking-widest transition-colors duration-300 flex items-center justify-center space-x-2 focus:outline-none"
            id="order-whatsapp-assist"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat WhatsApp Concierge</span>
          </button>
        </div>

        {/* Premium citation scroll text */}
        <div className="pt-4 flex items-center justify-center space-x-2 text-[9px] uppercase tracking-[0.2em] font-sans-poppins text-brand-black/40">
          <Sparkles className="h-3 w-3 text-brand-gold" />
          <span>Handcrafted with absolute devotion since 2022</span>
        </div>

      </div>
    </div>
  );
}
