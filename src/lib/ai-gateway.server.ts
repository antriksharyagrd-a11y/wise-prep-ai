// Server-only AI provider helpers. Never import from client code.
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey },
  });
}

export function getLovableApiKey(): string {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return key;
}

// Gemini via Google's OpenAI-compatible REST endpoint.
// The API key is passed as a Bearer token (Authorization header).
export function createGeminiProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
}

// Returns whichever provider is configured, preferring Gemini.
export function createAiProvider() {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) return createGeminiProvider(geminiKey);
  return createLovableAiGatewayProvider(getLovableApiKey());
}
