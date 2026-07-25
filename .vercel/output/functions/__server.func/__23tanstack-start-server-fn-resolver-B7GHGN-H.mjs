//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-B7GHGN-H.js
var manifest = {
	"14541eed963da7e9df4af98355df93c367cc8d107fd20a6fdd02052918ee98ba": {
		functionName: "updateProfile_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-CJJFrHBH.mjs")
	},
	"3b56f3b1d4a254f5152a1bd669eab1a5832204e31e5dd23726a8c593f645fa5b": {
		functionName: "getPublicProfile_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-CJJFrHBH.mjs")
	},
	"48aa35980fd7f5b55dee3e00bca29f46ce4e603d16c0eb74731e24680dba1835": {
		functionName: "startInterview_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-CJJFrHBH.mjs")
	},
	"4956acb034a961a9e6bd58b2f008fa36229b5212601eddbcbe3b318ea4cd39f1": {
		functionName: "saveAttempt_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-CJJFrHBH.mjs")
	},
	"5b07b3c21ec5038f0f5ec13a624b5edbd4616ffc1fdfc311629fbca45eddfc26": {
		functionName: "getProgress_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-CJJFrHBH.mjs")
	},
	"63c31c07ab6c10923af7d2c5e384a3a9901b587b19399352234c3e35b0e4889d": {
		functionName: "getInterview_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-CJJFrHBH.mjs")
	},
	"8742058a309f010bbe3659c41ccef297fa0ca4692571745ce3a29d2bb7881c74": {
		functionName: "replyInterview_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-CJJFrHBH.mjs")
	},
	"97cd36c76d506b6506967b0ccd50dff6d6785cd9ac2f10d610c2deef7428eeca": {
		functionName: "explainWithAI_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-CJJFrHBH.mjs")
	},
	"cb089af0f2ec6274cda00d90a551904066da6f180cfeef0cb157f7ff35049189": {
		functionName: "getTodayQuestion_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-CJJFrHBH.mjs")
	},
	"cd6e44486248f66b529cb98a9f2c27cc52e48d84a7b83e2cff4f7a82974dc18d": {
		functionName: "analyzeResume_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-CJJFrHBH.mjs")
	},
	"dbc3edd5aabd6b257a45c573bd3b62447151c808c9847a1da92812750cd37c6e": {
		functionName: "analyzeResumePublic_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-CJJFrHBH.mjs")
	},
	"ec71bb26942953bcd108a47c3c71dc900811c8b45bf6b6009ba3ae0e3f6d7017": {
		functionName: "getDashboard_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-CJJFrHBH.mjs")
	},
	"f3f6478b15fd973819df5f7aea1dce77a2d0a8429ebac47dfacb42d65b2ef944": {
		functionName: "finalizeInterview_createServerFn_handler",
		importer: () => import("./_ssr/hirewise.functions-CJJFrHBH.mjs")
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
