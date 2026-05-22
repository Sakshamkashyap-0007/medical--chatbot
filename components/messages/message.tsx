import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { LLM_LIST } from "@/lib/models/llm/llm-list"
import { cn } from "@/lib/utils"
import { Tables } from "@/supabase/types"
import { LLM, LLMID, MessageImage, ModelProvider } from "@/types"
import {
  IconBolt,
  IconCaretDownFilled,
  IconCaretRightFilled,
  IconCircleFilled,
  IconFileText,
  IconMoodSmile,
  IconPencil
} from "@tabler/icons-react"
import Image from "next/image"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { ModelIcon } from "../models/model-icon"
import { Button } from "../ui/button"
import { FileIcon } from "../ui/file-icon"
import { FilePreview } from "../ui/file-preview"
import { TextareaAutosize } from "../ui/textarea-autosize"
import { WithTooltip } from "../ui/with-tooltip"
import { MessageActions } from "./message-actions"
import { MessageMarkdown } from "./message-markdown"

const ICON_SIZE = 32

interface MessageProps {
  message: Tables<"messages">
  fileItems: Tables<"file_items">[]
  isEditing: boolean
  isLast: boolean
  onStartEdit: (message: Tables<"messages">) => void
  onCancelEdit: () => void
  onSubmitEdit: (value: string, sequenceNumber: number) => void
}

