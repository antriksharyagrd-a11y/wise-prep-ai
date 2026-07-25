import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FileText, Upload, Clipboard, Droplets } from "lucide-react";
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

export const Route = createFileRoute("/_authenticated/resume")({
  head: () => ({ meta: [{ title: "Resume — HireWise" }, { name: "description", content: "Upload a PDF or DOCX resume and get AI-powered ATS feedback." }] }),
  component: ResumePage,
});

function ResumePage() {
  const analyze = useServerFn(analyzeResume);
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
    
    // Check for files first
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      validateAndSetFile(e.clipboardData.files[0]);
      return;
    }
    
    // Check for text
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
    <div className="mx-auto max-w-4xl px-6 space-y-6" onPaste={handlePaste}>
      <motion.form initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="rounded-2xl border border-white/5 bg-white/5 p-8 glass">
        <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-brand shadow-glow"><FileText className="size-5 text-white" /></div>
        <h1 className="mt-5 text-2xl font-medium tracking-tight">Resume analysis</h1>
        <p className="mt-2 text-sm text-muted-foreground">PDF, DOCX, or paste text directly. Text is parsed in your browser, then evaluated by AI.</p>

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

        {/* Input mode toggle */}
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
            <p className="text-xs text-muted-foreground mt-2">Tip: You can also press Ctrl/Cmd+V anywhere on this page to paste</p>
          </div>
        )}

        <button 
          disabled={busy || (inputMode === "file" && !file) || (inputMode === "text" && !pastedText)} 
          className="mt-6 w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors disabled:opacity-60"
        >
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