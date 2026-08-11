import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for an hour, matching /api/github.

/**
 * Live release figures for the PyPI packages this site claims.
 *
 * Exists because the alternative was hardcoding them, and hardcoding them
 * was already wrong: the resume this content came from said "45 releases in
 * 4 months", and PyPI was at 46 by the time it was wired up. A portfolio
 * metric that silently drifts is worse than no metric, because the reader
 * who checks is exactly the reader you wanted to impress.
 *
 * No auth needed - the PyPI JSON API is public and unauthenticated, so
 * unlike /api/github this works with no environment configuration at all.
 *
 * Allowlisted rather than taking an arbitrary `?package=`: this endpoint is
 * public, and proxying any URL a caller names is how an open redirect or an
 * SSRF pivot gets built by accident.
 */
const ALLOWED = new Set(["neo-mcp"]);

type Payload = Record<
  string,
  { version: string; releases: number; requiresPython: string | null; license: string | null }
>;

function unavailable() {
  return NextResponse.json({ error: true, reason: "unavailable" as const });
}

export async function GET() {
  try {
    const entries = await Promise.all(
      [...ALLOWED].map(async (name) => {
        const res = await fetch(`https://pypi.org/pypi/${name}/json`, {
          headers: { Accept: "application/json" },
          next: { revalidate },
        });
        if (!res.ok) return null;
        const json = await res.json();
        const info = json?.info ?? {};
        return [
          name,
          {
            version: String(info.version ?? ""),
            // `releases` is keyed by version string; its size is the count of
            // published versions, which is what "45 releases" means.
            releases: Object.keys(json?.releases ?? {}).length,
            requiresPython: info.requires_python ?? null,
            license: info.license ?? null,
          },
        ] as const;
      })
    );

    const payload: Payload = {};
    for (const e of entries) if (e) payload[e[0]] = e[1];
    if (Object.keys(payload).length === 0) return unavailable();

    return NextResponse.json(payload);
  } catch (error) {
    console.error("PyPI API error:", error);
    return unavailable();
  }
}
