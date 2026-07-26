import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { i as stringType, n as numberType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hirewise.functions-v8PhElSL.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var atsSchema = objectType({
	ats_score: numberType().min(0).max(100),
	match_percentage: numberType().min(0).max(100),
	matched_keywords: arrayType(stringType()),
	missing_keywords: arrayType(stringType()),
	skills_found: arrayType(stringType()),
	skills_missing: arrayType(stringType()),
	strengths: arrayType(stringType()),
	improvements: arrayType(stringType()),
	summary: stringType(),
	section_feedback: objectType({
		skills: stringType(),
		experience: stringType(),
		education: stringType(),
		projects: stringType(),
		formatting: stringType(),
		contact_info: stringType()
	}),
	suggestions: arrayType(stringType())
});
function buildPrompt(resumeText, targetRole, jobDescription) {
	const jdSection = jobDescription.trim() ? `\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 8e3)}` : "";
	return `You are an expert ATS (Applicant Tracking System) resume reviewer.
Evaluate the resume below${jobDescription.trim() ? " against the provided job description" : ""} for a "${targetRole}" role.

Return ONLY a valid JSON object — no markdown, no code fences, no extra text — with exactly these fields:

{
  "ats_score": <integer 0-100, overall ATS-friendliness>,
  "match_percentage": <integer 0-100, how well resume matches the JD/role>,
  "matched_keywords": [<string>, ...],
  "missing_keywords": [<string>, ...],
  "skills_found": [<string>, ...],
  "skills_missing": [<string>, ...],
  "strengths": [<string>, ...],
  "improvements": [<string>, ...],
  "summary": "<1-3 sentence overall assessment>",
  "section_feedback": {
    "skills": "<feedback on skills section>",
    "experience": "<feedback on experience section>",
    "education": "<feedback on education section>",
    "projects": "<feedback on projects section>",
    "formatting": "<feedback on formatting and structure>",
    "contact_info": "<feedback on contact information>"
  },
  "suggestions": [<string>, ...]
}

Guidelines:
- ats_score: evaluate structure, parseability, keyword density, quantified impact
- match_percentage: evaluate alignment with the ${jobDescription.trim() ? "provided job description" : "target role"}
- matched_keywords: keywords present in BOTH the resume and the ${jobDescription.trim() ? "job description" : "role requirements"} (max 25)
- missing_keywords: important keywords from the ${jobDescription.trim() ? "job description" : "role"} that are absent from the resume (max 25)
- skills_found: technical and soft skills present in the resume (max 25)
- skills_missing: important skills for the role not found in the resume (max 25)
- strengths: 3-8 specific resume strengths
- improvements: 3-8 specific, actionable improvement areas
- suggestions: 4-10 prioritised, concrete suggestions to improve the resume for this role

RESUME:
${resumeText.slice(0, 12e3)}${jdSection}`;
}
async function runAnalysis(resumeText, targetRole, jobDescription) {
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
	const prompt = buildPrompt(resumeText, targetRole, jobDescription);
	const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			contents: [{ parts: [{ text: prompt }] }],
			generationConfig: {
				temperature: .2,
				maxOutputTokens: 8192,
				responseMimeType: "application/json"
			}
		})
	});
	if (!response.ok) {
		const errText = await response.text().catch(() => "");
		console.error("Gemini API error:", response.status, errText);
		throw new Error(`AI analysis failed (${response.status}). Please try again.`);
	}
	const text = (await response.json())?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
	if (!text) throw new Error("AI returned no content. Please try again.");
	const cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```\s*$/i, "").trim();
	let parsed;
	try {
		parsed = JSON.parse(cleaned);
	} catch {
		const match = cleaned.match(/\{[\s\S]*\}/);
		if (!match) throw new Error("AI did not return valid JSON. Please try again.");
		parsed = JSON.parse(match[0]);
	}
	return atsSchema.parse(parsed);
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
	return {
		id: null,
		feedback: await runAnalysis(data.extractedText, data.targetRole, data.jobDescription)
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
	const feedback = await runAnalysis(data.extractedText, data.targetRole, data.jobDescription);
	const { data: row, error } = await context.supabase.from("resumes").insert({
		user_id: context.userId,
		file_name: data.fileName,
		target_role: data.targetRole,
		job_description: data.jobDescription.slice(0, 2e4),
		extracted_text: data.extractedText.slice(0, 2e4),
		ats_score: feedback.ats_score,
		feedback
	}).select("id").single();
	if (error) throw new Error(error.message);
	return {
		id: row.id,
		feedback
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
	return {
		profile,
		resumes: resumes ?? [],
		resumeScore: resumes?.[0]?.ats_score ?? null
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
