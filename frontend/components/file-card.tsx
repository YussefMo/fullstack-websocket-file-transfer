import { FileIcon, FileTextIcon, ImageIcon, FileVideoIcon, FileAudioIcon, ArchiveIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileCardProps {
  file: File
  className?: string
}

export function FileCard({ file, className }: FileCardProps) {
  const fileType = file.type.split("/")[0]
  const fileSize = formatFileSize(file.size)

  return (
    <div
      className={cn(
        "flex items-center p-5 rounded-xl subtle-border hover-lift",
        "bg-background/50 transition-all duration-300",
        className,
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary/80">
        {getFileIcon(fileType)}
      </div>
      <div className="ml-4 flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <div className="flex items-center mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/70 mr-2"></div>
          <p className="text-xs text-muted-foreground">
            {fileSize} • {getFileTypeLabel(file.type)}
          </p>
        </div>
      </div>
    </div>
  )
}

function getFileIcon(type: string) {
  switch (type) {
    case "image":
      return <ImageIcon className="h-5 w-5 text-primary/80" />
    case "video":
      return <FileVideoIcon className="h-5 w-5 text-primary/80" />
    case "audio":
      return <FileAudioIcon className="h-5 w-5 text-primary/80" />
    case "text":
      return <FileTextIcon className="h-5 w-5 text-primary/80" />
    case "application":
      return <ArchiveIcon className="h-5 w-5 text-primary/80" />
    default:
      return <FileIcon className="h-5 w-5 text-primary/80" />
  }
}

function getFileTypeLabel(mimeType: string) {
  const parts = mimeType.split("/")
  if (parts.length !== 2) return "Unknown"

  const type = parts[0]
  const subtype = parts[1]

  switch (type) {
    case "image":
      return subtype.toUpperCase()
    case "video":
      return subtype.toUpperCase()
    case "audio":
      return subtype.toUpperCase()
    case "text":
      return `${subtype.charAt(0).toUpperCase()}${subtype.slice(1)}`
    case "application":
      if (subtype === "pdf") return "PDF"
      if (subtype.includes("zip") || subtype.includes("rar") || subtype.includes("tar")) return "Archive"
      if (subtype.includes("word") || subtype === "msword") return "Word"
      if (subtype.includes("excel") || subtype.includes("spreadsheet")) return "Spreadsheet"
      if (subtype.includes("presentation") || subtype.includes("powerpoint")) return "Presentation"
      return `${subtype.charAt(0).toUpperCase()}${subtype.slice(1)}`
    default:
      return "File"
  }
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

