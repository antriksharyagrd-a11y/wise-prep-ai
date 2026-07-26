import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Sparkles, Upload, Clipboard, Droplets, Briefcase } from "lucide-react";
import { HireWiseLogo } from "@/components/HireWiseLogo";
import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { analyzeResumePublic } from "@/lib/hirewise.functions";

const TARGET_ROLES = [
  { group: "Development", roles: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Engineer", "Software Developer", "Web Developer"] },
  { group: "Specialized", roles: ["React Developer", "Node.js Developer", "Java Developer", "Python Developer"] },
  { group: "Infrastructure & Cloud", roles: ["DevOps Engineer", "Cloud Engineer"] },
  { group: "Data & Analytics", roles: ["Data Analyst", "Business Analyst", "Data Scientist"] },
  { group: "AI & Machine Learning", roles: ["Machine Learning Engineer", "AI Engineer"] },
  { group: "Security & QA", roles: ["Cybersecurity Analyst", "QA Engineer"] },
  { group: "Design", roles: ["UI/UX Designer"] },
];
const ALL_ROLES = TARGET_ROLES.flatMap((g) => g.roles);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HireWise — ATS Resume Analyzer" },
      { name: "description", content: "Upload your resume and paste a job description to get an instant ATS score, keyword match, and detailed improvement suggestions." },
      { property: "og:title", content: "HireWise — ATS Resume Analyzer" },
      { property: "og:description", content: "Get your ATS score and detailed resume analysis in seconds." },
    ],
  }),
  component: Landing,
});

type Feedback = {
  ats_score: number;
  match_percentage: number;
  matched_keywords: string[];
  missing_keywords: string[];
  skills_found: string[];
  skills_missing: string[];
  strengths: string[];
  improvements: string[];
  summary: string;
  section_feedback: {
    skills: string;
    experience: string;
    education: string;
    projects: string;
    formatting: string;
    contact_info: string;
  };
  suggestions: string[];
};

