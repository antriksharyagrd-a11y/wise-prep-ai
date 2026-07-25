import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  FileText,
  Download,
  Edit3,
  Eye,
  Layout,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/resume-builder")({
  head: () => ({
    meta: [
      { title: "Resume Builder — HireWise" },
      { name: "description", content: "Build professional ATS-friendly resumes with modern templates." },
    ],
  }),
  component: ResumeBuilderPage,
});

type Template = {
  id: string;
  name: string;
  style: "classic" | "modern" | "minimal" | "creative" | "executive";
  accent: string;
  description: string;
};

const TEMPLATES: Template[] = [
  { id: "t1", name: "Classic Professional", style: "classic", accent: "from-blue-500 to-indigo-500", description: "Traditional layout, ideal for corporate roles." },
  { id: "t2", name: "Modern Clean", style: "modern", accent: "from-cyan-400 to-blue-500", description: "Clean two-column, popular with tech recruiters." },
  { id: "t3", name: "Minimal Simple", style: "minimal", accent: "from-slate-400 to-slate-600", description: "Minimalist, distraction-free, ATS-optimized." },
  { id: "t4", name: "Creative Bold", style: "creative", accent: "from-fuchsia-500 to-pink-500", description: "Stand out. Perfect for designers & PMs." },
  { id: "t5", name: "Executive Premium", style: "executive", accent: "from-amber-400 to-orange-500", description: "Senior leadership format with summary section." },
];

function ResumeBuilderPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("t2");
  const [step, setStep] = useState<"templates" | "edit" | "preview">("templates");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });
  const [saving, setSaving] = useState(false);

  function updateField(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      toast.success("Resume saved successfully!");
      setStep("preview");
    } finally {
      setSaving(false);
    }
  }

  function handleDownload() {
    if (form.fullName.trim()) {
      toast.success("Generating PDF... (Demo)");
    } else {
      toast.error("Save your resume first");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-electric-glow">Resume Builder</p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight">Create a standout resume in minutes</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose a template, fill in your details, and download a polished, ATS-friendly PDF.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {(["templates", "edit", "preview"] as const).map((s, i) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className={`flex size-5 items-center justify-center rounded-full text-[10px] font-semibold ${step === s ? "bg-primary text-primary-foreground" : i < ["templates", "edit", "preview"].indexOf(step) ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-muted-foreground"}`}>
                  {i < ["templates", "edit", "preview"].indexOf(step) ? <Check className="size-3" /> : i + 1}
                </span>
                {i < 2 && <span className="w-4 h-px bg-white/10" />}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {step === "templates" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`group cursor-pointer rounded-2xl border p-5 transition-all ${
                  selectedTemplate === t.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-white/5 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="relative rounded-lg border border-white/10 aspect-[210/297] overflow-hidden bg-gradient-to-br from-background to-white/[0.02]">
                  <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-r ${t.accent} opacity-80`} />
                  <div className="relative pt-24 px-4 space-y-3">
                    <div className="space-y-1">
                      <div className="h-3 w-2/3 rounded-full bg-white/20" />
                      <div className="h-2 w-1/2 rounded-full bg-white/10" />
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="space-y-1.5">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="space-y-1">
                          <div className="h-2.5 w-1/3 rounded-full bg-white/20" />
                          <div className="h-2 w-full rounded-full bg-white/5" />
                          <div className="h-2 w-4/5 rounded-full bg-white/5" />
                        </div>
                      ))}
                    </div>
                  </div>
                  {selectedTemplate === t.id && (
                    <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary ring-2 ring-background">
                      <Check className="size-3.5 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold flex items-center gap-2"><Layout className="size-3.5 text-muted-foreground" /> {t.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={() => setStep("edit")} className="h-10 inline-flex items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors">
              Continue to Edit <Edit3 className="size-4" />
            </button>
          </div>
        </motion.div>
      )}

      {step === "edit" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><User className="size-4 text-electric-glow" /> Personal Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Full Name" value={form.fullName} onChange={(v) => updateField("fullName", v)} placeholder="Alex Chen" />
                <Field label="Email" value={form.email} onChange={(v) => updateField("email", v)} placeholder="alex@company.com" />
                <Field label="Phone" value={form.phone} onChange={(v) => updateField("phone", v)} placeholder="+1 555 012 3456" />
                <Field label="Location" value={form.location} onChange={(v) => updateField("location", v)} placeholder="San Francisco, CA" />
                <Field label="LinkedIn / URL" value={form.linkedin} onChange={(v) => updateField("linkedin", v)} placeholder="linkedin.com/in/..." className="sm:col-span-2" />
              </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><Sparkles className="size-4 text-electric-glow" /> Professional Summary</h3>
              <textarea
                rows={4}
                value={form.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                placeholder="2-3 sentences describing your expertise, years of experience, and strengths..."
                className="w-full rounded-md bg-input px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
              />
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><Briefcase className="size-4 text-electric-glow" /> Experience</h3>
              <textarea
                rows={6}
                value={form.experience}
                onChange={(e) => updateField("experience", e.target.value)}
                placeholder={`Senior Engineer | Tech Co | 2022 - Present\n- Led migration of monolith to microservices...\n\nEngineer | Startup | 2019 - 2022\n- Built customer-facing dashboards...`}
                className="w-full rounded-md bg-input px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none font-mono text-xs"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><GraduationCap className="size-4 text-electric-glow" /> Education</h3>
                <textarea
                  rows={4}
                  value={form.education}
                  onChange={(e) => updateField("education", e.target.value)}
                  placeholder="B.S. Computer Science | Stanford | 2019"
                  className="w-full rounded-md bg-input px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
                />
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><Award className="size-4 text-electric-glow" /> Skills</h3>
                <textarea
                  rows={4}
                  value={form.skills}
                  onChange={(e) => updateField("skills", e.target.value)}
                  placeholder="React, TypeScript, Node.js, AWS, PostgreSQL..."
                  className="w-full rounded-md bg-input px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep("templates")} className="h-10 inline-flex items-center gap-2 rounded-md bg-secondary px-4 text-sm font-medium ring-1 ring-white/10 hover:bg-accent transition-colors">
                ← Back to Templates
              </button>
              <button onClick={handleSave} disabled={saving} className="h-10 inline-flex items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors disabled:opacity-60">
                {saving ? "Saving..." : "Save & Preview"} <Eye className="size-4" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Live Preview</p>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 glass">
                <ResumePreview form={form} template={TEMPLATES.find((t) => t.id === selectedTemplate)!} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {step === "preview" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
                <ResumePreview form={form} template={TEMPLATES.find((t) => t.id === selectedTemplate)!} full />
              </div>
            </div>
            <div className="lg:col-span-2 order-1 lg:order-2 space-y-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 glass">
                <h3 className="text-sm font-semibold flex items-center gap-2"><Sparkles className="size-4 text-electric-glow" /> Your Resume is Ready</h3>
                <p className="mt-2 text-xs text-muted-foreground">Template: {TEMPLATES.find((t) => t.id === selectedTemplate)?.name}</p>
                <div className="mt-4 space-y-2.5">
                  <button onClick={handleDownload} className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors">
                    <Download className="size-4" /> Download PDF
                  </button>
                  <button onClick={() => setStep("edit")} className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-md bg-secondary text-sm font-medium ring-1 ring-white/10 hover:bg-accent transition-colors">
                    <Edit3 className="size-4" /> Edit Content
                  </button>
                  <button onClick={() => setStep("templates")} className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-md bg-secondary text-sm font-medium ring-1 ring-white/10 hover:bg-accent transition-colors">
                    <Layout className="size-4" /> Change Template
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 glass">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><FileText className="size-4 text-electric-glow" /> Resume Details</h3>
                <ul className="space-y-2 text-xs">
                  {[
                    ["Name", form.fullName || "—"],
                    ["Email", form.email || "—"],
                    ["Sections", Object.values(form).filter((v) => v.trim()).length + "/7 filled"],
                  ].map(([k, v]) => (
                    <li key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="text-foreground/90 font-medium">{v}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, className }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full h-9 rounded-md bg-input px-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none"
      />
    </div>
  );
}

function ResumePreview({ form, template, full }: { form: any; template: Template; full?: boolean }) {
  return (
    <div className="rounded-lg overflow-hidden bg-white text-slate-900 shadow-xl ring-1 ring-black/5 aspect-[210/297] w-full">
      <div className={`h-20 bg-gradient-to-r ${template.accent} px-5 flex flex-col justify-center`}>
        <p className={`text-white font-bold ${full ? "text-xl" : "text-sm"}`}>{form.fullName || "Your Full Name"}</p>
        {[form.email, form.location].filter(Boolean).length > 0 && (
          <p className={`text-white/80 ${full ? "text-xs" : "text-[9px]"} mt-0.5 truncate`}>
            {[form.email, form.location].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
      <div className={`p-4 space-y-3 ${full ? "" : "scale-[0.96] origin-top"}`}>
        {form.summary && (
          <section>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 border-b border-slate-200 pb-1 mb-2">Summary</h4>
            <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-3">{form.summary}</p>
          </section>
        )}
        {form.experience && (
          <section>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 border-b border-slate-200 pb-1 mb-2">Experience</h4>
            <pre className="text-[9px] text-slate-600 leading-relaxed whitespace-pre-wrap font-sans line-clamp-6">{form.experience}</pre>
          </section>
        )}
        <div className="grid grid-cols-2 gap-3">
          {form.education && (
            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 border-b border-slate-200 pb-1 mb-2">Education</h4>
              <p className="text-[9px] text-slate-600 leading-relaxed line-clamp-4">{form.education}</p>
            </section>
          )}
          {form.skills && (
            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 border-b border-slate-200 pb-1 mb-2">Skills</h4>
              <p className="text-[9px] text-slate-600 leading-relaxed line-clamp-4">{form.skills}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
