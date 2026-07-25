import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, FileText, LayoutGrid as Layout, PenTool, Sparkles, Upload, Clipboard, Droplets, CircleCheck as CheckCircle2, Download, User } from "lucide-react";
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
      { title: "HireWise — AI Resume & ATS Platform" },
      { name: "description", content: "AI resume analyzer, resume builder, job match checker, and personal dashboard. Get ATS scores, build professional resumes, match jobs, and save all your documents." },
      { property: "og:title", content: "HireWise — AI Resume & ATS Platform" },
      { property: "og:description", content: "Resume analyzer, builder, job match, and dashboard. Everything you need to land the job." },
    ],
  }),
  component: Landing,
});

function ResumeUploader() {
  const analyze = useServerFn(analyzeResumePublic);
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("Frontend Engineer");
  const [roleInput, setRoleInput] = useState("Frontend Engineer");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [roleHighlight, setRoleHighlight] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pastedText, setPastedText] = useState<string>("");
  const [inputMode, setInputMode] = useState<"file" | "text">("file");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const roleInputRef = useRef<HTMLInputElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const filteredRoles = roleInput.trim() === ""
    ? ALL_ROLES
    : ALL_ROLES.filter((r) => r.toLowerCase().includes(roleInput.toLowerCase()));

  function closeRoleDropdown() {
    setRoleDropdownOpen(false);
    setRoleHighlight(-1);
  }

  function selectRole(role: string) {
    setRoleInput(role);
    setTargetRole(role);
    closeRoleDropdown();
    roleInputRef.current?.blur();
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        roleDropdownRef.current &&
        !roleDropdownRef.current.contains(e.target as Node) &&
        roleInputRef.current &&
        !roleInputRef.current.contains(e.target as Node)
      ) {
        closeRoleDropdown();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!roleDropdownOpen) setRoleHighlight(-1);
  }, [roleDropdownOpen]);

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
    const isValid = validTypes.some(type => 
      f.name.toLowerCase().endsWith(type) || f.type === type
    );
    
    if (isValid) {
      setFile(f);
      setPastedText("");
      setInputMode("file");
    } else {
      toast.error("Please upload a PDF or DOCX file");
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, [validateAndSetFile]);

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    e.preventDefault();
    
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      validateAndSetFile(e.clipboardData.files[0]);
      return;
    }
    
    const text = e.clipboardData.getData("text/plain");
    if (text && text.trim().length > 0) {
      setPastedText(text);
      setFile(null);
      setInputMode("text");
      toast.success("Text pasted successfully");
    }
  }, [validateAndSetFile]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    
    let textToAnalyze = "";
    let fileName = "pasted-resume.txt";
    
    if (inputMode === "file" && file) {
      try {
        textToAnalyze = await extractText(file);
        fileName = file.name;
      } catch (err) {
        toast.error("Failed to extract text from file");
        return;
      }
    } else if (inputMode === "text" && pastedText) {
      textToAnalyze = pastedText;
    } else {
      toast.error("Please upload a file or paste resume text");
      return;
    }
    
    if (textToAnalyze.trim().length < 40) {
      toast.error("Please provide more resume content (at least 40 characters)");
      return;
    }
    
    setBusy(true);
    try {
      const r = await analyze({ data: { fileName, extractedText: textToAnalyze, targetRole } });
      setResult(r.feedback);
      toast.success(`ATS score: ${r.feedback.ats_score}/100`);
    } catch (err) { 
      toast.error(err instanceof Error ? err.message : "Analysis failed"); 
    } finally { 
      setBusy(false); 
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6" onPaste={handlePaste}>
      <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="rounded-2xl border border-white/5 bg-white/5 p-8 glass">
        <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-brand shadow-glow"><FileText className="size-5 text-white" /></div>
        <h1 className="mt-5 text-2xl font-medium tracking-tight">Try Resume Analysis — Free</h1>
        <p className="mt-2 text-sm text-muted-foreground">PDF, DOCX, or paste text directly. No signup required for a quick preview.</p>

        <label className="mt-6 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Target role</label>
        <div className="mt-2 relative">
          <input
            ref={roleInputRef}
            type="text"
            value={roleInput}
            onChange={(e) => {
              setRoleInput(e.target.value);
              setTargetRole(e.target.value);
            }}
            onFocus={() => setRoleDropdownOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setRoleDropdownOpen(true);
                setRoleHighlight((h) => Math.min(h + 1, filteredRoles.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setRoleHighlight((h) => Math.max(h - 1, 0));
              } else if (e.key === "Enter") {
                if (roleDropdownOpen && roleHighlight >= 0 && filteredRoles[roleHighlight]) {
                  e.preventDefault();
                  selectRole(filteredRoles[roleHighlight]);
                } else {
                  closeRoleDropdown();
                }
              } else if (e.key === "Escape") {
                closeRoleDropdown();
              }
            }}
            placeholder="Type or select a target role..."
            className="w-full h-10 rounded-md bg-input px-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none pr-8"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4" /></svg>
          </div>
          {roleDropdownOpen && (
            <div
              ref={roleDropdownRef}
              className="absolute z-50 mt-1 w-full max-h-72 overflow-y-auto rounded-md bg-[#1a1a2e] border border-white/10 shadow-xl ring-1 ring-black/5"
            >
              {filteredRoles.length === 0 ? (
                <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                  No matches. Using custom role: "{roleInput}"
                </div>
              ) : (
                TARGET_ROLES.map((group) => {
                  const groupRoles = group.roles.filter((r) =>
                    roleInput.trim() === "" ? true : r.toLowerCase().includes(roleInput.toLowerCase())
                  );
                  if (groupRoles.length === 0) return null;
                  return (
                    <div key={group.group}>
                      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-electric-glow/80 bg-white/[0.02] border-b border-white/5">
                        {group.group}
                      </div>
                      {groupRoles.map((role) => {
                        const flatIndex = filteredRoles.indexOf(role);
                        return (
                          <div
                            key={role}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectRole(role);
                            }}
                            onMouseEnter={() => setRoleHighlight(flatIndex)}
                            className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                              flatIndex === roleHighlight
                                ? "bg-primary/20 text-foreground"
                                : "text-foreground/90 hover:bg-white/5"
                            }`}
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

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => { setInputMode("file"); setPastedText(""); }}
            className={`flex-1 h-9 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              inputMode === "file" 
                ? "bg-primary text-primary-foreground" 
                : "bg-input/50 text-muted-foreground hover:bg-input"
            }`}
          >
            <Upload className="size-4" />
            File
          </button>
          <button
            type="button"
            onClick={() => { setInputMode("text"); setFile(null); }}
            className={`flex-1 h-9 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              inputMode === "text" 
                ? "bg-primary text-primary-foreground" 
                : "bg-input/50 text-muted-foreground hover:bg-input"
            }`}
          >
            <Clipboard className="size-4" />
            Paste Text
          </button>
        </div>

        {inputMode === "file" ? (
          <div 
            className={`mt-2 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed px-4 py-10 text-sm transition-all ${
              isDragging 
                ? "border-primary bg-primary/10" 
                : "border-white/15 bg-input/50 hover:bg-input"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {isDragging ? (
              <>
                <Droplets className="size-8 text-primary animate-pulse" />
                <span className="text-primary font-medium">Drop resume here</span>
              </>
            ) : file ? (
              <>
                <FileText className="size-6 text-primary" />
                <span className="font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">Click or drag to change</span>
              </>
            ) : (
              <>
                <Upload className="size-6 text-muted-foreground" />
                <div className="text-center">
                  <span className="font-medium">Drag & drop your resume</span>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse (PDF or DOCX)</p>
                </div>
              </>
            )}
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf,.docx,application/pdf" 
              className="hidden" 
              onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])} 
            />
          </div>
        ) : (
          <div className="mt-2">
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full h-64 rounded-md bg-input px-4 py-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">Tip: You can also press Ctrl/Cmd+V anywhere in this box to paste</p>
          </div>
        )}

        <button 
          disabled={busy || (inputMode === "file" && !file) || (inputMode === "text" && !pastedText)} 
          className="mt-6 w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors disabled:opacity-60"
        >
          {busy ? "Analyzing…" : "Analyze resume"}
        </button>
        <p className="mt-4 text-xs text-center text-muted-foreground">
          Want to save your results? <Link to="/auth" className="text-electric-glow hover:underline">Create an account</Link>
        </p>
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
        <circle cx="50" cy="50" r="42" strokeWidth="8" strokeLinecap="round" stroke="url(#gr-landing)" className="fill-none" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
        <defs><linearGradient id="gr-landing" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3B82F6" /><stop offset="100%" stopColor="#60A5FA" /></linearGradient></defs>
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

function Landing() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 glass">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <HireWiseLogo />
          <div className="hidden gap-8 sm:flex">
            <Link to="/resume-builder" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Resume Builder</Link>
            <Link to="/job-match" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Job Match</Link>
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
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
            <span className="text-[10px] font-bold tracking-widest text-electric-glow uppercase">ATS Optimized</span>
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
          className="max-w-[22ch] text-balance text-4xl font-medium tracking-tight sm:text-6xl lg:text-7xl leading-tight"
        >
          AI resumes that pass the <span className="text-gradient-brand">ATS gatekeepers</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-[58ch] text-pretty text-lg text-muted-foreground"
        >
          Analyze, build, and match professional resumes with one platform. ATS scores, recruiter templates, and job-fit recommendations powered by precision AI.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <Link to="/auth" className="h-11 inline-flex items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors">
            Get started free <ArrowRight className="size-4" />
          </Link>
          <a href="#resume-check" className="h-11 inline-flex items-center rounded-md bg-secondary px-6 text-sm font-medium ring-1 ring-white/10 hover:bg-accent transition-colors">
            Check my resume
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-16 grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-4">
          {[
            ["ATS Score", "Instant"],
            ["Templates", "5 designs"],
            ["Job Match", "% match"],
            ["PDF Export", "One click"],
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
                  { label: "Saved Resumes", value: "4", sub: "docs", bar: 80 },
                  { label: "Analyses", value: "18", sub: "total", bar: 65 },
                  { label: "Avg ATS", value: "82", sub: "/ 100", bar: 82 },
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
                  <h3 className="text-sm font-medium flex items-center gap-2"><FileText className="size-4 text-electric-glow" /> Saved Resumes</h3>
                  <div className="flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="h-2 w-2 rounded-full bg-white/10" />
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    ["Alex_Chen_Software_Engineer.pdf", "Modern Clean", "Full Stack Developer", 82],
                    ["Resume_Product_Designer.pdf", "Creative Bold", "UI/UX Designer", 76],
                    ["Backend_Engineer_CV.pdf", "Classic Professional", "Node.js Developer", 88],
                  ].map(([name, tmpl, role, score]) => (
                    <div key={name as string} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 bg-white/[0.02]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20"><FileText className="size-4" /></div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{name}</p>
                          <p className="text-[11px] text-muted-foreground">{tmpl} · {role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ${
                          score as number >= 80 ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" :
                          (score as number >= 60 ? "bg-amber-500/10 text-amber-400 ring-amber-500/20" : "bg-rose-500/10 text-rose-400 ring-rose-500/20")
                        }`}>ATS {score}</span>
                        <Download className="size-3.5 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6 lg:col-span-4">
              <div className="rounded-xl border border-white/5 bg-white/5 p-6">
                <h3 className="mb-4 text-sm font-medium">Quick actions</h3>
                <div className="space-y-3">
                  <Link to="/resume" className="flex items-center justify-between rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40">
                    <span className="flex items-center gap-2"><Sparkles className="size-4" /> Analyze Resume</span>
                    <ArrowRight className="size-3.5 opacity-70" />
                  </Link>
                  <Link to="/resume-builder" className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm font-medium ring-1 ring-white/10 hover:bg-accent transition-colors">
                    <span className="flex items-center gap-2"><PenTool className="size-4" /> Build New Resume</span>
                    <ArrowRight className="size-3.5 opacity-70" />
                  </Link>
                  <Link to="/job-match" className="flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm font-medium ring-1 ring-white/10 hover:bg-accent transition-colors">
                    <span className="flex items-center gap-2"><Briefcase className="size-4" /> Check Job Match</span>
                    <ArrowRight className="size-3.5 opacity-70" />
                  </Link>
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/5 p-6">
                <h3 className="mb-4 text-sm font-medium">Templates Used</h3>
                <div className="space-y-3">
                  {[
                    ["Modern Clean", "from-cyan-400 to-blue-500", "12 edits"],
                    ["Classic Professional", "from-blue-500 to-indigo-500", "5 edits"],
                    ["Creative Bold", "from-fuchsia-500 to-pink-500", "2 edits"],
                  ].map(([name, c, usage]) => (
                    <div key={name as string} className="flex items-center gap-3">
                      <div className={`w-8 h-10 rounded bg-gradient-to-br ${c} ring-1 ring-white/10 shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{name}</p>
                        <p className="text-[10px] text-muted-foreground">{usage}</p>
                      </div>
                      <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                    </div>
                  ))}
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
          <h2 className="mt-3 text-3xl sm:text-4xl font-medium tracking-tight">Four pillars. One mission.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { icon: Sparkles, title: "AI Resume Analyzer", body: "Upload your resume and receive an ATS compatibility score, keyword analysis, and actionable suggestions.", to: "#resume-check", highlight: true },
            { icon: PenTool, title: "Resume Builder", body: "Build professional resumes using clean, recruiter-friendly templates. Download polished PDFs in seconds.", to: "/resume-builder" },
            { icon: Briefcase, title: "Job Match Checker", body: "Compare your resume with any job description and receive a match percentage with missing skills.", to: "/job-match" },
            { icon: Layout, title: "Personal Dashboard", body: "Securely save resumes, view previous analyses, and download your documents anytime.", to: "/dashboard" },
          ].map((f) => (
            <Link key={f.title} to={f.to as any} className={`rounded-xl border p-6 transition-all group ${
              f.highlight
                ? "border-primary/30 bg-primary/5 hover:bg-primary/10 ring-1 ring-primary/20 shadow-glow"
                : "border-white/5 bg-white/5 hover:bg-white/10"
            }`}>
              <div className={`flex size-9 items-center justify-center rounded-lg ring-1 ${
                f.highlight
                  ? "bg-gradient-brand text-white ring-primary/40 shadow-glow"
                  : "bg-primary/15 text-electric-glow ring-primary/20"
              }`}>
                <f.icon className="size-4" />
              </div>
              <h3 className="mt-4 text-sm font-semibold flex items-center gap-1.5">
                {f.title}
                <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing anchor */}
      <section id="pricing" className="mx-auto max-w-4xl px-6 pb-24">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-white/5 to-transparent p-8 md:p-12 text-center glass">
          <p className="text-[10px] font-bold tracking-widest text-electric-glow uppercase">Pricing</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-medium tracking-tight">Start free. Upgrade when you're ready.</h2>
          <p className="mt-4 max-w-2xl mx-auto text-sm text-muted-foreground">All plans include resume analysis. Paid plans unlock unlimited builders, job matches, and cloud storage.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/auth" className="h-11 inline-flex items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors">
              Create free account <ArrowRight className="size-4" />
            </Link>
            <Link to="/auth" className="h-11 inline-flex items-center rounded-md bg-secondary px-6 text-sm font-medium ring-1 ring-white/10 hover:bg-accent transition-colors">
              View pricing
            </Link>
          </div>
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
