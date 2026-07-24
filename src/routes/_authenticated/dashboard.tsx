import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Code2, FileText, Flame, Mic, Target } from "lucide-react";
import { getDashboard } from "@/lib/hirewise.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — HireWise" }, { name: "description", content: "Your interview prep dashboard: readiness score, streak, mock interview and resume performance." }] }),
  component: Dashboard,
});

function Dashboard() {
  const fn = useServerFn(getDashboard);
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: () => fn() });
  if (isLoading || !data) return <div className="mx-auto max-w-7xl px-6"><div className="h-64 animate-pulse rounded-2xl bg-white/5" /></div>;
  const streak = data.streak?.current_streak ?? 0;
  return (
    <div className="mx-auto max-w-7xl px-6 space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Signal status</p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">Welcome back{data.profile?.display_name ? `, ${data.profile.display_name.split(" ")[0]}` : ""}.</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Readiness Score" value={String(data.readiness)} sub="composite" bar={data.readiness} icon={Target} accent />
        <MetricCard label="Streak" value={String(streak)} sub={streak === 1 ? "day" : "days"} bar={Math.min((streak / 14) * 100, 100)} icon={Flame} />
        <MetricCard label="Questions Solved" value={String(data.solved)} sub="total" bar={Math.min((data.solved / 30) * 100, 100)} icon={Code2} />
        <MetricCard label="Resume Score" value={data.resumeScore !== null ? String(data.resumeScore) : "—"} sub={data.resumeScore !== null ? "ATS" : "no resume yet"} bar={data.resumeScore ?? 0} icon={FileText} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/5 p-6 glass">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Recent activity</h3>
            <Link to="/progress" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">See all</Link>
          </div>
          {data.recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No activity yet. Start with today's question.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {data.recent.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{r.question?.title ?? "Question"}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{r.question?.difficulty} · {r.question?.topic}</p>
                  </div>
                  <span className={`text-xs ${r.solved ? "text-electric-glow" : "text-muted-foreground"}`}>{r.solved ? "Solved" : "Attempted"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
            <h3 className="mb-4 text-sm font-medium">Quick actions</h3>
            <div className="space-y-2.5">
              <QuickAction to="/question" icon={Code2} label="Today's Question" primary />
              <QuickAction to="/interview" icon={Mic} label="Start Mock Interview" />
              <QuickAction to="/resume" icon={FileText} label="Upload Resume" />
            </div>
          </div>
          {data.profile?.username && (
            <Link to="/u/$username" params={{ username: data.profile.username }} className="block rounded-2xl border border-white/5 bg-white/5 p-6 glass hover:bg-white/10 transition-colors">
              <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Public profile</p>
              <p className="mt-2 text-sm font-mono text-muted-foreground">hirewise.app/u/{data.profile.username}</p>
              <p className="mt-3 text-xs text-muted-foreground">Share with recruiters →</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, bar, icon: Icon, accent }: { label: string; value: string; sub: string; bar: number; icon: React.ComponentType<{ className?: string }>; accent?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border border-white/5 p-5 glass ${accent ? "shadow-glow" : ""}`}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-medium tabular-nums">{value}</span>
        <span className="text-xs text-muted-foreground">{sub}</span>
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-white/5">
        <div className={`h-full rounded-full ${accent ? "bg-gradient-brand shadow-glow" : "bg-primary/70"}`} style={{ width: `${Math.max(bar, 4)}%` }} />
      </div>
    </motion.div>
  );
}

function QuickAction({ to, icon: Icon, label, primary }: { to: any; icon: React.ComponentType<{ className?: string }>; label: string; primary?: boolean }) {
  return (
    <Link to={to} className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${primary ? "bg-primary text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow" : "bg-secondary ring-1 ring-white/10 hover:bg-accent"}`}>
      <span className="flex items-center gap-2"><Icon className="size-4" /> {label}</span>
      <ArrowRight className="size-3.5 opacity-60" />
    </Link>
  );
}