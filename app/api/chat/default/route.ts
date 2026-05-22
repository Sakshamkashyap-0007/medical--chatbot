import Anthropic from "@anthropic-ai/sdk"
import { GoogleGenerativeAI } from "@google/generative-ai"
import OpenAI from "openai"

export const runtime = "edge"

type ChatMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

type ChatSettings = {
  temperature?: number
}

type ProviderName =
  | "openai"
  | "anthropic"
  | "google"
  | "groq"
  | "mistral"
  | "openrouter"
  | "perplexity"

type ProviderConfig = {
  apiKey?: string
  label: string
  name: ProviderName
}

const PROVIDERS: ProviderConfig[] = [
  {
    name: "openai",
    label: "OpenAI",
    apiKey: process.env.OPENAI_API_KEY
  },
  {
    name: "anthropic",
    label: "Anthropic",
    apiKey: process.env.ANTHROPIC_API_KEY
  },
  {
    name: "google",
    label: "Google Gemini",
    apiKey: process.env.GOOGLE_GEMINI_API_KEY
  },
  {
    name: "groq",
    label: "Groq",
    apiKey: process.env.GROQ_API_KEY
  },
  {
    name: "mistral",
    label: "Mistral",
    apiKey: process.env.MISTRAL_API_KEY
  },
  {
    name: "openrouter",
    label: "OpenRouter",
    apiKey: process.env.OPENROUTER_API_KEY
  },
  {
    name: "perplexity",
    label: "Perplexity",
    apiKey: process.env.PERPLEXITY_API_KEY
  }
]

export async function POST(request: Request) {
  const { chatSettings, messages } = (await request.json()) as {
    chatSettings: ChatSettings
    messages: ChatMessage[]
  }

  const availableProviders = PROVIDERS.filter(provider => provider.apiKey)

  if (availableProviders.length === 0) {
    return streamPlainText(
      [
        "I can't answer with an AI model yet because no LLM API key is configured.",
        "",
        "Create a `.env.local` file in the project root and add one provider key, for example:",
        "",
        "OPENAI_API_KEY=your_key_here",
        "",
        "Then restart the dev server."
      ].join("\n")
    )
  }

  const failures: string[] = []

  for (const provider of availableProviders) {
    try {
      const source = await createProviderTextSource(
        provider,
        chatSettings,
        messages
      )
      const firstChunk = await source.next()

      if (firstChunk.done) {
        throw new Error("Provider returned an empty response")
      }

      return streamText(source, firstChunk.value)
    } catch (error: any) {
      failures.push(
        `${provider.label}: ${error?.message || "Unknown provider error"}`
      )
      console.error(`Default chat provider failed: ${provider.label}`, error)
    }
  }

  return new Response(
    `All configured LLM providers failed.\n\n${failures.join("\n")}`,
    { status: 502 }
  )
}

async function createProviderTextSource(
  provider: ProviderConfig,
  chatSettings: ChatSettings,
  messages: ChatMessage[]
): Promise<AsyncGenerator<string>> {
  switch (provider.name) {
    case "openai":
      return createOpenAICompatibleTextSource({
        apiKey: provider.apiKey!,
        baseURL: undefined,
        model: "gpt-4o",
        messages,
        temperature: chatSettings.temperature
      })

    case "anthropic":
      return createAnthropicTextSource(provider.apiKey!, chatSettings, messages)

    case "google":
      return createGoogleTextSource(provider.apiKey!, chatSettings, messages)

    case "groq":
      return createOpenAICompatibleTextSource({
        apiKey: provider.apiKey!,
        baseURL: "https://api.groq.com/openai/v1",
        model: "llama-3.1-70b-versatile",
        messages,
        temperature: chatSettings.temperature
      })

    case "mistral":
      return createOpenAICompatibleTextSource({
        apiKey: provider.apiKey!,
        baseURL: "https://api.mistral.ai/v1",
        model: "mistral-large-latest",
        messages,
        temperature: chatSettings.temperature
      })

    case "openrouter":
      return createOpenAICompatibleTextSource({
        apiKey: provider.apiKey!,
        baseURL: "https://openrouter.ai/api/v1",
        model: "openai/gpt-4o-mini",
        messages,
        temperature: chatSettings.temperature
      })

    case "perplexity":
      return createOpenAICompatibleTextSource({
        apiKey: provider.apiKey!,
        baseURL: "https://api.perplexity.ai",
        model: "sonar",
        messages,
        temperature: chatSettings.temperature
      })
  }

  throw new Error(`Unsupported provider: ${provider.name}`)
}

async function createOpenAICompatibleTextSource({
  apiKey,
  baseURL,
  model,
  messages,
  temperature
}: {
  apiKey: string
  baseURL?: string
  model: string
  messages: ChatMessage[]
  temperature?: number
}) {
  const client = new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {})
  })

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: temperature ?? 0.7,
    stream: true
  })

  return (async function* () {
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content
      if (content) yield content
    }
  })()
}

async function createAnthropicTextSource(
  apiKey: string,
  chatSettings: ChatSettings,
  messages: ChatMessage[]
) {
  const anthropic = new Anthropic({ apiKey })
  const systemPrompt = messages.find(
    message => message.role === "system"
  )?.content

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    system: systemPrompt,
    temperature: chatSettings.temperature ?? 0.7,
    messages: messages
      .filter(message => message.role !== "system")
      .map(message => ({
        role: message.role as "user" | "assistant",
        content: message.content
      })),
    stream: true
  })

  return (async function* () {
    for await (const chunk of response) {
      if (chunk.type === "content_block_delta" && "text" in chunk.delta) {
        yield chunk.delta.text
      }
    }
  })()
}

async function createGoogleTextSource(
  apiKey: string,
  chatSettings: ChatSettings,
  messages: ChatMessage[]
) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  })

  const systemPrompt = messages.find(
    message => message.role === "system"
  )?.content
  const chatMessages = messages.filter(message => message.role !== "system")

  if (chatMessages.length === 0) {
    throw new Error("No message content supplied")
  }

  const lastMessage = chatMessages[chatMessages.length - 1]
  const history = chatMessages.slice(0, -1).map(message => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }]
  }))

  const prompt = systemPrompt
    ? `${systemPrompt}\n\nUser: ${lastMessage.content}`
    : lastMessage.content

  const result = await model
    .startChat({
      history,
      generationConfig: {
        temperature: chatSettings.temperature ?? 0.7
      }
    })
    .sendMessageStream(prompt)

  return (async function* () {
    for await (const chunk of result.stream) {
      const content = chunk.text()
      if (content) yield content
    }
  })()
}

function streamText(source: AsyncGenerator<string>, firstChunk: string) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(firstChunk))

        for await (const content of source) {
          controller.enqueue(encoder.encode(content))
        }
      } catch (error) {
        controller.error(error)
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  })
}

function streamPlainText(content: string) {
  const encoder = new TextEncoder()

  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(content))
        controller.close()
      }
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    }
  )
}
