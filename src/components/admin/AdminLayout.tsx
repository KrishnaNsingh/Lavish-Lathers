import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  LogOut,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({
  children,
  title,
  subtitle,
}: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogout } = useApp();

  const menuItems = [
    {
      name: "Dashboard stats",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    { name: "curate products", path: "/admin/products", icon: ShoppingBag },
    { name: "orders registry", path: "/admin/orders", icon: ClipboardList },
  ];

  const handleLogout = () => {
    adminLogout();
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-brand-cream font-sans-inter flex flex-col md:flex-row text-left">
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#11100F] border-b md:border-b-0 md:border-r border-brand-cream/10 p-6 flex flex-col justify-between shrink-0 font-sans-poppins">
        <div className="space-y-8">
          {/* Logo Title */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-brand-gold">
              <span className="h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-[0.3em]">
                Vault Console
              </span>
            </div>
            <h2 className="font-serif-playfair text-xl text-brand-cream tracking-wide font-semibold">
              Lavish Atelier
            </h2>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "bg-brand-gold text-brand-black font-bold"
                      : "text-brand-cream/65 hover:text-brand-gold hover:bg-brand-cream/5"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions inside sidebar */}
        <div className="mt-8 pt-6 border-t border-brand-cream/10 space-y-3.5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-xs text-brand-cream/55 hover:text-brand-gold transition-colors w-full cursor-pointer"
          >
            <ArrowLeft className="h-4.5 w-4.5 shrink-0" />
            <span>Storefront View</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-xs text-red-400 hover:text-red-300 transition-colors w-full cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0" />
            <span>Logout Vault</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN LAYOUT WORKSPACE CONTAINER */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Header line */}
        <div className="border-b border-brand-cream/10 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-sans-poppins font-bold block mb-1">
              administrative curation
            </span>
            <h1 className="font-serif-playfair text-3xl text-brand-cream tracking-wide font-normal font-semibold leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-brand-cream/55 font-light mt-1 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 text-brand-cream/35 text-[10px] uppercase tracking-widest font-sans-poppins justify-end">
            <span>Server: Stable</span>
            <span>•</span>
            <span className="text-brand-gold">Active Session</span>
          </div>
        </div>

        {/* Child templates */}
        <div className="animate-fade-in relative z-15">{children}</div>
      </main>
    </div>
  );
}
