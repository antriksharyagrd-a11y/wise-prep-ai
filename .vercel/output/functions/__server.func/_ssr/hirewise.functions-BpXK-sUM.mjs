import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-B7GHGN-H.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { At as objectType, Dt as booleanType, Ot as enumType, jt as stringType, kt as numberType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hirewise.functions-BpXK-sUM.js
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
createServerFn({ method: "GET" }).handler(createSsrRpc("cb089af0f2ec6274cda00d90a551904066da6f180cfeef0cb157f7ff35049189"));
var getPublicProfile = createServerFn({ method: "GET" }).inputValidator((i) => objectType({ username: stringType() }).parse(i)).handler(createSsrRpc("3b56f3b1d4a254f5152a1bd669eab1a5832204e31e5dd23726a8c593f645fa5b"));
var getDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ec71bb26942953bcd108a47c3c71dc900811c8b45bf6b6009ba3ae0e3f6d7017"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	questionId: stringType(),
	code: stringType(),
	language: stringType(),
	solved: booleanType()
}).parse(i)).handler(createSsrRpc("4956acb034a961a9e6bd58b2f008fa36229b5212601eddbcbe3b318ea4cd39f1"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	questionId: stringType(),
	code: stringType(),
	language: stringType()
}).parse(i)).handler(createSsrRpc("97cd36c76d506b6506967b0ccd50dff6d6785cd9ac2f10d610c2deef7428eeca"));
objectType({
	role: enumType([
		"system",
		"user",
		"assistant"
	]),
	content: stringType(),
	confidence: numberType().optional()
});
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({ roleDomain: stringType() }).parse(i)).handler(createSsrRpc("48aa35980fd7f5b55dee3e00bca29f46ce4e603d16c0eb74731e24680dba1835"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	interviewId: stringType(),
	userMessage: stringType(),
	confidence: numberType().nullable().optional()
}).parse(i)).handler(createSsrRpc("8742058a309f010bbe3659c41ccef297fa0ca4692571745ce3a29d2bb7881c74"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({ interviewId: stringType() }).parse(i)).handler(createSsrRpc("f3f6478b15fd973819df5f7aea1dce77a2d0a8429ebac47dfacb42d65b2ef944"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({ id: stringType() }).parse(i)).handler(createSsrRpc("63c31c07ab6c10923af7d2c5e384a3a9901b587b19399352234c3e35b0e4889d"));
var analyzeResumePublic = createServerFn({ method: "POST" }).inputValidator((i) => objectType({
	fileName: stringType(),
	extractedText: stringType().min(20),
	targetRole: stringType()
}).parse(i)).handler(createSsrRpc("dbc3edd5aabd6b257a45c573bd3b62447151c808c9847a1da92812750cd37c6e"));
var analyzeResume = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	fileName: stringType(),
	extractedText: stringType().min(20),
	targetRole: stringType()
}).parse(i)).handler(createSsrRpc("cd6e44486248f66b529cb98a9f2c27cc52e48d84a7b83e2cff4f7a82974dc18d"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("5b07b3c21ec5038f0f5ec13a624b5edbd4616ffc1fdfc311629fbca45eddfc26"));
var updateProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	display_name: stringType().max(60).optional(),
	bio: stringType().max(280).optional(),
	target_role: stringType().max(80).optional(),
	username: stringType().min(3).max(30).regex(/^[a-z0-9_]+$/).optional()
}).parse(i)).handler(createSsrRpc("14541eed963da7e9df4af98355df93c367cc8d107fd20a6fdd02052918ee98ba"));
//#endregion
export { updateProfile as a, getPublicProfile as i, analyzeResumePublic as n, getDashboard as r, analyzeResume as t };
