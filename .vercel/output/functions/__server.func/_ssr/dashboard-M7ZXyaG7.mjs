import { o as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, r as require_react, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { r as getDashboard } from "./hirewise.functions-BpXK-sUM.mjs";
import { D as ArrowRight, T as Briefcase, a as Sparkles, h as FileText, i as Target, l as PanelsTopLeft, r as Trash2, s as PenTool, v as Download, w as Calendar } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-M7ZXyaG7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MOCK_RESUMES = [{
	id: "r1",
	name: "Alex_Chen_Software_Engineer.pdf",
	template: "Modern Clean",
	lastEdited: "2 days ago",
	atsScore: 82,
	targetRole: "Full Stack Developer"
}, {
	id: "r2",
	name: "Alex_Chen_Resume_Backend.pdf",
	template: "Classic Professional",
	lastEdited: "1 week ago",
	atsScore: 76,
	targetRole: "Backend Developer"
}];
var MOCK_ANALYSES = [
	{
		id: "a1",
		resumeName: "Alex_Chen_Software_Engineer.pdf",
		targetRole: "Senior Full Stack Engineer",
		atsScore: 78,
		date: "2 days ago",
		keywordMatch: 74
	},
	{
		id: "a2",
		resumeName: "Alex_Chen_Resume_Backend.pdf",
		targetRole: "Node.js Developer",
		atsScore: 81,
		date: "5 days ago",
		keywordMatch: 85
	},
	{
		id: "a3",
		resumeName: "Pasted Resume Text",
		targetRole: "Full Stack Developer",
		atsScore: 69,
		date: "1 week ago",
		keywordMatch: 62
	}
];
var TEMPLATES_USED = [{
	id: "t1",
	name: "Modern Clean",
	uses: 12,
	color: "from-cyan-400 to-blue-500"
}, {
	id: "t2",
	name: "Classic Professional",
	uses: 5,
	color: "from-blue-500 to-indigo-500"
}];
function Dashboard() {
	const router = useRouter();
	const fn = useServerFn(getDashboard);
	const { data, isLoading } = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => fn()
	});
	const [resumes, setResumes] = (0, import_react.useState)(MOCK_RESUMES);
	const [analyses] = (0, import_react.useState)(MOCK_ANALYSES);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	function deleteResume(id) {
		setDeleting(id);
		setTimeout(() => {
			setResumes((r) => r.filter((x) => x.id !== id));
			setDeleting(null);
			toast.success("Resume deleted");
		}, 400);
	}
	if (isLoading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-2xl bg-white/5" })
	});
	const hasResumes = resumes.length > 0;
	const avgAts = analyses.length ? Math.round(analyses.reduce((s, a) => s + a.atsScore, 0) / analyses.length) : 0;
	const avgAtsBar = analyses.length ? avgAts : 0;
	const savedResumeBar = Math.min(resumes.length / 5 * 100, 100);
	const analysesBar = Math.min(analyses.length / 10 * 100, 100);
	const templatesBar = Math.min(TEMPLATES_USED.length / 5 * 100, 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-6 space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-baseline justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-bold uppercase tracking-widest text-electric-glow",
						children: "Dashboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-1 text-3xl font-medium tracking-tight",
						children: [
							"Welcome back",
							data.profile?.display_name ? ", " + data.profile.display_name.split(" ")[0] : "",
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Manage your resumes, review analyses, and access your templates."
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Saved Resumes",
						value: String(resumes.length),
						sub: resumes.length === 1 ? "document" : "documents",
						bar: savedResumeBar,
						icon: FileText,
						accent: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Analyses Run",
						value: String(analyses.length),
						sub: "total",
						bar: analysesBar,
						icon: Sparkles
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Avg ATS Score",
						value: analyses.length ? String(avgAts) : "—",
						sub: analyses.length ? "across runs" : "no data",
						bar: avgAtsBar,
						icon: Target
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						label: "Templates Used",
						value: String(TEMPLATES_USED.length),
						sub: "styles tried",
						bar: templatesBar,
						icon: PanelsTopLeft
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-semibold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-electric-glow" }), " Saved Resumes"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								"Download, ",
								resumes.length,
								" saved"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/resume-builder",
							className: "h-8 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenTool, { className: "size-3.5" }), " New Resume"]
						})]
					}), !hasResumes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						className: "py-10 text-center",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-10 text-muted-foreground/40" }),
						title: "No resumes saved yet",
						subtitle: "Create your first professional resume or paste one in to get started.",
						actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/resume-builder",
								className: "inline-flex items-center gap-2 h-9 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenTool, { className: "size-4" }), " Build a Resume"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/resume",
								className: "inline-flex items-center gap-2 h-9 rounded-md bg-secondary px-4 text-xs font-medium ring-1 ring-white/10 hover:bg-accent transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), " Analyze Existing"]
							})]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-white/5 rounded-xl border border-white/10 overflow-hidden",
						children: resumes.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-4 px-5 py-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium truncate",
										children: r.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelsTopLeft, { className: "size-3" }),
													" ",
													r.template
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-3" }),
													" ",
													r.targetRole
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3" }),
													" ",
													r.lastEdited
												]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "ATS Score"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-0.5 flex items-baseline gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xl font-semibold tabular-nums",
													children: r.atsScore
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground",
													children: "/ 100"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 h-1 w-20 rounded-full bg-white/5 overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `h-full rounded-full ${r.atsScore >= 80 ? "bg-emerald-400" : r.atsScore >= 60 ? "bg-amber-400" : "bg-rose-400"}`,
													style: { width: `${r.atsScore}%` }
												})
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => toast.success("Downloading PDF... (demo)"),
												className: "flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors",
												title: "Download",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/resume-builder",
												className: "flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors",
												title: "Edit",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenTool, { className: "size-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => deleteResume(r.id),
												disabled: deleting === r.id,
												className: "flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-60",
												title: "Delete",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: `size-4 ${deleting === r.id ? "animate-spin" : ""}` })
											})
										]
									})]
								})
							]
						}, r.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-2 rounded-2xl border border-white/5 bg-white/5 p-6 glass",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-electric-glow" }), " Recent Analyses"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [analyses.length, " analyses"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/resume",
								className: "h-8 inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 text-xs font-medium ring-1 ring-white/10 hover:bg-accent transition-colors",
								children: ["New Analysis ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
							})]
						}), analyses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
							className: "py-8 text-center",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-10 text-muted-foreground/40" }),
							title: "No analyses yet",
							subtitle: "Upload a resume to get an ATS compatibility report."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2.5",
							children: analyses.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => router.navigate({ to: "/resume" }),
								className: "group flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium truncate",
										children: a.resumeName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 flex items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-3" }),
													" ",
													a.targetRole
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3" }),
													" ",
													a.date
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-3" }),
													" Keywords ",
													a.keywordMatch,
													"%"
												]
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "ml-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreBadge, { value: a.atsScore })
								})]
							}, a.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-white/5 bg-white/5 p-6 glass",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "mb-4 text-sm font-semibold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelsTopLeft, { className: "size-4 text-electric-glow" }), " Templates Used"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-2.5",
									children: TEMPLATES_USED.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between rounded-lg border border-white/10 px-3 py-2.5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-7 h-9 rounded bg-gradient-to-br ${t.color} ring-1 ring-white/10` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-medium",
												children: t.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[10px] text-muted-foreground",
												children: [t.uses, " edits"]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/resume-builder",
											className: "text-[10px] font-bold uppercase tracking-widest text-primary hover:text-electric-glow transition-colors",
											children: "Use"
										})]
									}, t.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/resume-builder",
									className: "mt-4 block h-8 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-secondary text-xs font-medium ring-1 ring-white/10 hover:bg-accent transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelsTopLeft, { className: "size-3.5" }), " Explore all templates"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-primary/20 bg-primary/5 p-6 glass",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-semibold flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-electric-glow" }), " Quick actions"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
										to: "/resume",
										icon: Sparkles,
										label: "Analyze Resume",
										primary: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
										to: "/resume-builder",
										icon: PenTool,
										label: "Build New Resume"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickAction, {
										to: "/job-match",
										icon: Briefcase,
										label: "Check Job Match"
									})
								]
							})]
						})]
					})]
				})]
			})
		]
	});
}
function MetricCard({ label, value, sub, bar, icon: Icon, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		className: `rounded-2xl border border-white/5 p-5 glass ${accent ? "shadow-glow" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5 text-muted-foreground" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-baseline gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-4xl font-medium tabular-nums",
					children: value
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: sub
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-1 w-full rounded-full bg-white/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `h-full rounded-full ${accent ? "bg-gradient-brand shadow-glow" : "bg-primary/70"}`,
					style: { width: `${Math.max(bar, 4)}%` }
				})
			})
		]
	});
}
function QuickAction({ to, icon: Icon, label, primary }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${primary ? "bg-primary text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow" : "bg-secondary ring-1 ring-white/10 hover:bg-accent"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }),
				" ",
				label
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5 opacity-60" })]
	});
}
function ScoreBadge({ value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${value >= 80 ? "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20" : value >= 60 ? "text-amber-400 bg-amber-500/10 ring-amber-500/20" : "text-rose-400 bg-rose-500/10 ring-rose-500/20"}`,
		children: [
			value,
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] opacity-70",
				children: "/100"
			})
		]
	});
}
function Empty({ className, icon, title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex flex-col items-center ${className ?? ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: title
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground max-w-xs",
				children: subtitle
			}),
			actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap items-center justify-center gap-2",
				children: actions
			})
		]
	});
}
//#endregion
export { Dashboard as component };
