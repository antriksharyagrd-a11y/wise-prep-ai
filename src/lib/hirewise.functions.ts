import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
import { generateText, generateObject } from "ai";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { createLovableAiGatewayProvider, getLovableApiKey } from "./ai-gateway.server";

// -------- Public reads (no bearer required) --------

function publicClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const getTodayQuestion = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const today = new Date().toISOString().slice(0, 10);
  let { data: dq } = await sb.from("daily_questions").select("question_id").eq("day", today).maybeSingle();
  if (!dq) {
    const { data: pick } = await sb.from("questions").select("id").limit(1000);
    if (!pick || pick.length === 0) return null;
    const idx = new Date().getUTCDate() % pick.length;
    dq = { question_id: pick[idx].id };
  }
  const { data: q } = await sb.from("questions").select("*").eq("id", dq.question_id).maybeSingle();
  return q;
});

export const getPublicProfile = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => z.object({ username: z.string() }).parse(i))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: profile } = await sb.from("profiles").select("id,username,display_name,avatar_url,target_role,bio,created_at").eq("username", data.username).maybeSingle();
    if (!profile) return null;
    const { data: streak } = await sb.from("streaks").select("current_streak,longest_streak,last_active_date").eq("user_id", profile.id).maybeSingle();
    const { count: solved } = await sb.from("question_attempts").select("id", { count: "exact", head: true }).eq("user_id", profile.id).eq("solved", true);
    const { data: interviews } = await sb.from("mock_interviews").select("score").eq("user_id", profile.id).not("score", "is", null);
    const avgInterview = interviews && interviews.length > 0 ? Math.round((interviews.reduce((a, b) => a + (b.score || 0), 0) / interviews.length) * 10) / 10 : null;
    const { data: resumes } = await sb.from("resumes").select("ats_score").eq("user_id", profile.id).not("ats_score", "is", null).order("created_at", { ascending: false }).limit(1);
    const resumeScore = resumes?.[0]?.ats_score ?? null;
    const readiness = computeReadiness({ solved: solved ?? 0, avgInterview, resumeScore, streak: streak?.current_streak ?? 0 });
    return { profile, streak, solved: solved ?? 0, avgInterview, resumeScore, readiness };
  });

function computeReadiness({ solved, avgInterview, resumeScore, streak }: { solved: number; avgInterview: number | null; resumeScore: number | null; streak: number }) {
  const codeScore = Math.min(solved / 30, 1) * 100;
  const interviewScore = avgInterview !== null ? avgInterview * 10 : 0;
  const resume = resumeScore ?? 0;
  const streakBonus = Math.min(streak / 14, 1) * 100;
  return Math.round(codeScore * 0.35 + interviewScore * 0.35 + resume * 0.2 + streakBonus * 0.1);
}

// -------- Authenticated --------

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: streak }, { count: solved }, { data: interviews }, { data: resumes }, { data: recent }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("streaks").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("question_attempts").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("solved", true),
      supabase.from("mock_interviews").select("id,score,role_domain,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
      supabase.from("resumes").select("id,ats_score,file_name,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
      supabase.from("question_attempts").select("id,solved,created_at,question:questions(title,difficulty,topic)").eq("user_id", userId).order("created_at", { ascending: false }).limit(6),
    ]);
    const scored = (interviews ?? []).filter((i) => i.score !== null);
    const avgInterview = scored.length ? Math.round((scored.reduce((a, b) => a + (b.score || 0), 0) / scored.length) * 10) / 10 : null;
    const resumeScore = resumes?.[0]?.ats_score ?? null;
    const readiness = computeReadiness({ solved: solved ?? 0, avgInterview, resumeScore, streak: streak?.current_streak ?? 0 });
    return { profile, streak, solved: solved ?? 0, interviews: interviews ?? [], resumes: resumes ?? [], recent: recent ?? [], avgInterview, resumeScore, readiness };
  });

export const saveAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ questionId: z.string(), code: z.string(), language: z.string(), solved: z.boolean() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("question_attempts").insert({
      user_id: userId, question_id: data.questionId, code: data.code, language: data.language, solved: data.solved,
    });
    if (error) throw new Error(error.message);
    if (data.solved) await supabase.rpc("bump_streak", { _user_id: userId });
    return { ok: true };
  });

export const explainWithAI = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ questionId: z.string(), code: z.string(), language: z.string() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: q } = await supabase.from("questions").select("title,description,difficulty,topic,examples").eq("id", data.questionId).maybeSingle();
    if (!q) throw new Error("Question not found");
    const gateway = createLovableAiGatewayProvider(getLovableApiKey());
    const { text } = await generateText({
      model: gateway("openai/gpt-5.5"),
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
### Time & space complexity`,
    });
    return { explanation: text };
  });

// -------- Mock interview --------

const InterviewMessage = z.object({ role: z.enum(["system", "user", "assistant"]), content: z.string(), confidence: z.number().optional() });

