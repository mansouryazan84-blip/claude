import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertErrorProps {
  errors?: string[]
  className?: string
}

export default function AlertError({ errors, className }: AlertErrorProps) {
  if (!errors || errors.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive",
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        {errors.map((error, index) => (
          <p key={index} className="text-sm font-medium">
            {error}
          </p>
        ))}
      </div>
    </div>
  )
}
