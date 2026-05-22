"use client"

import useHotkey from "@/lib/hooks/use-hotkey"
import { cn } from "@/lib/utils"
import {
  IconPaperclip,
  IconPlayerStopFilled,
  IconSend,
  IconX,
  IconStethoscope,
  IconPills,
  IconApple,
  IconHeart,
  IconActivity,
  IconPlus
} from "@tabler/icons-react"
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react"

type ChatProvider = "google" | "openai"

type ChatSettings = {
  contextLength: number
  embeddingsProvider: "openai" | "local"
  includeProfileContext: boolean
  includeWorkspaceInstructions: boolean
  model: string
  prompt: string
  provider: ChatProvider
  temperature: number
}

type DefaultChatRole = "user" | "assistant"

type DefaultChatMessage = {
  id: string
  role: DefaultChatRole
  content: string
}

type ChatAttachment = {
  id: string
  name: string
  content: string
}

interface DefaultChatInputProps {
  attachments: ChatAttachment[]
  isGenerating: boolean
  isTyping: boolean
  onAttachFiles: (files: FileList | null) => void
  onCompositionEnd: () => void
  onCompositionStart: () => void
  onInputChange: (value: string) => void
  onRemoveAttachment: (id: string) => void
  onSendMessage: (messageContent: string) => void
  onStopMessage: () => void
  userInput: string
}

const DefaultChatInput = ({
  attachments,
  isGenerating,
  isTyping,
  onAttachFiles,
  onCompositionEnd,
  onCompositionStart,
  onInputChange,
  onRemoveAttachment,
  onSendMessage,
  onStopMessage,
  userInput
}: DefaultChatInputProps) => {
  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isTyping && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      if (isGenerating) return
      onSendMessage(userInput)
    }
  }

  useHotkey("l", () => {
    chatInputRef.current?.focus()
  })

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-4 sm:px-5 sm:pb-5 md:px-6">
      <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm dark:border-zinc-800/80 dark:bg-[#161920] backdrop-blur">
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2 border-b border-slate-100 dark:border-zinc-850 pb-2">
            {attachments.map(file => (
              <div
                key={file.id}
                className="flex max-w-full items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/50 px-2.5 py-1.5 text-xs text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <span className="truncate max-w-[180px]">{file.name}</span>
                <button
                  aria-label={`Remove ${file.name}`}
                  className="text-slate-400 transition-colors hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                  disabled={isGenerating}
                  onClick={() => onRemoveAttachment(file.id)}
                  type="button"
                >
                  <IconX size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 sm:gap-3">
          <input
            ref={fileInputRef}
            accept=".txt,.md,.markdown,.json,.csv,.log,.ts,.tsx,.js,.jsx,.py,.html,.css"
            className="hidden"
            multiple
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onAttachFiles(event.target.files)
              event.target.value = ""
            }}
            type="file"
          />

          <button
            aria-label="Attach files"
            className="mb-1 flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-700/20 dark:border-zinc-800 dark:text-zinc-500 dark:hover:border-zinc-700 dark:hover:bg-zinc-850 dark:hover:text-zinc-300"
            disabled={isGenerating}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <IconPaperclip size={18} />
          </button>

          <textarea
            ref={chatInputRef}
            className="max-h-[30dvh] min-h-[44px] min-w-0 flex-1 resize-none rounded-xl border border-transparent bg-transparent px-2 py-2.5 text-sm sm:text-[15px] leading-6 text-slate-800 placeholder:text-slate-400 outline-none dark:text-zinc-100 dark:placeholder:text-zinc-550 disabled:cursor-not-allowed disabled:text-slate-400"
            placeholder={
              isGenerating ? "Processing clinical request..." : "Describe symptoms, medications, or health queries..."
            }
            value={userInput}
            onChange={event => {
              if (isGenerating) return
              onInputChange(event.target.value)
            }}
            onKeyDown={handleKeyDown}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            disabled={isGenerating}
            rows={1}
          />

          <button
            className={cn(
              "mb-1 flex size-10 items-center justify-center rounded-xl bg-teal-700 text-white transition-all hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 shadow-sm",
              !userInput.trim() &&
                !isGenerating &&
                "cursor-not-allowed bg-slate-100 text-slate-350 dark:bg-zinc-800 dark:text-zinc-650 hover:bg-slate-100 dark:hover:bg-zinc-800 shadow-none"
            )}
            onClick={() => {
              if (isGenerating) {
                onStopMessage()
                return
              }

              if (!userInput.trim()) return
              onSendMessage(userInput)
            }}
            type="button"
            aria-label={isGenerating ? "Stop response" : "Send message"}
          >
            {isGenerating ? (
              <IconPlayerStopFilled size={18} />
            ) : (
              <IconSend size={18} />
            )}
          </button>
        </div>

        {isGenerating && (
          <div className="mt-2 px-2 text-xs leading-5 text-slate-400 dark:text-zinc-500 flex items-center gap-1.5">
            <span className="relative flex size-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-600"></span>
            </span>
            Formulating triage recommendation.
          </div>
        )}
      </div>
    </div>
  )
}

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void
}

