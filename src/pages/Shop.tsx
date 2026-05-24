import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Archive, Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

export default function Shop() {
  const navigate = useNavigate();
  const {
    wishlist,
    toggleWishlist,
    addToCart,
    filterCategory,
    setFilterCategory
  } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc' | 'default'>('default');
  const [activeCollectibleFilter, setActiveCollectibleFilter] = useState<boolean | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch products dynamically from real backend API instead of data.ts
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      // 1. Category check
      const matchesCategory = filterCategory === 'All' 
        || (filterCategory === 'Souvenirs' && (p.type === 'souvenir' || p.isCollectible))
        || (filterCategory === 'Skincare' && p.type === 'skincare')
        || (p.category.toLowerCase() === filterCategory.toLowerCase());
        
      // 2. Search check
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) 
        || p.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 3. Collectible specialized toggle check
      const matchesCollectible = activeCollectibleFilter === null 
        || (activeCollectibleFilter && p.isCollectible) 
        || (!activeCollectibleFilter && !p.isCollectible);

      return matchesCategory && matchesSearch && matchesCollectible;
    });

    // Sort operations
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, filterCategory, searchQuery, sortBy, activeCollectibleFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-black flex items-center justify-center font-sans-poppins text-xs uppercase tracking-[0.25em] text-brand-gold">
         Opening Botanical Apothecary...
      </div>
    );
  }

  return (
    <div className="bg-brand-cream min-h-screen py-32 text-brand-black font-sans-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header description */}
        <div className="text-left space-y-3 mb-12 border-b border-brand-beige/20 pb-6">
          <span className="text-[10px] uppercase tracking-[0.4em] font-sans-poppins font-semibold text-brand-gold">
             Atelier Archives
          </span>
          <h1 className="font-serif-playfair text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-wide font-light font-medium">
             The Curated Botanical Registry
          </h1>
          <p className="font-sans-inter text-xs text-brand-black/55 max-w-xl font-light leading-relaxed">
            Sort through our six-week cured cold-process bars, steam-distilled face drops, and custom ribboned souvenirs designed with genuine marigolds, red clays, and absolute oils.
          </p>
        </div>

        {/* SEARCH AND FILTERS TOOLBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Elegant Filtration Sidebar */}
          <div className="lg:col-span-3 space-y-8 bg-brand-cream border border-brand-beige/25 p-6 sm:p-8 rounded-[2rem] text-left shadow-lg shadow-brand-black/[0.01]">
            
            {/* Search Input bar */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-sans-poppins text-brand-black/50 font-bold">Search Botanical Catalog</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Lavender, Rose, Saffron"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-brand-black placeholder-brand-black/35 focus:ring-1 focus:ring-brand-gold focus:outline-none focus:border-brand-gold transition-all"
                  id="catalog-search"
                />
                <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-brand-black/40" />
              </div>
            </div>

            {/* Categories filters lists */}
            <div className="space-y-3 font-sans-poppins">
              <label className="block text-[10px] uppercase tracking-widest text-brand-black/50 font-bold">Curation Categories</label>
              <div className="flex flex-col space-y-1.5 pl-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`text-xs text-left uppercase py-2 tracking-widest font-light transition-all flex items-center justify-between cursor-pointer ${
                      filterCategory === cat 
                        ? 'text-brand-gold font-semibold translate-x-1.5' 
                        : 'text-brand-black/70 hover:text-brand-gold hover:translate-x-1'
                    }`}
                    id={`filter-cat-${cat}`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] transform transition-transform ${filterCategory === cat ? 'rotate-90 text-brand-gold' : 'text-brand-black/30'}`}>
                      ▶
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Premium Specialty checks */}
            <div className="space-y-3 pt-4 border-t border-brand-beige/25 font-sans-poppins">
              <label className="block text-[10px] uppercase tracking-widest text-brand-black/50 font-bold">Specialty Filter</label>
              
              <div className="space-y-2.5 text-xs pl-1">
                <label className="flex items-center space-x-2.5 text-brand-black/80 font-light cursor-pointer">
                  <input
                    type="radio"
                    name="specialty"
                    checked={activeCollectibleFilter === null}
                    onChange={() => setActiveCollectibleFilter(null)}
                    className="accent-brand-gold"
                    id="spec-all"
                  />
                  <span>Show All Formulations</span>
                </label>

                <label className="flex items-center space-x-2.5 text-brand-black/80 font-light cursor-pointer">
                  <input
                    type="radio"
                    name="specialty"
                    checked={activeCollectibleFilter === true}
                    onChange={() => setActiveCollectibleFilter(true)}
                    className="accent-brand-gold"
                    id="spec-collectible"
                  />
                  <span>Fine Souvenir Keepsakes Only</span>
                </label>

                <label className="flex items-center space-x-2.5 text-brand-black/80 font-light cursor-pointer">
                  <input
                    type="radio"
                    name="specialty"
                    checked={activeCollectibleFilter === false}
                    onChange={() => setActiveCollectibleFilter(false)}
                    className="accent-brand-gold"
                    id="spec-skincare"
                  />
                  <span>Skincare Formulas Only</span>
                </label>
              </div>
            </div>

            {/* Sort Dropdown select */}
            <div className="space-y-2 pt-4 border-t border-brand-beige/25 font-sans-poppins">
              <label className="block text-[10px] uppercase tracking-widest text-brand-black/50 font-bold">Sort Settings</label>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full text-xs px-3 py-3 rounded-xl border border-brand-beige/40 bg-[#FAF7F2] text-brand-black text-[11px] uppercase tracking-wider font-semibold focus:outline-none focus:border-brand-gold"
                id="catalog-sort"
              >
                <option value="default">Registry Default</option>
                <option value="rating">Top Patron Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Static customer helper */}
            <div className="pt-6 border-t border-brand-beige/25 text-[10px] text-brand-black/40 text-center leading-normal">
               Need custom sizing favors? We manufacture custom wax seal designs for events. Speak to heritages in Concierge contacts.
            </div>

          </div>

          {/* RIGHT: Grid columns mapping results */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Counts & Status banner */}
            <div className="flex justify-between items-center text-xs font-sans-poppins text-brand-black/50 border-b border-brand-beige/10 pb-4">
              <span>Showing <strong>{filteredProducts.length}</strong> premium offerings</span>
              <span className="font-light">Active filter: <strong>{filterCategory}</strong></span>
            </div>

            {/* Check if empty results */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 space-y-4 bg-brand-cream border border-brand-beige/20 rounded-[2.5rem]">
                <Archive className="h-10 w-10 text-brand-beige/65 mx-auto stroke-[1.2]" />
                <h4 className="font-serif-playfair text-xl text-brand-black font-medium">No botanical catalog entry aligns</h4>
                <p className="font-sans-inter text-xs text-brand-black/50 max-w-xs mx-auto">Try resetting keywords or category selection parameters to find curated items.</p>
                <button
                  onClick={() => {
                    setFilterCategory('All');
                    setSearchQuery('');
                    setActiveCollectibleFilter(null);
                  }}
                  className="py-2.5 px-6 bg-brand-black text-brand-cream hover:bg-brand-gold hover:text-brand-black text-[10px] tracking-widest uppercase font-bold rounded-full transition-colors cursor-pointer"
                  id="reset-catalog-btn"
                >
                   Reset Registry Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => {
                  const isWishlisted = wishlist.includes(product.id);

                  return (
                    <div
                      key={product.id}
                      className="group relative bg-[#FAF7F2] rounded-[2rem] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 border border-brand-beige/10 flex flex-col h-full"
                      id={`catalog-card-${product.id}`}
                    >
                      {/* Thumbnail frame */}
                      <div className="relative aspect-square overflow-hidden bg-brand-ivory">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        
                        {/* Tags */}
                        <span className="absolute top-4 left-4 bg-brand-black/70 backdrop-blur-xs text-brand-cream text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full font-sans-poppins">
                          {product.category}
                        </span>

                        {product.isCollectible && (
                          <span className="absolute bottom-4 left-4 bg-brand-gold text-brand-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-md font-sans-poppins font-bold">
                            Collectible Soul
                          </span>
                        )}

                        {/* Hover Overlay triggers */}
                        <div className="absolute inset-0 bg-brand-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3 font-sans-poppins">
                          
                          <button
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="p-3 bg-brand-cream hover:bg-brand-gold rounded-full text-brand-black transition-colors shadow shadow-brand-black/15 duration-300 hover:scale-105 cursor-pointer"
                            title="Quick View Details"
                            id={`quickview-${product.id}`}
                          >
                            <Eye className="h-4.5 w-4.5 stroke-[1.8]" />
                          </button>

                          <button
                            onClick={() => addToCart(product, false)}
                            className="p-3 bg-brand-black hover:bg-brand-gold text-brand-cream hover:text-brand-black rounded-full transition-colors shadow shadow-brand-black/15 duration-300 hover:scale-105 cursor-pointer"
                            title="Add directly to Bag"
                            id={`quickadd-${product.id}`}
                          >
                            <ShoppingBag className="h-4.5 w-4.5 stroke-[1.8]" />
                          </button>

                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-3 rounded-full transition-colors shadow shadow-brand-black/15 duration-300 hover:scale-105 cursor-pointer ${
                              isWishlisted ? 'bg-brand-pink text-red-500' : 'bg-brand-cream hover:bg-brand-pink text-brand-black'
                            }`}
                            id={`wishlist-catalog-${product.id}`}
                          >
                            <Heart className={`h-4.5 w-4.5 stroke-[1.8] ${isWishlisted ? 'fill-current' : ''}`} />
                          </button>

                        </div>
                      </div>

                      {/* Content details block */}
                      <div className="p-6 text-left flex flex-col flex-grow bg-[#FAF7F2] transition-colors duration-300 group-hover:bg-brand-ivory/50">
                        
                        {/* Rating row */}
                        <div className="flex items-center space-x-1 mb-2.5">
                          <div className="flex text-brand-gold">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-2.5 w-2.5 ${
                                  i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[9px] text-brand-black/45 font-sans-poppins">
                            ({product.reviewsCount})
                          </span>
                        </div>

                        {/* Product Name */}
                        <h3
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="font-serif-playfair text-base sm:text-lg text-brand-black leading-snug tracking-wide group-hover:text-brand-gold transition-colors cursor-pointer font-medium mb-1.5 line-clamp-2"
                        >
                          {product.name}
                        </h3>

                        {/* description snippet */}
                        <p className="text-xs text-brand-black/60 font-light leading-relaxed line-clamp-2 mb-4 font-sans-inter">
                          {product.description}
                        </p>

                        {/* Row pricing */}
                        <div className="mt-auto pt-3 flex items-center justify-between border-t border-brand-beige/10 font-sans-poppins">
                          <span className="font-serif-cormorant italic text-base text-brand-black font-semibold">
                            ₹{product.price}
                          </span>
                          
                          <button
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="text-[9px] uppercase font-bold tracking-widest text-brand-gold hover:text-brand-black transition-colors cursor-pointer"
                          >
                            Configure Custom Gifting
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
