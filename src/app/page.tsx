import { profile } from "@/data/profile"

/**
 * Foundation-phase placeholder. Replaced in Phase 6 (plan/17-reader-view.md) by:
 *
 *   export default function Page() {
 *     return (
 *       <>
 *         <ReaderView />
 *         <DesktopShell />
 *       </>
 *     )
 *   }
 *
 * Kept as a server component so the client/server boundary decided in
 * plan/00-architecture.md section 9 is never violated, even mid-build.
 */
export default function Page() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-2 bg-void px-6 text-center text-text">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-2">
        Under construction
      </p>
      <h1 className="text-2xl font-semibold tracking-[-0.02em]">{profile.name}</h1>
      <p className="max-w-[46ch] text-sm text-text-2">{profile.tagline}</p>
    </main>
  )
}
