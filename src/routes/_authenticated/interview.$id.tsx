import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Mic, MicOff, Send, Square, Award } from "lucide-react";
import { getInterview, replyInterview, finalizeInterview } from "@/lib/hirewise.functions";

export const Route = createFileRoute("/_authenticated/interview/$id")({
  head: () => ({ meta: [{ title: "Interview in progress — HireWise" }, { name: "description", content: "Live AI mock interview with real-time confidence scoring." }] }),
  component: InterviewRoom,
});

// Simple heuristic confidence: fewer fillers, longer answer, decisive tone -> higher.
const FILLERS = /\b(um+|uh+|like|you know|sort of|kind of|maybe|i guess|i think)\b/gi;
function confidenceFor(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words < 3) return 30;
  const fillers = (text.match(FILLERS) ?? []).length;
  const fillerRatio = fillers / Math.max(words, 1);
  const lengthScore = Math.min(words / 60, 1) * 40;
  const clarity = Math.max(0, 60 - fillerRatio * 300);
  return Math.round(Math.max(10, Math.min(100, lengthScore + clarity)));
}

function InterviewRoom() {
  const { id } = Route.useParams();
  const getIv = useServerFn(getInterview);
  const reply = useServerFn(replyInterview);
  const finalize = useServerFn(finalizeInterview);

  const { data: iv, refetch } = useQuery({ queryKey: ["interview", id], queryFn: () => getIv({ data: { id } }) });
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [liveConfidence, setLiveConfidence] = useState<number>(50);
  const [listening, setListening] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [iv?.transcript]);
  useEffect(() => { if (input.trim().length > 0) setLiveConfidence(confidenceFor(input)); }, [input]);

  function toggleMic() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Voice input not supported in this browser"); return; }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e: any) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setInput((prev) => (final ? prev + final + " " : prev + (interim ? "" : "")));
      if (interim) setLiveConfidence(confidenceFor(interim));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => { setListening(false); toast.error("Mic error"); };
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }

  async function send() {
    if (!input.trim() || sending) return;
    setSending(true);
    const c = confidenceFor(input);
    setConfidence(c);
    try {
      const r = await reply({ data: { interviewId: id, userMessage: input, confidence: c } });
      setInput("");
      await refetch();
      if (r.complete) toast.info("Interviewer has finished. Generate your report.");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Send failed"); }
    finally { setSending(false); }
  }

  async function end() {
    setFinalizing(true);
    try {
      const r = await finalize({ data: { interviewId: id } });
      setReport(r);
      toast.success(`Interview scored ${r.score}/10`);
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setFinalizing(false); }
  }

  const messages = ((iv?.transcript as Array<{ role: string; content: string; confidence?: number }>) ?? []).filter((m) => m.role !== "system");

  if (report) {
    return (
      <div className="mx-auto max-w-3xl px-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-primary/30 bg-white/5 p-8 glass shadow-glow">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-brand"><Award className="size-5 text-white" /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Report card</p>
              <h1 className="text-2xl font-medium">Score: {report.score}/10</h1>
            </div>
          </div>
          <p className="mt-5 text-sm text-foreground/90 leading-relaxed">{report.summary}</p>
          <Section title="Strengths" items={report.strengths} tone="emerald" />
          <Section title="Areas to improve" items={report.weaknesses} tone="amber" />
          <Section title="Suggested next steps" items={report.suggestions} tone="electric" />
          {report.confidenceAvg !== null && (
            <p className="mt-6 text-xs text-muted-foreground">Average confidence: <span className="text-foreground font-mono">{Math.round(report.confidenceAvg)}%</span></p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-3 rounded-2xl border border-white/5 bg-white/5 flex flex-col glass" style={{ height: "70vh" }}>
        <div className="border-b border-white/5 px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Live interview</p>
            <p className="text-sm font-medium">{iv?.role_domain}</p>
          </div>
          <button onClick={end} disabled={finalizing} className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-secondary text-xs font-medium ring-1 ring-white/10 hover:bg-accent disabled:opacity-60">
            <Square className="size-3.5" /> {finalizing ? "Scoring…" : "End & get report"}
          </button>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary ring-1 ring-white/10 rounded-bl-sm"}`}>
                  {m.content.replace("[INTERVIEW_COMPLETE]", "").trim()}
                  {typeof m.confidence === "number" && m.role === "user" && (
                    <div className="mt-1.5 text-[10px] opacity-70">Confidence · {m.confidence}%</div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="border-t border-white/5 p-3 space-y-2">
          <div className="flex items-end gap-2">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Type or speak your answer…" className="flex-1 h-20 resize-none rounded-md bg-input px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-primary outline-none" />
            <div className="flex flex-col gap-2">
              <button onClick={toggleMic} className={`h-10 w-10 inline-flex items-center justify-center rounded-md ring-1 transition-colors ${listening ? "bg-destructive text-white ring-destructive/60 animate-pulse" : "bg-secondary ring-white/10 hover:bg-accent"}`} title="Voice input">
                {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </button>
              <button onClick={send} disabled={sending || !input.trim()} className="h-10 w-10 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow disabled:opacity-60">
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfidenceMeter value={input.trim() ? liveConfidence : confidence ?? 0} />
    </div>
  );
}

function ConfidenceMeter({ value }: { value: number }) {
  const label = value >= 75 ? "Confident" : value >= 50 ? "Steady" : value >= 25 ? "Uncertain" : "Idle";
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 glass flex flex-col">
      <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Confidence Meter</p>
      <div className="mt-4 flex-1 flex flex-col items-center justify-center">
        <div className="relative size-32">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-none stroke-white/10" />
            <circle cx="50" cy="50" r="42" strokeWidth="8" strokeLinecap="round" className="fill-none stroke-[url(#g)]" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - value / 100)} style={{ transition: "stroke-dashoffset 0.3s ease" }} />
            <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3B82F6" /><stop offset="100%" stopColor="#60A5FA" /></linearGradient></defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-medium tabular-nums">{value}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground text-center leading-relaxed">Real-time signal from tone, filler words, and answer clarity.</p>
      </div>
    </div>
  );
}

function Section({ title, items, tone }: { title: string; items?: string[]; tone: "emerald" | "amber" | "electric" }) {
  if (!items || items.length === 0) return null;
  const dot = tone === "emerald" ? "bg-emerald-400" : tone === "amber" ? "bg-amber-400" : "bg-electric-glow";
  return (
    <div className="mt-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 text-sm"><span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${dot}`} />{it}</li>
        ))}
      </ul>
    </div>
  );
}