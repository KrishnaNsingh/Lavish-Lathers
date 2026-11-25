import React from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Trash2,
  ArrowRight,
  Gift,
  Truck,
  Plus,
  Minus,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function CartView() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQty, isCartOpen, setIsCartOpen } =
    useApp();

  if (!isCartOpen) return null;

  const onClose = () => setIsCartOpen(false);

  const onCheckout = () => {
    onClose();
    navigate("/checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const freeShippingThreshold = 75;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingShortfall = freeShippingThreshold - subtotal;
  const progressPercent = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100,
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans-inter">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-brand-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Cart Slide Sheet panel */}
        <div className="w-screen max-w-md bg-brand-cream border-l border-brand-beige/20 shadow-2xl flex flex-col justify-between">
          <header className="shrink-0 border-b border-brand-beige/30 bg-[#FAF7F2] text-left">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
              <div className="min-w-0">
                <h2 className="font-serif-playfair text-xl font-semibold leading-tight text-brand-black sm:text-2xl">
                  Your Canvas Bag
                </h2>
                <p className="mt-1 text-xs leading-4 text-brand-black/65">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={onClose}
                className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-brand-black/15 text-brand-black transition-colors hover:bg-brand-beige/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black"
                id="close-cart-btn"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div className="space-y-2 border-t border-brand-beige/20 bg-brand-pink/20 px-4 py-3 sm:px-6">
              <p className="flex items-start gap-2 text-xs leading-5 text-brand-black/80 sm:text-sm">
                <Truck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <span>
                  {isFreeShipping ? (
                    <>Free wrapping and shipping unlocked.</>
                  ) : (
                    <>Add <strong className="font-semibold">&#8377;{shippingShortfall.toFixed(2)}</strong> for free wrapping and shipping.</>
                  )}
                </span>
              </p>
              <div aria-hidden="true" className="h-1 overflow-hidden rounded-full bg-brand-black/10">
                <div
                  className="h-full rounded-full bg-brand-gold motion-safe:transition-[width] motion-safe:duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </header>

          {/* Items Lists */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <Gift className="h-10 w-10 text-brand-beige/60 mx-auto stroke-[1.2]" />
                <p className="font-serif-cormorant italic text-lg text-brand-black/60">
                  Your bag is empty of cured formulas.
                </p>
                <button
                  onClick={onClose}
                  className="py-3 px-6 bg-brand-black hover:bg-brand-gold hover:text-brand-black text-brand-cream font-sans-poppins tracking-widest text-[10px] uppercase font-bold rounded-full transition-colors cursor-pointer"
                  id="empty-cart-shop-btn"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-brand-beige/20">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 pt-4 first:pt-0 text-left animate-fade-in"
                    id={`cart-item-${idx}`}
                  >
                    {/* Item Thumbnail */}
                    <div className="w-20 aspect-square rounded-xl overflow-hidden bg-brand-ivory shrink-0 border border-brand-gold/5">
                      <img
                        src={item.product.images?.[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Metadata detail block */}
                    <div className="flex-grow flex flex-col justify-between space-y-1.5">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif-playfair text-[15px] sm:text-base text-brand-black tracking-wide leading-tight line-clamp-1 font-medium font-semibold">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(idx)}
                            className="text-brand-black/35 hover:text-red-500 transition-colors cursor-pointer"
                            title="Remove item"
                            id={`remove-item-${idx}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <span className="text-[9px] uppercase tracking-widest font-sans-poppins text-brand-black/45">
                          {item.product.category}
                        </span>
                      </div>

                      {/* Wax Seal Scroll Gifting Indication */}
                      {item.isGift && (
                        <div className="inline-flex items-center space-x-1.5 bg-red-800/10 text-red-900 border border-red-800/20 rounded-md px-2 py-1 w-fit animate-fade-in text-[10px]">
                          <div className="h-2 w-2 rounded-full bg-red-800 animate-pulse shrink-0" />
                          <span className="font-serif-cormorant italic font-semibold leading-none">
                            Wax-Sealed Note Scroll: &ldquo;
                            {item.giftRecipient || "Patron"}&rdquo;
                          </span>
                        </div>
                      )}

                      {/* Quantity Controller & Price line */}
                      <div className="flex items-center justify-between pt-1">
                        {/* Minus / Plus quantity elements */}
                        <div className="flex items-center border border-brand-beige/40 bg-[#FAF7F2] rounded-full p-1.5 space-x-2.5">
                          <button
                            onClick={() =>
                              updateCartQty(idx, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-0.5 text-brand-black/55 hover:text-brand-gold disabled:opacity-30 cursor-pointer"
                            id={`decrement-${idx}`}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-sans-poppins text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQty(idx, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="p-0.5 text-brand-black/55 hover:text-brand-gold disabled:opacity-30 cursor-pointer"
                            id={`increment-${idx}`}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Line Value */}
                        <span className="font-serif-cormorant italic text-[15px] text-brand-black font-semibold">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Totals Drawer Bottom */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-brand-beige/25 bg-[#FAF7F2] text-left space-y-4">
              {/* Values list */}
              <div className="space-y-2 border-b border-brand-beige/20 pb-4">
                <div className="flex justify-between text-xs text-brand-black/60">
                  <span>Formulas Value</span>
                  <span className="font-serif-cormorant text-sm text-brand-black font-semibold font-serif-cormorant">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-brand-black/60">
                  <span>Ribbon Wrappings &amp; Delivery</span>
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-semibold font-sans-poppins uppercase text-[10px]">
                      FREE
                    </span>
                  ) : (
                    <span className="font-serif-cormorant text-sm text-brand-black font-semibold font-serif-cormorant">
                      ₹9.50
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="font-serif-playfair text-base text-brand-black font-semibold">
                    Concierge Subtotal
                  </span>
                  <span className="font-serif-cormorant text-2xl text-brand-gold font-bold font-serif-cormorant">
                    ₹{(subtotal + (isFreeShipping ? 0 : 9.5)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Secure terms indicator */}
              <div className="flex items-center space-x-2 text-[10px] text-brand-black/50 justify-center">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-gold" />
                <span>SSL Secured Concierge Dispatch Ready</span>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={onCheckout}
                className="w-full py-4 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black rounded-full font-sans-poppins text-xs font-bold uppercase tracking-widest shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                id="drawer-checkout-btn"
              >
                <span>Proceed to Concierge Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full text-center text-xs text-brand-black/60 hover:text-brand-gold font-sans-poppins uppercase tracking-widest pt-1 block cursor-pointer"
                id="cart-continue-shopping-btn"
              >
                Continue Curing &amp; Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
