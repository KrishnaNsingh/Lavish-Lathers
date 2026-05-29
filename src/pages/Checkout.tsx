import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Sparkles,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { CheckoutDetails, Order } from "../types";
import { useApp } from "../context/AppContext";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart, setConfirmedOrder } = useApp();

  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const isFreeShipping = subtotal >= 6000;
  const shippingCharge = isFreeShipping ? 0 : 299;
  const grandTotal = subtotal + shippingCharge;

  // Form Fields
  const [formData, setFormData] = useState<CheckoutDetails>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    notes: "",
  });

  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");

 

  useEffect(() => {
    window.scrollTo(0, 0);
    if (cart.length === 0) {
      navigate("/shop");
    }
  }, [cart, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "LAVISH20") {
      setDiscount(subtotal * 0.2);
      setMessage("Success: 20% Discount applied with Botanical Love!");
    } else {
      setMessage("Error: Invalid or stale coupon code.");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  const handleRazorpayPayment = async () => {
    try {
      // STEP 1
      // Create Razorpay order

      const response = await fetch(
        "http://localhost:5000/api/orders/create-razorpay-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            total: grandTotal - discount,
          }),
        },
      );

      const order = await response.json();

      // STEP 2
      // Razorpay options

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "Lavish Lathers",

        description: "Luxury Herbal Products",

        order_id: order.id,

        handler: async function (response: any) {
          // STEP 3
          // Verify payment

          const verifyResponse = await fetch(
            "http://localhost:5000/api/orders/verify-payment",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,

                razorpay_payment_id: response.razorpay_payment_id,

                razorpay_signature: response.razorpay_signature,

                customer: {
                  name: formData.fullName,
                  email: formData.email,
                  phone: formData.phone,
                },

                shippingAddress: {
                  street: formData.address,
                  city: formData.city,
                  state: formData.state,
                  postalCode: formData.zipCode,
                  instructions: formData.notes,
                },

                items: cart.map((item) => ({
                  productId: item.product._id,

                  registryId: item.product.registryId,

                  name: item.product.name,

                  price: item.product.price,

                  quantity: item.quantity,

                  isGift: item.isGift,

                  giftNote: item.giftNote,

                  giftRecipient: item.giftRecipient,
                })),

                pricing: {
                  subtotal,

                  shipping: shippingCharge,

                  total: grandTotal - discount,
                },
              }),
            },
          );

          const data = await verifyResponse.json();

          if (data.success) {
            setConfirmedOrder(data.order);
            clearCart();
            navigate("/order-confirmation");
            console.log(data);

          } else {
            alert("Payment Verification Failed");
          }
        },

        theme: {
          color: "#0B0B0B",
        },
      };

      // STEP 4
      // Open Razorpay popup

      const razor = new window.Razorpay(options);

      razor.open();
    } catch (error) {
      console.error(error);
    }
  };

  const handleTriggerCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.zipCode
    ) {
      alert(
        "Please provide all required guest credentials and shipping fields.",
      );
      return;
    }
  };
  
  return (
    <div className="bg-brand-cream py-32 min-h-screen text-brand-black font-sans-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Back navigation */}
        <button
          onClick={() => navigate("/shop")}
          className="group flex items-center space-x-2 text-xs uppercase tracking-widest font-sans-poppins font-bold hover:text-brand-gold transition-colors focus:outline-none mb-8 text-left cursor-pointer"
          id="checkout-back-btn"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Gifting Bag</span>
        </button>

        {/* Section title */}
        <div className="text-left mb-12 border-b border-brand-beige/20 pb-4">
          <span className="text-[10px] uppercase tracking-[0.4em] font-sans-poppins font-semibold text-brand-gold">
            Atelier Checkout Portal
          </span>
          <h1 className="font-serif-playfair text-3xl sm:text-4xl text-brand-black tracking-wide font-light whitespace-pre-wrap font-semibold">
            Complete Your Bathing Order
          </h1>
        </div>

        {/* Checkout splits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          {/* LEFT: Guest Credentials details */}
          <form
            onSubmit={handleTriggerCheckout}
            className="lg:col-span-7 space-y-8"
          >
            {/* GUEST DETAILS */}
            <div className="space-y-4">
              <h2 className="font-serif-playfair text-2xl text-brand-black tracking-wide font-medium">
                1. Guest Patron Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-medium font-bold">
                    Patron Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Adrienne Vance"
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                    id="checkout-fullname"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-medium font-bold">
                    Phone Contact (for WhatsApp Concierge) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +1 (555) 0199"
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                    id="checkout-phone"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-medium font-bold">
                    Recipient Dispatch Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. adrienne@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                    id="checkout-email"
                  />
                </div>
              </div>
            </div>

            {/* SHIPPING ADDRESS */}
            <div className="space-y-4">
              <h2 className="font-serif-playfair text-2xl text-brand-black tracking-wide font-medium">
                2. Gifting Dispatch Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-medium font-bold">
                    Street Address &amp; Apartment *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. 742 Evergreen Terrace, Suite 10"
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                    id="checkout-address"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-medium font-bold">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Springfield"
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                    id="checkout-city"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-medium font-bold">
                    State / Region *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. Illinois"
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                    id="checkout-state"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-medium font-bold">
                    Zip Code / Postal Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="e.g. 62704"
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                    id="checkout-zip"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-medium font-bold">
                    Instructions for Artisan Packaging Scroll (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes || ""}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="e.g. Please use green silk ribbons if possible or double check scent notes..."
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all resize-none"
                    id="checkout-notes"
                  />
                </div>
              </div>
            </div>

            {/* Alerts Selection */}
            <div className="bg-[#FAF7F2] border border-brand-beige/40 p-4 rounded-2xl flex items-center justify-between">
              <span className="text-xs text-brand-black/80 font-normal">
                Send real-time packaging snapshots to my WhatsApp
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="sr-only peer"
                  id="whatsapp-alerts"
                />
                <div className="w-9 h-5 bg-brand-beige/40 peer-checked:bg-brand-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-brand-gold after:border-brand-beige after:border after:rounded-full after:h-4 after:w-4 after:transition-all" />
              </label>
            </div>

            {/* BUTTON PROCEED */}
            <button
              type="button"
              onClick={handleRazorpayPayment}
              className="w-full py-4 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-brand-black/15 focus:outline-none cursor-pointer"
              id="submit-checkout-btn"
            >
              Secure Order &amp; Initiate Razorpay Payment
            </button>
          </form>

          {/* RIGHT: High-end order summaries */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#FAF7F2] border border-brand-beige/20 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="font-serif-playfair text-2xl text-brand-black font-semibold">
                Order Summary
              </h3>

              {/* Items in summary list */}
              <div className="space-y-4 max-h-76 overflow-y-auto pr-2 divide-y divide-brand-beige/10">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 pt-4 first:pt-0 items-start"
                  >
                    <div className="w-14 aspect-square rounded-lg overflow-hidden bg-brand-ivory shrink-0 border border-brand-gold/10">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow text-xs space-y-0.5 text-left">
                      <h4 className="font-serif-playfair text-[14px] text-brand-black tracking-wide font-medium leading-tight font-semibold">
                        {item.product.name} (x{item.quantity})
                      </h4>
                      <div className="flex justify-between items-center text-[10px] text-brand-black/45">
                        <span>{item.product.category}</span>
                        <span className="font-serif-cormorant text-xs text-brand-black font-semibold font-serif-cormorant">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>

                      {/* Wax-seal message preview inside order summary */}
                      {item.isGift && (
                        <div className="mt-1.5 p-2 bg-[#FCFAF5] border border-dashed border-red-800/10 rounded-md text-[9px] text-red-900 leading-normal">
                          <span className="font-serif-cormorant italic font-bold font-serif-cormorant">
                            Wax-seal scroll included:{" "}
                          </span>
                          <span className="text-brand-black/75">
                            &ldquo;{item.giftNote || "Heartfelt Greetings"}
                            &rdquo;
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Module */}
              <div className="pt-4 border-t border-brand-beige/20 space-y-2">
                <span className="block text-[9px] uppercase tracking-widest font-sans-poppins text-brand-black/50 font-medium font-bold">
                  Have an Event Promo?
                </span>
                <div className="flex space-x-2 font-sans-poppins">
                  <input
                    type="text"
                    placeholder="Enter code (or try LAVISH20 for 20%)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2 rounded-xl border border-brand-beige/40 bg-brand-cream focus:outline-none uppercase tracking-wider"
                    id="coupon-input"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black px-4 py-2 rounded-xl text-[10px] tracking-widest uppercase font-bold transition-all cursor-pointer"
                    id="coupon-apply-btn"
                  >
                    Apply
                  </button>
                </div>
                {message && (
                  <p
                    className={`text-[10px] font-sans-inter font-medium ${message.startsWith("Err") ? "text-red-600" : "text-emerald-700"}`}
                  >
                    {message}
                  </p>
                )}
              </div>

              {/* Subtotal lines */}
              <div className="border-t border-brand-beige/20 pt-4 text-xs space-y-2.5">
                <div className="flex justify-between text-brand-black/60">
                  <span>Subtotal Cured</span>
                  <span className="font-serif-cormorant text-sm text-brand-black font-semibold font-serif-cormorant">
                    ₹{subtotal}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount (20% Off)</span>
                    <span className="font-serif-cormorant text-sm font-serif-cormorant">
                      -₹{discount}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-brand-black/60">
                  <span>Ribbon Wrapping &amp; Shipping</span>
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-medium text-[10px] font-bold">
                      FREE
                    </span>
                  ) : (
                    <span className="font-serif-cormorant text-sm text-brand-black font-semibold font-serif-cormorant">
                      ₹9.50
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-end pt-3 border-t border-brand-beige/10 font-sans-poppins">
                  <span className="font-serif-playfair text-base text-brand-black font-semibold">
                    Total Order Value
                  </span>
                  <span className="font-serif-cormorant text-2xl text-brand-gold font-extrabold font-serif-cormorant">
                    ₹{grandTotal - discount}
                  </span>
                </div>
              </div>

              {/* Secure terms */}
              <div className="flex items-center space-x-2 text-[10px] text-brand-black/45 justify-center leading-normal">
                <ShieldCheck className="h-4 w-4 text-brand-gold shrink-0" />
                <span>
                  Encrypted secure guest transaction &bull; Razorpay 3-D Secure
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
