import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { J as numberType, X as stringType, Y as objectType, q as arrayType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as generateObject } from "../_libs/ai.mjs";
import { t as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hirewise.functions-CsRVK3-9.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function createLovableAiGatewayProvider(apiKey) {
	return createOpenAICompatible({
		name: "lovable",
		baseURL: "https://ai.gateway.lovable.dev/v1",
		headers: { "Lovable-API-Key": apiKey }
	});
}
function getLovableApiKey() {
	const key = process.env.LOVABLE_API_KEY;
	if (!key) throw new Error("Missing LOVABLE_API_KEY");
	return key;
}
var atsSchema = objectType({
	ats_score: numberType().min(0).max(100),
	match_percentage: numberType().min(0).max(100),
	matched_keywords: arrayType(stringType()).max(30),
	missing_keywords: arrayType(stringType()).max(30),
	skills_found: arrayType(stringType()).max(30),
	skills_missing: arrayType(stringType()).max(30),
	strengths: arrayType(stringType()).max(8),
	improvements: arrayType(stringType()).max(8),
	summary: stringType(),
	section_feedback: objectType({
		skills: stringType(),
		experience: stringType(),
		education: stringType(),
		projects: stringType(),
		formatting: stringType(),
		contact_info: stringType()
	}),
	suggestions: arrayType(stringType()).max(10)
});
function buildPrompt(resumeText, targetRole, jobDescription) {
	const jdSection = jobDescription.trim() ? `\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 8e3)}` : "";
	return `You are an expert ATS (Applicant Tracking System) resume reviewer. Evaluate the resume below${jobDescription.trim() ? " against the provided job description" : ""} for a ${targetRole} role.

Produce:
- ats_score: overall ATS-friendliness 0-100 (structure, parseability, keyword match, quantified impact)
- match_percentage: how well the resume matches the ${jobDescription.trim() ? "job description" : "target role"} (0-100)
- matched_keywords: keywords present in both the resume and the ${jobDescription.trim() ? "job description" : "target role"}
- missing_keywords: important keywords from the ${jobDescription.trim() ? "job description" : "target role"} absent from the resume
- skills_found: skills explicitly present in the resume
- skills_missing: important skills for the role that are absent from the resume
- strengths: 3-8 concrete strengths of the resume
- improvements: 3-8 specific, actionable improvements
- summary: 1-3 sentence overall assessment
- section_feedback: one-paragraph feedback each for skills, experience, education, projects, formatting, and contact_info
- suggestions: 4-10 clear, prioritized suggestions to improve the resume for this role

RESUME:
${resumeText.slice(0, 12e3)}${jdSection}`;
}
var analyzeResumePublic_createServerFn_handler = createServerRpc({
	id: "dbc3edd5aabd6b257a45c573bd3b62447151c808c9847a1da92812750cd37c6e",
	name: "analyzeResumePublic",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => analyzeResumePublic.__executeServer(opts));
var analyzeResumePublic = createServerFn({ method: "POST" }).inputValidator((i) => objectType({
	fileName: stringType(),
	extractedText: stringType().min(20),
	targetRole: stringType(),
	jobDescription: stringType().optional().default("")
}).parse(i)).handler(analyzeResumePublic_createServerFn_handler, async ({ data }) => {
	const { object } = await generateObject({
		model: createLovableAiGatewayProvider(getLovableApiKey())("openai/gpt-5.5"),
		schema: atsSchema,
		prompt: buildPrompt(data.extractedText, data.targetRole, data.jobDescription)
	});
	return {
		id: null,
		feedback: object
	};
});
var analyzeResume_createServerFn_handler = createServerRpc({
	id: "cd6e44486248f66b529cb98a9f2c27cc52e48d84a7b83e2cff4f7a82974dc18d",
	name: "analyzeResume",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => analyzeResume.__executeServer(opts));
var analyzeResume = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	fileName: stringType(),
	extractedText: stringType().min(20),
	targetRole: stringType(),
	jobDescription: stringType().optional().default("")
}).parse(i)).handler(analyzeResume_createServerFn_handler, async ({ data, context }) => {
	const { object } = await generateObject({
		model: createLovableAiGatewayProvider(getLovableApiKey())("openai/gpt-5.5"),
		schema: atsSchema,
		prompt: buildPrompt(data.extractedText, data.targetRole, data.jobDescription)
	});
	const { data: row, error } = await context.supabase.from("resumes").insert({
		user_id: context.userId,
		file_name: data.fileName,
		target_role: data.targetRole,
		job_description: data.jobDescription.slice(0, 2e4),
		extracted_text: data.extractedText.slice(0, 2e4),
		ats_score: object.ats_score,
		feedback: object
	}).select("id").single();
	if (error) throw new Error(error.message);
	return {
		id: row.id,
		feedback: object
	};
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "ec71bb26942953bcd108a47c3c71dc900811c8b45bf6b6009ba3ae0e3f6d7017",
	name: "getDashboard",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const [{ data: profile }, { data: resumes }] = await Promise.all([supabase.from("profiles").select("*").eq("id", userId).maybeSingle(), supabase.from("resumes").select("id,ats_score,file_name,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(5)]);
	const resumeScore = resumes?.[0]?.ats_score ?? null;
	return {
		profile,
		resumes: resumes ?? [],
		resumeScore
	};
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "14541eed963da7e9df4af98355df93c367cc8d107fd20a6fdd02052918ee98ba",
	name: "updateProfile",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	display_name: stringType().max(60).optional(),
	bio: stringType().max(280).optional(),
	target_role: stringType().max(80).optional(),
	username: stringType().min(3).max(30).regex(/^[a-z0-9_]+$/).optional()
}).parse(i)).handler(updateProfile_createServerFn_handler, async ({ data, context }) => {
	const { error } = await context.supabase.from("profiles").update(data).eq("id", context.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { analyzeResumePublic_createServerFn_handler, analyzeResume_createServerFn_handler, getDashboard_createServerFn_handler, updateProfile_createServerFn_handler };
