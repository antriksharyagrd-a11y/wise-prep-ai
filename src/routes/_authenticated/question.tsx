import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, Sparkles } from "lucide-react";
import { getTodayQuestion, saveAttempt, explainWithAI } from "@/lib/hirewise.functions";

export const Route = createFileRoute("/_authenticated/question")({
  head: () => ({ meta: [{ title: "Daily Question — HireWise" }, { name: "description", content: "Solve today's curated coding question with a full editor and AI-powered explanations." }] }),
  component: QuestionPage,
});

const LANGS = ["javascript", "typescript", "python"] as const;

function QuestionPage() {
  const fn = useServerFn(getTodayQuestion);
  const save = useServerFn(saveAttempt);
  const explain = useServerFn(explainWithAI);
  const { data: q } = useQuery({ queryKey: ["todayQuestion"], queryFn: () => fn() });
  const [lang, setLang] = useState<(typeof LANGS)[number]>("javascript");
  const [code, setCode] = useState("");
  const [expl, setExpl] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "save" | "explain">(null);

  useEffect(() => {
    if (q) {
      const starter = (q.starter_code as Record<string, string>)?.[lang] ?? `// write your ${lang} solution here`;
      setCode(starter);
    }
  }, [q, lang]);

  if (!q) return <div className="mx-auto max-w-7xl px-6"><div className="h-64 animate-pulse rounded-2xl bg-white/5" /></div>;

  async function markSolved() {
    if (!q) return;
    setBusy("save");
    try { await save({ data: { questionId: q.id, code, language: lang, solved: true } }); toast.success("Marked as solved. Streak updated."); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(null); }
  }
  async function askAI() {
    if (!q) return;
    setBusy("explain");
    try { const r = await explain({ data: { questionId: q.id, code, language: lang } }); setExpl(r.explanation); }
    catch (e) { toast.error(e instanceof Error ? e.message : "AI unavailable"); }
    finally { setBusy(null); }
  }

  const diffColor = q.difficulty === "Easy" ? "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20" : q.difficulty === "Medium" ? "text-amber-400 bg-amber-500/10 ring-amber-500/20" : "text-rose-400 bg-rose-500/10 ring-rose-500/20";

  return (
    <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-5 rounded-2xl border border-white/5 bg-white/5 p-6 glass">
        <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Today's Question</p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">{q.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${diffColor}`}>{q.difficulty}</span>
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold text-muted-foreground bg-white/5 ring-1 ring-white/10">{q.topic}</span>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">{q.description}</p>
        <div className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Examples</p>
          <div className="mt-2 space-y-2">
            {(q.examples as Array<{ input: string; output: string }>).map((ex, i) => (
              <div key={i} className="rounded-md bg-black/30 p-3 font-mono text-xs">
                <div><span className="text-muted-foreground">Input:</span> {ex.input}</div>
                <div><span className="text-muted-foreground">Output:</span> {ex.output}</div>
              </div>
            ))}
          </div>
        </div>
        {q.hints && q.hints.length > 0 && (
          <details className="mt-6 group">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">Hints ({q.hints.length})</summary>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {q.hints.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </details>
        )}
      </motion.div>

      <div className="lg:col-span-7 space-y-4">
        <div className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden glass">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
            <select value={lang} onChange={(e) => setLang(e.target.value as any)} className="bg-transparent text-sm font-mono outline-none">
              {LANGS.map((l) => <option key={l} value={l} className="bg-navy-900">{l}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={askAI} disabled={busy !== null} className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-secondary text-xs font-medium ring-1 ring-white/10 hover:bg-accent transition-colors disabled:opacity-60">
                <Sparkles className="size-3.5" /> {busy === "explain" ? "Thinking…" : "Explain with AI"}
              </button>
              <button onClick={markSolved} disabled={busy !== null} className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-primary text-xs font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors disabled:opacity-60">
                <CheckCircle2 className="size-3.5" /> {busy === "save" ? "Saving…" : "Mark solved"}
              </button>
            </div>
          </div>
          <Editor height="480px" language={lang} value={code} onChange={(v) => setCode(v ?? "")} theme="vs-dark" options={{ minimap: { enabled: false }, fontSize: 13, fontFamily: "JetBrains Mono, monospace" }} />
        </div>

        {expl && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-primary/20 bg-primary/5 p-6 glass">
            <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">AI explanation</p>
            <article className="mt-3 prose prose-invert prose-sm max-w-none prose-headings:font-medium prose-code:text-electric-glow prose-code:before:content-none prose-code:after:content-none prose-pre:bg-black/40">
              <ReactMarkdown>{expl}</ReactMarkdown>
            </article>
          </motion.div>
        )}
      </div>
    </div>
  );
}