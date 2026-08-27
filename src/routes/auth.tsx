import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({ component: Auth });

type Mode = "login" | "signup";

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back to SmartChain");
        void navigate({ to: "/", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created successfully");
          void navigate({ to: "/", replace: true });
        } else {
          toast.success("Check your email to confirm your account, then sign in.");
          setMode("login");
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to continue. Please try again.");
    } finally { setLoading(false); }
  }

  return <main className="mx-auto grid min-h-screen max-w-lg place-items-center px-4 py-8">
    <section className="w-full rounded-3xl border border-border bg-card p-6 shadow-lg">
      <div className="mb-7 text-center"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">S</div><h1 className="mt-4 text-2xl font-semibold">{mode === "login" ? "Welcome back" : "Create your SmartChain account"}</h1><p className="mt-2 text-sm text-muted-foreground">Securely access your wallet dashboard and portfolio.</p></div>
      <div className="mb-6 grid grid-cols-2 rounded-xl bg-secondary p-1"><button type="button" onClick={() => setMode("login")} className={`rounded-lg px-3 py-2 text-sm font-medium ${mode === "login" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>Sign in</button><button type="button" onClick={() => setMode("signup")} className={`rounded-lg px-3 py-2 text-sm font-medium ${mode === "signup" ? "bg-background shadow-sm" : "text-muted-foreground"}`}>Create account</button></div>
      <form onSubmit={submit} className="space-y-4"><label className="block text-sm font-medium">Email<input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary" placeholder="you@example.com" /></label><label className="block text-sm font-medium">Password<input required minLength={6} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary" placeholder="At least 6 characters" /></label><button disabled={loading} className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">{loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}</button></form>
    </section>
  </main>;
}
