import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
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
    country: "India", // Default updated to match regional parameters
    notes: "",
  });

  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Partial<CheckoutDetails>
  >({});

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

    // Clean error states dynamically upon typing adjustments
    if (validationErrors[name as keyof CheckoutDetails]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

  // 🛡️ Safe Client-Side Form Evaluation Rules for Indian Localizations
  const validateFormPayload = (): boolean => {
    const errors: Partial<CheckoutDetails> = {};

    if (formData.fullName.trim().length < 3) {
      errors.fullName =
        "Please enter your official full name (minimum 3 characters).";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please input a valid email address configuration.";
    }

    // 10-Digit Mobile Constraint Logic (Strips optional prefix variables)
    const rawDigits = formData.phone.replace(/\D/g, "");
    const cleanPhone =
      rawDigits.startsWith("91") && rawDigits.length === 12
        ? rawDigits.slice(2)
        : rawDigits;
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(cleanPhone)) {
      errors.phone = "Please enter a standard 10-digit Indian mobile number.";
    }

    if (formData.address.trim().length < 8) {
      errors.address =
        "Please detail your full flat/building number and street coordinates.";
    }

    if (!formData.city.trim()) errors.city = "City parameter is required.";
    if (!formData.state.trim())
      errors.state = "State or Territory specification is required.";

    // Indian PIN Code 6-digit structure verify rule
    const pinCodeRegex = /^[1-9][0-9]{5}$/;
    if (!pinCodeRegex.test(formData.zipCode.trim())) {
      errors.zipCode =
        "Please provide a valid 6-digit PIN code (e.g., 400001).";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRazorpayPayment = async () => {
    if (!validateFormPayload()) return;
    setIsProcessing(true);

    try {
      // STEP 1: Initialize Razorpay order mapping values against core server
      const response = await fetch(
        "http://localhost:5000/api/orders/create-razorpay-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            total: grandTotal - discount,
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

      if (!response.ok) {
        throw new Error(
          "Failed to compile transactional variables with backend route.",
        );
      }

      const order = await response.json();

      // STEP 2: Configure initialization options block for Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Lavish Lathers",
        description: "Luxury Herbal Products Portfolio Acquisition",
        order_id: order.id,
        
        handler: async function (response: any) {
          // STEP 3: Dispatch tracking tokens forward to your signature verification path
          try {
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
            } else {
              alert(
                "Payment Verification Failed. Cryptographic signature check rejected.",
              );
            }
          } catch (verifyErr) {
            console.error(
              "Verification processing script exception:",
              verifyErr,
            );
            alert("Error establishing connection with validation servers.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#0B0B0B",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      // STEP 4: Call active popup layout window
      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
      alert(
        "Encountered initialization error building client transaction pipeline.",
      );
      setIsProcessing(false);
    }
  };

  const handleTriggerCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRazorpayPayment();
  };

  return (
    <div className="bg-brand-cream py-32 min-h-screen text-brand-black font-sans-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Back navigation */}
        <button
          onClick={() => navigate("/shop")}
          disabled={isProcessing}
          className="group flex items-center space-x-2 text-xs uppercase tracking-widest font-sans-poppins font-bold hover:text-brand-gold transition-colors focus:outline-none mb-8 text-left cursor-pointer disabled:opacity-40"
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

        {/* Checkout layout columns wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          {/* LEFT: Guest Credentials input elements */}
          <form
            onSubmit={handleTriggerCheckoutSubmit}
            className="lg:col-span-7 space-y-8"
            noValidate
          >
            {/* GUEST DETAILS */}
            <div className="space-y-4">
              <h2 className="font-serif-playfair text-2xl text-brand-black tracking-wide font-medium">
                1. Guest Patron Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-bold">
                    Patron Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Type your full name here"
                    className={`w-full px-4 py-3 rounded-xl border ${validationErrors.fullName ? "border-red-500" : "border-brand-beige/40"} bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all`}
                    id="checkout-fullname"
                  />
                  {validationErrors.fullName && (
                    <p className="text-red-500 text-[10px] mt-1 font-medium">
                      {validationErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-bold">
                    Phone Contact (for WhatsApp Updates) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 98765 43210"
                    className={`w-full px-4 py-3 rounded-xl border ${validationErrors.phone ? "border-red-500" : "border-brand-beige/40"} bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all`}
                    id="checkout-phone"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-[10px] mt-1延 font-medium">
                      {validationErrors.phone}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-bold">
                    Recipient Dispatch Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. krishna@lavishlathers.com"
                    className={`w-full px-4 py-3 rounded-xl border ${validationErrors.email ? "border-red-500" : "border-brand-beige/40"} bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all`}
                    id="checkout-email"
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-[10px] mt-1 font-medium">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SHIPPING ADDRESS SECTION */}
            <div className="space-y-4">
              <h2 className="font-serif-playfair text-2xl text-brand-black tracking-wide font-medium">
                2. Gifting Dispatch Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-bold">
                    Flat, Street Address &amp; Apartment *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. Flat 304, Royal Crest Apartments, near Lotus Temple"
                    className={`w-full px-4 py-3 rounded-xl border ${validationErrors.address ? "border-red-500" : "border-brand-beige/40"} bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all`}
                    id="checkout-address"
                  />
                  {validationErrors.address && (
                    <p className="text-red-500 text-[10px] mt-1 font-medium">
                      {validationErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-bold">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Mumbai"
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                    id="checkout-city"
                  />
                  {validationErrors.city && (
                    <p className="text-red-500 text-[10px] mt-1 font-medium">
                      {validationErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-bold">
                    State / Territory *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                    id="checkout-state"
                  />
                  {validationErrors.state && (
                    <p className="text-red-500 text-[10px] mt-1 font-medium">
                      {validationErrors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-bold">
                    6-Digit PIN Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    maxLength={6}
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="e.g. 400001"
                    className={`w-full px-4 py-3 rounded-xl border ${validationErrors.zipCode ? "border-red-500" : "border-brand-beige/40"} bg-[#FAF7F2] text-sm text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all font-mono`}
                    id="checkout-zip"
                  />
                  {validationErrors.zipCode && (
                    <p className="text-red-500 text-[10px] mt-1 font-medium">
                      {validationErrors.zipCode}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/55 mb-1.5 font-bold">
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

            {/* Alerts Toggle Layout selection */}
            <div className="bg-[#FAF7F2] border border-brand-beige/40 p-4 rounded-2xl flex items-center justify-between">
              <span className="text-xs text-brand-black/80 font-normal">
                Send email of order confirmation and disparch update
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

            {/* SUBMIT TRIGGERS PROCEED BUTTON */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-brand-black/15 focus:outline-none flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              id="submit-checkout-btn"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Contacting Gateway Chambers...</span>
                </>
              ) : (
                <span>Secure Order &amp; Initiate Razorpay Payment</span>
              )}
            </button>
          </form>

          {/* RIGHT: High-end order side details summaries panel */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#FAF7F2] border border-brand-beige/20 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="font-serif-playfair text-2xl text-brand-black font-semibold">
                Order Summary
              </h3>

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
                        <span className="font-serif-cormorant text-xs text-brand-black font-semibold">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>

                      {item.isGift && (
                        <div className="mt-1.5 p-2 bg-[#FCFAF5] border border-dashed border-red-800/10 rounded-md text-[9px] text-red-900 leading-normal">
                          <span className="font-serif-cormorant italic font-bold">
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

              {/* Cost ledger block lines */}
              <div className="border-t border-brand-beige/20 pt-4 text-xs space-y-2.5">
                <div className="flex justify-between text-brand-black/60">
                  <span>Subtotal Cured</span>
                  <span className="font-serif-cormorant text-sm text-brand-black font-semibold">
                    ₹{subtotal}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount (20% Off)</span>
                    <span className="font-serif-cormorant text-sm">
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
                    <span className="font-serif-cormorant text-sm text-brand-black font-semibold">
                      ₹{shippingCharge}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-end pt-3 border-t border-brand-beige/10 font-sans-poppins">
                  <span className="font-serif-playfair text-base text-brand-black font-semibold">
                    Total Order Value
                  </span>
                  <span className="font-serif-cormorant text-2xl text-brand-gold font-extrabold">
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
