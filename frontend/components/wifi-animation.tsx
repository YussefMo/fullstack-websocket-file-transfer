import { WifiIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface WifiAnimationProps {
  active?: boolean
}

export function WifiAnimation({ active = false }: WifiAnimationProps) {
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Outer rings */}
      <div
        className={cn(
          "absolute w-full h-full rounded-full transition-all duration-700",
          "border border-primary/5 opacity-0 scale-0",
          active && "opacity-100 scale-100",
        )}
      />

      <div
        className={cn(
          "absolute w-[140%] h-[140%] rounded-full transition-all duration-700 delay-100",
          "border border-primary/5 opacity-0 scale-0",
          active && "opacity-100 scale-100",
        )}
      />

      <div
        className={cn(
          "absolute w-[180%] h-[180%] rounded-full transition-all duration-700 delay-200",
          "border border-primary/5 opacity-0 scale-0",
          active && "opacity-100 scale-100",
        )}
      />

      {/* Inner circle with glow effect */}
      <div
        className={cn(
          "absolute w-14 h-14 rounded-full transition-all duration-500",
          active ? "opacity-20 scale-100" : "opacity-0 scale-90",
          "bg-primary blur-md",
        )}
      />

      {/* Icon container */}
      <div
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full z-10",
          "transition-all duration-500 shadow-sm",
          active ? "bg-primary text-primary-foreground shadow-lg" : "bg-secondary text-secondary-foreground",
        )}
      >
        <WifiIcon className={cn("h-6 w-6 transition-all duration-300", active && "scale-110")} />
      </div>
    </div>
  )
}

