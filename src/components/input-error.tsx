import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputErrorProps {
  message?: string
  className?: string
}

export default function InputError({ message, className }: InputErrorProps) {
  if (!message) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-destructive mt-1",
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
