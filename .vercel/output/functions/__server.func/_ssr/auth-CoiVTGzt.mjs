import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-CraBf8HK.mjs";
import { i as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as HireWiseLogo } from "./HireWiseLogo-BvJ6_Qbp.mjs";
import { _ as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CoiVTGzt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		redirect_uri: opts?.redirect_uri,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function AuthPage() {
	const nav = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		supabase.auth.getSession().then(({ data }) => {
			if (mounted && data.session) nav({ to: "/dashboard" });
		});
		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
			if (mounted && (event === "SIGNED_IN" || event === "SIGNED_UP") && session) nav({ to: "/dashboard" });
		});
		return () => {
			mounted = false;
			authListener.subscription.unsubscribe();
		};
	}, [nav]);
	async function submit(e) {
		e.preventDefault();
		setLoading(true);
		try {
			if (mode === "signup") {
				const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: { display_name: displayName }
					}
				});
				if (signUpError) throw signUpError;
				if (!signUpData.session) {
					const { error: signInError } = await supabase.auth.signInWithPassword({
						email,
						password
					});
					if (signInError) toast.success("Account created. Please confirm your email if prompted.");
					else toast.success("Account created. Welcome!");
				} else toast.success("Account created. Welcome!");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				toast.success("Signed in");
			}
			await new Promise((r) => setTimeout(r, 150));
			const { data: sessionCheck } = await supabase.auth.getSession();
			if (!sessionCheck.session) throw new Error("Session could not be established. Please sign in manually.");
			nav({ to: "/dashboard" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Auth failed");
		} finally {
			setLoading(false);
		}
	}
	async function google() {
		const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
		if (result.error) {
			toast.error("Google sign-in failed");
			return;
		}
		if (result.redirected) return;
		nav({ to: "/dashboard" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-screen circuit-bg flex items-center justify-center px-6 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			initial: {
				opacity: 0,
				y: 12
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: { duration: .5 },
			className: "w-full max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "flex justify-center mb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HireWiseLogo, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-6 shadow-glow",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-medium tracking-tight",
						children: mode === "signin" ? "Welcome back" : "Create your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: mode === "signin" ? "Sign in to access your resumes." : "Start building better resumes in under a minute."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: google,
						className: "mt-6 w-full h-10 inline-flex items-center justify-center gap-2 rounded-md bg-white text-navy-950 text-sm font-medium hover:bg-white/90 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 24 24",
							className: "size-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#4285F4",
									d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#34A853",
									d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#FBBC05",
									d: "M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#EA4335",
									d: "M12 5.38c1.62 0 3.06.56 4.2 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
								})
							]
						}), "Continue with Google"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-white/10" }),
							" or ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-white/10" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-3",
						children: [
							mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: displayName,
								onChange: (e) => setDisplayName(e.target.value),
								placeholder: "Display name",
								className: "w-full h-10 rounded-md bg-input px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-primary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true,
								type: "email",
								placeholder: "you@work.com",
								className: "w-full h-10 rounded-md bg-input px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-primary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								type: "password",
								placeholder: "Password",
								className: "w-full h-10 rounded-md bg-input px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-primary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: loading,
								className: "w-full h-10 rounded-md bg-primary text-primary-foreground text-sm font-medium ring-1 ring-electric-glow/40 hover:bg-electric-glow disabled:opacity-60 transition-colors",
								children: loading ? "…" : mode === "signin" ? "Sign in" : "Create account"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
						className: "mt-4 w-full text-xs text-muted-foreground hover:text-foreground transition-colors",
						children: mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"
					})
				]
			})]
		})]
	});
}
//#endregion
export { AuthPage as component };
