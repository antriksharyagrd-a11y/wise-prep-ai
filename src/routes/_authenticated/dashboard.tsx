import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Download,
  FileText,
  Layout,
  PenTool,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import { getDashboard } from "@/lib/hirewise.functions";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — HireWise" }, { name: "description", content: "Your resume management dashboard: saved resumes, recent analyses, and templates." }] }),
  component: Dashboard,
});

type SavedResume = {
  id: string;
  name: string;
  template: string;
  lastEdited: string;
  atsScore: number;
  targetRole: string;
};

type RecentAnalysis = {
  id: string;
  resumeName: string;
  targetRole: string;
  atsScore: number;
  date: string;
  keywordMatch: number;
};

const MOCK_RESUMES: SavedResume[] = [
  { id: "r1", name: "Alex_Chen_Software_Engineer.pdf", template: "Modern Clean", lastEdited: "2 days ago", atsScore: 82, targetRole: "Full Stack Developer" },
  { id: "r2", name: "Alex_Chen_Resume_Backend.pdf", template: "Classic Professional", lastEdited: "1 week ago", atsScore: 76, targetRole: "Backend Developer" },
];

const MOCK_ANALYSES: RecentAnalysis[] = [
  { id: "a1", resumeName: "Alex_Chen_Software_Engineer.pdf", targetRole: "Senior Full Stack Engineer", atsScore: 78, date: "2 days ago", keywordMatch: 74 },
  { id: "a2", resumeName: "Alex_Chen_Resume_Backend.pdf", targetRole: "Node.js Developer", atsScore: 81, date: "5 days ago", keywordMatch: 85 },
  { id: "a3", resumeName: "Pasted Resume Text", targetRole: "Full Stack Developer", atsScore: 69, date: "1 week ago", keywordMatch: 62 },
];

const TEMPLATES_USED = [
  { id: "t1", name: "Modern Clean", uses: 12, color: "from-cyan-400 to-blue-500" },
  { id: "t2", name: "Classic Professional", uses: 5, color: "from-blue-500 to-indigo-500" },
];

