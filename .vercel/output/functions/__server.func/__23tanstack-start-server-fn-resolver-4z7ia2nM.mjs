//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-4z7ia2nM.js
var manifest = {
	"14541eed963da7e9df4af98355df93c367cc8d107fd20a6fdd02052918ee98ba": {
		functionName: "updateProfile_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-B_2AfLbO.mjs")
	},
	"cd6e44486248f66b529cb98a9f2c27cc52e48d84a7b83e2cff4f7a82974dc18d": {
		functionName: "analyzeResume_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-B_2AfLbO.mjs")
	},
	"dbc3edd5aabd6b257a45c573bd3b62447151c808c9847a1da92812750cd37c6e": {
		functionName: "analyzeResumePublic_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-B_2AfLbO.mjs")
	},
	"ec71bb26942953bcd108a47c3c71dc900811c8b45bf6b6009ba3ae0e3f6d7017": {
		functionName: "getDashboard_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-B_2AfLbO.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
