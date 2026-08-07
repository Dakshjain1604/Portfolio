import type { ComponentType } from "react"
import type { IconProps } from "@phosphor-icons/react"

type EmptyStateProps = {
  icon: ComponentType<IconProps>
  title: string
  body: string
  actions?: React.ReactNode
  /** Announced when it replaces a loading state (Activity Monitor's offline
   *  case). Purely decorative empty states (Finder's no-results) omit it. */
  live?: boolean
}

export function EmptyState({ icon: Icon, title, body, actions, live }: EmptyStateProps) {
  return (
    <div
      role={live ? "status" : undefined}
      className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center"
    >
      <Icon size={28} weight="light" className="text-text-2" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-text">{title}</p>
        <p className="max-w-[36ch] text-xs text-text-2">{body}</p>
      </div>
      {actions && <div className="mt-1 flex gap-2">{actions}</div>}
    </div>
  )
}
