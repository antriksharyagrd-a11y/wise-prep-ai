import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Briefcase,
  CheckCircle2,
  Clipboard,
  Droplets,
  FileText,
  Percent,
  Upload,
  XCircle,
  Target,
  Sparkles,
  ChevronRight,
} from "lucide-react";

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

export const Route = createFileRoute("/_authenticated/job-match")({
  head: () => ({
    meta: [
      { title: "Job Match Checker — HireWise" },
      { name: "description", content: "Compare your resume against any job description and get a match percentage." },
    ],
  }),
  component: JobMatchPage,
});

function JobMatchPage() {
  const [resumeMode, setResumeMode] = useState<"file" | "text">("text");
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [roleHighlight, setRoleHighlight] = useState(-1);
  const roleInputRef = useRef<HTMLInputElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<null | {
    score: number;
    matched: string[];
    missing: string[];
    suggestions: string[];
    keywordMatch: number;
  }>(null);

  const filteredRoles = roleInput.trim() === ""
    ? ALL_ROLES
    : ALL_ROLES.filter((r) => r.toLowerCase().includes(roleInput.toLowerCase()));

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  function handleFile(f: File) {
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    setFile(f);
  }

  async function handleAnalyze() {
    const hasResume = resumeMode === "file" ? file : resumeText.trim();
    if (!hasResume) {
      toast.error("Please upload or paste your resume");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please paste the job description");
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      const matched = [
        "React", "TypeScript", "Node.js", "REST APIs", "Git", "Agile", "Problem Solving", "Communication",
      ];
      const missing = [
        "AWS", "Kubernetes", "Docker", "CI/CD Pipelines", "System Design", "Microservices", "PostgreSQL",
      ];
      const suggestions = [
        "Add AWS or cloud experience — mentioned 4 times in JD.",
        "Include Kubernetes/Docker containerization experience.",
        "Show impact with numbers: % improvements, users served, revenue.",
        "Add a 'System Design' bullet or section if relevant.",
        "Mention CI/CD tooling: GitHub Actions, Jenkins, etc.",
      ];
      setResult({
        score: 74,
        matched,
        missing,
        suggestions,
        keywordMatch: 68,
      });
      toast.success("Match analysis complete!");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Job Match Checker</p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">See how well you fit the role</h1>
        <p className="mt-2 text-sm text-muted-foreground">Upload your resume, paste the job description, and get a personalized match report with missing skills.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2"><FileText className="size-4 text-electric-glow" /> Your Resume</h2>
            <div className="inline-flex h-8 rounded-md bg-secondary p-0.5 ring-1 ring-white/10">
              <button onClick={() => setResumeMode("file")} className={`h-full px-3 rounded text-xs font-medium transition-colors ${resumeMode === "file" ? "bg-input text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <Upload className="size-3.5 inline mr-1.5" /> Upload
              </button>
              <button onClick={() => setResumeMode("text")} className={`h-full px-3 rounded text-xs font-medium transition-colors ${resumeMode === "text" ? "bg-input text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                <Clipboard className="size-3.5 inline mr-1.5" /> Paste
              </button>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-white/5 bg-white/5 p-6 glass h-[420px] flex flex-col">
            {resumeMode === "file" ? (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  className={`group relative flex-1 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                  }`}
                >
                  <div className={`mb-3 flex size-14 items-center justify-center rounded-2xl ring-1 ring-white/10 ${isDragging ? "bg-primary/20 ring-primary/30" : "bg-secondary"}`}>
                    {isDragging ? <Droplets className="size-6 text-primary animate-pulse" /> : <Upload className="size-6 text-muted-foreground" />}
                  </div>
                  <p className="text-sm font-medium">{isDragging ? "Drop your resume here" : file ? file.name : "Click to upload or drag & drop"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF, DOCX, TXT • Max 5MB"}</p>
                </div>
              </>
            ) : (
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here...
Experience, education, skills, projects, etc."
                className="flex-1 w-full rounded-md bg-input px-4 py-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none font-mono text-xs leading-relaxed"
              />
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold flex items-center gap-2"><Briefcase className="size-4 text-electric-glow" /> Job Description</h2>
          </div>

          <div className="mt-3 rounded-2xl border border-white/5 bg-white/5 p-6 glass h-[420px] flex flex-col space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Target Role (optional)</label>
              <div className="mt-1.5 relative">
                <input
                  ref={roleInputRef}
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
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
                        setRoleInput(filteredRoles[roleHighlight]);
                        setRoleDropdownOpen(false);
                      }
                    } else if (e.key === "Escape") setRoleDropdownOpen(false);
                  }}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full h-9 rounded-md bg-input px-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none pr-8"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-3.5 w-3.5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4" /></svg>
                </div>
                {roleDropdownOpen && (
                  <div ref={roleDropdownRef} className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-md bg-[#1a1a2e] border border-white/10 shadow-xl ring-1 ring-black/5">
                    {filteredRoles.length === 0 ? (
                      <div className="px-3 py-3 text-xs text-muted-foreground text-center">Using custom role</div>
                    ) : (
                      TARGET_ROLES.map((g) => {
                        const roles = g.roles.filter((r) => roleInput.trim() === "" ? true : r.toLowerCase().includes(roleInput.toLowerCase()));
                        if (roles.length === 0) return null;
                        return (
                          <div key={g.group}>
                            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-electric-glow/80 bg-white/[0.02] border-b border-white/5">{g.group}</div>
                            {roles.map((r) => (
                              <div
                                key={r}
                                onMouseDown={(e) => { e.preventDefault(); setRoleInput(r); setRoleDropdownOpen(false); }}
                                onMouseEnter={() => setRoleHighlight(filteredRoles.indexOf(r))}
                                className={`px-3 py-1.5 text-xs cursor-pointer transition-colors ${filteredRoles.indexOf(r) === roleHighlight ? "bg-primary/20" : "hover:bg-white/5"}`}
                              >
                                {r}
                              </div>
                            ))}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here.

Include: responsibilities, requirements, preferred qualifications, tech stack, etc.

Example:
We're looking for a Senior Full Stack Engineer with 5+ years of experience building production React apps...

Required:
- React, TypeScript, Node.js
- AWS, Docker, Kubernetes
- ..."
                className="mt-1.5 h-[290px] w-full rounded-md bg-input px-4 py-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleAnalyze}
          disabled={busy}
          className="h-11 inline-flex items-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors shadow-glow disabled:opacity-60"
        >
          {busy ? (
            <>Analyzing match... <span className="inline-block size-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /></>
          ) : (
            <><Sparkles className="size-4" /> Analyze Match <ChevronRight className="size-4" /></>
          )}
        </button>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-1 rounded-2xl border border-primary/20 bg-primary/5 p-6 glass shadow-glow flex flex-col items-center justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Match Score</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-6xl font-semibold tabular-nums">{result.score}</span>
                <Percent className="size-6 text-primary mt-3" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Good match — address gaps to reach 90%+</p>
              <div className="mt-4 h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-brand shadow-glow" style={{ width: `${result.score}%` }} />
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5"><CheckCircle2 className="size-3.5" /> Matched Skills</p>
              <p className="mt-2 text-xs text-muted-foreground">You have {result.matched.length} of the required keywords</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {result.matched.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-300 px-2.5 py-1 text-[11px] font-medium ring-1 ring-emerald-500/20">
                    <CheckCircle2 className="size-3" /> {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
              <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5"><XCircle className="size-3.5" /> Missing Skills</p>
              <p className="mt-2 text-xs text-muted-foreground">Add these to boost your score</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {result.missing.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-300 px-2.5 py-1 text-[11px] font-medium ring-1 ring-rose-500/20">
                    <XCircle className="size-3" /> {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><Target className="size-4 text-electric-glow" /> At-a-glance</h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  ["Match Score", `${result.score}%`, "text-primary"],
                  ["Keyword Match", `${result.keywordMatch}%`, "text-foreground/90"],
                  ["Skills Matched", `${result.matched.length}`, "text-emerald-400"],
                  ["Skills Missing", `${result.missing.length}`, "text-rose-400"],
                ].map(([k, v, c]) => (
                  <li key={k} className="flex items-center justify-between border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                    <span className="text-muted-foreground">{k}</span>
                    <span className={`font-semibold tabular-nums ${c}`}>{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><Sparkles className="size-4 text-electric-glow" /> Suggested Improvements</h3>
              <ol className="space-y-2.5 text-sm">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-muted-foreground leading-relaxed">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ring-1 ring-primary/30">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
