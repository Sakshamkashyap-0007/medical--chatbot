import { cn } from "@/lib/utils"
import { ModelProvider } from "@/types"
import {
  IconBrandOpenai,
  IconBrandGoogle,
  IconCpu
} from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { FC, HTMLAttributes } from "react"
import { AnthropicSVG } from "../icons/anthropic-svg"
import { GoogleSVG } from "../icons/google-svg"
import { OpenAISVG } from "../icons/openai-svg"

interface ModelIconProps extends HTMLAttributes<HTMLDivElement> {
  provider: ModelProvider
  height: number
  width: number
}

export const ModelIcon: FC<ModelIconProps> = ({
  provider,
  height,
  width,
  ...props
}) => {
  const { theme } = useTheme()

  switch (provider as ModelProvider) {
    case "openai":
      return (
        <OpenAISVG
          className={cn(
            "rounded-sm bg-white p-1 text-black",
            props.className,
            theme === "dark" ? "bg-white" : "border-DEFAULT border-black"
          )}
          width={width}
          height={height}
        />
      )
    case "mistral":
      return (
        <IconCpu
          className={cn(
            "rounded-sm p-1",
            theme === "dark" ? "text-white" : "text-black"
          )}
          width={width}
          height={height}
        />
      )
    case "groq":
      return (
        <IconCpu
          className={cn(
            "rounded-sm p-1",
            theme === "dark" ? "text-white" : "text-black"
          )}
          width={width}
          height={height}
        />
      )
    case "anthropic":
      return (
        <AnthropicSVG
          className={cn(
            "rounded-sm bg-white p-1 text-black",
            props.className,
            theme === "dark" ? "bg-white" : "border-DEFAULT border-black"
          )}
          width={width}
          height={height}
        />
      )
    case "google":
      return (
        <GoogleSVG
          className={cn(
            "rounded-sm bg-white p-1 text-black",
            props.className,
            theme === "dark" ? "bg-white" : "border-DEFAULT border-black"
          )}
          width={width}
          height={height}
        />
      )
    case "perplexity":
      return (
        <IconCpu
          className={cn(
            "rounded-sm p-1",
            theme === "dark" ? "text-white" : "text-black"
          )}
          width={width}
          height={height}
        />
      )
    default:
      return <IconCpu size={width} />
  }
}
