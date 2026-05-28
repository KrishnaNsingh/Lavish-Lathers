import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart, Eye, ShoppingBag } from "lucide-react";
import { Product } from "../../types";
import { useApp } from "../../context/AppContext";

interface BestSellersProps {
  products?: Product[];
}

export default function BestSellers({
  products: propProducts,
}: BestSellersProps) {
  const navigate = useNavigate();
  const { cart, wishlist, toggleWishlist, addToCart } = useApp();

  const [products, setProducts] = React.useState<Product[]>(propProducts || []);
  const [loading, setLoading] = React.useState(!propProducts);

  React.useEffect(() => {
    if (propProducts) {
      setProducts(propProducts);
      return;
    }

    // Fetch products dynamically from real backend API instead of data.ts
    const fetchBestSellers = async () => {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed fetching bestseller listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, [propProducts]);

  const bestSellers = products.filter((p) => p.isBestSeller);

  if (loading) {
    return (
      <div className="py-20 bg-brand-cream text-center text-xs uppercase tracking-[0.2em] font-sans-poppins text-brand-gold">
        Preparing Celebrated Cures...
      </div>
    );
  }

  return (
    <section className="py-20 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-brand-beige/20 pb-6">
          <div className="text-left space-y-2">
            <span className="text-[10px] uppercase tracking-[0.4em] font-sans-poppins font-semibold text-brand-gold">
              Popular Vanities
            </span>
            <h2 className="font-serif-playfair text-3xl sm:text-4xl text-brand-black tracking-tight font-light font-medium">
              Our Celebrated Best-Sellers
            </h2>
          </div>
          <p className="font-sans-inter text-xs text-brand-black/50 font-light max-w-sm text-left md:text-right mt-4 md:mt-0">
            Highly-coveted formulas and collectible souvenirs celebrated by
            editors and beauty patrons worldwide.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product) => {
            const isWishlisted = wishlist.includes(product._id);

            return (
              <div
                key={product._id}
                className="group relative bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 border border-brand-beige/10 flex flex-col h-full"
                id={`best-seller-${product._id}`}
              >
                {/* Product Hover Image Gallery Container */}
                <div className="relative aspect-square overflow-hidden bg-brand-ivory z-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Category Tag */}
                  <span className="absolute top-4 left-4 bg-brand-black/70 backdrop-blur-xs text-brand-cream text-[9px] uppercase tracking-widest px-3 py-1 rounded-full font-medium">
                    {product.category}
                  </span>

                  {/* Stock Alert Label if low */}
                  {product.stock <= 12 && (
                    <span className="absolute top-4 right-4 bg-brand-gold text-brand-black text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md shadow-xs">
                      Only {product.stock} Left
                    </span>
                  )}

                  {/* Accessory Action Panel (Surgical Float Hover) */}
                  <div className="absolute inset-0 bg-brand-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 z-10 font-sans-poppins">
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="p-3 bg-brand-cream hover:bg-brand-gold rounded-full text-brand-black transition-colors shadow-lg shadow-brand-black/10 duration-300 hover:scale-105 pointer-events-auto cursor-pointer"
                      title="Quick View Details"
                      id={`view-${product._id}`}
                    >
                      <Eye className="h-4.5 w-4.5 stroke-[1.8]" />
                    </button>

                    <button
                      onClick={() => addToCart(product, false)}
                      className="p-3 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black rounded-full transition-colors shadow-lg shadow-brand-black/10 duration-300 hover:scale-105 pointer-events-auto cursor-pointer"
                      title="Add to Canvas Bag"
                      id={`cart-add-${product._id}`}
                    >
                      <ShoppingBag className="h-4.5 w-4.5 stroke-[1.8]" />
                    </button>

                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className={`p-3 rounded-full transition-colors shadow-lg shadow-brand-black/10 duration-300 hover:scale-105 cursor-pointer ${
                        isWishlisted
                          ? "bg-brand-pink text-red-500"
                          : "bg-brand-cream hover:bg-brand-pink text-brand-black"
                      }`}
                      title="Add to Wishlist"
                      id={`wishlist-add-${product._id}`}
                    >
                      <Heart
                        className={`h-4.5 w-4.5 stroke-[1.8] ${isWishlisted ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Info and price */}
                <div className="p-6 text-left flex flex-col flex-grow bg-[#FAF7F2] relative z-10 transition-colors duration-300 group-hover:bg-brand-ivory/50">
                  {/* Ratings */}
                  <div className="flex items-center space-x-1.5 mb-2.5">
                    <div className="flex text-brand-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating)
                              ? "fill-current"
                              : "opacity-30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-brand-black/50 font-sans-poppins font-medium">
                      ({product.reviewsCount})
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="font-serif-playfair text-lg text-brand-black leading-snug tracking-wide group-hover:text-brand-gold transition-colors cursor-pointer mb-2 font-medium line-clamp-2"
                  >
                    {product.name}
                  </h3>

                  {/* Pricing (Botanical Luxury Minimalist label) */}
                  <div className="mt-auto pt-3 flex items-center justify-between border-t border-brand-beige/20 font-sans-poppins">
                    <span className="font-serif-cormorant italic text-lg text-brand-black font-semibold">
                      ₹{product.price}
                    </span>
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="text-[10px] uppercase font-bold tracking-widest text-brand-gold hover:text-brand-black transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