function ResumeUploader() {
  const analyze = useServerFn(analyzeResumePublic);
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("Frontend Developer");
  const [roleInput, setRoleInput] = useState("Frontend Developer");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [roleHighlight, setRoleHighlight] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Feedback | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [inputMode, setInputMode] = useState<"file" | "text">("file");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const roleInputRef = useRef<HTMLInputElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const filteredRoles = roleInput.trim() === ""
    ? ALL_ROLES
    : ALL_ROLES.filter((r) => r.toLowerCase().includes(roleInput.toLowerCase()));

  function closeRoleDropdown() { setRoleDropdownOpen(false); setRoleHighlight(-1); }
  function selectRole(role: string) { setRoleInput(role); setTargetRole(role); closeRoleDropdown(); roleInputRef.current?.blur(); }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node) && roleInputRef.current && !roleInputRef.current.contains(e.target as Node)) closeRoleDropdown();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);
  useEffect(() => { if (!roleDropdownOpen) setRoleHighlight(-1); }, [roleDropdownOpen]);

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

  const validateAndSetFile = useCallback((f: File) => {
    const validTypes = [".pdf", ".docx", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const isValid = validTypes.some(type => f.name.toLowerCase().endsWith(type) || f.type === type);
    if (isValid) { setFile(f); setPastedText(""); setInputMode("file"); }
    else toast.error("Please upload a PDF or DOCX file");
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) validateAndSetFile(e.dataTransfer.files[0]);
  }, [validateAndSetFile]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    let textToAnalyze = "";
    let fileName = "pasted-resume.txt";
    if (inputMode === "file" && file) {
      try { textToAnalyze = await extractText(file); fileName = file.name; }
      catch { toast.error("Failed to extract text from file"); return; }
    } else if (inputMode === "text" && pastedText) {
      textToAnalyze = pastedText;
    } else { toast.error("Please upload a file or paste resume text"); return; }
    if (textToAnalyze.trim().length < 40) { toast.error("Please provide more resume content (at least 40 characters)"); return; }
    if (!jobDescription.trim()) { toast.error("Please paste the job description"); return; }

    setBusy(true); setResult(null);
    try {
      const r = await analyze({ data: { fileName, extractedText: textToAnalyze, targetRole, jobDescription } });
      setResult(r.feedback as Feedback);
      toast.success(`ATS score: ${(r.feedback as Feedback).ats_score}/100`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="rounded-2xl border border-white/5 bg-white/5 p-8 glass">
        <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-brand shadow-glow"><FileText className="size-5 text-white" /></div>
        <h1 className="mt-5 text-2xl font-medium tracking-tight">Try Resume Analysis — Free</h1>
        <p className="mt-2 text-sm text-muted-foreground">Upload your resume and paste a job description. No signup required for a quick preview.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Resume input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Your Resume</label>
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={() => { setInputMode("file"); setPastedText(""); }} className={`flex-1 h-9 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${inputMode === "file" ? "bg-primary text-primary-foreground" : "bg-input/50 text-muted-foreground hover:bg-input"}`}>
                <Upload className="size-3.5" /> File
              </button>
              <button type="button" onClick={() => { setInputMode("text"); setFile(null); }} className={`flex-1 h-9 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${inputMode === "text" ? "bg-primary text-primary-foreground" : "bg-input/50 text-muted-foreground hover:bg-input"}`}>
                <Clipboard className="size-3.5" /> Paste
              </button>
            </div>
            {inputMode === "file" ? (
              <div
                className={`mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-8 text-sm transition-all ${isDragging ? "border-primary bg-primary/10" : "border-white/15 bg-input/50 hover:bg-input"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {isDragging ? (
                  <><Droplets className="size-6 text-primary animate-pulse" /><span className="text-primary font-medium">Drop here</span></>
                ) : file ? (
                  <><FileText className="size-5 text-primary" /><span className="font-medium text-xs">{file.name}</span></>
                ) : (
                  <><Upload className="size-5 text-muted-foreground" /><span className="font-medium text-xs">Drag & drop or click</span><p className="text-[10px] text-muted-foreground">PDF or DOCX</p></>
                )}
                <input ref={fileInputRef} type="file" accept=".pdf,.docx,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])} />
              </div>
            ) : (
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste resume text..."
                className="mt-2 w-full h-40 rounded-md bg-input px-3 py-2 text-xs ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
              />
            )}
          </div>

          {/* Job description */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here. Include responsibilities, requirements, qualifications, and tech stack..."
              className="mt-2 w-full h-[calc(100%-1.5rem)] min-h-[160px] rounded-md bg-input px-3 py-2 text-xs ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
            />
          </div>
        </div>

        {/* Target role */}
        <label className="mt-4 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Target role</label>
        <div className="mt-2 relative">
          <input
            ref={roleInputRef}
            type="text"
            value={roleInput}
            onChange={(e) => { setRoleInput(e.target.value); setTargetRole(e.target.value); }}
            onFocus={() => setRoleDropdownOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setRoleDropdownOpen(true); setRoleHighlight((h) => Math.min(h + 1, filteredRoles.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setRoleHighlight((h) => Math.max(h - 1, 0)); }
              else if (e.key === "Enter") {
                if (roleDropdownOpen && roleHighlight >= 0 && filteredRoles[roleHighlight]) { e.preventDefault(); selectRole(filteredRoles[roleHighlight]); }
                else closeRoleDropdown();
              } else if (e.key === "Escape") closeRoleDropdown();
            }}
            placeholder="Type or select a target role..."
            className="w-full h-10 rounded-md bg-input px-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none pr-8"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4" /></svg>
          </div>
          {roleDropdownOpen && (
            <div ref={roleDropdownRef} className="absolute z-50 mt-1 w-full max-h-72 overflow-y-auto rounded-md bg-[#1a1a2e] border border-white/10 shadow-xl ring-1 ring-black/5">
              {filteredRoles.length === 0 ? (
                <div className="px-3 py-4 text-sm text-muted-foreground text-center">No matches. Using custom role: "{roleInput}"</div>
              ) : (
                TARGET_ROLES.map((group) => {
                  const groupRoles = group.roles.filter((r) => roleInput.trim() === "" ? true : r.toLowerCase().includes(roleInput.toLowerCase()));
                  if (groupRoles.length === 0) return null;
                  return (
                    <div key={group.group}>
                      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-electric-glow/80 bg-white/[0.02] border-b border-white/5">{group.group}</div>
                      {groupRoles.map((role) => {
                        const flatIndex = filteredRoles.indexOf(role);
                        return (
                          <div
                            key={role}
                            onMouseDown={(e) => { e.preventDefault(); selectRole(role); }}
                            onMouseEnter={() => setRoleHighlight(flatIndex)}
                            className={`px-3 py-2 text-sm cursor-pointer transition-colors ${flatIndex === roleHighlight ? "bg-primary/20 text-foreground" : "text-foreground/90 hover:bg-white/5"}`}
                          >
                            {role}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <button
          disabled={busy || (inputMode === "file" && !file) || (inputMode === "text" && !pastedText) || !jobDescription.trim()}
          className="mt-6 w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors disabled:opacity-60"
        >
          {busy ? "Analyzing…" : "Check ATS Score"}
        </button>
        <p className="mt-4 text-xs text-center text-muted-foreground">
          Want to save your results? <Link to="/auth" className="text-electric-glow hover:underline">Create an account</Link>
        </p>
      </motion.form>

      {result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-primary/20 bg-white/5 p-8 glass space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10 flex items-center gap-4">
              <ScoreGauge value={result.ats_score} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">ATS Score</p>
                <p className="text-3xl font-medium">{result.ats_score}<span className="text-lg text-muted-foreground">/100</span></p>
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10 flex items-center gap-4">
              <ScoreGauge value={result.match_percentage} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Match</p>
                <p className="text-3xl font-medium">{result.match_percentage}<span className="text-lg text-muted-foreground">%</span></p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{result.summary}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KeywordList title="Matched Keywords" items={result.matched_keywords} tone="emerald" />
            <KeywordList title="Missing Keywords" items={result.missing_keywords} tone="rose" />
            <KeywordList title="Skills Found" items={result.skills_found} tone="emerald" />
            <KeywordList title="Skills Missing" items={result.skills_missing} tone="amber" />
            <ListPanel title="Strengths" items={result.strengths} tone="emerald" />
            <ListPanel title="Improvements" items={result.improvements} tone="amber" />
          </div>
          <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Suggestions</p>
            <ol className="mt-3 space-y-2 text-sm">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-muted-foreground leading-relaxed">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ring-1 ring-primary/30">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ScoreGauge({ value }: { value: number }) {
  const c = 2 * Math.PI * 42;
  return (
    <div className="relative size-20 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-none stroke-white/10" />
        <circle cx="50" cy="50" r="42" strokeWidth="8" strokeLinecap="round" stroke="url(#gr-landing)" className="fill-none" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
        <defs><linearGradient id="gr-landing" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3B82F6" /><stop offset="100%" stopColor="#60A5FA" /></linearGradient></defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-sm font-medium">{value}</div>
    </div>
  );
}

function KeywordList({ title, items, tone }: { title: string; items: string[]; tone: "emerald" | "rose" | "amber" }) {
  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
    rose: "bg-rose-500/10 text-rose-300 ring-rose-500/20",
    amber: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
  };
  return (
    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.map((k) => (
          <span key={k} className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${colors[tone]}`}>{k}</span>
        ))}
      </div>
    </div>
  );
}

