import { createFileRoute, Outlet, redirect, Link, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { HireWiseLogo } from "@/components/HireWiseLogo";
import { Briefcase, FileText, LayoutDashboard, LogOut, PenTool, Sparkles, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthedShell,
});

function AuthedShell() {
  const router = useRouter();
  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.navigate({ to: "/" });
  }
  const nav = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/resume", label: "Resume Analyzer", icon: Sparkles },
    { to: "/resume-builder", label: "Resume Builder", icon: PenTool },
    { to: "/job-match", label: "Job Match", icon: Briefcase },
    { to: "/profile", label: "Profile", icon: User },
  ] as const;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 z-40 w-full border-b border-white/5 glass">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link to="/dashboard"><HireWiseLogo /></Link>
          <div className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="px-3 h-8 inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors [&.active]:text-foreground [&.active]:bg-white/5" activeProps={{ className: "active" }}>
                <n.icon className="size-3.5" /> {n.label}
              </Link>
            ))}
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-1 h-8 rounded-md px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
        <div className="md:hidden border-t border-white/5 overflow-x-auto">
          <div className="flex gap-1 px-3 py-2">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="shrink-0 px-3 h-8 inline-flex items-center gap-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 [&.active]:text-foreground [&.active]:bg-white/5" activeProps={{ className: "active" }}>
                <n.icon className="size-3.5" /> {n.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <div className="pt-24 md:pt-20 pb-16">
        <Outlet />
      </div>
    </div>
  );
}