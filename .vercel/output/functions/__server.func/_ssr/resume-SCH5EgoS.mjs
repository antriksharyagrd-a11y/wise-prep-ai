import { o as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { a as useServerFn, t as analyzeResume } from "./hirewise.functions-BaGxhchm.mjs";
import { a as Percent, c as Droplets, d as CircleCheck, f as Briefcase, i as Sparkles, l as Clipboard, n as Upload, r as Target, s as FileText, u as CircleX } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resume-SCH5EgoS.js
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
function ResumePage() {
	const analyze = useServerFn(analyzeResume);
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
		className: "mx-auto max-w-7xl px-6 space-y-6",
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
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-bold uppercase tracking-widest text-electric-glow",
						children: "ATS Resume Analyzer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-3xl font-medium tracking-tight",
						children: "Analyze your resume"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Upload your resume and paste the job description to get an ATS score and detailed feedback."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
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
						transition: { delay: .05 },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-electric-glow" }), " Your Resume"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex h-8 rounded-md bg-secondary p-0.5 ring-1 ring-white/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setInputMode("file");
										setPastedText("");
									},
									className: `h-full px-3 rounded text-xs font-medium transition-colors ${inputMode === "file" ? "bg-input text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5 inline mr-1.5" }), " Upload"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setInputMode("text");
										setFile(null);
									},
									className: `h-full px-3 rounded text-xs font-medium transition-colors ${inputMode === "text" ? "bg-input text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clipboard, { className: "size-3.5 inline mr-1.5" }), " Paste"]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 rounded-2xl border border-white/5 bg-white/5 p-6 glass",
							children: inputMode === "file" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-12 text-sm transition-all ${isDragging ? "border-primary bg-primary/10" : "border-white/15 bg-input/50 hover:bg-input"}`,
								onDragOver: handleDragOver,
								onDragLeave: handleDragLeave,
								onDrop: handleDrop,
								onClick: () => fileInputRef.current?.click(),
								children: [isDragging ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "size-8 text-primary animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary font-medium",
									children: "Drop resume here"
								})] }) : file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-6 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: file.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Click or drag to change"
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-6 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Drag & drop your resume"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: "or click to browse (PDF or DOCX)"
									})]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileInputRef,
									type: "file",
									accept: ".pdf,.docx,application/pdf",
									className: "hidden",
									onChange: (e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: pastedText,
								onChange: (e) => setPastedText(e.target.value),
								placeholder: "Paste your resume text here...",
								className: "w-full h-72 rounded-md bg-input px-4 py-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
							})
						})]
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
						transition: { delay: .1 },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-4 text-electric-glow" }), " Job Description"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-2xl border border-white/5 bg-white/5 p-6 glass space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: "Target role"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: "Job description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: jobDescription,
								onChange: (e) => setJobDescription(e.target.value),
								placeholder: "Paste the full job description here. Include responsibilities, requirements, qualifications, and tech stack...",
								className: "mt-2 w-full h-72 rounded-md bg-input px-4 py-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-2 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy || inputMode === "file" && !file || inputMode === "text" && !pastedText || !jobDescription.trim(),
							className: "h-11 inline-flex items-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors shadow-glow disabled:opacity-60",
							children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Analyzing… ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), " Analyze Resume"] })
						})
					})
				]
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Results, { result })
		]
	});
}
function Results({ result }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 12
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-1 rounded-2xl border border-primary/20 bg-primary/5 p-6 glass shadow-glow flex flex-col items-center justify-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-bold uppercase tracking-widest text-electric-glow",
								children: "ATS Score"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-baseline gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-6xl font-semibold tabular-nums",
									children: result.ats_score
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg text-muted-foreground",
									children: "/100"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 h-2 w-full rounded-full bg-white/5 overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-gradient-brand shadow-glow",
									style: { width: `${result.ats_score}%` }
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass flex flex-col items-center justify-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[10px] font-bold uppercase tracking-widest text-electric-glow flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "size-3.5" }), " Match Percentage"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-baseline gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-6xl font-semibold tabular-nums",
									children: result.match_percentage
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg text-muted-foreground",
									children: "%"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 h-2 w-full rounded-full bg-white/5 overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-gradient-brand",
									style: { width: `${result.match_percentage}%` }
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
							children: "Summary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-foreground/90 leading-relaxed",
							children: result.summary
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), " Matched Keywords"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [result.matched_keywords.length, " keywords found in both resume and job description"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1.5",
							children: result.matched_keywords.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-300 px-2.5 py-1 text-[11px] font-medium ring-1 ring-emerald-500/20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }),
									" ",
									k
								]
							}, k))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" }), " Missing Keywords"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Add these to boost your score"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1.5",
							children: result.missing_keywords.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-300 px-2.5 py-1 text-[11px] font-medium ring-1 ring-rose-500/20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3" }),
									" ",
									k
								]
							}, k))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), " Skills Found"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [result.skills_found.length, " skills present in your resume"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1.5",
							children: result.skills_found.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-300 px-2.5 py-1 text-[11px] font-medium ring-1 ring-emerald-500/20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }),
									" ",
									s
								]
							}, s))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-3.5" }), " Important Skills Missing"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Consider adding these if you have them"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1.5",
							children: result.skills_missing.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-300 px-2.5 py-1 text-[11px] font-medium ring-1 ring-amber-500/20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-3" }),
									" ",
									s
								]
							}, s))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPanel, {
					title: "Resume Strengths",
					items: result.strengths,
					tone: "emerald"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPanel, {
					title: "Areas for Improvement",
					items: result.improvements,
					tone: "amber"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-bold uppercase tracking-widest text-electric-glow",
					children: "Section-wise Feedback"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPanel, {
							title: "Skills",
							body: result.section_feedback.skills
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPanel, {
							title: "Experience",
							body: result.section_feedback.experience
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPanel, {
							title: "Education",
							body: result.section_feedback.education
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPanel, {
							title: "Projects",
							body: result.section_feedback.projects
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPanel, {
							title: "Formatting",
							body: result.section_feedback.formatting
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionPanel, {
							title: "Contact Information",
							body: result.section_feedback.contact_info
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-primary/20 bg-primary/5 p-6 glass",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-sm font-semibold flex items-center gap-2 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-electric-glow" }), " Suggestions to Improve"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-2.5 text-sm",
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
	});
}
function SectionPanel({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-white/5 p-4 ring-1 ring-white/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-foreground/90 leading-relaxed",
			children: body
		})]
	});
}
function ListPanel({ title, items, tone }) {
	if (!items || items.length === 0) return null;
	const dot = tone === "emerald" ? "bg-emerald-400" : "bg-amber-400";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-2.5 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-1.5 size-1.5 shrink-0 rounded-full ${dot}` }), it]
			}, i))
		})]
	});
}
//#endregion
export { ResumePage as component };
