import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mic } from "lucide-react";
import { startInterview } from "@/lib/hirewise.functions";

export const Route = createFileRoute("/_authenticated/interview")({
  head: () => ({ meta: [{ title: "Mock Interview — HireWise" }, { name: "description", content: "Start an AI-powered mock interview with live confidence scoring." }] }),
  component: InterviewStart,
});

const ROLES = ["Frontend Engineer", "Backend Engineer", "Full-Stack Engineer", "Data Structures & Algorithms", "System Design", "Behavioral"];

function InterviewStart() {
  const nav = useNavigate();
  const start = useServerFn(startInterview);
  const [role, setRole] = useState(ROLES[0]);
  const [busy, setBusy] = useState(false);
  async function begin() {
    setBusy(true);
    try {
      const r = await start({ data: { roleDomain: role } });
      nav({ to: "/interview/$id", params: { id: r.id } });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Could not start"); setBusy(false); }
  }
  return (
    <div className="mx-auto max-w-2xl px-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/5 bg-white/5 p-8 glass">
        <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-brand shadow-glow">
          <Mic className="size-5 text-white" />
        </div>
        <h1 className="mt-5 text-2xl font-medium tracking-tight">Start a mock interview</h1>
        <p className="mt-2 text-sm text-muted-foreground">The AI interviewer will ask questions one at a time, evaluate answers, and finish with a scored report. Voice input and live confidence scoring supported.</p>
        <label className="mt-6 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Role / domain</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-2 w-full h-10 rounded-md bg-input px-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none">
          {ROLES.map((r) => <option key={r} className="bg-navy-900">{r}</option>)}
        </select>
        <button onClick={begin} disabled={busy} className="mt-6 w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors disabled:opacity-60">
          {busy ? "Starting…" : "Begin interview"}
        </button>
      </motion.div>
    </div>
  );
}