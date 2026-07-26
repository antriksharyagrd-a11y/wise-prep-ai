import { o as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as HireWiseLogo } from "./HireWiseLogo-BvJ6_Qbp.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { a as useServerFn, n as analyzeResumePublic } from "./hirewise.functions-BaGxhchm.mjs";
import { c as Droplets, f as Briefcase, i as Sparkles, l as Clipboard, n as Upload, p as ArrowRight, s as FileText } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-cRzLMu7U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TARGET_ROLES = [
	{
		group: "Development",
		roles: [
			"Frontend Developer",
			"Backend Developer",
			"Full Stack Developer",
			"Software Engineer",
			"Software Developer",
			"Web Developer"
		]
	},
	{
		group: "Specialized",
		roles: [
			"React Developer",
			"Node.js Developer",
			"Java Developer",
			"Python Developer"
		]
	},
	{
		group: "Infrastructure & Cloud",
		roles: ["DevOps Engineer", "Cloud Engineer"]
	},
	{
		group: "Data & Analytics",
		roles: [
			"Data Analyst",
			"Business Analyst",
			"Data Scientist"
		]
	},
	{
		group: "AI & Machine Learning",
		roles: ["Machine Learning Engineer", "AI Engineer"]
	},
	{
		group: "Security & QA",
		roles: ["Cybersecurity Analyst", "QA Engineer"]
	},
	{
		group: "Design",
		roles: ["UI/UX Designer"]
	}
];
var ALL_ROLES = TARGET_ROLES.flatMap((g) => g.roles);
function ResumeUploader() {
	const analyze = useServerFn(analyzeResumePublic);
	const [file, setFile] = (0, import_react.useState)(null);
	const [targetRole, setTargetRole] = (0, import_react.useState)("Frontend Developer");
	const [roleInput, setRoleInput] = (0, import_react.useState)("Frontend Developer");
	const [roleDropdownOpen, setRoleDropdownOpen] = (0, import_react.useState)(false);
	const [roleHighlight, setRoleHighlight] = (0, import_react.useState)(-1);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [pastedText, setPastedText] = (0, import_react.useState)("");
	const [jobDescription, setJobDescription] = (0, import_react.useState)("");
	const [inputMode, setInputMode] = (0, import_react.useState)("file");
	const fileInputRef = (0, import_react.useRef)(null);
	const roleInputRef = (0, import_react.useRef)(null);
	const roleDropdownRef = (0, import_react.useRef)(null);
	const filteredRoles = roleInput.trim() === "" ? ALL_ROLES : ALL_ROLES.filter((r) => r.toLowerCase().includes(roleInput.toLowerCase()));
	function closeRoleDropdown() {
		setRoleDropdownOpen(false);
		setRoleHighlight(-1);
	}
	function selectRole(role) {
		setRoleInput(role);
		setTargetRole(role);
		closeRoleDropdown();
		roleInputRef.current?.blur();
	}
	(0, import_react.useEffect)(() => {
		function onDocClick(e) {
			if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target) && roleInputRef.current && !roleInputRef.current.contains(e.target)) closeRoleDropdown();
		}
		document.addEventListener("mousedown", onDocClick);
		return () => document.removeEventListener("mousedown", onDocClick);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!roleDropdownOpen) setRoleHighlight(-1);
	}, [roleDropdownOpen]);
	async function extractText(f) {
		const buf = new Uint8Array(await f.arrayBuffer());
		if (f.name.toLowerCase().endsWith(".pdf") || f.type === "application/pdf") {
			const { extractText: extract, getDocumentProxy } = await import("../_libs/unpdf.mjs").then((n) => n.t);
			const { text } = await extract(await getDocumentProxy(buf), { mergePages: true });
			return Array.isArray(text) ? text.join("\n") : text;
		}
		if (f.name.toLowerCase().endsWith(".docx")) return (await ((await import("../_libs/mammoth+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).default ?? await import("../_libs/mammoth+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).extractRawText({ arrayBuffer: buf.buffer })).value;
		return new TextDecoder().decode(buf);
	}
	const validateAndSetFile = (0, import_react.useCallback)((f) => {
		if ([
			".pdf",
			".docx",
			"application/pdf",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		].some((type) => f.name.toLowerCase().endsWith(type) || f.type === type)) {
			setFile(f);
			setPastedText("");
			setInputMode("file");
		} else toast.error("Please upload a PDF or DOCX file");
	}, []);
	const handleDragOver = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);
	const handleDragLeave = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);
	const handleDrop = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) validateAndSetFile(e.dataTransfer.files[0]);
	}, [validateAndSetFile]);
	async function submit(e) {
		e.preventDefault();
		let textToAnalyze = "";
		let fileName = "pasted-resume.txt";
		if (inputMode === "file" && file) try {
			textToAnalyze = await extractText(file);
			fileName = file.name;
		} catch {
			toast.error("Failed to extract text from file");
			return;
		}
		else if (inputMode === "text" && pastedText) textToAnalyze = pastedText;
		else {
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
			const r = await analyze({ data: {
				fileName,
				extractedText: textToAnalyze,
				targetRole,
				jobDescription
			} });
			setResult(r.feedback);
			toast.success(`ATS score: ${r.feedback.ats_score}/100`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Analysis failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.form, {
			initial: {
				opacity: 0,
				y: 8
			},
			animate: {
				opacity: 1,
				y: 0
			},
			onSubmit: submit,
			className: "rounded-2xl border border-white/5 bg-white/5 p-8 glass",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-12 items-center justify-center rounded-lg bg-gradient-brand shadow-glow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5 text-white" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 text-2xl font-medium tracking-tight",
					children: "Try Resume Analysis — Free"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Upload your resume and paste a job description. No signup required for a quick preview."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
							children: "Your Resume"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setInputMode("file");
									setPastedText("");
								},
								className: `flex-1 h-9 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${inputMode === "file" ? "bg-primary text-primary-foreground" : "bg-input/50 text-muted-foreground hover:bg-input"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), " File"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setInputMode("text");
									setFile(null);
								},
								className: `flex-1 h-9 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${inputMode === "text" ? "bg-primary text-primary-foreground" : "bg-input/50 text-muted-foreground hover:bg-input"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clipboard, { className: "size-3.5" }), " Paste"]
							})]
						}),
						inputMode === "file" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-8 text-sm transition-all ${isDragging ? "border-primary bg-primary/10" : "border-white/15 bg-input/50 hover:bg-input"}`,
							onDragOver: handleDragOver,
							onDragLeave: handleDragLeave,
							onDrop: handleDrop,
							onClick: () => fileInputRef.current?.click(),
							children: [isDragging ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "size-6 text-primary animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary font-medium",
								children: "Drop here"
							})] }) : file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-xs",
								children: file.name
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-5 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-xs",
									children: "Drag & drop or click"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "PDF or DOCX"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileInputRef,
								type: "file",
								accept: ".pdf,.docx,application/pdf",
								className: "hidden",
								onChange: (e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: pastedText,
							onChange: (e) => setPastedText(e.target.value),
							placeholder: "Paste resume text...",
							className: "mt-2 w-full h-40 rounded-md bg-input px-3 py-2 text-xs ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
						children: "Job Description"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: jobDescription,
						onChange: (e) => setJobDescription(e.target.value),
						placeholder: "Paste the full job description here. Include responsibilities, requirements, qualifications, and tech stack...",
						className: "mt-2 w-full h-[calc(100%-1.5rem)] min-h-[160px] rounded-md bg-input px-3 py-2 text-xs ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-4 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
					children: "Target role"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: roleInputRef,
							type: "text",
							value: roleInput,
							onChange: (e) => {
								setRoleInput(e.target.value);
								setTargetRole(e.target.value);
							},
							onFocus: () => setRoleDropdownOpen(true),
							onKeyDown: (e) => {
								if (e.key === "ArrowDown") {
									e.preventDefault();
									setRoleDropdownOpen(true);
									setRoleHighlight((h) => Math.min(h + 1, filteredRoles.length - 1));
								} else if (e.key === "ArrowUp") {
									e.preventDefault();
									setRoleHighlight((h) => Math.max(h - 1, 0));
								} else if (e.key === "Enter") if (roleDropdownOpen && roleHighlight >= 0 && filteredRoles[roleHighlight]) {
									e.preventDefault();
									selectRole(filteredRoles[roleHighlight]);
								} else closeRoleDropdown();
								else if (e.key === "Escape") closeRoleDropdown();
							},
							placeholder: "Type or select a target role...",
							className: "w-full h-10 rounded-md bg-input px-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none pr-8"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								className: "h-4 w-4 text-muted-foreground",
								xmlns: "http://www.w3.org/2000/svg",
								fill: "none",
								viewBox: "0 0 20 20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									stroke: "currentColor",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: "1.5",
									d: "M6 8l4 4 4-4"
								})
							})
						}),
						roleDropdownOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: roleDropdownRef,
							className: "absolute z-50 mt-1 w-full max-h-72 overflow-y-auto rounded-md bg-[#1a1a2e] border border-white/10 shadow-xl ring-1 ring-black/5",
							children: filteredRoles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3 py-4 text-sm text-muted-foreground text-center",
								children: [
									"No matches. Using custom role: \"",
									roleInput,
									"\""
								]
							}) : TARGET_ROLES.map((group) => {
								const groupRoles = group.roles.filter((r) => roleInput.trim() === "" ? true : r.toLowerCase().includes(roleInput.toLowerCase()));
								if (groupRoles.length === 0) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-electric-glow/80 bg-white/[0.02] border-b border-white/5",
									children: group.group
								}), groupRoles.map((role) => {
									const flatIndex = filteredRoles.indexOf(role);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										onMouseDown: (e) => {
											e.preventDefault();
											selectRole(role);
										},
										onMouseEnter: () => setRoleHighlight(flatIndex),
										className: `px-3 py-2 text-sm cursor-pointer transition-colors ${flatIndex === roleHighlight ? "bg-primary/20 text-foreground" : "text-foreground/90 hover:bg-white/5"}`,
										children: role
									}, role);
								})] }, group.group);
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: busy || inputMode === "file" && !file || inputMode === "text" && !pastedText || !jobDescription.trim(),
					className: "mt-6 w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors disabled:opacity-60",
					children: busy ? "Analyzing…" : "Check ATS Score"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-xs text-center text-muted-foreground",
					children: ["Want to save your results? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "text-electric-glow hover:underline",
						children: "Create an account"
					})]
				})
			]
		}), result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				y: 8
			},
			animate: {
				opacity: 1,
				y: 0
			},
			className: "rounded-2xl border border-primary/20 bg-white/5 p-8 glass space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-white/5 p-4 ring-1 ring-white/10 flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreGauge, { value: result.ats_score }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-bold uppercase tracking-widest text-electric-glow",
							children: "ATS Score"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-3xl font-medium",
							children: [result.ats_score, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg text-muted-foreground",
								children: "/100"
							})]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-white/5 p-4 ring-1 ring-white/10 flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreGauge, { value: result.match_percentage }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-bold uppercase tracking-widest text-electric-glow",
							children: "Match"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-3xl font-medium",
							children: [result.match_percentage, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg text-muted-foreground",
								children: "%"
							})]
						})] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: result.summary
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeywordList, {
							title: "Matched Keywords",
							items: result.matched_keywords,
							tone: "emerald"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeywordList, {
							title: "Missing Keywords",
							items: result.missing_keywords,
							tone: "rose"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeywordList, {
							title: "Skills Found",
							items: result.skills_found,
							tone: "emerald"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeywordList, {
							title: "Skills Missing",
							items: result.skills_missing,
							tone: "amber"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPanel, {
							title: "Strengths",
							items: result.strengths,
							tone: "emerald"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPanel, {
							title: "Improvements",
							items: result.improvements,
							tone: "amber"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-white/5 p-4 ring-1 ring-white/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-bold uppercase tracking-widest text-electric-glow",
						children: "Suggestions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-3 space-y-2 text-sm",
						children: result.suggestions.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2.5 text-muted-foreground leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary ring-1 ring-primary/30",
								children: i + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s })]
						}, i))
					})]
				})
			]
		})]
	});
}
function ScoreGauge({ value }) {
	const c = 2 * Math.PI * 42;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative size-20 shrink-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 100 100",
			className: "size-full -rotate-90",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "50",
					cy: "50",
					r: "42",
					strokeWidth: "8",
					className: "fill-none stroke-white/10"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "50",
					cy: "50",
					r: "42",
					strokeWidth: "8",
					strokeLinecap: "round",
					stroke: "url(#gr-landing)",
					className: "fill-none",
					strokeDasharray: c,
					strokeDashoffset: c * (1 - value / 100)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "gr-landing",
					x1: "0",
					y1: "0",
					x2: "1",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "#3B82F6"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "#60A5FA"
					})]
				}) })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 grid place-items-center text-sm font-medium",
			children: value
		})]
	});
}
function KeywordList({ title, items, tone }) {
	const colors = {
		emerald: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
		rose: "bg-rose-500/10 text-rose-300 ring-rose-500/20",
		amber: "bg-amber-500/10 text-amber-300 ring-amber-500/20"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-white/5 p-4 ring-1 ring-white/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-1.5",
			children: items.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${colors[tone]}`,
				children: k
			}, k))
		})]
	});
}
function ListPanel({ title, items, tone }) {
	if (!items || items.length === 0) return null;
	const dot = tone === "emerald" ? "bg-emerald-400" : "bg-amber-400";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-white/5 p-4 ring-1 ring-white/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-2",
			children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-2.5 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-1.5 size-1.5 shrink-0 rounded-full ${dot}` }), it]
			}, i))
		})]
	});
}
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed top-0 z-50 w-full border-b border-white/5 glass",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-7xl items-center justify-between px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HireWiseLogo, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden gap-8 sm:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#resume-check",
								className: "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
								children: "ATS Analyzer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#how-it-works",
								className: "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
								children: "How it works"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "h-8 inline-flex items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground ring-1 ring-primary/50 hover:bg-electric-glow transition-colors",
							children: "Sign In"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "circuit-bg relative flex flex-col items-center px-6 pt-32 pb-24 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { duration: .6 },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 mb-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative mr-2 flex h-2 w-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-glow opacity-70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-electric-glow" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-bold tracking-widest text-electric-glow uppercase",
								children: "ATS Optimized"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.h1, {
						initial: {
							opacity: 0,
							y: 16
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .7,
							delay: .05
						},
						className: "max-w-[22ch] text-balance text-4xl font-medium tracking-tight sm:text-6xl lg:text-7xl leading-tight",
						children: ["Check if your resume passes the ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gradient-brand",
							children: "ATS gatekeepers"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: {
							duration: .7,
							delay: .15
						},
						className: "mt-6 max-w-[58ch] text-pretty text-lg text-muted-foreground",
						children: "Upload your resume, paste the job description, and get an instant ATS score with keyword match, skills analysis, and clear suggestions to improve."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							duration: .7,
							delay: .25
						},
						className: "mt-10 flex flex-wrap justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#resume-check",
							className: "h-11 inline-flex items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors",
							children: ["Check my resume ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "h-11 inline-flex items-center rounded-md bg-secondary px-6 text-sm font-medium ring-1 ring-white/10 hover:bg-accent transition-colors",
							children: "Sign in"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: { delay: .45 },
						className: "mt-16 grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-4",
						children: [
							["ATS Score", "Instant"],
							["Keyword Match", "% match"],
							["Skills Analysis", "Found & missing"],
							["Suggestions", "Actionable"]
						].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-medium",
								children: v
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: k
							})]
						}, k))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "resume-check",
				className: "mx-auto max-w-7xl px-6 pb-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-12 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-bold tracking-widest text-electric-glow uppercase",
						children: "Free Tool"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl sm:text-4xl font-medium tracking-tight",
						children: "Upload your resume — see your score"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeUploader, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "how-it-works",
				className: "mx-auto max-w-7xl px-6 pb-32",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-12 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-bold tracking-widest text-electric-glow uppercase",
						children: "How it works"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl sm:text-4xl font-medium tracking-tight",
						children: "Three steps to a stronger resume"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-4",
					children: [
						{
							icon: FileText,
							title: "Upload your resume",
							body: "Drag & drop a PDF or DOCX, or paste your resume text directly."
						},
						{
							icon: Briefcase,
							title: "Paste the job description",
							body: "Add the full job description so we can match keywords and skills."
						},
						{
							icon: Sparkles,
							title: "Get your ATS score",
							body: "Receive an instant score, keyword match, skills analysis, and suggestions."
						}
					].map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 12
						},
						whileInView: {
							opacity: 1,
							y: 0
						},
						viewport: { once: true },
						transition: {
							duration: .5,
							delay: i * .1
						},
						className: "rounded-xl border border-white/5 bg-white/5 p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-9 items-center justify-center rounded-lg bg-primary/15 text-electric-glow ring-1 ring-primary/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 text-sm font-semibold",
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground leading-relaxed",
								children: f.body
							})
						]
					}, f.title))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-white/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HireWiseLogo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" HireWise. Signal over noise."
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { Landing as component };