export const Message: FC<MessageProps> = ({
  message,
  fileItems,
  isEditing,
  isLast,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit
}) => {
  const {
    assistants,
    profile,
    isGenerating,
    setIsGenerating,
    firstTokenReceived,
    availableLocalModels,
    availableOpenRouterModels,
    chatMessages,
    selectedAssistant,
    chatImages,
    assistantImages,
    toolInUse,
    files,
    models
  } = useContext(ChatbotUIContext)

  const { handleSendMessage } = useChatHandler()

  const editInputRef = useRef<HTMLTextAreaElement>(null)

  const [isHovering, setIsHovering] = useState(false)
  const [editedMessage, setEditedMessage] = useState(message.content)

  const [showImagePreview, setShowImagePreview] = useState(false)
  const [selectedImage, setSelectedImage] = useState<MessageImage | null>(null)

  const [showFileItemPreview, setShowFileItemPreview] = useState(false)
  const [selectedFileItem, setSelectedFileItem] =
    useState<Tables<"file_items"> | null>(null)

  const [viewSources, setViewSources] = useState(false)

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message.content)
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = message.content
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }
  }

  const handleSendEdit = () => {
    onSubmitEdit(editedMessage, message.sequence_number)
    onCancelEdit()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isEditing && event.key === "Enter" && event.metaKey) {
      handleSendEdit()
    }
  }

  const handleRegenerate = async () => {
    setIsGenerating(true)
    await handleSendMessage(
      editedMessage || chatMessages[chatMessages.length - 2].message.content,
      chatMessages,
      true
    )
  }

  const handleStartEdit = () => {
    onStartEdit(message)
  }

  useEffect(() => {
    setEditedMessage(message.content)

    if (isEditing && editInputRef.current) {
      const input = editInputRef.current
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }, [isEditing, message.content])

  const MODEL_DATA = [
    ...models.map(model => ({
      modelId: model.model_id as LLMID,
      modelName: model.name,
      provider: "custom" as ModelProvider,
      hostedId: model.id,
      platformLink: "",
      imageInput: false
    })),
    ...LLM_LIST,
    ...availableLocalModels,
    ...availableOpenRouterModels
  ].find(llm => llm.modelId === message.model) as LLM

  const messageAssistantImage = assistantImages.find(
    image => image.assistantId === message.assistant_id
  )?.base64

  const selectedAssistantImage = assistantImages.find(
    image => image.path === selectedAssistant?.image_path
  )?.base64

  const modelDetails = LLM_LIST.find(model => model.modelId === message.model)

  const fileAccumulator: Record<
    string,
    {
      id: string
      name: string
      count: number
      type: string
      description: string
    }
  > = {}

  const fileSummary = fileItems.reduce((acc, fileItem) => {
    const parentFile = files.find(file => file.id === fileItem.file_id)
    if (parentFile) {
      if (!acc[parentFile.id]) {
        acc[parentFile.id] = {
          id: parentFile.id,
          name: parentFile.name,
          count: 1,
          type: parentFile.type,
          description: parentFile.description
        }
      } else {
        acc[parentFile.id].count += 1
      }
    }
    return acc
  }, fileAccumulator)
  const summarizedFiles = Object.values(fileSummary) as Array<{
    id: string
    name: string
    count: number
    type: string
    description: string
  }>

  const assistantName =
    message.role === "assistant"
      ? message.assistant_id
        ? assistants.find(assistant => assistant.id === message.assistant_id)
            ?.name
        : selectedAssistant
          ? selectedAssistant?.name
          : MODEL_DATA?.modelName
      : profile?.display_name ?? profile?.username

  return (
    <div
      className={cn(
        "flex w-full py-3.5 transition-all duration-300",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onKeyDown={handleKeyDown}
    >
      {message.role === "user" ? (
        // ================= USER MESSAGE DESIGN =================
        <div className="relative flex flex-col items-end max-w-[80%] md:max-w-[70%] space-y-1.5 animate-slide-in">
          {/* Action buttons floating to the left of the bubble */}
          <div
            className={cn(
              "absolute -left-12 top-2 z-10 transition-opacity duration-200",
              isHovering ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <MessageActions
              onCopy={handleCopy}
              onEdit={handleStartEdit}
              isAssistant={false}
              isLast={isLast}
              isEditing={isEditing}
              isHovering={isHovering}
              onRegenerate={handleRegenerate}
            />
          </div>

          {/* Bubble wrapper */}
          <div className="rounded-2xl rounded-tr-none bg-teal-700 dark:bg-teal-800 px-4 py-3 shadow-sm text-white">
            {isEditing ? (
              <TextareaAutosize
                textareaRef={editInputRef}
                className="text-md bg-transparent focus:outline-none w-full border-none resize-none text-white"
                value={editedMessage}
                onValueChange={setEditedMessage}
                maxRows={20}
              />
            ) : (
              <div className="prose prose-invert max-w-none text-white text-sm md:text-base leading-relaxed">
                <MessageMarkdown content={message.content} />
              </div>
            )}
          </div>

          {/* Files display under bubble */}
          {fileItems.length > 0 && (
            <div className="mt-2 w-full text-left font-semibold text-xs text-neutral-500 dark:text-neutral-400">
              {!viewSources ? (
                <div
                  className="flex cursor-pointer items-center transition-all duration-300 hover:opacity-50"
                  onClick={() => setViewSources(true)}
                >
                  {fileItems.length}
                  {fileItems.length > 1 ? " Sources " : " Source "}
                  from {Object.keys(fileSummary).length}{" "}
                  {Object.keys(fileSummary).length > 1 ? "Files" : "File"}{" "}
                  <IconCaretRightFilled className="ml-1" />
                </div>
              ) : (
                <>
                  <div
                    className="flex cursor-pointer items-center transition-all duration-300 hover:opacity-50"
                    onClick={() => setViewSources(false)}
                  >
                    {fileItems.length}
                    {fileItems.length > 1 ? " Sources " : " Source "}
                    from {Object.keys(fileSummary).length}{" "}
                    {Object.keys(fileSummary).length > 1 ? "Files" : "File"}{" "}
                    <IconCaretDownFilled className="ml-1" />
                  </div>

                  <div className="mt-2 space-y-2 pl-2">
                    {summarizedFiles.map((file, index) => (
                      <div key={index}>
                        <div className="flex items-center space-x-1 text-xs">
                          <FileIcon type={file.type} />
                          <div className="truncate font-medium">{file.name}</div>
                        </div>

                        {fileItems
                          .filter(fileItem => {
                            const parentFile = files.find(
                              parentFile => parentFile.id === fileItem.file_id
                            )
                            return parentFile?.id === file.id
                          })
                          .map((fileItem, index) => (
                            <div
                              key={index}
                              className="ml-6 mt-1 flex cursor-pointer items-center space-x-1 transition-all duration-300 hover:opacity-50"
                              onClick={() => {
                                setSelectedFileItem(fileItem)
                                setShowFileItemPreview(true)
                              }}
                            >
                              <div className="text-[11px] font-normal truncate max-w-[200px] text-neutral-400">
                                - {fileItem.content.substring(0, 80)}...
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* User Images display */}
          <div className="mt-2 flex flex-wrap gap-2 justify-end">
            {message.image_paths?.map((path, index) => {
              const item = chatImages.find(image => image.path === path)

              return (
                <Image
                  key={index}
                  className="cursor-pointer rounded-xl border border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:scale-102 hover:opacity-90 shadow-sm"
                  src={path.startsWith("data") ? path : item?.base64}
                  alt="message image"
                  width={240}
                  height={240}
                  onClick={() => {
                    setSelectedImage({
                      messageId: message.id,
                      path,
                      base64: path.startsWith("data") ? path : item?.base64 || "",
                      url: path.startsWith("data") ? "" : item?.url || "",
                      file: null
                    })

                    setShowImagePreview(true)
                  }}
                  loading="lazy"
                />
              )
            })}
          </div>

          {/* Action buttons inside user bubble during edit */}
          {isEditing && (
            <div className="mt-2 flex justify-end space-x-2">
              <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs px-3 h-8" onClick={handleSendEdit}>
                Save & Send
              </Button>
              <Button size="sm" variant="outline" className="rounded-lg text-xs px-3 h-8" onClick={onCancelEdit}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      ) : (
        // ================= AI MESSAGE DESIGN =================
        <div className="relative flex items-start space-x-3.5 max-w-[85%] animate-slide-in">
          {/* Circular Medical Avatar */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40 shadow-sm">
            {message.role === "assistant" && messageAssistantImage ? (
              <Image
                style={{
                  width: `36px`,
                  height: `36px`
                }}
                className="rounded-full"
                src={messageAssistantImage}
                alt="assistant image"
                height={36}
                width={36}
              />
            ) : (
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
            )}
          </div>

          {/* AI Card Bubble */}
          <div className="relative group rounded-2xl rounded-tl-sm bg-white border border-slate-200/80 border-l-4 border-l-teal-700 dark:bg-[#161920] dark:border-zinc-800 dark:border-l-teal-600 px-5 py-4.5 shadow-sm text-neutral-800 dark:text-neutral-100">
            {/* Header name */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase select-none">
                {message.role === "system" ? "SYSTEM PROMPT" : assistantName}
              </span>
            </div>

            {/* Markdown / content wrapper with good line height */}
            <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-100 text-sm md:text-base leading-relaxed">
              {!firstTokenReceived &&
              isGenerating &&
              isLast &&
              message.role === "assistant" ? (
                <>
                  {(() => {
                    switch (toolInUse) {
                      case "none":
                        return (
                          <div className="flex items-center space-x-2 py-1">
                            <span className="flex size-2 rounded-full bg-teal-600 animate-ping" />
                            <span className="text-xs text-neutral-400">Formulating triage recommendation...</span>
                          </div>
                        )
                      case "retrieval":
                        return (
                          <div className="flex animate-pulse items-center space-x-2 text-teal-600 dark:text-teal-400">
                            <IconFileText size={18} />
                            <div className="text-xs font-medium">Searching files...</div>
                          </div>
                        )
                      default:
                        return (
                          <div className="flex animate-pulse items-center space-x-2 text-teal-600 dark:text-teal-400">
                            <IconBolt size={18} />
                            <div className="text-xs font-medium">Using {toolInUse}...</div>
                          </div>
                        )
                    }
                  })()}
                </>
              ) : isEditing ? (
                <TextareaAutosize
                  textareaRef={editInputRef}
                  className="text-md bg-transparent focus:outline-none w-full border-none resize-none text-neutral-900 dark:text-neutral-50"
                  value={editedMessage}
                  onValueChange={setEditedMessage}
                  maxRows={20}
                />
              ) : (
                <MessageMarkdown content={message.content} />
              )}
            </div>

            {/* Sources / File details */}
            {fileItems.length > 0 && (
              <div className="mt-4 border-t border-neutral-100 dark:border-neutral-800 pt-3 font-semibold text-xs text-neutral-500 dark:text-neutral-400">
                {!viewSources ? (
                  <div
                    className="flex cursor-pointer items-center transition-all duration-300 hover:opacity-50"
                    onClick={() => setViewSources(true)}
                  >
                    {fileItems.length}
                    {fileItems.length > 1 ? " Sources " : " Source "}
                    from {Object.keys(fileSummary).length}{" "}
                    {Object.keys(fileSummary).length > 1 ? "Files" : "File"}{" "}
                    <IconCaretRightFilled className="ml-1" />
                  </div>
                ) : (
                  <>
                    <div
                      className="flex cursor-pointer items-center transition-all duration-300 hover:opacity-50"
                      onClick={() => setViewSources(false)}
                    >
                      {fileItems.length}
                      {fileItems.length > 1 ? " Sources " : " Source "}
                      from {Object.keys(fileSummary).length}{" "}
                      {Object.keys(fileSummary).length > 1 ? "Files" : "File"}{" "}
                      <IconCaretDownFilled className="ml-1" />
                    </div>

                    <div className="mt-3 space-y-3 pl-1">
                      {summarizedFiles.map((file, index) => (
                        <div key={index}>
                          <div className="flex items-center space-x-1.5 font-medium">
                            <FileIcon type={file.type} />
                            <div className="truncate">{file.name}</div>
                          </div>

                          {fileItems
                            .filter(fileItem => {
                              const parentFile = files.find(
                                parentFile => parentFile.id === fileItem.file_id
                              )
                              return parentFile?.id === file.id
                            })
                            .map((fileItem, index) => (
                              <div
                                key={index}
                                className="ml-6 mt-1 flex cursor-pointer items-center space-x-1 transition-all duration-300 hover:opacity-50"
                                onClick={() => {
                                  setSelectedFileItem(fileItem)
                                  setShowFileItemPreview(true)
                                }}
                              >
                                <div className="text-xs font-normal text-neutral-400">
                                  - {fileItem.content.substring(0, 150)}...
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* AI Images */}
            <div className="mt-3 flex flex-wrap gap-2">
              {message.image_paths?.map((path, index) => {
                const item = chatImages.find(image => image.path === path)

                return (
                  <Image
                    key={index}
                    className="cursor-pointer rounded-xl border border-neutral-100 dark:border-neutral-800 transition-all duration-300 hover:scale-102 hover:opacity-90 shadow-sm"
                    src={path.startsWith("data") ? path : item?.base64}
                    alt="message image"
                    width={240}
                    height={240}
                    onClick={() => {
                      setSelectedImage({
                        messageId: message.id,
                        path,
                        base64: path.startsWith("data") ? path : item?.base64 || "",
                        url: path.startsWith("data") ? "" : item?.url || "",
                        file: null
                      })

                      setShowImagePreview(true)
                    }}
                    loading="lazy"
                  />
                )
              })}
            </div>

            {/* Action buttons inside bubble during edit */}
            {isEditing && (
              <div className="mt-3 flex justify-start space-x-2 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs px-3 h-8" onClick={handleSendEdit}>
                  Save & Send
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg text-xs px-3 h-8" onClick={onCancelEdit}>
                  Cancel
                </Button>
              </div>
            )}

            {/* Float Action buttons to the right of AI Card */}
            <div
              className={cn(
                "absolute -right-12 top-2 z-10 transition-opacity duration-200",
                isHovering ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            >
              <MessageActions
                onCopy={handleCopy}
                onEdit={handleStartEdit}
                isAssistant={true}
                isLast={isLast}
                isEditing={isEditing}
                isHovering={isHovering}
                onRegenerate={handleRegenerate}
              />
            </div>
          </div>
        </div>
      )}

      {/* Previews Modal */}
      {showImagePreview && selectedImage && (
        <FilePreview
          type="image"
          item={selectedImage}
          isOpen={showImagePreview}
          onOpenChange={(isOpen: boolean) => {
            setShowImagePreview(isOpen)
            setSelectedImage(null)
          }}
        />
      )}

      {showFileItemPreview && selectedFileItem && (
        <FilePreview
          type="file_item"
          item={selectedFileItem}
          isOpen={showFileItemPreview}
          onOpenChange={(isOpen: boolean) => {
            setShowFileItemPreview(isOpen)
            setSelectedFileItem(null)
          }}
        />
      )}
    </div>
  )
}
