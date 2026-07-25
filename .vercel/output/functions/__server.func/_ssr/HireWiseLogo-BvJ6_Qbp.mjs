import { i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/HireWiseLogo-BvJ6_Qbp.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function HireWiseLogo({ className, showText = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative flex size-9 items-center justify-center rounded-lg bg-gradient-brand ring-1 ring-white/25 shadow-glow",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 24 24",
				className: "size-5 text-white",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M4 14c0-4.4 3.6-8 8-8 2.2 0 4.2.9 5.7 2.3",
						opacity: "0.85"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M8 18v2M11 20v-2M14 20v-2",
						opacity: "0.6"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M13 15l3-3 3 3M16 12v8" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "10",
						cy: "10",
						r: "1",
						fill: "currentColor"
					})
				]
			})
		}), showText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-lg font-semibold tracking-tight",
			children: ["Hire", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-gradient-brand",
				children: "Wise"
			})]
		})]
	});
}
//#endregion
export { HireWiseLogo as t };
