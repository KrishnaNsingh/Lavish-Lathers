import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Order } from "../types";
import { useProducts } from "../hooks/useProducts";
import { productApi } from "../api/productApi";

interface AppContextType {
  products: Product[];
  productsLoading: boolean;
  fetchProducts: () => Promise<void>;
  cart: CartItem[];
  wishlist: string[];
  confirmedOrder: Order | null;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  remainingStock: (product: Product) => number;
  checkingCartStock: boolean;
  addToCart: (
    product: Product,
    isGift: boolean,
    giftNote?: string,
    giftRecipient?: string,
    quantity?: number,
  ) => void;
  removeFromCart: (index: number) => void;
  updateCartQty: (index: number, newQty: number) => void;
  toggleWishlist: (product: Product) => void;
  openWishlistCart: () => void;
  clearCart: () => void;
  setConfirmedOrder: (order: Order | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Admin Authentication State
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  adminLogin: (token: string) => void;
  adminLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("lavish_lathers_cart") || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(
    localStorage.getItem("lavish_lathers_admin_token"),
  );
  const {
    data: catalog,
    isFetching: checkingCartStock,
    isLoading: productsLoading,
    refetch: fetchProducts,
  } = useProducts();
  const products = catalog ?? [];
  useEffect(() => {
    if (isCartOpen) void fetchProducts();
  }, [isCartOpen, fetchProducts]);

  function remainingStock(product: Product) {
    const stock = catalog ? catalog.find(entry => entry._id === product._id)?.stock ?? 0 : product.stock;
    const inCart = cart.reduce((total, line) => line.product._id === product._id ? total + line.quantity : total, 0);
    return Math.max(0, stock - inCart);
  }

  const fetchProductsManually = async () => {
    await fetchProducts();
  };
  // const [products, setProducts] = useState<Product[]>([]);
  // const [productsLoading, setProductsLoading] = useState(true);

  // Restore saved likes on mount.
  useEffect(() => {
    try {
      const cachedWishlist = localStorage.getItem("lavish_lathers_wishlist");
      if (cachedWishlist) {
        setWishlist(JSON.parse(cachedWishlist));
      }
    } catch (err) {
      console.error("Local storage decoding issue:", err);
    }
  }, []);

  // const fetchProducts = async () => {
  //   try {
  //     setProductsLoading(true);

  //     const data = await productApi.getProducts();

  //     setProducts(data);
  //   } catch (error) {
  //     console.error("Failed fetching products:", error);
  //   } finally {
  //     setProductsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  const updateCartState = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("lavish_lathers_cart", JSON.stringify(newCart));
  };

  const updateWishlistState = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    localStorage.setItem(
      "lavish_lathers_wishlist",
      JSON.stringify(newWishlist),
    );
  };

  const addToCart = (
    product: Product,
    isGift: boolean,
    giftNote?: string,
    giftRecipient?: string,
    quantity = 1,
  ) => {
    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > remainingStock(product)) {
      window.alert(`${product.name}: you can add ${remainingStock(product)} more to your cart.`);
      return;
    }
    const existingIdx = cart.findIndex(
      (it) =>
        it.product._id === product._id &&
        it.isGift === isGift &&
        it.giftRecipient === giftRecipient,
    );

    let updated: CartItem[];
    if (existingIdx > -1) {
      updated = cart.map((item, idx) =>
        idx === existingIdx
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    } else {
      updated = [
        ...cart,
        {
          product,
          quantity,
          isGift,
          giftNote,
          giftRecipient,
        },
      ];
    }

    updateCartState(updated);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const updated = cart.filter((_, idx) => idx !== index);
    updateCartState(updated);
  };

  const updateCartQty = (index: number, newQty: number) => {
    const line = cart[index];
    if (!line || !Number.isSafeInteger(newQty) || newQty < 1) return;
    if (newQty - line.quantity > remainingStock(line.product)) return;
    updateCartState(cart.map((item, i) => i === index ? { ...item, quantity: newQty } : item));
  };

  const addMissingToCart = (candidates: Product[]) => {
    const additions = candidates
      .filter(product => remainingStock(product) > 0 && !cart.some(item => item.product._id === product._id))
      .map(product => ({ product, quantity: 1, isGift: false }));
    if (additions.length) updateCartState([...cart, ...additions]);
  };

  const toggleWishlist = (product: Product) => {
    if (wishlist.includes(product._id)) {
      updateWishlistState(wishlist.filter(id => id !== product._id));
      return;
    }
    if (product.stock <= 0) return;
    addMissingToCart([product]);
    updateWishlistState([...wishlist, product._id]);
  };

  const openWishlistCart = () => {
    addMissingToCart(products.filter(product => wishlist.includes(product._id)));
    setIsCartOpen(true);
  };

  const clearCart = () => {
    updateCartState([]);
  };

  // Admin authentication handlers
  const adminLogin = (token: string) => {
    setAdminToken(token);
    localStorage.setItem("lavish_lathers_admin_token", token);
  };

  const adminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem("lavish_lathers_admin_token");
  };

  const isAdminAuthenticated = !!adminToken;

  return (
    <AppContext.Provider
      value={{
        products,
        productsLoading,
        // fetchProducts,
        fetchProducts: fetchProductsManually,
        cart,
        wishlist,
        confirmedOrder,
        filterCategory,
        setFilterCategory,
        remainingStock,
        checkingCartStock,
        addToCart,
        removeFromCart,
        updateCartQty,
        toggleWishlist,
        openWishlistCart,
        clearCart,
        setConfirmedOrder,
        isCartOpen,
        setIsCartOpen,
        adminToken,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
