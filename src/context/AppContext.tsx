import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Order } from "../types";

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  confirmedOrder: Order | null;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  addToCart: (
    product: Product,
    isGift: boolean,
    giftNote?: string,
    giftRecipient?: string,
    quantity?: number,
  ) => void;
  removeFromCart: (index: number) => void;
  updateCartQty: (index: number, newQty: number) => void;
  toggleWishlist: (id: string) => void;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(
    localStorage.getItem("lavish_lathers_admin_token"),
  );

  // Load cart & wishlist from localStorage on mounting
  useEffect(() => {
    try {
      const cachedCart = localStorage.getItem("lavish_lathers_cart");
      const cachedWishlist = localStorage.getItem("lavish_lathers_wishlist");
      if (cachedCart) {
        setCart(JSON.parse(cachedCart));
      }
      if (cachedWishlist) {
        setWishlist(JSON.parse(cachedWishlist));
      }
    } catch (err) {
      console.error("Local storage decoding issue:", err);
    }
  }, []);

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
    const existingIdx = cart.findIndex(
      (it) =>
        it.product._id === product._id &&
        it.isGift === isGift &&
        it.giftRecipient === giftRecipient,
    );

    let updated = [...cart];
    if (existingIdx > -1) {
      updated[existingIdx].quantity += quantity;
    } else {
      updated.push({
        product,
        quantity,
        isGift,
        giftNote,
        giftRecipient,
      });
    }

    updateCartState(updated);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const updated = cart.filter((_, idx) => idx !== index);
    updateCartState(updated);
  };

  const updateCartQty = (index: number, newQty: number) => {
    if (newQty < 1) return;
    const updated = [...cart];
    updated[index].quantity = newQty;
    updateCartState(updated);
  };

  const toggleWishlist = (id: string) => {
    let updated: string[];
    if (wishlist.includes(id)) {
      updated = wishlist.filter((item) => item !== id);
    } else {
      updated = [...wishlist, id];
    }
    updateWishlistState(updated);
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
        cart,
        wishlist,
        confirmedOrder,
        filterCategory,
        setFilterCategory,
        addToCart,
        removeFromCart,
        updateCartQty,
        toggleWishlist,
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
