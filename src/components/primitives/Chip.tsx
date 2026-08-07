export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[--r-chip] bg-panel-3 px-2.5 py-1 text-[11px] text-text-2">
      {children}
    </span>
  )
}
