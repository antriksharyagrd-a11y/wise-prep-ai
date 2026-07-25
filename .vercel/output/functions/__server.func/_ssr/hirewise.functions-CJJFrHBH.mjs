import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { At as objectType, Dt as booleanType, Et as arrayType, Ot as enumType, jt as stringType, kt as numberType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { n as generateText, t as generateObject } from "../_libs/ai.mjs";
import { t as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hirewise.functions-CJJFrHBH.js
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
function publicClient() {
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_PUBLISHABLE_KEY;
	return createClient(url, key, {
		auth: { persistSession: false },
		global: { fetch: (input, init) => {
			const h = new Headers(init?.headers);
			if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
			h.set("apikey", key);
			return fetch(input, {
				...init,
				headers: h
			});
		} }
	});
}
var getTodayQuestion_createServerFn_handler = createServerRpc({
	id: "cb089af0f2ec6274cda00d90a551904066da6f180cfeef0cb157f7ff35049189",
	name: "getTodayQuestion",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => getTodayQuestion.__executeServer(opts));
var getTodayQuestion = createServerFn({ method: "GET" }).handler(getTodayQuestion_createServerFn_handler, async () => {
	const sb = publicClient();
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	let { data: dq } = await sb.from("daily_questions").select("question_id").eq("day", today).maybeSingle();
	if (!dq) {
		const { data: pick } = await sb.from("questions").select("id").limit(1e3);
		if (!pick || pick.length === 0) return null;
		dq = { question_id: pick[(/* @__PURE__ */ new Date()).getUTCDate() % pick.length].id };
	}
	const { data: q } = await sb.from("questions").select("*").eq("id", dq.question_id).maybeSingle();
	return q;
});
var getPublicProfile_createServerFn_handler = createServerRpc({
	id: "3b56f3b1d4a254f5152a1bd669eab1a5832204e31e5dd23726a8c593f645fa5b",
	name: "getPublicProfile",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => getPublicProfile.__executeServer(opts));
var getPublicProfile = createServerFn({ method: "GET" }).inputValidator((i) => objectType({ username: stringType() }).parse(i)).handler(getPublicProfile_createServerFn_handler, async ({ data }) => {
	const sb = publicClient();
	const { data: profile } = await sb.from("profiles").select("id,username,display_name,avatar_url,target_role,bio,created_at").eq("username", data.username).maybeSingle();
	if (!profile) return null;
	const { data: streak } = await sb.from("streaks").select("current_streak,longest_streak,last_active_date").eq("user_id", profile.id).maybeSingle();
	const { count: solved } = await sb.from("question_attempts").select("id", {
		count: "exact",
		head: true
	}).eq("user_id", profile.id).eq("solved", true);
	const { data: interviews } = await sb.from("mock_interviews").select("score").eq("user_id", profile.id).not("score", "is", null);
	const avgInterview = interviews && interviews.length > 0 ? Math.round(interviews.reduce((a, b) => a + (b.score || 0), 0) / interviews.length * 10) / 10 : null;
	const { data: resumes } = await sb.from("resumes").select("ats_score").eq("user_id", profile.id).not("ats_score", "is", null).order("created_at", { ascending: false }).limit(1);
	const resumeScore = resumes?.[0]?.ats_score ?? null;
	const readiness = computeReadiness({
		solved: solved ?? 0,
		avgInterview,
		resumeScore,
		streak: streak?.current_streak ?? 0
	});
	return {
		profile,
		streak,
		solved: solved ?? 0,
		avgInterview,
		resumeScore,
		readiness
	};
});
function computeReadiness({ solved, avgInterview, resumeScore, streak }) {
	const codeScore = Math.min(solved / 30, 1) * 100;
	const interviewScore = avgInterview !== null ? avgInterview * 10 : 0;
	const resume = resumeScore ?? 0;
	const streakBonus = Math.min(streak / 14, 1) * 100;
	return Math.round(codeScore * .35 + interviewScore * .35 + resume * .2 + streakBonus * .1);
}
var getDashboard_createServerFn_handler = createServerRpc({
	id: "ec71bb26942953bcd108a47c3c71dc900811c8b45bf6b6009ba3ae0e3f6d7017",
	name: "getDashboard",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const [{ data: profile }, { data: streak }, { count: solved }, { data: interviews }, { data: resumes }, { data: recent }] = await Promise.all([
		supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
		supabase.from("streaks").select("*").eq("user_id", userId).maybeSingle(),
		supabase.from("question_attempts").select("id", {
			count: "exact",
			head: true
		}).eq("user_id", userId).eq("solved", true),
		supabase.from("mock_interviews").select("id,score,role_domain,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
		supabase.from("resumes").select("id,ats_score,file_name,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
		supabase.from("question_attempts").select("id,solved,created_at,question:questions(title,difficulty,topic)").eq("user_id", userId).order("created_at", { ascending: false }).limit(6)
	]);
	const scored = (interviews ?? []).filter((i) => i.score !== null);
	const avgInterview = scored.length ? Math.round(scored.reduce((a, b) => a + (b.score || 0), 0) / scored.length * 10) / 10 : null;
	const resumeScore = resumes?.[0]?.ats_score ?? null;
	const readiness = computeReadiness({
		solved: solved ?? 0,
		avgInterview,
		resumeScore,
		streak: streak?.current_streak ?? 0
	});
	return {
		profile,
		streak,
		solved: solved ?? 0,
		interviews: interviews ?? [],
		resumes: resumes ?? [],
		recent: recent ?? [],
		avgInterview,
		resumeScore,
		readiness
	};
});
var saveAttempt_createServerFn_handler = createServerRpc({
	id: "4956acb034a961a9e6bd58b2f008fa36229b5212601eddbcbe3b318ea4cd39f1",
	name: "saveAttempt",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => saveAttempt.__executeServer(opts));
var saveAttempt = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	questionId: stringType(),
	code: stringType(),
	language: stringType(),
	solved: booleanType()
}).parse(i)).handler(saveAttempt_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { error } = await supabase.from("question_attempts").insert({
		user_id: userId,
		question_id: data.questionId,
		code: data.code,
		language: data.language,
		solved: data.solved
	});
	if (error) throw new Error(error.message);
	if (data.solved) await supabase.rpc("bump_streak", { _user_id: userId });
	return { ok: true };
});
var explainWithAI_createServerFn_handler = createServerRpc({
	id: "97cd36c76d506b6506967b0ccd50dff6d6785cd9ac2f10d610c2deef7428eeca",
	name: "explainWithAI",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => explainWithAI.__executeServer(opts));
var explainWithAI = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	questionId: stringType(),
	code: stringType(),
	language: stringType()
}).parse(i)).handler(explainWithAI_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { data: q } = await supabase.from("questions").select("title,description,difficulty,topic,examples").eq("id", data.questionId).maybeSingle();
	if (!q) throw new Error("Question not found");
	const { text } = await generateText({
		model: createLovableAiGatewayProvider(getLovableApiKey())("openai/gpt-5.5"),
		prompt: `You are a senior engineer explaining a coding problem to a candidate.

Problem: ${q.title} (${q.difficulty} · ${q.topic})
${q.description}

Candidate's attempt in ${data.language}:
\`\`\`${data.language}
${data.code}
\`\`\`

Respond in Markdown with these sections:
### What the problem asks
### Review of your attempt (bugs, edge cases, complexity)
### Optimal approach (step-by-step)
### Optimal solution in ${data.language}
### Time & space complexity`
	});
	return { explanation: text };
});
objectType({
	role: enumType([
		"system",
		"user",
		"assistant"
	]),
	content: stringType(),
	confidence: numberType().optional()
});
var startInterview_createServerFn_handler = createServerRpc({
	id: "48aa35980fd7f5b55dee3e00bca29f46ce4e603d16c0eb74731e24680dba1835",
	name: "startInterview",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => startInterview.__executeServer(opts));
var startInterview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({ roleDomain: stringType() }).parse(i)).handler(startInterview_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const system = `You are conducting a live technical interview for a ${data.roleDomain} role. Ask ONE focused question at a time, evaluate the candidate's answer briefly (1-2 sentences), then ask a follow-up. Keep responses concise. When the candidate asks to end, or after 6 exchanges, end and reply exactly with: [INTERVIEW_COMPLETE]`;
	const { text: opener } = await generateText({
		model: createLovableAiGatewayProvider(getLovableApiKey())("openai/gpt-5.5"),
		messages: [{
			role: "system",
			content: system
		}, {
			role: "user",
			content: "Please begin the interview with a short greeting and your first question."
		}]
	});
	const transcript = [{
		role: "system",
		content: system
	}, {
		role: "assistant",
		content: opener
	}];
	const { data: iv, error } = await supabase.from("mock_interviews").insert({
		user_id: userId,
		role_domain: data.roleDomain,
		status: "in_progress",
		transcript
	}).select("id").single();
	if (error) throw new Error(error.message);
	return {
		id: iv.id,
		opener
	};
});
var replyInterview_createServerFn_handler = createServerRpc({
	id: "8742058a309f010bbe3659c41ccef297fa0ca4692571745ce3a29d2bb7881c74",
	name: "replyInterview",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => replyInterview.__executeServer(opts));
var replyInterview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({
	interviewId: stringType(),
	userMessage: stringType(),
	confidence: numberType().nullable().optional()
}).parse(i)).handler(replyInterview_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: iv } = await supabase.from("mock_interviews").select("*").eq("id", data.interviewId).eq("user_id", userId).maybeSingle();
	if (!iv) throw new Error("Interview not found");
	const transcript = iv.transcript ?? [];
	transcript.push({
		role: "user",
		content: data.userMessage,
		confidence: data.confidence ?? void 0
	});
	const { text } = await generateText({
		model: createLovableAiGatewayProvider(getLovableApiKey())("openai/gpt-5.5"),
		messages: transcript.map((m) => ({
			role: m.role,
			content: m.content
		}))
	});
	transcript.push({
		role: "assistant",
		content: text
	});
	const complete = text.includes("[INTERVIEW_COMPLETE]");
	await supabase.from("mock_interviews").update({
		transcript,
		status: complete ? "awaiting_report" : "in_progress"
	}).eq("id", data.interviewId);
	return {
		reply: text.replace("[INTERVIEW_COMPLETE]", "").trim(),
		complete
	};
});
var finalizeInterview_createServerFn_handler = createServerRpc({
	id: "f3f6478b15fd973819df5f7aea1dce77a2d0a8429ebac47dfacb42d65b2ef944",
	name: "finalizeInterview",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => finalizeInterview.__executeServer(opts));
var finalizeInterview = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({ interviewId: stringType() }).parse(i)).handler(finalizeInterview_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: iv } = await supabase.from("mock_interviews").select("*").eq("id", data.interviewId).eq("user_id", userId).maybeSingle();
	if (!iv) throw new Error("Interview not found");
	const transcript = iv.transcript ?? [];
	const chat = transcript.filter((m) => m.role !== "system").map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
	const confidences = transcript.filter((m) => typeof m.confidence === "number").map((m) => m.confidence);
	const confidenceAvg = confidences.length ? confidences.reduce((a, b) => a + b, 0) / confidences.length : null;
	const { object } = await generateObject({
		model: createLovableAiGatewayProvider(getLovableApiKey())("openai/gpt-5.5"),
		schema: objectType({
			score: numberType().min(0).max(10),
			summary: stringType(),
			strengths: arrayType(stringType()).max(5),
			weaknesses: arrayType(stringType()).max(5),
			suggestions: arrayType(stringType()).max(5)
		}),
		prompt: `Evaluate this ${iv.role_domain} mock interview transcript and produce a scored report.\n\n${chat}`
	});
	await supabase.from("mock_interviews").update({
		status: "completed",
		score: Math.round(object.score),
		summary: object.summary,
		strengths: object.strengths,
		weaknesses: object.weaknesses,
		suggestions: object.suggestions,
		confidence_avg: confidenceAvg
	}).eq("id", data.interviewId);
	await supabase.rpc("bump_streak", { _user_id: userId });
	return {
		...object,
		confidenceAvg
	};
});
var getInterview_createServerFn_handler = createServerRpc({
	id: "63c31c07ab6c10923af7d2c5e384a3a9901b587b19399352234c3e35b0e4889d",
	name: "getInterview",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => getInterview.__executeServer(opts));
var getInterview = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).inputValidator((i) => objectType({ id: stringType() }).parse(i)).handler(getInterview_createServerFn_handler, async ({ data, context }) => {
	const { data: iv } = await context.supabase.from("mock_interviews").select("*").eq("id", data.id).eq("user_id", context.userId).maybeSingle();
	return iv;
});
var analyzeResumePublic_createServerFn_handler = createServerRpc({
	id: "dbc3edd5aabd6b257a45c573bd3b62447151c808c9847a1da92812750cd37c6e",
	name: "analyzeResumePublic",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => analyzeResumePublic.__executeServer(opts));
var analyzeResumePublic = createServerFn({ method: "POST" }).inputValidator((i) => objectType({
	fileName: stringType(),
	extractedText: stringType().min(20),
	targetRole: stringType()
}).parse(i)).handler(analyzeResumePublic_createServerFn_handler, async ({ data }) => {
	const { object } = await generateObject({
		model: createLovableAiGatewayProvider(getLovableApiKey())("openai/gpt-5.5"),
		schema: objectType({
			ats_score: numberType().min(0).max(100),
			formatting: stringType(),
			keyword_match: stringType(),
			missing_sections: arrayType(stringType()).max(6),
			strengths: arrayType(stringType()).max(5),
			improvements: arrayType(stringType()).max(6),
			summary: stringType()
		}),
		prompt: `Evaluate this resume for a ${data.targetRole} role. Score ATS-friendliness 0-100 based on structure, keyword match to the target role, quantified impact, and machine parseability.\n\nRESUME:\n${data.extractedText.slice(0, 12e3)}`
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
	targetRole: stringType()
}).parse(i)).handler(analyzeResume_createServerFn_handler, async ({ data, context }) => {
	const { object } = await generateObject({
		model: createLovableAiGatewayProvider(getLovableApiKey())("openai/gpt-5.5"),
		schema: objectType({
			ats_score: numberType().min(0).max(100),
			formatting: stringType(),
			keyword_match: stringType(),
			missing_sections: arrayType(stringType()).max(6),
			strengths: arrayType(stringType()).max(5),
			improvements: arrayType(stringType()).max(6),
			summary: stringType()
		}),
		prompt: `Evaluate this resume for a ${data.targetRole} role. Score ATS-friendliness 0-100 based on structure, keyword match to the target role, quantified impact, and machine parseability.\n\nRESUME:\n${data.extractedText.slice(0, 12e3)}`
	});
	const { data: row, error } = await context.supabase.from("resumes").insert({
		user_id: context.userId,
		file_name: data.fileName,
		target_role: data.targetRole,
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
var getProgress_createServerFn_handler = createServerRpc({
	id: "5b07b3c21ec5038f0f5ec13a624b5edbd4616ffc1fdfc311629fbca45eddfc26",
	name: "getProgress",
	filename: "src/lib/hirewise.functions.ts"
}, (opts) => getProgress.__executeServer(opts));
var getProgress = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getProgress_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data: attempts } = await supabase.from("question_attempts").select("created_at,solved,question:questions(topic,difficulty)").eq("user_id", userId).eq("solved", true).order("created_at");
	const { data: interviews } = await supabase.from("mock_interviews").select("created_at,score").eq("user_id", userId).not("score", "is", null).order("created_at");
	return {
		attempts: attempts ?? [],
		interviews: interviews ?? []
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
export { analyzeResumePublic_createServerFn_handler, analyzeResume_createServerFn_handler, explainWithAI_createServerFn_handler, finalizeInterview_createServerFn_handler, getDashboard_createServerFn_handler, getInterview_createServerFn_handler, getProgress_createServerFn_handler, getPublicProfile_createServerFn_handler, getTodayQuestion_createServerFn_handler, replyInterview_createServerFn_handler, saveAttempt_createServerFn_handler, startInterview_createServerFn_handler, updateProfile_createServerFn_handler };
