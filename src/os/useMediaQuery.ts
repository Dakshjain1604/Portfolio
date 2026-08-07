"use client"

import { useEffect, useState } from "react"

/** Returns null until resolved on the client, so DesktopShell can avoid
 *  rendering the wrong branch for one frame. See plan/16-mobile-springboard.md. */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null)

  useEffect(() => {
    const mql = window.matchMedia(query)
    // Deliberate: matchMedia doesn't exist during SSR, so the initial value
    // must start as null (matching the server render) and be corrected here
    // post-mount. Lazy useState init would read window during hydration and
    // risk a mismatch against the server-rendered null.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(mql.matches)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return matches
}