function ListPanel({ title, items, tone }: { title: string; items: string[]; tone: "emerald" | "amber" }) {
  if (!items || items.length === 0) return null;
  const dot = tone === "emerald" ? "bg-emerald-400" : "bg-amber-400";
  return (
    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((it, i) => <li key={i} className="flex gap-2.5 text-sm"><span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${dot}`} />{it}</li>)}
      </ul>
    </div>
  );
}

function Landing() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 glass">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <HireWiseLogo />
          <div className="hidden gap-8 sm:flex">
            <a href="#resume-check" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">ATS Analyzer</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How it works</a>
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
            <span className="text-[10px] font-bold tracking-widest text-electric-glow uppercase">ATS Optimized</span>
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
          className="max-w-[22ch] text-balance text-4xl font-medium tracking-tight sm:text-6xl lg:text-7xl leading-tight"
        >
          Check if your resume passes the <span className="text-gradient-brand">ATS gatekeepers</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-[58ch] text-pretty text-lg text-muted-foreground"
        >
          Upload your resume, paste the job description, and get an instant ATS score with keyword match, skills analysis, and clear suggestions to improve.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <a href="#resume-check" className="h-11 inline-flex items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors">
            Check my resume <ArrowRight className="size-4" />
          </a>
          <Link to="/auth" className="h-11 inline-flex items-center rounded-md bg-secondary px-6 text-sm font-medium ring-1 ring-white/10 hover:bg-accent transition-colors">
            Sign in
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-16 grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-4">
          {[
            ["ATS Score", "Instant"],
            ["Keyword Match", "% match"],
            ["Skills Analysis", "Found & missing"],
            ["Suggestions", "Actionable"],
          ].map(([k, v]) => (
            <div key={k} className="text-center">
              <p className="text-2xl font-medium">{v}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{k}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Resume Upload Section */}
      <section id="resume-check" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-12 text-center">
          <p className="text-[10px] font-bold tracking-widest text-electric-glow uppercase">Free Tool</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-medium tracking-tight">Upload your resume — see your score</h2>
        </div>
        <ResumeUploader />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 pb-32">
        <div className="mb-12 text-center">
          <p className="text-[10px] font-bold tracking-widest text-electric-glow uppercase">How it works</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-medium tracking-tight">Three steps to a stronger resume</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: FileText, title: "Upload your resume", body: "Drag & drop a PDF or DOCX, or paste your resume text directly." },
            { icon: Briefcase, title: "Paste the job description", body: "Add the full job description so we can match keywords and skills." },
            { icon: Sparkles, title: "Get your ATS score", body: "Receive an instant score, keyword match, skills analysis, and suggestions." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-white/5 bg-white/5 p-6"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-electric-glow ring-1 ring-primary/20">
                <f.icon className="size-4" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </motion.div>
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
