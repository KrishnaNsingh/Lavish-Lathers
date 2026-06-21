import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Minus,
  CheckCircle,
  ChevronDown,
  Leaf,
  Sparkles,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { Product } from "../types";
import { useApp } from "../context/AppContext";
import { useProduct } from "../hooks/useProduct";
import { useProducts } from "../hooks/useProducts";
import CustomMessageForm from "../components/CustomMessageForm";
import { productApi } from "../api/productApi";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart } = useApp();

  // const [product, setProduct] = useState<Product | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  // const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "details" | "ingredients" | "benefits"
  >("details");

  // Gift message states
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [giftRecipient, setGiftRecipient] = useState("");
  const [openSection, setOpenSection] = useState<string>("details");

  // Settle review inputs
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [localReviews, setLocalReviews] = useState<any[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState("");

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   if (!id) return;

  //   setLoading(true);
  //   setError("");

  //   const fetchProductData = async () => {
  //     try {
  //       const data = await productApi.getProductById(id!);

  //       setProduct(data);

  //       setActiveImage(data.imageUrl);

  //       setQuantity(1);
  //       setIsGift(false);
  //       setGiftNote("");
  //       setGiftRecipient("");
  //       setLocalReviews([]);
  //       setSubmitSuccess("");

  //       const allData = await productApi.getProducts();

  //       const filteredRelated = allData
  //         .filter(
  //           (p) =>
  //             p._id !== id &&
  //             (p.category === data.category ||
  //               p.artistryType === data.artistryType),
  //         )
  //         .slice(0, 4);

  //       setRelatedProducts(filteredRelated);
  //     } catch (err: any) {
  //       console.error("Failed loading selected product details:", err);

  //       setError(
  //         err.message || "An issue occurred pulling this formula curation.",
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProductData();
  // }, [id]);
  const { data: product, isLoading, error } = useProduct(id!);

  const { data: allProducts = [] } = useProducts();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  React.useEffect(() => {
    if (product?.imageUrl) {
      setActiveImage(product.imageUrl);
    }
  }, [product]);

  const relatedProducts = product
    ? allProducts
        .filter(
          (p) =>
            p._id !== product._id &&
            (p.category === product.category ||
              p.artistryType === product.artistryType),
        )
        .slice(0, 4)
    : [];

  const handleIncrement = () => {
    if (!product) return;
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToBag = () => {
    if (!product) return;
    addToCart(
      product,
      isGift,
      isGift ? giftNote : undefined,
      isGift ? giftRecipient : undefined,
      quantity,
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-black flex items-center justify-center font-sans-poppins text-xs uppercase tracking-[0.25em] text-brand-gold">
        Loading Bespoke Formula Ledger...
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-black flex flex-col items-center justify-center p-6 space-y-4">
        <h2 className="font-serif-playfair text-xl text-red-700">
          {/* {error || "Formula not loaded."} */}
          {error instanceof Error ? error.message : "Formula not loaded."}
        </h2>
        <button
          onClick={() => navigate("/shop")}
          className="py-2.5 px-6 bg-brand-black text-[#FAF7F2] font-sans-poppins text-xs uppercase tracking-widest font-semibold font-bold hover:bg-brand-gold hover:text-brand-black"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product._id);

  return (
    <div className="bg-brand-cream py-32 min-h-screen text-brand-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        {/* Back and Navigation helper */}
        <div className="flex items-center justify-between mb-8 border-b border-brand-beige/20 pb-4">
          <button
            onClick={() => navigate("/shop")}
            className="group flex items-center space-x-2 text-xs uppercase tracking-widest font-sans-poppins font-semibold hover:text-brand-gold transition-colors focus:outline-none cursor-pointer"
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
              <button className="w-20 aspect-square rounded-2xl overflow-hidden bg-brand-ivory border-2 border-brand-gold">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </button>
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
              <h1 className="font-serif-playfair text-3xl sm:text-4xl text-brand-black leading-tight tracking-wide mb-3 font-semibold font-medium">
                {product.name}
              </h1>
            </div>

            {/* Pricing Section */}
            <div className="bg-[#FAF7F2] border-y border-brand-beige/20 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/45 block mb-0.5 font-bold">
                  Total Value (INR)
                </span>
                <span className="font-serif-cormorant text-3xl text-brand-black font-semibold">
                  ₹{product.price}
                </span>
              </div>

              {/* Stock check pill */}
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/45 block mb-1 font-bold">
                  Status
                </span>
                {product.stock > 0 ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-sans-poppins uppercase tracking-wider font-semibold px-3 py-1 rounded-md">
                    {product.stock} Units Cured &amp; Ready
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
            </div>

            {/* TAB SYSTEM (Philosophy, Ingredients, Benefits) */}
            <div className="border border-brand-beige/30 rounded-2xl overflow-hidden bg-brand-cream shadow-sm">
              {/* Philosophy */}
              <button
                onClick={() =>
                  setOpenSection(openSection === "details" ? "" : "details")
                }
                className="w-full flex items-center justify-between px-6 py-5 text-left border-b border-brand-beige/30 hover:bg-[#FAF7F2] transition-all duration-300"
              >
                <span className="uppercase tracking-[0.18em] text-sm font-semibold text-brand-gold font-sans-poppins">
                  Philosophy
                </span>

                <ChevronDown
                  className={`h-5 w-5 text-brand-gold transition-transform duration-300 ${
                    openSection === "details" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openSection === "details" && (
                <div className="px-6 py-5 bg-[#FCFBF8] border-b border-brand-beige/20">
                  <p className="text-sm leading-7 text-brand-black/75 font-sans-inter">
                    {product.detailedDescription ||
                      "Crafted using traditional botanical techniques and carefully selected ingredients."}
                  </p>
                </div>
              )}

              {/* Ingredients */}
              <button
                onClick={() =>
                  setOpenSection(
                    openSection === "ingredients" ? "" : "ingredients",
                  )
                }
                className="w-full flex items-center justify-between px-6 py-5 text-left border-b border-brand-beige/30 hover:bg-[#FAF7F2] transition-all duration-300"
              >
                <span className="uppercase tracking-[0.18em] text-sm font-semibold text-brand-gold font-sans-poppins">
                  Active Ingredients
                </span>

                <ChevronDown
                  className={`h-5 w-5 text-brand-gold transition-transform duration-300 ${
                    openSection === "ingredients" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openSection === "ingredients" && (
                <div className="px-6 py-5 bg-[#FCFBF8] border-b border-brand-beige/20">
                  <ul className="space-y-3">
                    {product.ingredients?.length > 0 ? (
                      product.ingredients.map((ing, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-sm text-brand-black/75"
                        >
                          <span className="h-2 w-2 rounded-full bg-brand-gold" />
                          <span>{ing}</span>
                        </li>
                      ))
                    ) : (
                      <li className="italic text-brand-black/50">
                        Ingredient information coming soon.
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              <button
                onClick={() =>
                  setOpenSection(openSection === "benefits" ? "" : "benefits")
                }
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#FAF7F2] transition-all duration-300"
              >
                <span className="uppercase tracking-[0.18em] text-sm font-semibold text-brand-gold font-sans-poppins">
                  Ritual Benefits
                </span>

                <ChevronDown
                  className={`h-5 w-5 text-brand-gold transition-transform duration-300 ${
                    openSection === "benefits" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openSection === "benefits" && (
                <div className="px-6 py-5 bg-[#FCFBF8]">
                  <ul className="space-y-3">
                    {product.benefits?.length > 0 ? (
                      product.benefits.map((ben, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-brand-black/75"
                        >
                          <CheckCircle className="h-4 w-4 text-brand-gold mt-0.5 shrink-0" />
                          <span>{ben}</span>
                        </li>
                      ))
                    ) : (
                      <li className="italic text-brand-black/50">
                        Benefit information coming soon.
                      </li>
                    )}
                  </ul>
                </div>
              )}
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
              <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/60 font-medium font-bold">
                Adjust Quantity &amp; Order Package
              </label>

              <div className="flex flex-col sm:flex-row gap-4 font-sans-poppins">
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
                  <span className="font-semibold text-sm">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    disabled={quantity >= product.stock}
                    className="p-2 sm:p-2.5 hover:text-brand-gold disabled:opacity-35 transition-colors cursor-pointer"
                    id="qty-increment-btn"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* 💡 FIX: Wrapped the Action Buttons in a flex container to keep them inline on mobile views */}
                <div className="flex flex-1 items-center gap-4 w-full">
                  {/* Bag Addition Button */}
                  <button
                    onClick={handleAddToBag}
                    disabled={product.stock <= 0}
                    className="flex-1 group py-4 px-8 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black disabled:bg-brand-beige/50 disabled:text-brand-black/40 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-brand-black/10 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                    id="add-to-bag-cta"
                  >
                    <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>
                      {isGift
                        ? "Add Custom Gifting Pack"
                        : "Add to Sandalwood Bag"}
                    </span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className={`p-4 rounded-full border transition-all cursor-pointer ${
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
            </div>

            {/* LIVE VERIFIED REVIEWS SECTION */}
          </div>
        </div>

        {/* RELATED PRODUCTS (Dotted Luxury Layout) */}
        {relatedProducts.length > 0 && (
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
              {relatedProducts.map((p) => (
                <div
                  key={p._id}
                  onClick={() => {
                    navigate(`/product/${p._id}`);
                  }}
                  className="group cursor-pointer bg-brand-cream/40 border border-brand-beige/10 p-4 rounded-2xl hover:bg-brand-ivory transition-all duration-300 text-left flex flex-col justify-between"
                  id={`related-card-${p._id}`}
                >
                  <div className="aspect-square overflow-hidden rounded-xl bg-brand-ivory mb-3">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="font-serif-playfair text-[15px] text-brand-black tracking-wide line-clamp-1 group-hover:text-brand-gold transition-colors font-medium">
                    {p.name}
                  </h4>
                  <span className="font-serif-cormorant italic text-sm text-brand-gold font-bold mt-1 block font-serif-cormorant">
                    ₹{p.price}
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
