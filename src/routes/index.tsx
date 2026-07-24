import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Code2, FileText, Gauge, Mic, TrendingUp } from "lucide-react";
import { HireWiseLogo } from "@/components/HireWiseLogo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HireWise — Master technical interviews with precision AI" },
      { name: "description", content: "Daily coding challenges, AI mock interviews with live confidence scoring, resume analysis, and a composite readiness score. Built for serious engineers." },
      { property: "og:title", content: "HireWise — AI Interview Preparation Platform" },
      { property: "og:description", content: "Daily coding challenges, AI mock interviews, resume feedback, readiness tracking." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 glass">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <HireWiseLogo />
          <div className="hidden gap-8 sm:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#how" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How it works</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
          </div>
          <Link to="/auth" className="h-8 inline-flex items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground ring-1 ring-primary/50 hover:bg-electric-glow transition-colors">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="circuit-bg relative flex flex-col items-center px-6 pt-32 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-8">
            <span className="relative mr-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-glow opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric-glow" />
            </span>
            <span className="text-[10px] font-bold tracking-widest text-electric-glow uppercase">Signal Rising</span>
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
          className="max-w-[22ch] text-balance text-4xl font-medium tracking-tight sm:text-6xl lg:text-7xl leading-tight"
        >
          Master technical screens with <span className="text-gradient-brand">precision AI</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-[58ch] text-pretty text-lg text-muted-foreground"
        >
          The high-fidelity interview simulator for engineers. Analyze performance gaps, refine architectural depth, and secure your next role with confidence.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <Link to="/auth" className="h-11 inline-flex items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors">
            Get started free <ArrowRight className="size-4" />
          </Link>
          <a href="#features" className="h-11 inline-flex items-center rounded-md bg-secondary px-6 text-sm font-medium ring-1 ring-white/10 hover:bg-accent transition-colors">
            View features
          </a>
        </motion.div>
      </section>

      {/* Dashboard preview */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="relative rounded-2xl border border-white/5 bg-card/50 p-4 ring-1 ring-black/5 md:p-8 glass"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: "Readiness Score", value: "84", sub: "+12%", bar: 84 },
                  { label: "Streak", value: "12", sub: "days", bar: 65 },
                  { label: "Resume Score", value: "A-", sub: "12 impact items", bar: 88 },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/5 bg-white/5 p-5">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-4xl font-medium">{s.value}</span>
                      <span className="text-sm text-electric-glow">{s.sub}</span>
                    </div>
                    <div className="mt-3 h-1 w-full rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-brand shadow-glow" style={{ width: `${s.bar}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-medium">Preparation Velocity</h3>
                  <div className="flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="h-2 w-2 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="h-40 flex items-end gap-2">
                  {[30, 45, 40, 60, 55, 72, 68, 80, 74, 88, 82, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t bg-gradient-brand/80" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6 lg:col-span-4">
              <div className="rounded-xl border border-white/5 bg-white/5 p-6">
                <h3 className="mb-4 text-sm font-medium">Quick actions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40">
                    <span className="flex items-center gap-2"><Mic className="size-4" /> Start Mock Interview</span>
                    <span className="text-[10px] opacity-70 font-mono">⌘N</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm ring-1 ring-white/10">
                    <FileText className="size-4" /> Upload New Resume
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm ring-1 ring-white/10">
                    <Code2 className="size-4" /> Daily Coding Challenge
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-6">
                <h3 className="mb-4 text-sm font-medium">Recent solved</h3>
                <div className="divide-y divide-white/5">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">LRU Cache</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Hard · 24m</p>
                    </div>
                    <span className="text-xs text-electric-glow">98% rank</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">Word Break</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Medium · 18m</p>
                    </div>
                    <span className="text-xs text-electric-glow">A grade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-12 text-center">
          <p className="text-[10px] font-bold tracking-widest text-electric-glow uppercase">Capabilities</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-medium tracking-tight">Every signal, sharpened.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Code2, title: "Daily coding", body: "One curated question per day with a full editor, language selector, and step-by-step AI explanations." },
            { icon: Brain, title: "AI mock interviews", body: "Role-specific interviewer that asks, evaluates, and follows up — then delivers a scored report card." },
            { icon: Mic, title: "Confidence meter", body: "Live sentiment + filler-word analysis of your voice answers so you hear yourself the way a hiring panel does." },
            { icon: FileText, title: "Resume + ATS", body: "PDF/DOCX upload, keyword match for your target role, and an ATS-friendliness score with concrete fixes." },
            { icon: TrendingUp, title: "Progress tracking", body: "Radar charts by topic, streak calendar, and mock-interview scores over time." },
            { icon: Gauge, title: "Readiness score", body: "A composite of code, interview, and resume signals. One number to know if you're ready." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-colors">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-electric-glow ring-1 ring-primary/20">
                <f.icon className="size-4" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <HireWiseLogo />
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} HireWise. Signal over noise.</p>
        </div>
      </footer>
    </main>
  );
}