const EmptyState = ({ onSelectPrompt }: EmptyStateProps) => {
  const prompts = [
    {
      id: "PATH-01",
      title: "Symptom Assessment",
      tag: "CLINICAL PATHWAY",
      desc: "I have a scratchy throat and a mild fever. What should I do?"
    },
    {
      id: "PHARM-02",
      title: "Medication Properties",
      tag: "PHARMACOLOGY REFERENCE",
      desc: "What are the common side effects or interactions of ibuprofen?"
    },
    {
      id: "NUTR-03",
      title: "Nutrition & Care",
      tag: "NUTRITION GUIDE",
      desc: "Suggest some heart-healthy meal ideas and wellness tips."
    },
    {
      id: "WELL-04",
      title: "Preventative Wellness",
      tag: "PREVENTATIVE CARE",
      desc: "How much water should I drink daily, and how does sleep affect health?"
    }
  ]

  return (
    <div className="flex-1 overflow-y-auto w-full min-h-0">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-start min-h-full px-4 py-8 md:py-12 text-center sm:px-6 animate-fade-in">
        <div className="my-auto flex flex-col items-center w-full">
          
          {/* Clinician System Verification Cross */}
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-sm shadow-teal-500/10 dark:bg-teal-900/40 dark:text-teal-400">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Clinical Guidance Portal
          </h1>
          <p className="mt-2 max-w-lg text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
            Initiate a secure clinical triage consultation. Describe symptoms or query pharmacology parameters below to receive evidence-based guidance.
          </p>

          {/* Clinical Notice Warning */}
          <div className="mt-6 flex w-full max-w-2xl items-center gap-3 rounded-xl border border-teal-150 bg-teal-50/40 p-3.5 text-left text-[11px] text-teal-800 dark:border-teal-900/30 dark:bg-teal-950/10 dark:text-teal-300">
            <svg
              className="size-5 shrink-0 text-teal-700 dark:text-teal-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span className="font-semibold uppercase tracking-wider text-[9px] bg-teal-600 text-white px-1.5 py-0.5 rounded mr-1.5">Notice</span>
              This secure clinical guidance workflow is for consultation assistance. Cross-reference recommendations with approved medical guidelines.
            </div>
          </div>



          {/* Suggested Prompt Panels with Professional Layout */}
          <div className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {prompts.map((p, idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => onSelectPrompt(p.desc)}
                  className="group flex flex-col justify-between w-full h-full rounded-xl border border-slate-200/85 bg-white border-l-4 border-l-teal-700 p-5 text-left transition-all duration-200 hover:border-l-teal-600 hover:shadow-md hover:shadow-slate-100/70 dark:border-zinc-800 dark:border-l-teal-600 dark:bg-[#161920] dark:hover:shadow-none"
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 tracking-wider uppercase">
                        {p.tag}
                      </span>
                      <span className="font-mono text-[9px] text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-850 px-1.5 py-0.5 rounded border border-slate-100 dark:border-zinc-800">
                        {p.id}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-xs leading-normal text-slate-500 dark:text-zinc-400">
                      {p.desc}
                    </p>
                  </div>
                  <div className="mt-4 flex w-full justify-end">
                    <span className="font-mono text-[9px] font-bold tracking-wider text-slate-400 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                      INITIALIZE PROTOCOL →
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}

const DefaultChatMessages = ({
  messages
}: {
  messages: DefaultChatMessage[]
}) => (
  <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-5 sm:py-7 md:px-6 md:py-8">
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 sm:gap-6">
      {messages.map(message => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3 items-start",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role === "assistant" && (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-100/50 dark:border-teal-900/30">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          )}

          <div
            className={cn(
              "max-w-[85%] rounded-xl px-4 py-3 text-[14px] leading-relaxed sm:max-w-[75%] transition-all",
              message.role === "user"
                ? "rounded-tr-none bg-teal-700 text-white dark:bg-teal-800"
                : "rounded-tl-none bg-white text-slate-800 border border-slate-200/80 border-l-4 border-l-teal-700 dark:bg-[#161920] dark:text-zinc-150 dark:border-zinc-800 dark:border-l-teal-600 shadow-sm"
            )}
          >
            <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              {message.role === "assistant" ? "Clinical Guidance" : "Patient Query"}
            </div>

            {message.content ? (
              <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                {message.content}
              </div>
            ) : (
              <div className="flex items-center gap-1 py-1.5">
                <span className="size-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-zinc-500 [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-zinc-500 [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-zinc-500" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default function DefaultChatPage() {
  useHotkey("o", () => handleNewChat())

  const [chatMessages, setChatMessages] = useState<DefaultChatMessage[]>([])
  const [userInput, setUserInput] = useState("")
  const [attachments, setAttachments] = useState<ChatAttachment[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [abortController, setAbortController] =
    useState<AbortController | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [chatSettings, setChatSettings] = useState<ChatSettings>({
    model: "gemini-2.5-flash",
    prompt: "You are a helpful, professional medical assistant. Provide accurate, clear, and reassuring health information. Always include a brief disclaimer that your advice is for informational purposes and that they should consult a healthcare professional for clinical decisions.",
    provider: "google",
    temperature: 0.7,
    contextLength: 4000,
    includeProfileContext: false,
    includeWorkspaceInstructions: false,
    embeddingsProvider: "openai"
  })

  const handleNewChat = () => {
    setChatMessages([])
    setUserInput("")
    setAttachments([])
    setIsGenerating(false)
  }

  const handleStopMessage = () => {
    abortController?.abort()
  }

  const handleAttachFiles = async (files: FileList | null) => {
    if (!files || isGenerating) return

    const readableFiles = await Promise.all(
      Array.from(files).map(async file => {
        const content = await file.text()

        return {
          id: crypto.randomUUID(),
          name: file.name,
          content: content.slice(0, 12000)
        }
      })
    )

    setAttachments(prev => [...prev, ...readableFiles])
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(file => file.id !== id))
  }

  const handleSendMessage = async (messageContent: string) => {
    if (isGenerating) return
    if (!messageContent.trim()) return

    const userMessage: DefaultChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageContent
    }
    const assistantMessage: DefaultChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: ""
    }

    try {
      setUserInput("")
      setIsGenerating(true)
      setChatMessages(prev => [...prev, userMessage, assistantMessage])

      const newAbortController = new AbortController()
      setAbortController(newAbortController)
      const fileContext =
        attachments.length > 0
          ? `\n\nUse the following attached file context when it is relevant. If the answer is not in the files, say so briefly.\n\n${attachments
              .map(file => `File: ${file.name}\n${file.content}`)
              .join("\n\n---\n\n")}`
          : ""

      const response = await fetch("/api/chat/default", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chatSettings,
          messages: [
            { role: "system", content: `${chatSettings.prompt}${fileContext}` },
            ...chatMessages.map(message => ({
              role: message.role,
              content: message.content
            })),
            { role: "user", content: messageContent }
          ]
        }),
        signal: newAbortController.signal
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          fullText += decoder.decode(value, { stream: true })
          setChatMessages(prev =>
            prev.map(message =>
              message.id === assistantMessage.id
                ? { ...message, content: fullText }
                : message
            )
          )
        }
      }
      setAttachments([])
    } catch (error) {
      setUserInput(messageContent)
      setChatMessages(prev =>
        prev.filter(message => message.id !== assistantMessage.id)
      )
      console.error("Error sending message:", error)
    } finally {
      setIsGenerating(false)
      setAbortController(null)
    }
  }

  return (
    <main className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-background text-slate-800 dark:bg-[#0b0d12] dark:text-zinc-100 transition-colors">
      <header className="shrink-0 border-b border-slate-150 bg-white/95 px-3 py-3 backdrop-blur dark:border-zinc-900 dark:bg-[#0b0d12]/95 sm:px-5 md:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm shadow-teal-500/10">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Clinical Guidance Portal
              </h2>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 leading-none">
                Secure Guidance Triage
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {chatMessages.length > 0 && (
              <button
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#161920] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition-all hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-teal-300 shadow-sm"
                onClick={handleNewChat}
                type="button"
              >
                <IconPlus size={14} />
                <span>New consultation</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {chatMessages.length === 0 ? (
        <EmptyState onSelectPrompt={handleSendMessage} />
      ) : (
        <DefaultChatMessages messages={chatMessages} />
      )}

      <div className="shrink-0 border-t border-slate-100 bg-white/95 pt-3 dark:border-zinc-850 dark:bg-[#0b0d12]/95 backdrop-blur">
        <DefaultChatInput
          attachments={attachments}
          isGenerating={isGenerating}
          isTyping={isTyping}
          onAttachFiles={handleAttachFiles}
          onCompositionEnd={() => setIsTyping(false)}
          onCompositionStart={() => setIsTyping(true)}
          onInputChange={setUserInput}
          onRemoveAttachment={handleRemoveAttachment}
          onSendMessage={handleSendMessage}
          onStopMessage={handleStopMessage}
          userInput={userInput}
        />
      </div>
    </main>
  )
}
