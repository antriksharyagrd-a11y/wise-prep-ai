import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateObject } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, getLovableApiKey } from "./ai-gateway.server";

const atsSchema = z.object({
  ats_score: z.number().min(0).max(100),
  match_percentage: z.number().min(0).max(100),
  matched_keywords: z.array(z.string()).max(30),
  missing_keywords: z.array(z.string()).max(30),
  skills_found: z.array(z.string()).max(30),
  skills_missing: z.array(z.string()).max(30),
  strengths: z.array(z.string()).max(8),
  improvements: z.array(z.string()).max(8),
  summary: z.string(),
  section_feedback: z.object({
    skills: z.string(),
    experience: z.string(),
    education: z.string(),
    projects: z.string(),
    formatting: z.string(),
    contact_info: z.string(),
  }),
  suggestions: z.array(z.string()).max(10),
});

type AtsFeedback = z.infer<typeof atsSchema>;

function buildPrompt(resumeText: string, targetRole: string, jobDescription: string) {
  const jdSection = jobDescription.trim()
    ? `\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 8000)}`
    : "";
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
${resumeText.slice(0, 12000)}${jdSection}`;
}

export const analyzeResumePublic = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    z.object({
      fileName: z.string(),
      extractedText: z.string().min(20),
      targetRole: z.string(),
      jobDescription: z.string().optional().default(""),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(getLovableApiKey());
    const { object } = await generateObject({
      model: gateway("openai/gpt-5.5"),
      schema: atsSchema,
      prompt: buildPrompt(data.extractedText, data.targetRole, data.jobDescription),
    });
    return { id: null, feedback: object as AtsFeedback };
  });

export const analyzeResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      fileName: z.string(),
      extractedText: z.string().min(20),
      targetRole: z.string(),
      jobDescription: z.string().optional().default(""),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const gateway = createLovableAiGatewayProvider(getLovableApiKey());
    const { object } = await generateObject({
      model: gateway("openai/gpt-5.5"),
      schema: atsSchema,
      prompt: buildPrompt(data.extractedText, data.targetRole, data.jobDescription),
    });
    const { data: row, error } = await context.supabase.from("resumes").insert({
      user_id: context.userId,
      file_name: data.fileName,
      target_role: data.targetRole,
      job_description: data.jobDescription.slice(0, 20000),
      extracted_text: data.extractedText.slice(0, 20000),
      ats_score: object.ats_score,
      feedback: object,
    }).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id, feedback: object as AtsFeedback };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: resumes }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("resumes").select("id,ats_score,file_name,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(5),
    ]);
    const resumeScore = resumes?.[0]?.ats_score ?? null;
    return { profile, resumes: resumes ?? [], resumeScore };
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: unknown) =>
    z.object({
      display_name: z.string().max(60).optional(),
      bio: z.string().max(280).optional(),
      target_role: z.string().max(80).optional(),
      username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("profiles").update(data).eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
