/**
 * Command-line projects, and the commands worth photographing.
 *
 * `slice` trims a transcript down to what fits in one window. It only ever
 * removes whole lines - see the header of terminal.mjs, and the full
 * untrimmed output in tools/shots/transcripts/.
 */
const HOME = process.env.HOME
const DESK = `${HOME}/Desktop/CODES`

/** Keep the lines from the first match of `from` through the last of `to`. */
const between = (from, to) => (lines) => {
  const a = lines.findIndex((l) => from.test(l))
  const b = lines.map((l) => to.test(l)).lastIndexOf(true)
  if (a < 0 || b < 0 || b < a) return lines
  return lines.slice(a, b + 1)
}

/** The LAST `from` block and the first `to` after it. The agent prints one
 *  summary per subtask and the run is non-deterministic, so anchoring on the
 *  first-to-last pair swept up every intermediate turn and produced an image
 *  three screens tall. */
const lastBlock = (from, to) => (lines) => {
  const a = lines.map((l) => from.test(l)).lastIndexOf(true)
  if (a < 0) return lines
  const rel = lines.slice(a).findIndex((l) => to.test(l))
  return rel < 0 ? lines.slice(a) : lines.slice(a, a + rel + 1)
}
const dropBlank = (lines) => {
  const out = []
  for (const l of lines) {
    const blank = l.replace(/\x1b\[[0-9;]*m/g, "").trim() === ""
    if (blank && out.length && out[out.length - 1] === "") continue
    out.push(blank ? "" : l)
  }
  return out
}

export const sessions = [
  {
    /**
     * neo-mcp has no screen: it is a stdio MCP server whose source repo is
     * private. The first attempt photographed its PyPI project page and got
     * a Fastly bot challenge instead - a CAPTCHA, correctly served to a
     * headless browser, and not something to work around. So the evidence
     * is the two things that are checkable without a browser at all: the
     * package installed on this machine, and PyPI's own JSON API. Both are
     * live output, and both are reproducible by anyone reading this.
     */
    id: "neo_mcp",
    name: "package",
    title: "neo-mcp — installed from PyPI",
    cwd: HOME,
    width: 1180,
    steps: [
      {
        cmd: "pip show neo-mcp",
        display: "pip show neo-mcp",
        slice: (lines) => lines.filter((l) => !/^(Home-page|Author|Location|Required-by|Editable)/.test(l)),
      },
      {
        cmd: "curl -s https://pypi.org/pypi/neo-mcp/json | jq '{name: .info.name, version: .info.version, license: .info.license, requires_python: .info.requires_python, releases: (.releases | length)}'",
        display: "curl -s https://pypi.org/pypi/neo-mcp/json | jq '{name, version, license, releases}'",
        timeout: 60_000,
      },
    ],
  },

  {
    /** The artefacts themselves - the MIT sdist the Finder entry links to. */
    id: "neo_mcp",
    name: "distribution",
    title: "neo-mcp \u2014 what ships",
    cwd: HOME,
    width: 1180,
    steps: [
      {
        cmd: "curl -s https://pypi.org/pypi/neo-mcp/json | jq -r '.urls[] | [.packagetype, .filename, (.size|tostring) + \" bytes\"] | @tsv'",
        display: "curl -s https://pypi.org/pypi/neo-mcp/json | jq -r '.urls[] | [.packagetype, .filename, .size] | @tsv'",
        timeout: 60_000,
      },
      {
        cmd: "pip show -f neo-mcp | sed -n '/^Files:/,$p' | head -14",
        display: "pip show -f neo-mcp | sed -n '/^Files:/,$p'",
      },
    ],
  },

  {
    /**
     * The provider chain the project claims, printed by the project. This is
     * the shot that shows Ollama/Groq/OpenRouter routing is a real config
     * surface rather than a README sentence.
     */
    id: "ai_coding_agent",
    name: "providers",
    title: "coding-agent \u2014 config list",
    cwd: `${DESK}/CodingAgent`,
    width: 1180,
    steps: [
      {
        cmd: "node ./bin/run.js config list",
        display: "coding-agent config list",
        slice: (lines) => dropBlank(lines).slice(0, 26),
      },
    ],
  },

  {
    id: "ai_coding_agent",
    name: "memory",
    title: "coding-agent \u2014 memory",
    cwd: `${DESK}/CodingAgent`,
    width: 1180,
    steps: [
      {
        cmd: "node ./bin/run.js memory --help",
        display: "coding-agent memory --help",
        slice: (lines) => dropBlank(lines).slice(0, 16),
      },
      {
        cmd: "node ./bin/run.js memory show",
        display: "coding-agent memory show",
        slice: (lines) => dropBlank(lines).slice(0, 14),
      },
    ],
  },

  {
    id: "ai_coding_agent",
    name: "cli",
    title: "coding-agent — run \"add a unit test for slugify in slugify.js\"",
    cwd: `${DESK}/CodingAgent`,
    width: 1180,
    steps: [
      {
        cmd: "node ./bin/run.js --help",
        display: "coding-agent --help",
        slice: (lines) => dropBlank(between(/COMMANDS/, /simplify/)(lines)),
      },
      {
        // A real run against the local Ollama chain, no API key configured -
        // which is the property the project claims and the reason the cost
        // line at the end reads $0.000000.
        cmd: `cd "${process.env.SHOTS_DEMO_DIR ?? "/tmp/ca-demo"}" && node "${DESK}/CodingAgent/bin/run.js" run "add a unit test for slugify in slugify.js" --no-confirm --complexity simple`,
        display: 'coding-agent run "add a unit test for slugify in slugify.js"',
        timeout: 600_000,
        slice: (lines) => dropBlank(lastBlock(/Turn \d+ Summary/, /local: .*calls/)(lines)),
      },
    ],
  },
]
