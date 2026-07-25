import { o as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { S as ChevronRight, T as Briefcase, _ as Droplets, a as Sparkles, b as CircleX, h as FileText, i as Target, n as Upload, o as Percent, x as CircleCheck, y as Clipboard } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/job-match-qF64shQk.js
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
function JobMatchPage() {
	const [resumeMode, setResumeMode] = (0, import_react.useState)("text");
	const [file, setFile] = (0, import_react.useState)(null);
	const [resumeText, setResumeText] = (0, import_react.useState)("");
	const [jobDescription, setJobDescription] = (0, import_react.useState)("");
	const [roleInput, setRoleInput] = (0, import_react.useState)("");
	const [roleDropdownOpen, setRoleDropdownOpen] = (0, import_react.useState)(false);
	const [roleHighlight, setRoleHighlight] = (0, import_react.useState)(-1);
	const roleInputRef = (0, import_react.useRef)(null);
	const roleDropdownRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const filteredRoles = roleInput.trim() === "" ? ALL_ROLES : ALL_ROLES.filter((r) => r.toLowerCase().includes(roleInput.toLowerCase()));
	const onDrop = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		setIsDragging(false);
		const f = e.dataTransfer.files?.[0];
		if (f) handleFile(f);
	}, []);
	function handleFile(f) {
		if (f.size > 5 * 1024 * 1024) {
			toast.error("File too large. Max 5MB.");
			return;
		}
		setFile(f);
	}
	async function handleAnalyze() {
		if (!(resumeMode === "file" ? file : resumeText.trim())) {
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
			setResult({
				score: 74,
				matched: [
					"React",
					"TypeScript",
					"Node.js",
					"REST APIs",
					"Git",
					"Agile",
					"Problem Solving",
					"Communication"
				],
				missing: [
					"AWS",
					"Kubernetes",
					"Docker",
					"CI/CD Pipelines",
					"System Design",
					"Microservices",
					"PostgreSQL"
				],
				suggestions: [
					"Add AWS or cloud experience — mentioned 4 times in JD.",
					"Include Kubernetes/Docker containerization experience.",
					"Show impact with numbers: % improvements, users served, revenue.",
					"Add a 'System Design' bullet or section if relevant.",
					"Mention CI/CD tooling: GitHub Actions, Jenkins, etc."
				],
				keywordMatch: 68
			});
			toast.success("Match analysis complete!");
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
						children: "Job Match Checker"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-3xl font-medium tracking-tight",
						children: "See how well you fit the role"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Upload your resume, paste the job description, and get a personalized match report with missing skills."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
								onClick: () => setResumeMode("file"),
								className: `h-full px-3 rounded text-xs font-medium transition-colors ${resumeMode === "file" ? "bg-input text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5 inline mr-1.5" }), " Upload"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setResumeMode("text"),
								className: `h-full px-3 rounded text-xs font-medium transition-colors ${resumeMode === "text" ? "bg-input text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clipboard, { className: "size-3.5 inline mr-1.5" }), " Paste"]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 rounded-2xl border border-white/5 bg-white/5 p-6 glass h-[420px] flex flex-col",
						children: resumeMode === "file" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileInputRef,
							type: "file",
							accept: ".pdf,.docx,.doc,.txt",
							className: "hidden",
							onChange: (e) => e.target.files?.[0] && handleFile(e.target.files[0])
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => fileInputRef.current?.click(),
							onDragOver: (e) => {
								e.preventDefault();
								setIsDragging(true);
							},
							onDragLeave: () => setIsDragging(false),
							onDrop,
							className: `group relative flex-1 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 ${isDragging ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20 bg-white/[0.02]"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `mb-3 flex size-14 items-center justify-center rounded-2xl ring-1 ring-white/10 ${isDragging ? "bg-primary/20 ring-primary/30" : "bg-secondary"}`,
									children: isDragging ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Droplets, { className: "size-6 text-primary animate-pulse" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-6 text-muted-foreground" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: isDragging ? "Drop your resume here" : file ? file.name : "Click to upload or drag & drop"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: file ? `${(file.size / 1024).toFixed(1)} KB` : "PDF, DOCX, TXT • Max 5MB"
								})
							]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: resumeText,
							onChange: (e) => setResumeText(e.target.value),
							placeholder: "Paste your resume text here...\nExperience, education, skills, projects, etc.",
							className: "flex-1 w-full rounded-md bg-input px-4 py-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none font-mono text-xs leading-relaxed"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
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
						className: "mt-3 rounded-2xl border border-white/5 bg-white/5 p-6 glass h-[420px] flex flex-col space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
							children: "Target Role (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: roleInputRef,
									type: "text",
									value: roleInput,
									onChange: (e) => setRoleInput(e.target.value),
									onFocus: () => setRoleDropdownOpen(true),
									onKeyDown: (e) => {
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
									},
									placeholder: "e.g. Senior Full Stack Engineer",
									className: "w-full h-9 rounded-md bg-input px-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none pr-8"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
										className: "h-3.5 w-3.5 text-muted-foreground",
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
									className: "absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-md bg-[#1a1a2e] border border-white/10 shadow-xl ring-1 ring-black/5",
									children: filteredRoles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "px-3 py-3 text-xs text-muted-foreground text-center",
										children: "Using custom role"
									}) : TARGET_ROLES.map((g) => {
										const roles = g.roles.filter((r) => roleInput.trim() === "" ? true : r.toLowerCase().includes(roleInput.toLowerCase()));
										if (roles.length === 0) return null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-electric-glow/80 bg-white/[0.02] border-b border-white/5",
											children: g.group
										}), roles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											onMouseDown: (e) => {
												e.preventDefault();
												setRoleInput(r);
												setRoleDropdownOpen(false);
											},
											onMouseEnter: () => setRoleHighlight(filteredRoles.indexOf(r)),
											className: `px-3 py-1.5 text-xs cursor-pointer transition-colors ${filteredRoles.indexOf(r) === roleHighlight ? "bg-primary/20" : "hover:bg-white/5"}`,
											children: r
										}, r))] }, g.group);
									})
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-h-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
								children: "Job Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: jobDescription,
								onChange: (e) => setJobDescription(e.target.value),
								placeholder: "Paste the full job description here.\n\nInclude: responsibilities, requirements, preferred qualifications, tech stack, etc.\n\nExample:\nWe're looking for a Senior Full Stack Engineer with 5+ years of experience building production React apps...\n\nRequired:\n- React, TypeScript, Node.js\n- AWS, Docker, Kubernetes\n- ...",
								className: "mt-1.5 h-[290px] w-full rounded-md bg-input px-4 py-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleAnalyze,
					disabled: busy,
					className: "h-11 inline-flex items-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors shadow-glow disabled:opacity-60",
					children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Analyzing match... ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block size-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }),
						" Analyze Match ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
					] })
				})
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-1 rounded-2xl border border-primary/20 bg-primary/5 p-6 glass shadow-glow flex flex-col items-center justify-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-bold uppercase tracking-widest text-electric-glow",
									children: "Match Score"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-baseline gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-6xl font-semibold tabular-nums",
										children: result.score
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "size-6 text-primary mt-3" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: "Good match — address gaps to reach 90%+"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 h-2 w-full rounded-full bg-white/5 overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full bg-gradient-brand shadow-glow",
										style: { width: `${result.score}%` }
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), " Matched Skills"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: [
										"You have ",
										result.matched.length,
										" of the required keywords"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-wrap gap-1.5",
									children: result.matched.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-300 px-2.5 py-1 text-[11px] font-medium ring-1 ring-emerald-500/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }),
											" ",
											s
										]
									}, s))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" }), " Missing Skills"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted-foreground",
									children: "Add these to boost your score"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-wrap gap-1.5",
									children: result.missing.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-300 px-2.5 py-1 text-[11px] font-medium ring-1 ring-rose-500/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3" }),
											" ",
											s
										]
									}, s))
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-semibold flex items-center gap-2 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-4 text-electric-glow" }), " At-a-glance"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2.5 text-sm",
							children: [
								[
									"Match Score",
									`${result.score}%`,
									"text-primary"
								],
								[
									"Keyword Match",
									`${result.keywordMatch}%`,
									"text-foreground/90"
								],
								[
									"Skills Matched",
									`${result.matched.length}`,
									"text-emerald-400"
								],
								[
									"Skills Missing",
									`${result.missing.length}`,
									"text-rose-400"
								]
							].map(([k, v, c]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between border-b border-white/5 pb-2.5 last:border-0 last:pb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: k
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `font-semibold tabular-nums ${c}`,
									children: v
								})]
							}, k))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-semibold flex items-center gap-2 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-electric-glow" }), " Suggested Improvements"]
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
					})]
				})]
			})
		]
	});
}
//#endregion
export { JobMatchPage as component };
