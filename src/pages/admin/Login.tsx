import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldAlert, LogIn, Lock, Mail } from "lucide-react";
import { authApi } from "../../api/authApi";
import { useApp } from "../../context/AppContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin, isAdminAuthenticated } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  const from = (location.state as any)?.from?.pathname || "/admin/dashboard";

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isAdminAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAdminAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please key in your administrator credentials.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authApi.login(email, password);

      // Check if token exists directly (or if your API returns data inside a nested property)
      if (response && response.token) {
        adminLogin(response.token);
        navigate(from, { replace: true });
      } else {
        setError("Invalid email address or passcode.");
      }
    } catch (err: any) {
      console.error("Login submission issue:", err);
      setError(err.message || "Credential authentication rejected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E0D] text-brand-cream flex flex-col justify-center items-center py-20 px-4 select-none relative">
      {/* Golden flare backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-8 animate-fade-in text-center">
        {/* Brand Header */}
        <div className="space-y-2">
          <span className="text-[9px] uppercase tracking-[0.45em] font-sans-poppins font-bold text-brand-gold block">
            Secured Vault API
          </span>
          <h1 className="font-serif-playfair text-3xl font-medium tracking-wide">
            Lavish Lathers Console
          </h1>
          <p className="text-xs text-brand-cream/55 font-light font-sans-inter">
            Please verify your identities to curate batch logs.
          </p>
        </div>

        {/* Credentials Form Box */}
        <div className="bg-[#141312] border border-brand-cream/10 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/40 text-red-300 text-xs rounded-xl flex items-center space-x-2 text-left animate-shake">
              <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 text-left font-sans-inter"
          >
            {/* Email input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 font-sans-poppins font-bold">
                Consul User Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="owner@login.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-3.5 rounded-xl border border-brand-cream/10 bg-[#0A0A09] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all"
                  id="admin-email-input"
                />
                <Mail className="absolute left-3.5 top-4 h-4 w-4 text-brand-cream/30" />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-widest text-brand-cream/50 font-sans-poppins font-bold">
                Secure Passphrase
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-10 pr-4 py-3.5 rounded-xl border border-brand-cream/10 bg-[#0A0A09] text-brand-cream placeholder-brand-cream/25 focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all"
                  id="admin-password-input"
                />
                <Lock className="absolute left-3.5 top-4 h-4 w-4 text-brand-cream/30" />
              </div>
            </div>

            {/* Helper block */}
            {/* <div className="text-[10px] text-brand-cream/45 bg-[#0F0E0D] p-3 rounded-lg border border-brand-cream/5 leading-relaxed text-center font-sans-poppins">
              Demo access credentials:
              <br />
              <strong className="text-brand-gold select-all">
                owner@longin.com
              </strong>{" "}
              / <strong className="text-brand-gold select-all">password123</strong>
            </div> */}

            {/* Submit btn */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-sans-poppins py-3.5 px-6 mt-2 bg-brand-gold hover:bg-brand-cream text-brand-black disabled:bg-brand-cream/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow flex items-center justify-center space-x-2 cursor-pointer"
              id="admin-login-submit"
            >
              {loading ? (
                <span>Unbolting vaults...</span>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Verify and Authenticate</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div>
          <button
            onClick={() => navigate("/")}
            className="text-[10px] uppercase tracking-widest text-brand-cream/45 hover:text-brand-gold transition-colors font-sans-poppins cursor-pointer"
          >
            ← Return to public apothecary
          </button>
        </div>
      </div>
    </div>
  );
}
