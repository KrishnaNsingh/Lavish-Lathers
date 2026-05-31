import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  Plus,
  Minus,
  CheckCircle,
  Leaf,
  Sparkles,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { Product, CartItem } from "../types";
import CustomMessageForm from "./CustomMessageForm";

interface ProductDetailsModalProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (
    product: Product,
    isGift: boolean,
    giftNote?: string,
    giftRecipient?: string,
    quantity?: number,
  ) => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
}

export default function ProductDetailsModal({
  product,
  onBack,
  onAddToCart,
  products,
  onSelectProduct,
  wishlist,
  toggleWishlist,
}: ProductDetailsModalProps) {
  const [activeImage, setActiveImage] = useState(product.imageUrl);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "details" | "ingredients" | "benefits"
  >("details");
  const [isWishlisted, setIsWishlisted] = useState(
    wishlist.includes(product._id),
  );

  // Gift message states
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [giftRecipient, setGiftRecipient] = useState("");

  // Settle review inputs
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [localReviews, setLocalReviews] = useState<any[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    setActiveImage(product.imageUrl);
    setQuantity(1);
    setIsGift(false);
    setGiftNote("");
    setGiftRecipient("");
    setLocalReviews([]);
    setSubmitSuccess("");
    setIsWishlisted(wishlist.includes(product._id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product, wishlist]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewText) {
      alert("Please provide both your name and review remarks.");
      return;
    }

    const newRev = {
      id: `rev-local-${Date.now()}`,
      name: reviewName,
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    setLocalReviews([newRev, ...localReviews]);
    setReviewName("");
    setReviewText("");
    setSubmitSuccess(
      "Thank you! Your verified patron review has been loaded live onto the product records.",
    );

    setTimeout(() => {
      setSubmitSuccess("");
    }, 4000);
  };

  const handleIncrement = () =>
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToBag = () => {
    onAddToCart(
      product,
      isGift,
      isGift ? giftNote : undefined,
      isGift ? giftRecipient : undefined,
      quantity,
    );
  };

  // Extract related products (excluding current, matching category)
  const related = products
    .filter(
      (p) =>
        p.id !== product._id &&
        (p.category === product.category || p.type === product.artistryType),
    )
    .slice(0, 4);

  return (
    <div className="bg-brand-cream py-10 min-h-screen text-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back and Navigation helper */}
        <div className="flex items-center justify-between mb-8 border-b border-brand-beige/20 pb-4">
          <button
            onClick={onBack}
            className="group flex items-center space-x-2 text-xs uppercase tracking-widest font-sans-poppins font-semibold hover:text-brand-gold transition-colors focus:outline-none"
            id="back-to-collection-btn"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Collection</span>
          </button>

          <span className="text-[10px] uppercase font-sans-poppins tracking-[0.2em] text-brand-black/50">
            Lavish Atelier &bull; {product.category}
          </span>
        </div>

        {/* Product Panel splits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: Cinematic Gallery with Zoom */}
          <div className="lg:col-span-6 space-y-4">
            {/* Lead Image Box with full Zoom Effect on scale */}
            <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-brand-ivory shadow-lg border border-brand-beige/20 group">
              <img
                src={activeImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 cursor-zoom-in"
                id="main-product-img"
              />
              <div className="absolute inset-0 bg-brand-black/5 pointer-events-none" />

              <div className="absolute bottom-6 left-6 bg-brand-black/75 backdrop-blur-xs text-brand-cream text-[9px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center space-x-1.5 font-medium">
                <Sparkles className="h-3 w-3 text-brand-gold animate-pulse" />
                <span>Hover Image to Zoom detail</span>
              </div>
            </div>

            {/* Thumbnails list */}
            <div className="flex items-center space-x-4 pl-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 aspect-square rounded-2xl overflow-hidden bg-brand-ivory border-2 transition-all cursor-pointer ${
                    activeImage === img
                      ? "border-brand-gold scale-105"
                      : "border-brand-beige/40 opacity-70 hover:opacity-100"
                  }`}
                  id={`img-thumb-${idx}`}
                >
                  <img
                    src={img}
                    alt="Product closeup"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Detailed Marketing parameters & customizations */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div>
              {/* Product Type/Badge */}
              <div className="flex items-center space-x-2 text-brand-gold text-[10px] font-semibold tracking-widest uppercase font-sans-poppins mb-2">
                <Leaf className="h-3.5 w-3.5" />
                <span>
                  {product.artistryType === "Keepsake Souvenir"
                    ? "Premium Keepsake Souvenir"
                    : "Natural Botanical Facial Care"}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif-playfair text-3xl sm:text-4xl text-brand-black leading-tight tracking-wide mb-3 font-semibold">
                {product.name}
              </h1>

              {/* Stars rating */}
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex text-brand-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-current"
                          : "opacity-30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-sans-poppins font-medium text-brand-black/60 pt-0.5">
                  {product.rating.toFixed(1)} Rating (
                  {product.reviewsCount + localReviews.length} Patron Reviews)
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="bg-[#FAF7F2] border-y border-brand-beige/20 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/45 block mb-0.5">
                  Total Value (INR)
                </span>
                <span className="font-serif-cormorant text-3xl text-brand-black font-semibold">
                  ₹{product.price.toFixed(2)}
                </span>
              </div>

              {/* Stock check pill */}
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/45 block mb-1">
                  Status
                </span>
                {product.stock > 0 ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-sans-poppins uppercase tracking-wider font-semibold px-3 py-1 rounded-md">
                    {product.stock} Units Cured & Ready
                  </span>
                ) : (
                  <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-sans-poppins uppercase tracking-wider font-semibold px-3 py-1 rounded-md">
                    Out of Stock (Curing)
                  </span>
                )}
              </div>
            </div>

            {/* Short Descriptions */}
            <div className="space-y-2">
              <p className="font-sans-inter text-sm text-brand-black/80 font-normal leading-relaxed">
                {product.shortDescription}
              </p>
              <p className="font-sans-inter text-xs text-brand-black/60 font-light leading-relaxed">
                {product.detailedDescription}
              </p>
            </div>

            {/* TAB SYSTEM (Details, Ingredients, Benefits) */}
            <div className="border border-brand-beige/30 rounded-2xl overflow-hidden bg-brand-cream shadow-sm">
              <div className="flex border-b border-brand-beige/30 text-xs uppercase font-sans-poppins tracking-wider font-semibold">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 py-4 text-center cursor-pointer transition-colors ${
                    activeTab === "details"
                      ? "bg-[#FAF7F2] text-brand-gold border-r border-brand-beige/30"
                      : "bg-transparent text-brand-black/50 hover:text-brand-black hover:bg-[#FAF7F2]/50"
                  }`}
                  id="tab-details-btn"
                >
                  Philosophy
                </button>
                <button
                  onClick={() => setActiveTab("ingredients")}
                  className={`flex-1 py-4 text-center cursor-pointer transition-colors ${
                    activeTab === "ingredients"
                      ? "bg-[#FAF7F2] text-brand-gold border-x border-brand-beige/30"
                      : "bg-transparent text-brand-black/50 hover:text-brand-black hover:bg-[#FAF7F2]/50"
                  }`}
                  id="tab-ingredients-btn"
                >
                  Active Ingredients
                </button>
                <button
                  onClick={() => setActiveTab("benefits")}
                  className={`flex-1 py-4 text-center cursor-pointer transition-colors ${
                    activeTab === "benefits"
                      ? "bg-[#FAF7F2] text-brand-gold border-l border-brand-beige/30"
                      : "bg-transparent text-brand-black/50 hover:text-brand-black hover:bg-[#FAF7F2]/50"
                  }`}
                  id="tab-benefits-btn"
                >
                  Ritual Benefits
                </button>
              </div>

              <div className="p-6 text-left bg-[#FCFBF8] text-xs leading-relaxed text-brand-black/75">
                {activeTab === "details" && (
                  <div className="space-y-2">
                    <p className="font-sans-inter">
                      This batch cured in dark climate-controlled cedarwood
                      chambers.
                    </p>
                    <p className="font-sans-inter">
                      Free of parabens, palm-oils, microplastics, and petroleum.
                      Crafted in sterile environment under guidance of seasoned
                      herbalists.
                    </p>
                  </div>
                )}

                {activeTab === "ingredients" && (
                  <ul className="space-y-2.5 font-sans-inter">
                    {product.ingredients?.map((ing, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                        <span>
                          <strong>{ing}</strong>: Hand-measured, unrefined
                          organic element source.
                        </span>
                      </li>
                    )) || (
                      <li>
                        All botanical oils used are certified cold-pressed
                        unrefined resources.
                      </li>
                    )}
                  </ul>
                )}

                {activeTab === "benefits" && (
                  <ul className="space-y-2.5 font-sans-inter">
                    {product.benefits?.map((ben, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle className="h-3.5 w-3.5 text-brand-gold shrink-0 mt-0.5" />
                        <span>{ben}</span>
                      </li>
                    )) || (
                      <li>
                        Restores surface ph values, clarifies dirt, and locks
                        skin humidity.
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>

            {/* PERSONALIZATION FORM WIDGET */}
            <CustomMessageForm
              giftNote={giftNote}
              setGiftNote={setGiftNote}
              giftRecipient={giftRecipient}
              setGiftRecipient={setGiftRecipient}
              isGift={isGift}
              setIsGift={setIsGift}
            />

            {/* QTY SELECTOR & ACTION CONTAINER */}
            <div className="space-y-4">
              <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/60 font-medium">
                Adjust Quantity & Order Package
              </label>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Qty Selector */}
                <div className="flex items-center justify-between border border-brand-beige/40 bg-[#FAF7F2] rounded-full p-2 w-full sm:w-36">
                  <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-2 sm:p-2.5 hover:text-brand-gold disabled:opacity-35 transition-colors cursor-pointer"
                    id="qty-decrement-btn"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-sans-poppins text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    className="p-2 sm:p-2.5 hover:text-brand-gold disabled:opacity-35 transition-colors cursor-pointer"
                    id="qty-increment-btn"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Bag Addition Button */}
                <button
                  onClick={handleAddToBag}
                  disabled={product.stock <= 0}
                  className="flex-1 group py-4 px-8 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black disabled:bg-brand-beige/50 disabled:text-brand-black/40 rounded-full font-sans-poppins text-xs font-bold uppercase tracking-widest shadow-lg shadow-brand-black/10 transition-all duration-300 flex items-center justify-center space-x-2"
                  id="add-to-bag-cta"
                >
                  <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>
                    {isGift
                      ? "Add Custom Gifting Pack"
                      : "Add to Sandalwood Bag"}
                  </span>
                </button>

                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`p-4 rounded-full border transition-all ${
                    isWishlisted
                      ? "bg-brand-pink text-red-500 border-transparent"
                      : "bg-[#FAF7F2] border-brand-beige/40 text-brand-black hover:text-brand-gold hover:border-brand-gold"
                  }`}
                  id="wishlist-toggle-detail"
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* LIVE VERIFIED REVIEWS SECTION */}
            <div className="pt-8 border-t border-brand-beige/20 space-y-6">
              <h3 className="font-serif-playfair text-2xl text-brand-black tracking-wide font-medium">
                Patron Reviews & Reflections
              </h3>

              {/* Leave Review Form */}
              <form
                onSubmit={handleReviewSubmit}
                className="bg-[#FAF7F2] border border-brand-beige/30 p-6 rounded-2xl text-left space-y-4"
              >
                <span className="text-[9px] uppercase tracking-widest font-sans-poppins text-brand-gold font-bold">
                  Patron Portal &bull; Share your bathing impressions
                </span>

                {submitSuccess && (
                  <p className="text-[11px] font-sans-inter text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                    {submitSuccess}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest font-sans-poppins text-brand-black/50 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lady Genevieve"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-brand-beige/40 bg-brand-cream text-brand-black focus:outline-none focus:border-brand-gold"
                      id="review-name"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest font-sans-poppins text-brand-black/50 mb-1">
                      Rating Star Selection
                    </label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2.5 rounded-lg border border-brand-beige/40 bg-brand-cream text-brand-black focus:outline-none focus:border-brand-gold font-sans-poppins"
                      id="review-rating-select"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                      <option value={2}>⭐⭐ (2 Stars)</option>
                      <option value={1}>⭐ (1 Star)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-widest font-sans-poppins text-brand-black/50 mb-1">
                    Review Remarks
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe the scent notes, lather quality, or gifting feedback..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-brand-beige/40 bg-brand-cream text-brand-black focus:outline-none focus:border-brand-gold resize-none"
                    id="review-text"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="py-2 px-5 bg-brand-black text-brand-cream hover:bg-brand-gold hover:text-brand-black rounded-full text-[10px] uppercase font-bold tracking-widest transition-colors duration-300 pointer-events-auto"
                    id="review-submit-btn"
                  >
                    Submit Verified Review
                  </button>
                </div>
              </form>

              {/* Reviews lists */}
              <div className="space-y-4">
                {localReviews.length === 0 && (
                  <p className="text-xs text-brand-black/40 italic">
                    Be the first verified patron to write a review for this
                    hand-cured block.
                  </p>
                )}

                {/* Local Custom Reviews */}
                {localReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="border-b border-brand-beige/10 pb-4 space-y-1 bg-brand-pink/15 p-4 rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif-playfair text-sm text-brand-black font-semibold">
                        {rev.name}
                      </span>
                      <span className="text-[9px] text-brand-black/50 font-sans-poppins">
                        {rev.date}
                      </span>
                    </div>
                    <div className="flex text-brand-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-2.5 w-2.5 ${i < rev.rating ? "fill-current" : "opacity-25"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-brand-black/80 font-sans-inter leading-relaxed">
                      {rev.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS (Dotted Luxury Layout) */}
        {related.length > 0 && (
          <div className="mt-24 pt-12 border-t border-brand-beige/20">
            <div className="text-left mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans-poppins font-semibold text-brand-gold block mb-1">
                Atelier Suggestions
              </span>
              <h3 className="font-serif-playfair text-2xl text-brand-black tracking-wide font-light">
                Complementary Botanical Rituals
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="group cursor-pointer bg-brand-cream/40 border border-brand-beige/10 p-4 rounded-2xl hover:bg-brand-ivory transition-all duration-300 text-left flex flex-col justify-between"
                  id={`related-card-${p.id}`}
                >
                  <div className="aspect-square overflow-hidden rounded-xl bg-brand-ivory mb-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="font-serif-playfair text-[15px] text-brand-black tracking-wide line-clamp-1 group-hover:text-brand-gold transition-colors font-medium">
                    {p.name}
                  </h4>
                  <span className="font-serif-cormorant italic text-sm text-brand-gold font-bold mt-1 block">
                    ₹{p.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
