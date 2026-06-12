import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, Menu, X, Sparkles, MapPin } from "lucide-react";
import { useApp } from "../context/AppContext";
import LavishLathersLogo from "./LavishLathersLogo";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, setIsCartOpen, wishlist, setFilterCategory, filterCategory } =
    useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const cartQuantity = Math.max(
    0,
    cart.reduce((total, item) => total + item.quantity, 0),
  );
  const wishlistCount = wishlist.length;

  const categories = [
    "Herbal Soaps",
    "Essential Oils",
    "Gift Boxes",
    "Souvenirs",
  ];

  const isHome = location.pathname === "/";

  useEffect(() => {
    // Only detect scroll on the home page overlay layout
    if (!isHome) {
      setIsScrolled(false);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHome]);

  const isAtHomeTop = isHome && !isScrolled;

  // // Header dynamic placement and premium backing
  // const headerClass = isHome
  //   ? `fixed top-0 left-0 right-0 z-40 transition-all duration-500 w-full ${
  //       isScrolled
  //         ? "bg-brand-cream/95 backdrop-blur-md border-b border-brand-beige/30 shadow-md animate-slide-down"
  //         : "bg-black/20 backdrop-blur-[2px] border-b border-white/10"
  //     }`
  //   : "sticky top-0 z-40 bg-brand-cream/95 backdrop-blur-md border-b border-brand-beige/30 w-full";
  // Header dynamic placement and premium backing


  // 💡 GAP REDUCTION FIX: Converted non-home route from 'sticky' to 'fixed top-0 left-0 right-0' layout configuration
  const headerClass = isHome
    ? `fixed top-0 left-0 right-0 z-40 transition-all duration-500 w-full ${
        isScrolled
          ? "bg-brand-cream/95 backdrop-blur-md border-b border-brand-beige/30 shadow-md animate-slide-down"
          : "bg-black/20 backdrop-blur-[2px] border-b border-white/10"
      }`
    : "fixed top-0 left- right-0 z-40 bg-brand-cream/95 backdrop-blur-md border-b border-brand-beige/30 w-full";

  // Dynamic aesthetic class names for links
  const linkTextClass = (active: boolean) => {
    if (active) return "text-brand-gold font-semibold font-medium";
    return isAtHomeTop
      ? "text-brand-cream hover:text-brand-gold font-light"
      : "text-brand-black hover:text-brand-gold font-light";
  };

  const storeTextClass = isAtHomeTop
    ? "text-brand-cream/80 hover:text-brand-gold"
    : "text-brand-black/75 hover:text-brand-gold";

  const iconColorClass = isAtHomeTop ? "text-brand-cream" : "text-brand-black";

  return (
    <header className={headerClass} id="app-nav-header">
      {/* --- INTEGRATED TOP PORTION TICKER BAR --- */}
      <div
        className={`transition-all duration-500 text-[10px] uppercase tracking-[0.25em] py-2.5 overflow-hidden font-sans-poppins font-semibold border-b w-full ${
          isAtHomeTop
            ? "bg-black/50 border-white/5 text-brand-cream"
            : "bg-brand-black border-brand-gold/15 text-brand-cream"
        }`}
        id="top-ticker-banner"
      >
        {/* Flex Container to align the scrolling loops back-to-back */}
        <div className="flex whitespace-nowrap min-w-full relative">
          {/* First Loop Content Track */}
          <div className="animate-marquee flex items-center shrink-0 space-x-8 pr-8">
            <span>
              ✨ Complimentary Sandalwood &amp; Satin Ribbon Gifting wraps with
              all order values &bull; Free courier shipping over ₹2,000 ✨
            </span>
            <span>
              ✨ Complimentary Sandalwood &amp; Satin Ribbon Gifting wraps with
              all order values &bull; Free courier shipping over ₹2,000 ✨
            </span>
          </div>

          {/* Second Duplicate Content Track (Clones the timeline to ensure an un-broken sequence loop) */}
          <div
            className="animate-marquee flex items-center shrink-0 space-x-8 pr-8"
            aria-hidden="true"
          >
            <span>
              ✨ Complimentary Sandalwood &amp; Satin Ribbon Gifting wraps with
              all order values &bull; Free courier shipping over ₹2,000 ✨
            </span>
            <span>
              ✨ Complimentary Sandalwood &amp; Satin Ribbon Gifting wraps with
              all order values &bull; Free courier shipping over ₹2,000 ✨
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- NAVBAR SECTION 1 (UPPER ROW using a rigid 3-way symmetric CSS grid) --- */}
        <div
          className={`grid grid-cols-3 items-center min-h-[64px] md:min-h-[15px] py-1.5 md:py-2 border-b transition-colors duration-500 ${
            isAtHomeTop ? "border-white/10" : "border-brand-beige/25"
          }`}
        >
          {/* LEFT SECTION (Hamburger trigger, Store locator & currency selector) */}
          <div className="flex items-center justify-start space-x-2 sm:space-x-3 md:space-x-6">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors p-1.5 -ml-1.5 md:hidden ${iconColorClass} hover:text-brand-gold`}
              aria-label="Toggle navigation menu"
              id="mobile-menu-btn"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* STORES & currency display like in the Forest Essentials layout */}
            <div
              className={`hidden sm:flex items-center space-x-4 text-[10.5px] uppercase tracking-widest font-sans-poppins font-light transition-colors duration-500 ${storeTextClass}`}
            >
              <span className="flex items-center space-x-1.5 select-none cursor-pointer">
                <MapPin className="h-3.5 w-3.5 text-brand-gold stroke-[1.5]" />
                <span className="hover:text-brand-gold transition-colors">
                  Our Stores
                </span>
              </span>
              <span
                className={`transition-colors ${isAtHomeTop ? "text-white/20" : "text-brand-beige/40"}`}
              >
                |
              </span>
              <span className="cursor-pointer font-bold hover:text-brand-gold transition-colors">
                ₹ INR
              </span>
            </div>
          </div>

          {/* CENTER SECTION (Highly integrated inline logo + brand name pairing) */}
          <div className="flex items-center justify-center text-center">
            <button
              onClick={() => {
                navigate("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex flex-row items-center justify-center space-x-2 sm:space-x-2.5 md:space-x-3.5 group focus:outline-none cursor-pointer"
              id="brand-logo-btn"
            >
              <div className="transition-all duration-300 transform group-hover:scale-105 shrink-0">
                <LavishLathersLogo
                  className="h-5.5 w-5.5 sm:h-6.5 sm:w-6.5 md:h-8 md:w-8"
                  showBackground={true}
                />
              </div>
              <div className="flex flex-col items-start justify-center text-left mt-0">
                <span
                  className={`block font-serif-playfair text-[10px] xs:text-xs sm:text-[14px] md:text-base lg:text-lg tracking-[0.12em] md:tracking-[0.16em] uppercase font-light transition-colors duration-500 leading-none ${
                    isAtHomeTop
                      ? "text-brand-cream group-hover:text-brand-gold"
                      : "text-brand-black group-hover:text-brand-gold"
                  }`}
                >
                  Lavish Lathers
                </span>
                <span className="block text-[5.5px] sm:text-[6.5px] md:text-[8px] lg:text-[8.5px] uppercase tracking-[0.2em] md:tracking-[0.35em] font-sans-poppins text-brand-gold/80 font-normal leading-none mt-0.5 sm:mt-1">
                  Luxe Ayurveda
                </span>
              </div>
            </button>
          </div>

          {/* RIGHT SECTION (Our Story & Contact links, Wishlist, and Cart) */}
          <div className="flex items-center justify-end space-x-1.5 sm:space-x-3.5 md:space-x-5">
            <nav className="hidden lg:flex space-x-5 items-center mr-2">
              <button
                onClick={() => {
                  navigate("/about");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`text-[11px] uppercase tracking-widest font-sans-poppins transition-colors relative py-1 cursor-pointer ${linkTextClass(location.pathname === "/about")}`}
                id="nav-about-upper"
              >
                Our Story
                {location.pathname === "/about" && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold animate-pulse" />
                )}
              </button>
              <button
                onClick={() => {
                  navigate("/contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`text-[11px] uppercase tracking-widest font-sans-poppins transition-colors relative py-1 cursor-pointer ${linkTextClass(location.pathname === "/contact")}`}
                id="nav-contact-upper"
              >
                Contact &amp; Concierge
                {location.pathname === "/contact" && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-gold animate-pulse" />
                )}
              </button>
            </nav>

            {/* Wishlist Heart Icon */}
            <button
              onClick={() => {
                alert(
                  "Lavish Lathers Concierge Assistant is ready to customize your orders! Wishlisted items will remain highlighted for easy bulk quoting.",
                );
              }}
              className={`relative p-1.5 transition-colors duration-300 ${iconColorClass} hover:text-brand-gold group cursor-pointer`}
              id="wishlist-btn"
            >
              <Heart className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-brand-cream text-[8px] font-sans-poppins aspect-square w-3.5 border border-brand-cream rounded-full flex items-center justify-center font-bold animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative py-1 px-2.5 sm:py-1.5 sm:px-3 rounded-full transition-all duration-500 flex items-center space-x-1 sm:space-x-1.5 text-[9px] sm:text-[10px] font-sans-poppins tracking-wider cursor-pointer ${
                isAtHomeTop
                  ? "bg-white text-brand-black hover:bg-[#D4AF37] hover:text-brand-black hover:scale-105"
                  : "bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black"
              }`}
              id="navbar-cart-trigger"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="hidden sm:inline uppercase font-semibold text-xs leading-none">
                Cart
              </span>
              <span
                className={`text-[8px] sm:text-[9px] font-bold px-1 py-0.1 sm:px-1.5 rounded-full ${
                  isAtHomeTop
                    ? "bg-black/10 text-brand-black"
                    : "bg-white/20 text-brand-cream"
                }`}
              >
                {cartQuantity}
              </span>
            </button>
          </div>
        </div>

        {/* --- NAVBAR SECTION 2 (LOWER ROW) --- */}
        <div
          className={`border-t transition-colors duration-500 ${
            isAtHomeTop ? "border-white/10" : "border-brand-beige/20"
          }`}
        >
          <div className="flex items-center space-x-6 sm:space-x-8 md:space-x-10 lg:space-x-12 py-3 md:py-4 overflow-x-auto scrollbar-none w-full justify-start md:justify-center -mx-4 md:mx-0 px-4 md:px-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setFilterCategory(category);
                  navigate("/shop");
                }}
                className={`text-[9.5px] sm:text-[10.5px] md:text-xs uppercase tracking-[0.25em] font-sans-poppins transition-colors duration-300 hover:text-brand-gold relative py-1 shrink-0 cursor-pointer ${
                  location.pathname === "/shop" && filterCategory === category
                    ? "text-brand-gold font-semibold"
                    : isAtHomeTop
                      ? "text-brand-cream/90 font-light"
                      : "text-brand-black/95 font-light"
                }`}
                id={`nav-cat-${category.replace(/\s+/g, "-").toLowerCase()}`}
              >
                {category}
                {location.pathname === "/shop" &&
                  filterCategory === category && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#D4AF37] duration-300" />
                  )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className={`md:hidden absolute w-full left-0 z-30 shadow-2xl border-t transition-all duration-500 animate-slide-down ${
            isAtHomeTop
              ? "bg-black/90 backdrop-blur-xl border-white/10 text-brand-cream/90"
              : "bg-brand-cream/95 backdrop-blur-xl border-brand-beige/25 text-brand-black/95"
          }`}
          id="mobile-nav-drawer"
        >
          {/* Main Links */}
          <div className="p-4 space-y-3">
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold font-sans-poppins block border-b pb-1.5 border-brand-beige/20 dark:border-white/5">
              General Nav
            </span>
            <button
              onClick={() => {
                navigate("/");
                setIsOpen(false);
              }}
              className={`block w-full text-left py-1 text-xs uppercase tracking-widest font-sans-poppins hover:text-brand-gold font-light transition-colors cursor-pointer ${
                isAtHomeTop ? "text-white" : "text-brand-black"
              }`}
              id="mobile-nav-home"
            >
              Home / Atelier
            </button>
            <button
              onClick={() => {
                navigate("/about");
                setIsOpen(false);
              }}
              className={`block w-full text-left py-1 text-xs uppercase tracking-widest font-sans-poppins hover:text-brand-gold font-light transition-colors cursor-pointer ${
                isAtHomeTop ? "text-white" : "text-brand-black"
              }`}
              id="mobile-nav-about"
            >
              Our Story
            </button>
            <button
              onClick={() => {
                navigate("/contact");
                setIsOpen(false);
              }}
              className={`block w-full text-left py-1 text-xs uppercase tracking-widest font-sans-poppins hover:text-brand-gold font-light transition-colors cursor-pointer ${
                isAtHomeTop ? "text-white" : "text-brand-black"
              }`}
              id="mobile-nav-contact"
            >
              Contact &amp; Concierge
            </button>
          </div>

          {/* Mobile Category Navigation Links */}
          <div className="px-4 pb-4 space-y-3">
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold font-sans-poppins block border-b pb-1.5 border-brand-beige/20 dark:border-white/5">
              Shop Categories
            </span>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setFilterCategory(category);
                    navigate("/shop");
                    setIsOpen(false);
                  }}
                  className={`text-left p-3.5 border rounded-lg text-xs uppercase tracking-widest font-sans-poppins hover:text-brand-gold hover:border-brand-gold/60 transition-all cursor-pointer ${
                    location.pathname === "/shop" && filterCategory === category
                      ? "border-[#D4AF37] text-brand-gold bg-[#D4AF37]/5 font-semibold"
                      : isAtHomeTop
                        ? "border-white/10 text-white/90 bg-white/5"
                        : "border-brand-beige/30 text-brand-black/90 bg-brand-cream/20"
                  }`}
                  id={`mobile-nav-cat-${category.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`p-4 mx-4 border-t my-2 flex justify-between items-center text-[10px] font-sans-poppins ${
              isAtHomeTop
                ? "border-white/10 text-white/50"
                : "border-brand-beige/25 text-brand-black/60"
            }`}
          >
            <span>Customer Concierge</span>
            <div className="flex items-center space-x-1.5 text-brand-gold">
              <Sparkles className="h-3 w-3 animate-spin-slow" />
              <span>Complimentary Wraps &amp; Samples</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