export const startInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ roleDomain: z.string() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const system = `You are conducting a live technical interview for a ${data.roleDomain} role. Ask ONE focused question at a time, evaluate the candidate's answer briefly (1-2 sentences), then ask a follow-up. Keep responses concise. When the candidate asks to end, or after 6 exchanges, end and reply exactly with: [INTERVIEW_COMPLETE]`;
    const gateway = createLovableAiGatewayProvider(getLovableApiKey());
    const { text: opener } = await generateText({
      model: gateway("openai/gpt-5.5"),
      messages: [{ role: "system", content: system }, { role: "user", content: "Please begin the interview with a short greeting and your first question." }],
    });
    const transcript = [
      { role: "system", content: system },
      { role: "assistant", content: opener },
    ];
    const { data: iv, error } = await supabase.from("mock_interviews").insert({ user_id: userId, role_domain: data.roleDomain, status: "in_progress", transcript }).select("id").single();
    if (error) throw new Error(error.message);
    return { id: iv.id, opener };
  });

export const replyInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ interviewId: z.string(), userMessage: z.string(), confidence: z.number().nullable().optional() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: iv } = await supabase.from("mock_interviews").select("*").eq("id", data.interviewId).eq("user_id", userId).maybeSingle();
    if (!iv) throw new Error("Interview not found");
    const transcript = (iv.transcript as Array<{ role: string; content: string; confidence?: number }>) ?? [];
    transcript.push({ role: "user", content: data.userMessage, confidence: data.confidence ?? undefined });
    const gateway = createLovableAiGatewayProvider(getLovableApiKey());
    const { text } = await generateText({
      model: gateway("openai/gpt-5.5"),
      messages: transcript.map((m) => ({ role: m.role as "system" | "user" | "assistant", content: m.content })),
    });
    transcript.push({ role: "assistant", content: text });
    const complete = text.includes("[INTERVIEW_COMPLETE]");
    await supabase.from("mock_interviews").update({ transcript, status: complete ? "awaiting_report" : "in_progress" }).eq("id", data.interviewId);
    return { reply: text.replace("[INTERVIEW_COMPLETE]", "").trim(), complete };
  });

export const finalizeInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ interviewId: z.string() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: iv } = await supabase.from("mock_interviews").select("*").eq("id", data.interviewId).eq("user_id", userId).maybeSingle();
    if (!iv) throw new Error("Interview not found");
    const transcript = (iv.transcript as Array<{ role: string; content: string; confidence?: number }>) ?? [];
    const chat = transcript.filter((m) => m.role !== "system").map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
    const confidences = transcript.filter((m) => typeof m.confidence === "number").map((m) => m.confidence!);
    const confidenceAvg = confidences.length ? confidences.reduce((a, b) => a + b, 0) / confidences.length : null;
    const gateway = createLovableAiGatewayProvider(getLovableApiKey());
    const { object } = await generateObject({
      model: gateway("openai/gpt-5.5"),
      schema: z.object({
        score: z.number().min(0).max(10),
        summary: z.string(),
        strengths: z.array(z.string()).max(5),
        weaknesses: z.array(z.string()).max(5),
        suggestions: z.array(z.string()).max(5),
      }),
      prompt: `Evaluate this ${iv.role_domain} mock interview transcript and produce a scored report.\n\n${chat}`,
    });
    await supabase.from("mock_interviews").update({
      status: "completed",
      score: Math.round(object.score),
      summary: object.summary,
      strengths: object.strengths,
      weaknesses: object.weaknesses,
      suggestions: object.suggestions,
      confidence_avg: confidenceAvg,
    }).eq("id", data.interviewId);
    await supabase.rpc("bump_streak", { _user_id: userId });
    return { ...object, confidenceAvg };
  });

export const getInterview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ id: z.string() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: iv } = await context.supabase.from("mock_interviews").select("*").eq("id", data.id).eq("user_id", context.userId).maybeSingle();
    return iv;
  });

// -------- Resume --------

export const analyzeResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({ fileName: z.string(), extractedText: z.string().min(20), targetRole: z.string() }).parse(i))
  .handler(async ({ data, context }) => {
    const gateway = createLovableAiGatewayProvider(getLovableApiKey());
    const { object } = await generateObject({
      model: gateway("openai/gpt-5.5"),
      schema: z.object({
        ats_score: z.number().min(0).max(100),
        formatting: z.string(),
        keyword_match: z.string(),
        missing_sections: z.array(z.string()).max(6),
        strengths: z.array(z.string()).max(5),
        improvements: z.array(z.string()).max(6),
        summary: z.string(),
      }),
      prompt: `Evaluate this resume for a ${data.targetRole} role. Score ATS-friendliness 0-100 based on structure, keyword match to the target role, quantified impact, and machine parseability.\n\nRESUME:\n${data.extractedText.slice(0, 12000)}`,
    });
    const { data: row, error } = await context.supabase.from("resumes").insert({
      user_id: context.userId, file_name: data.fileName, target_role: data.targetRole,
      extracted_text: data.extractedText.slice(0, 20000), ats_score: object.ats_score, feedback: object,
    }).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id, feedback: object };
  });

export const getProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: attempts } = await supabase.from("question_attempts").select("created_at,solved,question:questions(topic,difficulty)").eq("user_id", userId).eq("solved", true).order("created_at");
    const { data: interviews } = await supabase.from("mock_interviews").select("created_at,score").eq("user_id", userId).not("score", "is", null).order("created_at");
    return { attempts: attempts ?? [], interviews: interviews ?? [] };
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) => z.object({
    display_name: z.string().max(60).optional(),
    bio: z.string().max(280).optional(),
    target_role: z.string().max(80).optional(),
    username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/).optional(),
  }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("profiles").update(data).eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });