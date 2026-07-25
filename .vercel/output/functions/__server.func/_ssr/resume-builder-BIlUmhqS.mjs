import { o as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { C as Check, E as Award, T as Briefcase, a as Sparkles, c as PenLine, g as Eye, h as FileText, l as PanelsTopLeft, p as GraduationCap, t as User, v as Download } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resume-builder-BIlUmhqS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TEMPLATES = [
	{
		id: "t1",
		name: "Classic Professional",
		style: "classic",
		accent: "from-blue-500 to-indigo-500",
		description: "Traditional layout, ideal for corporate roles."
	},
	{
		id: "t2",
		name: "Modern Clean",
		style: "modern",
		accent: "from-cyan-400 to-blue-500",
		description: "Clean two-column, popular with tech recruiters."
	},
	{
		id: "t3",
		name: "Minimal Simple",
		style: "minimal",
		accent: "from-slate-400 to-slate-600",
		description: "Minimalist, distraction-free, ATS-optimized."
	},
	{
		id: "t4",
		name: "Creative Bold",
		style: "creative",
		accent: "from-fuchsia-500 to-pink-500",
		description: "Stand out. Perfect for designers & PMs."
	},
	{
		id: "t5",
		name: "Executive Premium",
		style: "executive",
		accent: "from-amber-400 to-orange-500",
		description: "Senior leadership format with summary section."
	}
];
function ResumeBuilderPage() {
	const [selectedTemplate, setSelectedTemplate] = (0, import_react.useState)("t2");
	const [step, setStep] = (0, import_react.useState)("templates");
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		email: "",
		phone: "",
		location: "",
		linkedin: "",
		summary: "",
		experience: "",
		education: "",
		skills: ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	function updateField(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
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
		if (form.fullName.trim()) toast.success("Generating PDF... (Demo)");
		else toast.error("Save your resume first");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "flex flex-wrap items-baseline justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-bold uppercase tracking-widest text-electric-glow",
						children: "Resume Builder"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-3xl font-medium tracking-tight",
						children: "Create a standout resume in minutes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Choose a template, fill in your details, and download a polished, ATS-friendly PDF."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5 text-xs text-muted-foreground",
						children: [
							"templates",
							"edit",
							"preview"
						].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `flex size-5 items-center justify-center rounded-full text-[10px] font-semibold ${step === s ? "bg-primary text-primary-foreground" : i < [
									"templates",
									"edit",
									"preview"
								].indexOf(step) ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-muted-foreground"}`,
								children: i < [
									"templates",
									"edit",
									"preview"
								].indexOf(step) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }) : i + 1
							}), i < 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-4 h-px bg-white/10" })]
						}, s))
					})
				})]
			}),
			step === "templates" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .05 },
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => setSelectedTemplate(t.id),
						className: `group cursor-pointer rounded-2xl border p-5 transition-all ${selectedTemplate === t.id ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-white/5 bg-white/5 hover:bg-white/10"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative rounded-lg border border-white/10 aspect-[210/297] overflow-hidden bg-gradient-to-br from-background to-white/[0.02]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute inset-x-0 top-0 h-20 bg-gradient-to-r ${t.accent} opacity-80` }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative pt-24 px-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-2/3 rounded-full bg-white/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-1/2 rounded-full bg-white/10" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-white/10" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-1.5",
											children: [
												0,
												1,
												2
											].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2.5 w-1/3 rounded-full bg-white/20" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-full rounded-full bg-white/5" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-4/5 rounded-full bg-white/5" })
												]
											}, i))
										})
									]
								}),
								selectedTemplate === t.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-primary ring-2 ring-background",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-primary-foreground" })
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-semibold flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelsTopLeft, { className: "size-3.5 text-muted-foreground" }),
									" ",
									t.name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: t.description
							})]
						})]
					}, t.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setStep("edit"),
						className: "h-10 inline-flex items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors",
						children: ["Continue to Edit ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-4" })]
					})
				})]
			}),
			step === "edit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .05 },
				className: "grid grid-cols-1 gap-6 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-3 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-semibold flex items-center gap-2 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4 text-electric-glow" }), " Personal Info"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Full Name",
										value: form.fullName,
										onChange: (v) => updateField("fullName", v),
										placeholder: "Alex Chen"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Email",
										value: form.email,
										onChange: (v) => updateField("email", v),
										placeholder: "alex@company.com"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Phone",
										value: form.phone,
										onChange: (v) => updateField("phone", v),
										placeholder: "+1 555 012 3456"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Location",
										value: form.location,
										onChange: (v) => updateField("location", v),
										placeholder: "San Francisco, CA"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "LinkedIn / URL",
										value: form.linkedin,
										onChange: (v) => updateField("linkedin", v),
										placeholder: "linkedin.com/in/...",
										className: "sm:col-span-2"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-semibold flex items-center gap-2 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-electric-glow" }), " Professional Summary"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 4,
								value: form.summary,
								onChange: (e) => updateField("summary", e.target.value),
								placeholder: "2-3 sentences describing your expertise, years of experience, and strengths...",
								className: "w-full rounded-md bg-input px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-semibold flex items-center gap-2 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-4 text-electric-glow" }), " Experience"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 6,
								value: form.experience,
								onChange: (e) => updateField("experience", e.target.value),
								placeholder: `Senior Engineer | Tech Co | 2022 - Present\n- Led migration of monolith to microservices...\n\nEngineer | Startup | 2019 - 2022\n- Built customer-facing dashboards...`,
								className: "w-full rounded-md bg-input px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none font-mono text-xs"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-sm font-semibold flex items-center gap-2 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4 text-electric-glow" }), " Education"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 4,
									value: form.education,
									onChange: (e) => updateField("education", e.target.value),
									placeholder: "B.S. Computer Science | Stanford | 2019",
									className: "w-full rounded-md bg-input px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-sm font-semibold flex items-center gap-2 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-4 text-electric-glow" }), " Skills"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 4,
									value: form.skills,
									onChange: (e) => updateField("skills", e.target.value),
									placeholder: "React, TypeScript, Node.js, AWS, PostgreSQL...",
									className: "w-full rounded-md bg-input px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setStep("templates"),
								className: "h-10 inline-flex items-center gap-2 rounded-md bg-secondary px-4 text-sm font-medium ring-1 ring-white/10 hover:bg-accent transition-colors",
								children: "← Back to Templates"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleSave,
								disabled: saving,
								className: "h-10 inline-flex items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors disabled:opacity-60",
								children: [
									saving ? "Saving..." : "Save & Preview",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky top-20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2",
							children: "Live Preview"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-white/5 bg-white/5 p-4 glass",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumePreview, {
								form,
								template: TEMPLATES.find((t) => t.id === selectedTemplate)
							})
						})]
					})
				})]
			}),
			step === "preview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					opacity: 0,
					y: 8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .05 },
				className: "space-y-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-5 gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-3 order-2 lg:order-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumePreview, {
								form,
								template: TEMPLATES.find((t) => t.id === selectedTemplate),
								full: true
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-2 order-1 lg:order-2 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-primary/20 bg-primary/5 p-6 glass",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-sm font-semibold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-electric-glow" }), " Your Resume is Ready"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: ["Template: ", TEMPLATES.find((t) => t.id === selectedTemplate)?.name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 space-y-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: handleDownload,
											className: "w-full h-10 inline-flex items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download PDF"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setStep("edit"),
											className: "w-full h-10 inline-flex items-center justify-center gap-2 rounded-md bg-secondary text-sm font-medium ring-1 ring-white/10 hover:bg-accent transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-4" }), " Edit Content"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setStep("templates"),
											className: "w-full h-10 inline-flex items-center justify-center gap-2 rounded-md bg-secondary text-sm font-medium ring-1 ring-white/10 hover:bg-accent transition-colors",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelsTopLeft, { className: "size-4" }), " Change Template"]
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-semibold flex items-center gap-2 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-electric-glow" }), " Resume Details"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2 text-xs",
								children: [
									["Name", form.fullName || "—"],
									["Email", form.email || "—"],
									["Sections", Object.values(form).filter((v) => v.trim()).length + "/7 filled"]
								].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: k
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground/90 font-medium",
										children: v
									})]
								}, k))
							})]
						})]
					})]
				})
			})
		]
	});
}
function Field({ label, value, onChange, placeholder, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			className: "mt-1.5 w-full h-9 rounded-md bg-input px-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none"
		})]
	});
}
function ResumePreview({ form, template, full }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg overflow-hidden bg-white text-slate-900 shadow-xl ring-1 ring-black/5 aspect-[210/297] w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `h-20 bg-gradient-to-r ${template.accent} px-5 flex flex-col justify-center`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `text-white font-bold ${full ? "text-xl" : "text-sm"}`,
				children: form.fullName || "Your Full Name"
			}), [form.email, form.location].filter(Boolean).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `text-white/80 ${full ? "text-xs" : "text-[9px]"} mt-0.5 truncate`,
				children: [form.email, form.location].filter(Boolean).join(" · ")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `p-4 space-y-3 ${full ? "" : "scale-[0.96] origin-top"}`,
			children: [
				form.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-[10px] font-bold uppercase tracking-widest text-slate-700 border-b border-slate-200 pb-1 mb-2",
					children: "Summary"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-slate-600 leading-relaxed line-clamp-3",
					children: form.summary
				})] }),
				form.experience && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-[10px] font-bold uppercase tracking-widest text-slate-700 border-b border-slate-200 pb-1 mb-2",
					children: "Experience"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "text-[9px] text-slate-600 leading-relaxed whitespace-pre-wrap font-sans line-clamp-6",
					children: form.experience
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [form.education && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-[10px] font-bold uppercase tracking-widest text-slate-700 border-b border-slate-200 pb-1 mb-2",
						children: "Education"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] text-slate-600 leading-relaxed line-clamp-4",
						children: form.education
					})] }), form.skills && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-[10px] font-bold uppercase tracking-widest text-slate-700 border-b border-slate-200 pb-1 mb-2",
						children: "Skills"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[9px] text-slate-600 leading-relaxed line-clamp-4",
						children: form.skills
					})] })]
				})
			]
		})]
	});
}
//#endregion
export { ResumeBuilderPage as component };
