import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { customerRequest, type Customer } from "../api/customerApi";

const sessionKey = ["customer-session"];
const Context = createContext<{ customer: Customer | null; loading: boolean; openAccount: () => void } | null>(null);

export function useCustomer() {
  const value = useContext(Context);
  if (!value) throw new Error("CustomerProvider is required");
  return value;
}

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: sessionKey, queryFn: () => customerRequest<Customer | null>("/auth/me"),
    staleTime: 0, retry: false, refetchOnWindowFocus: true,
  });
  return <Context.Provider value={{ customer: data ?? null, loading: isLoading, openAccount: () => setOpen(true) }}>
    {children}
    {open && <AccountModal customer={data ?? null} close={() => setOpen(false)} />}
  </Context.Provider>;
}

function AccountModal({ customer, close }: { customer: Customer | null; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const codeInput = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [until, setUntil] = useState(0);
  const [now, setNow] = useState(Date.now);
  const seconds = Math.max(0, Math.ceil((until - now) / 1000));
  const client = useQueryClient();

  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  useEffect(() => { if (sent) codeInput.current?.focus(); }, [sent]);
  useEffect(() => {
    if (!seconds) return;
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, [until, seconds > 0]);

  function cooldown(delay: number) {
    const start = Date.now();
    setNow(start);
    setUntil(start + delay * 1000);
  }

  async function send() {
    setBusy(true); setError("");
    try {
      const result = await customerRequest<{ retryAfter: number }>("/auth/send-otp", { email });
      setSent(true); setCode(""); cooldown(result.retryAfter);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        if ("retryAfter" in err && typeof err.retryAfter === "number") {
          cooldown(err.retryAfter); setSent(true);
        }
      }
    } finally { setBusy(false); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (!sent && !customer) return send();
    setBusy(true); setError("");
    try {
      let user: Customer | null = null;
      if (customer) await customerRequest("/auth/logout", {});
      else user = await customerRequest<Customer>("/auth/verify-otp", { email, code });
      await client.cancelQueries({ queryKey: sessionKey });
      client.setQueryData(sessionKey, user);
      close();
    } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { setBusy(false); }
  }

  return <dialog ref={ref} aria-labelledby="customer-title" className="fixed inset-0 m-auto w-[min(26rem,calc(100%-2rem))] rounded-2xl bg-brand-cream p-6 text-brand-black shadow-2xl backdrop:bg-black/55">
    <header className="mb-5 flex items-center justify-between gap-4">
      <h2 id="customer-title" className="font-serif-playfair text-2xl">{customer ? "Your account" : sent ? "Check your email" : "Sign in with email"}</h2>
      <button onClick={close} aria-label="Close account" className="grid size-11 place-items-center rounded-full border border-brand-black/15"><X size={18}/></button>
    </header>
    <form onSubmit={submit} className="space-y-4 text-sm">
      {customer ? <p>{customer.email}</p> : sent ? <>
        <p>Enter the six-digit code sent to <strong>{email}</strong>. It expires in 10 minutes.</p>
        <label className="block">Verification code<input ref={codeInput} required autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} className="mt-1 block w-full rounded-lg border border-brand-black/20 p-3 tracking-widest"/></label>
      </> : <label className="block">Email address<input autoFocus required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-lg border border-brand-black/20 p-3"/></label>}
      {error && <p role="alert" className="text-red-800">{error}</p>}
      <button disabled={busy} className="w-full rounded-full bg-brand-black py-3 font-semibold text-brand-cream disabled:opacity-50">{busy ? "Please wait..." : customer ? "Sign out" : sent ? "Verify and sign in" : "Email me a code"}</button>
      {sent && !customer && <div className="flex justify-between gap-3">
        <button type="button" disabled={busy || seconds > 0} onClick={send} className="underline disabled:opacity-60">{seconds ? `Resend in ${seconds}s` : "Resend code"}</button>
        <button type="button" disabled={busy} onClick={() => { setSent(false); setCode(""); setError(""); }} className="underline">Change email</button>
      </div>}
    </form>
  </dialog>;
}
