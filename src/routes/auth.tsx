import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { HireWiseLogo } from "@/components/HireWiseLogo";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — HireWise" },
      { name: "description", content: "Sign in or create your HireWise account to analyze your resume against any job description." },
      { property: "og:title", content: "Sign in — HireWise" },
      { property: "og:description", content: "Sign in to your HireWise AI Resume & ATS account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    // Initial session check
    supabase.auth.getSession().then(({ data }) => {
      if (mounted && data.session) nav({ to: "/resume" });
    });
    // Real-time listener: redirect as soon as session appears (e.g. after signup auto-sign-in)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted && (event === "SIGNED_IN" || event === "SIGNED_UP") && session) {
        nav({ to: "/resume" });
      }
    });
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [nav]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: displayName } },
        });
        if (signUpError) throw signUpError;

        // If signUp didn't set a session (email confirmation is enabled),
        // immediately sign in the user so they can start using the app.
        if (!signUpData.session) {
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) {
            // Sign-in failed (email confirmation may be strictly required).
            // Still try to navigate — worst case auth guard redirects back.
            toast.success("Account created. Please confirm your email if prompted.");
          } else {
            toast.success("Account created. Welcome!");
          }
        } else {
          toast.success("Account created. Welcome!");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
      }

      // Wait a tick for Supabase to propagate the session into storage
      // before navigation, so the _authenticated guard doesn't kick us back.
      await new Promise((r) => setTimeout(r, 150));
      const { data: sessionCheck } = await supabase.auth.getSession();
      if (!sessionCheck.session) {
        throw new Error("Session could not be established. Please sign in manually.");
      }
      nav({ to: "/resume" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error("Google sign-in failed"); return; }
    if (result.redirected) return;
    nav({ to: "/resume" });
  }

  return (
    <main className="relative min-h-screen circuit-bg flex items-center justify-center px-6 py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
        <Link to="/" className="flex justify-center mb-8"><HireWiseLogo /></Link>
        <div className="glass rounded-2xl p-6 shadow-glow">
          <h1 className="text-xl font-medium tracking-tight">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{mode === "signin" ? "Sign in to analyze your resume." : "Start analyzing your resume in under a minute."}</p>

          <button onClick={google} className="mt-6 w-full h-10 inline-flex items-center justify-center gap-2 rounded-md bg-white text-navy-950 text-sm font-medium hover:bg-white/90 transition-colors">
            <svg viewBox="0 0 24 24" className="size-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </button>
          <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            <div className="h-px flex-1 bg-white/10" /> or <div className="h-px flex-1 bg-white/10" />
          </div>
          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display name" className="w-full h-10 rounded-md bg-input px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-primary" />
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="you@work.com" className="w-full h-10 rounded-md bg-input px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-primary" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="Password" className="w-full h-10 rounded-md bg-input px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-primary" />
            <button disabled={loading} className="w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium ring-1 ring-electric-glow/40 hover:bg-electric-glow disabled:opacity-60 transition-colors">
              {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground transition-colors">
            {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}