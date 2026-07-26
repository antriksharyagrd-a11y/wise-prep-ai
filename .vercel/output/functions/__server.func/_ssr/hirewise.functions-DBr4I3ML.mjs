import { o as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { O as isRedirect, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-BCSYJ7Za.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hirewise.functions-DBr4I3ML.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var analyzeResumePublic = createServerFn({ method: "POST" }).inputValidator((i) => objectType({
	fileName: stringType(),
	extractedText: stringType().min(20),
	targetRole: stringType(),
	jobDescription: stringType().optional().default("")
}).parse(i)).handler(createSsrRpc("dbc3edd5aabd6b257a45c573bd3b62447151c808c9847a1da92812750cd37c6e"));
var analyzeResume = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	fileName: stringType(),
	extractedText: stringType().min(20),
	targetRole: stringType(),
	jobDescription: stringType().optional().default("")
}).parse(i)).handler(createSsrRpc("cd6e44486248f66b529cb98a9f2c27cc52e48d84a7b83e2cff4f7a82974dc18d"));
var getDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ec71bb26942953bcd108a47c3c71dc900811c8b45bf6b6009ba3ae0e3f6d7017"));
var updateProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	display_name: stringType().max(60).optional(),
	bio: stringType().max(280).optional(),
	target_role: stringType().max(80).optional(),
	username: stringType().min(3).max(30).regex(/^[a-z0-9_]+$/).optional()
}).parse(i)).handler(createSsrRpc("14541eed963da7e9df4af98355df93c367cc8d107fd20a6fdd02052918ee98ba"));
//#endregion
export { useServerFn as a, updateProfile as i, analyzeResumePublic as n, getDashboard as r, analyzeResume as t };
