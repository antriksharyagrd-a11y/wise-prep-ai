import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FileText, Upload } from "lucide-react";
import { analyzeResume } from "@/lib/hirewise.functions";

export const Route = createFileRoute("/_authenticated/resume")({
  head: () => ({ meta: [{ title: "Resume — HireWise" }, { name: "description", content: "Upload a PDF or DOCX resume and get AI-powered ATS feedback." }] }),
  component: ResumePage,
});

function ResumePage() {
  const analyze = useServerFn(analyzeResume);
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("Frontend Engineer");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function extractText(f: File): Promise<string> {
    const buf = new Uint8Array(await f.arrayBuffer());
    if (f.name.toLowerCase().endsWith(".pdf") || f.type === "application/pdf") {
      const { extractText: extract, getDocumentProxy } = await import("unpdf");
      const doc = await getDocumentProxy(buf);
      const { text } = await extract(doc, { mergePages: true });
      return Array.isArray(text) ? text.join("\n") : text;
    }
    if (f.name.toLowerCase().endsWith(".docx")) {
      const mammoth = (await import("mammoth")).default ?? (await import("mammoth"));
      const r = await (mammoth as any).extractRawText({ arrayBuffer: buf.buffer });
      return r.value;
    }
    return new TextDecoder().decode(buf);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { toast.error("Select a file"); return; }
    setBusy(true);
    try {
      const text = await extractText(file);
      if (text.trim().length < 40) throw new Error("Could not extract enough text from the file");
      const r = await analyze({ data: { fileName: file.name, extractedText: text, targetRole } });
      setResult(r.feedback);
      toast.success(`ATS score: ${r.feedback.ats_score}/100`);
    } catch (err) { toast.error(err instanceof Error ? err.message : "Analysis failed"); }
    finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 space-y-6">
      <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="rounded-2xl border border-white/5 bg-white/5 p-8 glass">
        <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-brand shadow-glow"><FileText className="size-5 text-white" /></div>
        <h1 className="mt-5 text-2xl font-medium tracking-tight">Resume analysis</h1>
        <p className="mt-2 text-sm text-muted-foreground">PDF or DOCX. Text is parsed in your browser, then evaluated by AI for a target role.</p>

        <label className="mt-6 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Target role</label>
        <input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="mt-2 w-full h-10 rounded-md bg-input px-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none" />

        <label className="mt-4 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">File</label>
        <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-white/15 bg-input/50 px-4 py-8 text-sm text-muted-foreground hover:bg-input transition-colors">
          <Upload className="size-4" />
          <span>{file ? file.name : "Click to select a PDF or DOCX"}</span>
          <input type="file" accept=".pdf,.docx,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>

        <button disabled={busy || !file} className="mt-6 w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors disabled:opacity-60">
          {busy ? "Analyzing…" : "Analyze resume"}
        </button>
      </motion.form>

      {result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-primary/20 bg-white/5 p-8 glass">
          <div className="flex items-center gap-6">
            <ScoreGauge value={result.ats_score} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">ATS Score</p>
              <p className="text-3xl font-medium">{result.ats_score}<span className="text-lg text-muted-foreground">/100</span></p>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg">{result.summary}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Panel title="Formatting" body={result.formatting} />
            <Panel title="Keyword match" body={result.keyword_match} />
            <ListPanel title="Strengths" items={result.strengths} tone="emerald" />
            <ListPanel title="Improvements" items={result.improvements} tone="amber" />
            <ListPanel title="Missing sections" items={result.missing_sections} tone="electric" />
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ScoreGauge({ value }: { value: number }) {
  const c = 2 * Math.PI * 42;
  return (
    <div className="relative size-24 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-none stroke-white/10" />
        <circle cx="50" cy="50" r="42" strokeWidth="8" strokeLinecap="round" stroke="url(#gr)" className="fill-none" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
        <defs><linearGradient id="gr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3B82F6" /><stop offset="100%" stopColor="#60A5FA" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-sm font-medium">{value}</div>
    </div>
  );
}
function Panel({ title, body }: { title: string; body?: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{body}</p>
    </div>
  );
}
function ListPanel({ title, items, tone }: { title: string; items?: string[]; tone: "emerald" | "amber" | "electric" }) {
  if (!items || items.length === 0) return null;
  const dot = tone === "emerald" ? "bg-emerald-400" : tone === "amber" ? "bg-amber-400" : "bg-electric-glow";
  return (
    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((it, i) => <li key={i} className="flex gap-2.5 text-sm"><span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${dot}`} />{it}</li>)}
      </ul>
    </div>
  );
}