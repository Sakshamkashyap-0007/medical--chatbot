import { Database, Tables } from "@/supabase/types"
import { VALID_ENV_KEYS } from "@/types/valid-keys"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getServerProfile() {
  // Return a mock profile with API keys from environment variables
  const mockProfile: Partial<Tables<"profiles">> = {
    user_id: "default-user",
    openai_api_key: process.env.OPENAI_API_KEY || "",
    anthropic_api_key: process.env.ANTHROPIC_API_KEY || "",
    google_gemini_api_key: process.env.GOOGLE_GEMINI_API_KEY || "",
    mistral_api_key: process.env.MISTRAL_API_KEY || "",
    groq_api_key: process.env.GROQ_API_KEY || "",
    perplexity_api_key: process.env.PERPLEXITY_API_KEY || "",
    openrouter_api_key: process.env.OPENROUTER_API_KEY || "",
    azure_openai_api_key: process.env.AZURE_OPENAI_API_KEY || "",
    azure_openai_endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
    azure_openai_35_turbo_id: process.env.AZURE_GPT_35_TURBO_NAME || "",
    azure_openai_45_vision_id: process.env.AZURE_GPT_45_VISION_NAME || "",
    azure_openai_45_turbo_id: process.env.AZURE_GPT_45_TURBO_NAME || "",
    azure_openai_embeddings_id: process.env.AZURE_EMBEDDINGS_NAME || "",
    openai_organization_id:
      process.env.NEXT_PUBLIC_OPENAI_ORGANIZATION_ID || "",
    use_azure_openai: !!process.env.AZURE_OPENAI_API_KEY,
    has_onboarded: true
  }

  return mockProfile as Tables<"profiles">
}

export function checkApiKey(apiKey: string | null, keyName: string) {
  if (apiKey === null || apiKey === "") {
    throw new Error(`${keyName} API Key not found`)
  }
}
