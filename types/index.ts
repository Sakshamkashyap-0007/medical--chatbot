import type { Tables } from "@/supabase/types"

export type LLMID = string

export type ModelProvider =
  | "custom"
  | "openai"
  | "azure"
  | "google"
  | "anthropic"
  | "groq"
  | "mistral"
  | "perplexity"
  | "ollama"
  | "openrouter"

export type LLMPricing = {
  currency: string
  unit: string
  inputCost: number
  outputCost?: number
}

export type LLM = {
  modelId: LLMID
  modelName: string
  provider: ModelProvider
  hostedId: string
  platformLink: string
  imageInput: boolean
  pricing?: LLMPricing
}

export type OpenRouterLLM = LLM & {
  maxContext?: number
}

export type ChatSettings = {
  model: LLMID
  prompt: string
  temperature: number
  contextLength: number
  includeProfileContext: boolean
  includeWorkspaceInstructions: boolean
  embeddingsProvider: "openai" | "local"
}

export type ChatFile = {
  id: string
  name: string
  type: string
  file: File | null
}

export type MessageImage = {
  messageId?: string
  path: string
  base64: string
  url: string
  file?: File | null
}

export type WorkspaceImage = {
  workspaceId: string
  path: string
  base64: string
  url: string
}

export type ChatMessage = {
  message: Tables<"messages">
  fileItems: string[]
}

export type ChatPayload = {
  chatSettings: ChatSettings
  workspaceInstructions: string
  chatMessages: ChatMessage[]
  assistant: Tables<"assistants"> | null
  messageFileItems: Tables<"file_items">[]
  chatFileItems: Tables<"file_items">[]
}

export type ContentType =
  | "chats"
  | "presets"
  | "prompts"
  | "files"
  | "collections"
  | "assistants"
  | "tools"
  | "models"

export type DataItemType =
  | Tables<"chats">
  | Tables<"presets">
  | Tables<"prompts">
  | Tables<"files">
  | Tables<"collections">
  | Tables<"assistants">
  | Tables<"tools">
  | Tables<"models">

export type DataListType =
  | Tables<"chats">[]
  | Tables<"presets">[]
  | Tables<"prompts">[]
  | Tables<"files">[]
  | Tables<"collections">[]
  | Tables<"assistants">[]
  | Tables<"tools">[]
  | Tables<"models">[]

export type CollectionFile = {
  id: string
  name: string
  type: string
  file: File | null
}

export type FileItemChunk = {
  content: string
  tokens: number
}

export type ChatAPIPayload = {
  chatSettings: ChatSettings
  messages: any[]
}

export type { Announcement } from "./announcement"
export type { AssistantImage } from "./images/assistant-image"