function Dashboard() {
  const router = useRouter();
  const fn = useServerFn(getDashboard);
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: () => fn() });
  const [resumes, setResumes] = useState<SavedResume[]>(MOCK_RESUMES);
  const [analyses] = useState<RecentAnalysis[]>(MOCK_ANALYSES);
  const [deleting, setDeleting] = useState<string | null>(null);

  function deleteResume(id: string) {
    setDeleting(id);
    setTimeout(() => {
      setResumes((r) => r.filter((x) => x.id !== id));
      setDeleting(null);
      toast.success("Resume deleted");
    }, 400);
  }

  if (isLoading || !data) return <div className="mx-auto max-w-7xl px-6"><div className="h-64 animate-pulse rounded-2xl bg-white/5" /></div>;

  const hasResumes = resumes.length > 0;
  const avgAts = analyses.length ? Math.round(analyses.reduce((s, a) => s + a.atsScore, 0) / analyses.length) : 0;
  const avgAtsBar = analyses.length ? avgAts : 0;
  const savedResumeBar = Math.min((resumes.length / 5) * 100, 100);
  const analysesBar = Math.min((analyses.length / 10) * 100, 100);
  const templatesBar = Math.min((TEMPLATES_USED.length / 5) * 100, 100);

  return (
    <div className="mx-auto max-w-7xl px-6 space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Dashboard</p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">Welcome back{data.profile?.display_name ? ", " + data.profile.display_name.split(" ")[0] : ""}.</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your resumes, review analyses, and access your templates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard label="Saved Resumes" value={String(resumes.length)} sub={resumes.length === 1 ? "document" : "documents"} bar={savedResumeBar} icon={FileText} accent={true} />
        <MetricCard label="Analyses Run" value={String(analyses.length)} sub="total" bar={analysesBar} icon={Sparkles} />
        <MetricCard label="Avg ATS Score" value={analyses.length ? String(avgAts) : "—"} sub={analyses.length ? "across runs" : "no data"} bar={avgAtsBar} icon={Target} />
        <MetricCard label="Templates Used" value={String(TEMPLATES_USED.length)} sub="styles tried" bar={templatesBar} icon={Layout} />
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2"><FileText className="size-4 text-electric-glow" /> Saved Resumes</h3>
              <p className="mt-1 text-xs text-muted-foreground">Download, {resumes.length} saved</p>
            </div>
            <Link to="/resume-builder" className="h-8 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors">
              <PenTool className="size-3.5" /> New Resume
            </Link>
          </div>

          {!hasResumes ? (
            <Empty
              className="py-10 text-center"
              icon={<FileText className="size-10 text-muted-foreground/40" />}
              title="No resumes saved yet"
              subtitle="Create your first professional resume or paste one in to get started."
              actions={
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <Link to="/resume-builder" className="inline-flex items-center gap-2 h-9 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors">
                    <PenTool className="size-4" /> Build a Resume
                  </Link>
                  <Link to="/resume" className="inline-flex items-center gap-2 h-9 rounded-md bg-secondary px-4 text-xs font-medium ring-1 ring-white/10 hover:bg-accent transition-colors">
                    <Sparkles className="size-4" /> Analyze Existing
                  </Link>
                </div>
              }
            />
          ) : (
              <div className="divide-y divide-white/5 rounded-xl border border-white/10 overflow-hidden">
                {resumes.map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center gap-4 px-5 py-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20"><FileText className="size-5" /></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{r.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Layout className="size-3" /> {r.template}</span>
                        <span className="inline-flex items-center gap-1"><Briefcase className="size-3" /> {r.targetRole}</span>
                        <span className="inline-flex items-center gap-1"><Calendar className="size-3" /> {r.lastEdited}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">ATS Score</p>
                        <div className="mt-0.5 flex items-baseline gap-1">
                          <span className="text-xl font-semibold tabular-nums">{r.atsScore}</span>
                          <span className="text-xs text-muted-foreground">/ 100</span>
                        </div>
                        <div className="mt-1 h-1 w-20 rounded-full bg-white/5 overflow-hidden">
                          <div className={`h-full rounded-full ${r.atsScore >= 80 ? "bg-emerald-400" : r.atsScore >= 60 ? "bg-amber-400" : "bg-rose-400"}`} style={{ width: `${r.atsScore}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toast.success("Downloading PDF... (demo)")}
                          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                          title="Download"
                        >
                          <Download className="size-4" />
                        </button>
                        <Link
                          to="/resume-builder"
                          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                          title="Edit"
                        >
                          <PenTool className="size-4" />
                        </Link>
                        <button
                          onClick={() => deleteResume(r.id)}
                          disabled={deleting === r.id}
                          className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-60"
                          title="Delete"
                        >
                          <Trash2 className={`size-4 ${deleting === r.id ? "animate-spin" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/5 p-6 glass">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold flex items-center gap-2"><Sparkles className="size-4 text-electric-glow" /> Recent Analyses</h3>
                <p className="mt-1 text-xs text-muted-foreground">{analyses.length} analyses</p>
              </div>
              <Link to="/resume" className="h-8 inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 text-xs font-medium ring-1 ring-white/10 hover:bg-accent transition-colors">
                New Analysis <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {analyses.length === 0 ? (
              <Empty
                className="py-8 text-center"
                icon={<Sparkles className="size-10 text-muted-foreground/40" />}
                title="No analyses yet"
                subtitle="Upload a resume to get an ATS compatibility report."
              />
            ) : (
              <div className="space-y-2.5">
                {analyses.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => router.navigate({ to: "/resume" })}
                    className="group flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{a.resumeName}</p>
                      <div className="mt-0.5 flex items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Briefcase className="size-3" /> {a.targetRole}</span>
                        <span className="inline-flex items-center gap-1"><Calendar className="size-3" /> {a.date}</span>
                        <span className="inline-flex items-center gap-1"><Target className="size-3" /> Keywords {a.keywordMatch}%</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <ScoreBadge value={a.atsScore} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
              <h3 className="mb-4 text-sm font-semibold flex items-center gap-2"><Layout className="size-4 text-electric-glow" /> Templates Used</h3>
              <div className="space-y-2.5">
                {TEMPLATES_USED.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2.5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-9 rounded bg-gradient-to-br ${t.color} ring-1 ring-white/10`} />
                      <div>
                        <p className="text-xs font-medium">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground">{t.uses} edits</p>
                      </div>
                    </div>
                    <Link to="/resume-builder" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-electric-glow transition-colors">Use</Link>
                  </div>
                ))}
              </div>
              <Link to="/resume-builder" className="mt-4 block h-8 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-secondary text-xs font-medium ring-1 ring-white/10 hover:bg-accent transition-colors">
                <Layout className="size-3.5" /> Explore all templates
              </Link>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 glass">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Sparkles className="size-4 text-electric-glow" /> Quick actions</h3>
              <div className="mt-3 space-y-2">
                <QuickAction to="/resume" icon={Sparkles} label="Analyze Resume" primary />
                <QuickAction to="/resume-builder" icon={PenTool} label="Build New Resume" />
                <QuickAction to="/job-match" icon={Briefcase} label="Check Job Match" />
              </div>
            </div>
          </div>
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

function ScoreBadge({ value }: { value: number }) {
  const color = value >= 80 ? "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20" : value >= 60 ? "text-amber-400 bg-amber-500/10 ring-amber-500/20" : "text-rose-400 bg-rose-500/10 ring-rose-500/20";
  return (
    <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${color}`}>
      {value} <span className="text-[10px] opacity-70">/100</span>
    </div>
  );
}

function Empty({ className, icon, title, subtitle, actions }: { className?: string; icon: React.ReactNode; title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className={`flex flex-col items-center ${className ?? ""}`}>
      <div className="mb-3">{icon}</div>
      <p className="text-sm font-medium">{title}</p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground max-w-xs">{subtitle}</p>}
      {actions && <div className="mt-4 flex flex-wrap items-center justify-center gap-2">{actions}</div>}
    </div>
  );
}
