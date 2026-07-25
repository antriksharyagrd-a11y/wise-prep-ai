import { o as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as analyzeResume } from "./hirewise.functions-BpXK-sUM.mjs";
import { _ as Droplets, h as FileText, n as Upload, y as Clipboard } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resume-CN3-WhCz.js
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
	const [targetRole, setTargetRole] = (0, import_react.useState)("Frontend Engineer");
	const [roleInput, setRoleInput] = (0, import_react.useState)("Frontend Engineer");
	const [roleDropdownOpen, setRoleDropdownOpen] = (0, import_react.useState)(false);
	const [roleHighlight, setRoleHighlight] = (0, import_react.useState)(-1);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [pastedText, setPastedText] = (0, import_react.useState)("");
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
	const handlePaste = (0, import_react.useCallback)(async (e) => {
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
	async function submit(e) {
		e.preventDefault();
		let textToAnalyze = "";
		let fileName = "pasted-resume.txt";
		if (inputMode === "file" && file) try {
			textToAnalyze = await extractText(file);
			fileName = file.name;
		} catch (err) {
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
		setBusy(true);
		try {
			const r = await analyze({ data: {
				fileName,
				extractedText: textToAnalyze,
				targetRole
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
		className: "mx-auto max-w-4xl px-6 space-y-6",
		onPaste: handlePaste,
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
					children: "Resume analysis"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "PDF, DOCX, or paste text directly. Text is parsed in your browser, then evaluated by AI."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-6 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setInputMode("file");
							setPastedText("");
						},
						className: `flex-1 h-9 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${inputMode === "file" ? "bg-primary text-primary-foreground" : "bg-input/50 text-muted-foreground hover:bg-input"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "File"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setInputMode("text");
							setFile(null);
						},
						className: `flex-1 h-9 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${inputMode === "text" ? "bg-primary text-primary-foreground" : "bg-input/50 text-muted-foreground hover:bg-input"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clipboard, { className: "size-4" }), "Paste Text"]
					})]
				}),
				inputMode === "file" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `mt-2 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed px-4 py-10 text-sm transition-all ${isDragging ? "border-primary bg-primary/10" : "border-white/15 bg-input/50 hover:bg-input"}`,
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
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: pastedText,
						onChange: (e) => setPastedText(e.target.value),
						placeholder: "Paste your resume text here...",
						className: "w-full h-64 rounded-md bg-input px-4 py-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none resize-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-2",
						children: "Tip: You can also press Ctrl/Cmd+V anywhere on this page to paste"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: busy || inputMode === "file" && !file || inputMode === "text" && !pastedText,
					className: "mt-6 w-full h-11 rounded-md bg-primary text-primary-foreground text-sm font-medium ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors disabled:opacity-60",
					children: busy ? "Analyzing…" : "Analyze resume"
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
			className: "rounded-2xl border border-primary/20 bg-white/5 p-8 glass",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreGauge, { value: result.ats_score }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-bold uppercase tracking-widest text-electric-glow",
						children: "ATS Score"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-3xl font-medium",
						children: [result.ats_score, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg text-muted-foreground",
							children: "/100"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground max-w-lg",
						children: result.summary
					})
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-1 md:grid-cols-2 gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Formatting",
						body: result.formatting
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Keyword match",
						body: result.keyword_match
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPanel, {
						title: "Missing sections",
						items: result.missing_sections,
						tone: "electric"
					})
				]
			})]
		})]
	});
}
function ScoreGauge({ value }) {
	const c = 2 * Math.PI * 42;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative size-24 shrink-0",
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
					stroke: "url(#gr)",
					className: "fill-none",
					strokeDasharray: c,
					strokeDashoffset: c * (1 - value / 100)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "gr",
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
function Panel({ title, body }) {
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
	const dot = tone === "emerald" ? "bg-emerald-400" : tone === "amber" ? "bg-amber-400" : "bg-electric-glow";
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
//#endregion
export { ResumePage as component };
