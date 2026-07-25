import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as HireWiseLogo } from "./HireWiseLogo-BvJ6_Qbp.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as Award, i as Target, m as Flame } from "../_libs/lucide-react.mjs";
import { t as Route } from "./u._username-BAYWuQoQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/u._username-tX3AGZhN.js
var import_jsx_runtime = require_jsx_runtime();
function PublicProfile() {
	const { profile, streak, solved, avgInterview, resumeScore, readiness } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "border-b border-white/5 glass",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-14 max-w-5xl items-center justify-between px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HireWiseLogo, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					className: "h-8 inline-flex items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors",
					children: "Create your profile"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-6 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row items-start md:items-center gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-white text-3xl font-bold shadow-glow",
						children: (profile.display_name ?? profile.username)[0]?.toUpperCase()
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl font-medium tracking-tight",
								children: profile.display_name || profile.username
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted-foreground font-mono",
								children: ["@", profile.username]
							}),
							profile.target_role && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm",
								children: ["Targeting: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-electric-glow",
									children: profile.target_role
								})]
							}),
							profile.bio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-foreground/90 max-w-xl",
								children: profile.bio
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid grid-cols-2 md:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Readiness",
							value: String(readiness),
							icon: Target,
							accent: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Streak",
							value: `${streak?.current_streak ?? 0}d`,
							icon: Flame
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Solved",
							value: String(solved),
							icon: Award
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Interview avg",
							value: avgInterview !== null ? `${avgInterview}/10` : "—",
							icon: Award
						})
					]
				}),
				resumeScore !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-sm text-muted-foreground",
					children: ["ATS resume score · ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-foreground",
						children: [resumeScore, "/100"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-16 rounded-2xl border border-primary/20 bg-white/5 p-8 glass text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-bold uppercase tracking-widest text-electric-glow",
							children: "Recruiter-ready"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-lg",
							children: [
								"This is a live snapshot of ",
								profile.display_name || profile.username,
								"'s prep signal."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "mt-6 inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground ring-1 ring-electric-glow/40 hover:bg-electric-glow transition-colors",
							children: "Build your own profile"
						})
					]
				})
			]
		})]
	});
}
function Stat({ label, value, icon: Icon, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl border border-white/5 bg-white/5 p-5 glass ${accent ? "shadow-glow" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5 text-muted-foreground" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-3xl font-medium tabular-nums",
			children: value
		})]
	});
}
//#endregion
export { PublicProfile as component };
