import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FileText, Upload, Clipboard, Droplets, Briefcase, CircleCheck as CheckCircle2, Circle as XCircle, Sparkles, Target, Percent } from "lucide-react";
import { analyzeResume } from "@/lib/hirewise.functions";

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

export const Route = createFileRoute("/_authenticated/resume")({
  head: () => ({
    meta: [
      { title: "ATS Resume Analyzer — HireWise" },
      { name: "description", content: "Upload your resume and paste a job description to get an ATS score and detailed analysis." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  const analyze = useServerFn(analyzeResume);
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
        roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node) &&
        roleInputRef.current && !roleInputRef.current.contains(e.target as Node)
      ) closeRoleDropdown();
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
    if (isValid) {
      setFile(f);
      setPastedText("");
      setInputMode("file");
    } else {
      toast.error("Please upload a PDF or DOCX file");
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) validateAndSetFile(e.dataTransfer.files[0]);
  }, [validateAndSetFile]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    let textToAnalyze = "";
    let fileName = "pasted-resume.txt";

    if (inputMode === "file" && file) {
      try {
        textToAnalyze = await extractText(file);
        fileName = file.name;
      } catch {
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
    if (!jobDescription.trim()) {
      toast.error("Please paste the job description");
      return;
    }

    setBusy(true);
    setResult(null);
    try {
      const r = await analyze({ data: { fileName, extractedText: textToAnalyze, targetRole, jobDescription } });
      setResult(r.feedback as Feedback);
      toast.success(`ATS score: ${(r.feedback as Feedback).ats_score}/100`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">ATS Resume Analyzer</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">Analyze your resume</h1>
        <p className="mt-2 text-sm text-muted-foreground">Upload your resume and paste the job description to get an ATS score and detailed feedback.</p>
      </motion.div>

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Resume input */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2"><FileText className="size-4 text-electric-glow" /> Your Resume</h2>
            <div className="inline-flex h-8 rounded-md bg-secondary p-0.5 ring-1 ring-white/10">
              <button type="button" onClick={() => { setInputMode("file"); setPastedText(""); }} className={`h-full px-3 rounded text-xs font-medium transition-colors ${inputMode === "file" ? "bg-input text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <Upload className="size-3.5 inline mr-1.5" /> Upload
              </button>
              <button type="button" onClick={() => { setInputMode("text"); setFile(null); }} className={`h-full px-3 rounded text-xs font-medium transition-colors ${inputMode === "text" ? "bg-input text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <Clipboard className="size-3.5 inline mr-1.5" /> Paste
              </button>
            </div>
          </div>
          <div className="mt-3 rounded-2xl border border-white/5 bg-white/5 p-6 glass">
            {inputMode === "file" ? (
              <div
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-12 text-sm transition-all ${isDragging ? "border-primary bg-primary/10" : "border-white/15 bg-input/50 hover:bg-input"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {isDragging ? (
                  <><Droplets className="size-8 text-primary animate-pulse" /><span className="text-primary font-medium">Drop resume here</span></>
                ) : file ? (
                  <><FileText className="size-6 text-primary" /><span className="font-medium">{file.name}</span><span className="text-xs text-muted-foreground">Click or drag to change</span></>
                ) : (
                  <><Upload className="size-6 text-muted-foreground" /><div className="text-center"><span className="font-medium">Drag & drop your resume</span><p className="text-xs text-muted-foreground mt-1">or click to browse (PDF or DOCX)</p></div></>
                )}
                <input ref={fileInputRef} type="file" accept=".pdf,.docx,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])} />
              </div>
            ) : (
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your resume text here..."
                className="w-full h-72 rounded-md bg-input px-4 py-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
              />
            )}
          </div>
        </motion.div>

        {/* Job description input */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2"><Briefcase className="size-4 text-electric-glow" /> Job Description</h2>
          </div>
          <div className="mt-3 rounded-2xl border border-white/5 bg-white/5 p-6 glass space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Target role</label>
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
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Job description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here. Include responsibilities, requirements, qualifications, and tech stack..."
                className="mt-2 w-full h-72 rounded-md bg-input px-4 py-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
              />
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 flex justify-center">
          <button
            type="submit"
            disabled={busy || (inputMode === "file" && !file) || (inputMode === "text" && !pastedText) || !jobDescription.trim()}
            className="h-11 inline-flex items-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors shadow-glow disabled:opacity-60"
          >
            {busy ? (
              <>Analyzing… <span className="inline-block size-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /></>
            ) : (
              <><Sparkles className="size-4" /> Analyze Resume</>
            )}
          </button>
        </div>
      </form>

      {result && <Results result={result} />}
    </div>
  );
}

function Results({ result }: { result: Feedback }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Score cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1 rounded-2xl border border-primary/20 bg-primary/5 p-6 glass shadow-glow flex flex-col items-center justify-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">ATS Score</p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-6xl font-semibold tabular-nums">{result.ats_score}</span>
            <span className="text-lg text-muted-foreground">/100</span>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-brand shadow-glow" style={{ width: `${result.ats_score}%` }} />
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass flex flex-col items-center justify-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow flex items-center gap-1.5"><Percent className="size-3.5" /> Match Percentage</p>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-6xl font-semibold tabular-nums">{result.match_percentage}</span>
            <span className="text-lg text-muted-foreground">%</span>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${result.match_percentage}%` }} />
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Summary</p>
          <p className="mt-3 text-sm text-foreground/90 leading-relaxed">{result.summary}</p>
        </div>
      </div>

      {/* Keywords */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="size-3.5" /> Matched Keywords</p>
          <p className="mt-2 text-xs text-muted-foreground">{result.matched_keywords.length} keywords found in both resume and job description</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {result.matched_keywords.map((k) => (
              <span key={k} className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-300 px-2.5 py-1 text-[11px] font-medium ring-1 ring-emerald-500/20">
                <CheckCircle2 className="size-3" /> {k}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
          <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5"><XCircle className="size-3.5" /> Missing Keywords</p>
          <p className="mt-2 text-xs text-muted-foreground">Add these to boost your score</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {result.missing_keywords.map((k) => (
              <span key={k} className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-300 px-2.5 py-1 text-[11px] font-medium ring-1 ring-rose-500/20">
                <XCircle className="size-3" /> {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="size-3.5" /> Skills Found</p>
          <p className="mt-2 text-xs text-muted-foreground">{result.skills_found.length} skills present in your resume</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {result.skills_found.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-300 px-2.5 py-1 text-[11px] font-medium ring-1 ring-emerald-500/20">
                <CheckCircle2 className="size-3" /> {s}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5"><Target className="size-3.5" /> Important Skills Missing</p>
          <p className="mt-2 text-xs text-muted-foreground">Consider adding these if you have them</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {result.skills_missing.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-300 px-2.5 py-1 text-[11px] font-medium ring-1 ring-amber-500/20">
                <Target className="size-3" /> {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ListPanel title="Resume Strengths" items={result.strengths} tone="emerald" />
        <ListPanel title="Areas for Improvement" items={result.improvements} tone="amber" />
      </div>

      {/* Section-wise feedback */}
      <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
        <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Section-wise Feedback</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionPanel title="Skills" body={result.section_feedback.skills} />
          <SectionPanel title="Experience" body={result.section_feedback.experience} />
          <SectionPanel title="Education" body={result.section_feedback.education} />
          <SectionPanel title="Projects" body={result.section_feedback.projects} />
          <SectionPanel title="Formatting" body={result.section_feedback.formatting} />
          <SectionPanel title="Contact Information" body={result.section_feedback.contact_info} />
        </div>
      </div>

      {/* Suggestions */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 glass">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><Sparkles className="size-4 text-electric-glow" /> Suggestions to Improve</h3>
        <ol className="space-y-2.5 text-sm">
          {result.suggestions.map((s, i) => (
            <li key={i} className="flex gap-2.5 text-muted-foreground leading-relaxed">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ring-1 ring-primary/30">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
}

function SectionPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <p className="mt-2 text-sm text-foreground/90 leading-relaxed">{body}</p>
    </div>
  );
}

function ListPanel({ title, items, tone }: { title: string; items: string[]; tone: "emerald" | "amber" }) {
  if (!items || items.length === 0) return null;
  const dot = tone === "emerald" ? "bg-emerald-400" : "bg-amber-400";
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => <li key={i} className="flex gap-2.5 text-sm"><span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${dot}`} />{it}</li>)}
      </ul>
    </div>
  );
}
