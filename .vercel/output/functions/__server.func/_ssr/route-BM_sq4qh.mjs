import { t as supabase } from "./client-BFmJXiLp.mjs";
import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as HireWiseLogo } from "./HireWiseLogo-BvJ6_Qbp.mjs";
import { d as Outlet, h as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Sparkles, o as LogOut, t as User } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-BM_sq4qh.js
var import_jsx_runtime = require_jsx_runtime();
function AuthedShell() {
	const router = useRouter();
	async function signOut() {
		await supabase.auth.signOut();
		toast.success("Signed out");
		router.navigate({ to: "/" });
	}
	const nav = [{
		to: "/resume",
		label: "ATS Analyzer",
		icon: Sparkles
	}, {
		to: "/profile",
		label: "Profile",
		icon: User
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "fixed top-0 z-40 w-full border-b border-white/5 glass",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-14 max-w-7xl items-center justify-between px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/resume",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HireWiseLogo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:flex items-center gap-1",
						children: nav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.to,
							className: "px-3 h-8 inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors [&.active]:text-foreground [&.active]:bg-white/5",
							activeProps: { className: "active" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "size-3.5" }),
								" ",
								n.label
							]
						}, n.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: signOut,
						className: "inline-flex items-center gap-1 h-8 rounded-md px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), " Sign out"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:hidden border-t border-white/5 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 px-3 py-2",
					children: nav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: n.to,
						className: "shrink-0 px-3 h-8 inline-flex items-center gap-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 [&.active]:text-foreground [&.active]:bg-white/5",
						activeProps: { className: "active" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "size-3.5" }),
							" ",
							n.label
						]
					}, n.to))
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pt-24 md:pt-20 pb-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
//#endregion
export { AuthedShell as component };
