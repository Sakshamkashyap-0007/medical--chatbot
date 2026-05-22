"use client"

import { ChatHelp } from "@/components/chat/chat-help"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSettings } from "@/components/chat/chat-settings"
import { ChatUI } from "@/components/chat/chat-ui"
import { ChatHeader } from "@/components/chat/chat-header"
import { QuickSettings } from "@/components/chat/quick-settings"
import { ChatbotUIContext } from "@/context/context"
import useHotkey from "@/lib/hooks/use-hotkey"
import { useContext } from "react"
import {
  IconStethoscope,
  IconPills,
  IconApple,
  IconHeart
} from "@tabler/icons-react"

export default function ChatPage() {
  useHotkey("o", () => handleNewChat())
  useHotkey("l", () => {
    handleFocusChatInput()
  })

  const { chatMessages, setUserInput } = useContext(ChatbotUIContext)

  const { handleNewChat, handleFocusChatInput } = useChatHandler()

  const suggestedPrompts = [
    {
      id: "PATH-01",
      title: "Symptom Assessment",
      tag: "CLINICAL PATHWAY",
      description: "Get guidance on symptoms and next steps",
      prompt: "I have a scratchy throat and a mild fever. What should I do?"
    },
    {
      id: "PHARM-02",
      title: "Medication Properties",
      tag: "PHARMACOLOGY REFERENCE",
      description: "Understand dosage, side effects, and uses",
      prompt: "What are the common side effects or interactions of ibuprofen?"
    },
    {
      id: "NUTR-03",
      title: "Nutrition & Care",
      tag: "NUTRITION GUIDE",
      description: "Healthy eating and dietary recommendations",
      prompt: "Suggest some heart-healthy meal ideas and wellness tips."
    },
    {
      id: "WELL-04",
      title: "Preventative Wellness",
      tag: "PREVENTATIVE CARE",
      description: "How sleep, water, and fitness affect health",
      prompt: "How much water should I drink daily, and how does sleep affect health?"
    }
  ]

  const handlePromptClick = (promptText: string) => {
    setUserInput(promptText)
    handleFocusChatInput()
  }

  return (
    <>
      {chatMessages.length === 0 ? (
        <div className="relative flex h-full min-h-0 flex-col bg-background dark:bg-[#0c1317] transition-colors duration-300">
          {/* Header */}
          <ChatHeader />

          {/* Settings Buttons positioned underneath the header bar for access without cluttering the main flow */}
          <div className="absolute left-4 top-[74px] z-20">
            <QuickSettings />
          </div>

          <div className="absolute right-4 top-[74px] z-20">
            <ChatSettings />
          </div>

          {/* Main content area */}
          <div className="flex-1 overflow-y-auto w-full min-h-0">
            <div className="mx-auto flex w-full max-w-[800px] flex-col items-center justify-start min-h-full px-4 py-8 text-center animate-fade-in">
              <div className="my-auto flex flex-col items-center w-full">
                
                {/* Centered Medical Illustration */}
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

                {/* Title & Subheading */}
                <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
                  Clinical Guidance Portal
                </h2>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 max-w-[540px] leading-relaxed">
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



                {/* Suggested Prompt Cards */}
                <div className="mt-6 grid w-full max-w-[700px] grid-cols-1 gap-4 sm:grid-cols-2 text-left">
                  {suggestedPrompts.map((card, i) => (
                    <button
                      key={i}
                      onClick={() => handlePromptClick(card.prompt)}
                      className="group flex flex-col justify-between w-full h-full rounded-xl border border-slate-200/85 bg-white border-l-4 border-l-teal-700 p-5 transition-all duration-200 hover:border-l-teal-600 hover:shadow-md hover:shadow-slate-100/70 dark:border-zinc-800 dark:border-l-teal-600 dark:bg-[#161920] dark:hover:shadow-none"
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 tracking-wider uppercase">
                            {card.tag}
                          </span>
                          <span className="font-mono text-[9px] text-slate-400 dark:text-zinc-500 bg-slate-50 dark:bg-zinc-850 px-1.5 py-0.5 rounded border border-slate-100 dark:border-zinc-800">
                            {card.id}
                          </span>
                        </div>
                        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                          {card.title}
                        </h3>
                        <p className="mt-2 text-xs leading-normal text-slate-500 dark:text-zinc-400">
                          {card.description}
                        </p>
                      </div>
                      <div className="mt-4 flex w-full justify-end">
                        <span className="font-mono text-[9px] font-bold tracking-wider text-slate-400 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                          INITIALIZE PROTOCOL →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* Bottom input area container, centered properly */}
          <div className="mx-auto w-full max-w-[900px] px-6 pb-6 pt-0">
            <ChatInput />
          </div>

          {/* Help helper absolute bottom right */}
          <div className="absolute bottom-4 right-4 hidden md:block z-10">
            <ChatHelp />
          </div>
        </div>
      ) : (
        <ChatUI />
      )}
    </>
  )
}

