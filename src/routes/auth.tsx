import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({ component: Auth });
type Mode = "login" | "signup";

const countries = [
  ["Nigeria", "NG", "+234"], ["United States", "US", "+1"], ["United Kingdom", "GB", "+44"],
  ["Canada", "CA", "+1"], ["South Africa", "ZA", "+27"], ["Ghana", "GH", "+233"],
  ["Kenya", "KE", "+254"], ["India", "IN", "+91"], ["Australia", "AU", "+61"], ["Germany", "DE", "+49"],
] as const;

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); const [country, setCountry] = useState("NG"); const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false); const [loading, setLoading] = useState(false);
  const selectedCountry = countries.find((item) => item[1] === country) ?? countries[0];

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error;
        toast.success("Welcome back to SmartChain"); void navigate({ to: "/", replace: true });
      } else {
        if (!fullName.trim()) throw new Error("Please enter your full name.");
        if (!phone.trim()) throw new Error("Please enter your phone number.");
        const phoneNumber = `${selectedCountry[2]}${phone.replace(/^0+/, "")}`;
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { full_name: fullName.trim(), country: selectedCountry[0], country_code: selectedCountry[2], phone: phoneNumber } } });
        if (error) throw error;
        if (data.user) await supabase.from("profiles").upsert({ id: data.user.id, display_name: fullName.trim() });
        if (data.session) { toast.success("Account created successfully"); void navigate({ to: "/", replace: true }); }
        else { toast.success("Check your email to confirm your account, then sign in."); setMode("login"); }
      }
    } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to continue. Please try again."); }
    finally { setLoading(false); }
  }

  const fieldClass = "mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary";
  return <main className="mx-auto grid min-h-screen max-w-lg place-items-center px-4 py-8"><section className="w-full rounded-3xl border border-border bg-card p-6 shadow-lg">
    <div className="mb-7 text-center"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">S</div><h1 className="mt-4 text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create your SmartChain account"}</h1><p className="mt-2 text-sm text-muted-foreground">Securely access your wallet dashboard and portfolio.</p></div>
    <div className="mb-6 grid grid-cols-2 rounded-xl bg-secondary p-1"><button type="button" onClick={() => setMode("login")} className={`rounded-lg px-3 py-2 text-sm font-medium ${mode === "login" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>Sign in</button><button type="button" onClick={() => setMode("signup")} className={`rounded-lg px-3 py-2 text-sm font-medium ${mode === "signup" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>Create account</button></div>
    <form onSubmit={submit} className="space-y-4">
      {mode === "signup" && <><label className="block text-sm font-medium">Full name<input required autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={fieldClass} placeholder="Your full name" /></label><label className="block text-sm font-medium">Country<select value={country} onChange={(e) => setCountry(e.target.value)} className={fieldClass}>{countries.map(([name, code]) => <option key={code} value={code}>{name}</option>)}</select></label><label className="block text-sm font-medium">Phone number<div className="mt-1.5 flex"><span className="flex items-center rounded-l-xl border border-r-0 border-border bg-secondary px-3 text-sm text-muted-foreground">{selectedCountry[2]}</span><input required inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-r-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary" placeholder="Phone number" /></div></label></>}
      <label className="block text-sm font-medium">Email<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} placeholder="you@example.com" /></label>
      <label className="block text-sm font-medium">Password<div className="relative mt-1.5"><input required minLength={6} type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-3 pr-12 outline-none focus:border-primary" placeholder="At least 6 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-4 text-muted-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
      {mode === "login" && <Link to="/reset-password" className="block text-right text-sm font-medium text-primary">Forgot password?</Link>}
      <button disabled={loading} className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">{loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button>
    </form>
  </section></main>;
}
