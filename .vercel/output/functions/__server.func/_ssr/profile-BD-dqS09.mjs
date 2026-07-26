import { o as __toESM } from "../_runtime.mjs";
import { i as require_jsx_runtime, r as require_react, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useServerFn, i as updateProfile, r as getDashboard } from "./hirewise.functions-BaGxhchm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-BD-dqS09.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const fn = useServerFn(getDashboard);
	const update = useServerFn(updateProfile);
	const { data, refetch } = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => fn()
	});
	const p = data?.profile;
	const [form, setForm] = (0, import_react.useState)({
		username: "",
		display_name: "",
		target_role: "",
		bio: ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (p) setForm({
			username: p.username ?? "",
			display_name: p.display_name ?? "",
			target_role: p.target_role ?? "",
			bio: p.bio ?? ""
		});
	}, [p]);
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-2xl bg-white/5" })
	});
	async function submit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			await update({ data: form });
			toast.success("Profile updated");
			await refetch();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-2xl px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "rounded-2xl border border-white/5 bg-white/5 p-8 glass space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-bold uppercase tracking-widest text-electric-glow",
						children: "Public profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl font-medium",
						children: "Edit profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: ["Public URL: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono",
							children: ["/u/", form.username]
						})]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Username",
					value: form.username,
					onChange: (v) => setForm({
						...form,
						username: v
					}),
					placeholder: "alex"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Display name",
					value: form.display_name,
					onChange: (v) => setForm({
						...form,
						display_name: v
					}),
					placeholder: "Alex Chen"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Target role",
					value: form.target_role,
					onChange: (v) => setForm({
						...form,
						target_role: v
					}),
					placeholder: "Senior Frontend Engineer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
					children: "Bio"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: form.bio,
					onChange: (e) => setForm({
						...form,
						bio: e.target.value
					}),
					maxLength: 280,
					rows: 3,
					className: "mt-2 w-full rounded-md bg-input px-3 py-2 text-sm ring-1 ring-white/10 focus:ring-primary outline-none"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: busy,
					className: "h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium ring-1 ring-electric-glow/40 hover:bg-electric-glow disabled:opacity-60",
					children: busy ? "Saving…" : "Save"
				})
			]
		})
	});
}
function Field({ label, value, onChange, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		value,
		onChange: (e) => onChange(e.target.value),
		placeholder,
		className: "mt-2 w-full h-10 rounded-md bg-input px-3 text-sm ring-1 ring-white/10 focus:ring-primary outline-none"
	})] });
}
//#endregion
export { ProfilePage as component };
