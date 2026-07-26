import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const atsSchema = z.object({
  ats_score: z.number().min(0).max(100),
  match_percentage: z.number().min(0).max(100),
  matched_keywords: z.array(z.string()),
  missing_keywords: z.array(z.string()),
  skills_found: z.array(z.string()),
  skills_missing: z.array(z.string()),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  summary: z.string(),
  section_feedback: z.object({
    skills: z.string(),
    experience: z.string(),
    education: z.string(),
    projects: z.string(),
    formatting: z.string(),
    contact_info: z.string(),
  }),
  suggestions: z.array(z.string()),
});

export type AtsFeedback = z.infer<typeof atsSchema>;

function buildPrompt(resumeText: string, targetRole: string, jobDescription: string) {
  const jdSection = jobDescription.trim()
    ? `\n\nJOB DESCRIPTION:\n${jobDescription.slice(0, 8000)}`
    : "";

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
${resumeText.slice(0, 12000)}${jdSection}`;
}

async function runAnalysis(resumeText: string, targetRole: string, jobDescription: string): Promise<AtsFeedback> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const prompt = buildPrompt(resumeText, targetRole, jobDescription);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    console.error("Gemini API error:", response.status, errText);
    throw new Error(`AI analysis failed (${response.status}). Please try again.`);
  }

  const data = await response.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!text) throw new Error("AI returned no content. Please try again.");

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI did not return valid JSON. Please try again.");
    parsed = JSON.parse(match[0]);
  }

  return atsSchema.parse(parsed);
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
    const feedback = await runAnalysis(data.extractedText, data.targetRole, data.jobDescription);
    return { id: null, feedback };
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
    const feedback = await runAnalysis(data.extractedText, data.targetRole, data.jobDescription);
    const { data: row, error } = await context.supabase
      .from("resumes")
      .insert({
        user_id: context.userId,
        file_name: data.fileName,
        target_role: data.targetRole,
        job_description: data.jobDescription.slice(0, 20000),
        extracted_text: data.extractedText.slice(0, 20000),
        ats_score: feedback.ats_score,
        feedback,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id, feedback };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: resumes }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase
        .from("resumes")
        .select("id,ats_score,file_name,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);
    return { profile, resumes: resumes ?? [], resumeScore: resumes?.[0]?.ats_score ?? null };
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
    const { error } = await context.supabase
      .from("profiles")
      .update(data)
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
