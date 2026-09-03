/**
 * What to run, and what to photograph once it is running.
 *
 * Every entry here is a real local checkout. Nothing in this file mocks a
 * screen: if a project cannot be started, it gets no shot rather than a
 * hand-made picture of one. `capture.mjs` starts `services` in order, waits
 * for each `ready` probe, then walks `shots` in one Chromium context.
 *
 * Ports are assigned in the 53xx/83xx range on purpose - the projects
 * themselves default to 3000/5173/8000 and several of them collide, so the
 * harness overrides the port rather than running them one-at-a-time and
 * hoping nothing else on the machine holds the default.
 */

const HOME = process.env.HOME
const DOCS = `${HOME}/Documents/CODES`
const DESK = `${HOME}/Desktop/CODES`
/** Repos that are not checked out on this machine get cloned here on demand.
 *  Gitignored - see the entry at the bottom of .gitignore. */
const CHECKOUTS = new URL("./.checkouts/", import.meta.url).pathname

export const targets = [
  {
    id: "soh_ships",
    title: "SOH Ships",
    root: `${DESK}/SOH_Ships`,
    services: [
      {
        name: "api",
        cwd: ".",
        cmd: ".venv/bin/python -m uvicorn backend.api:app --port 8000 --host 127.0.0.1",
        ready: "http://127.0.0.1:8000/docs",
        optional: true,
      },
      {
        name: "web",
        cwd: "frontend",
        cmd: "npx vite --host 127.0.0.1 --port 5301 --strictPort",
        ready: "http://127.0.0.1:5301/",
      },
    ],
    base: "http://127.0.0.1:5301",
    shots: [
      { name: "map", path: "/", settle: 7000 },
      {
        // The mission log's completed run is the part that shows actual
        // detector output rather than the AIS traffic layer.
        name: "detections",
        path: "/",
        settle: 6000,
        actions: [(p) => p.getByText("DETECTIONS READY").first().click({ timeout: 15000 })],
      },
      {
        name: "dark-vessels",
        path: "/",
        settle: 5000,
        actions: [
          (p) => p.getByText("DETECTIONS READY").first().click({ timeout: 15000 }),
          (p) => p.waitForTimeout(2500),
          // The filter tabs carry aria-labels; matching on the visible "DARK"
          // instead hit the "3 DARK VESSELS" banner and silently did nothing,
          // which the duplicate-shot check caught.
          (p) => p.getByLabel("Filter: DARK").click({ timeout: 10000 }),
        ],
      },
      {
        name: "new-analysis",
        path: "/",
        settle: 4000,
        actions: [(p) => p.getByText("NEW SAR ANALYSIS").first().click({ timeout: 15000 })],
      },
    ],
  },

  {
    id: "bloomberg_terminal",
    title: "BloombergTerminal",
    root: `${DESK}/9861`,
    services: [
      {
        name: "web",
        cwd: "frontend",
        cmd: "npx vite --host 127.0.0.1 --port 5302 --strictPort",
        ready: "http://127.0.0.1:5302/",
      },
    ],
    base: "http://127.0.0.1:5302",
    shots: [
      { name: "terminal", path: "/", settle: 7000 },
      {
        /**
         * The technical-indicator overlays, not the Ctrl+K palette.
         *
         * The palette was the first choice and made a poor shot: its own
         * backdrop dims the whole terminal, and because the gateway 429s
         * every request (see README) the results list reads "No results".
         * The indicator toolbar is client-side, so it shows something real.
         */
        name: "indicators",
        path: "/",
        settle: 4000,
        actions: [
          (p) => p.waitForTimeout(5000),
          (p) => p.getByText("RSI", { exact: true }).first().click({ timeout: 10000 }),
          (p) => p.waitForTimeout(1200),
          (p) => p.getByText("MACD", { exact: true }).first().click({ timeout: 10000 }),
        ],
      },
      {
        name: "chart-range",
        path: "/",
        settle: 4000,
        actions: [
          (p) => p.waitForTimeout(5000),
          (p) => p.getByText("5Y", { exact: true }).first().click({ timeout: 10000 }),
        ],
      },
      {
        name: "shortcuts",
        path: "/",
        settle: 3000,
        actions: [(p) => p.waitForTimeout(5000), (p) => p.keyboard.press("?")],
      },
      {
        name: "watchlist",
        path: "/",
        settle: 4000,
        actions: [(p) => p.waitForTimeout(5500), (p) => p.getByText("NVDA").first().click({ timeout: 10000 })],
      },
    ],
  },

  {
    id: "llm_response_judge",
    title: "LLM Response Judge",
    root: `${DOCS}/LLM-response-Judge`,
    /**
     * `GET /api/demo-results` resolves its file as
     * `backend/app/api/../../data/demo_results.json` -> `backend/data/...`,
     * which only exists because docker-compose bind-mounts `./data` there.
     * Run outside the container the endpoint 404s and demo mode is dead, so
     * the harness recreates the mount as a symlink. Reversible:
     * `rm LLM-response-Judge/backend/data`.
     */
    prepare: ["[ -e backend/data ] || ln -s ../data backend/data"],
    services: [
      {
        // The frontend opens a blocking "API Configuration" modal on load and
        // its welcome screen stays empty until something is evaluated, so the
        // shot worth having is the demo dataset - which only exists behind the
        // API. CORS_ORIGINS has to name the harness port, not the 5173 the app
        // defaults to.
        name: "api",
        cwd: "backend",
        cmd: "CORS_ORIGINS=http://127.0.0.1:5303 .venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8303",
        ready: "http://127.0.0.1:8303/docs",
      },
      {
        name: "web",
        cwd: "frontend",
        cmd: "VITE_API_URL=http://127.0.0.1:8303 npx vite --host 127.0.0.1 --port 5303 --strictPort",
        ready: "http://127.0.0.1:5303/",
      },
    ],
    base: "http://127.0.0.1:5303",
    shots: [
      {
        name: "results",
        path: "/",
        settle: 6000,
        actions: [
          (p) => p.getByRole("button", { name: "Cancel" }).click({ timeout: 15000 }),
          (p) => p.getByText("Try Demo Mode").click({ timeout: 15000 }),
        ],
      },
      {
        name: "response-detail",
        path: "/",
        settle: 4000,
        actions: [
          (p) => p.getByRole("button", { name: "Cancel" }).click({ timeout: 15000 }),
          (p) => p.getByText("Try Demo Mode").click({ timeout: 15000 }),
          (p) => p.waitForTimeout(2500),
          (p) => p.locator("tbody tr").first().click({ timeout: 10000 }),
        ],
      },
      {
        name: "dark-mode",
        path: "/",
        settle: 4000,
        actions: [
          (p) => p.getByRole("button", { name: "Cancel" }).click({ timeout: 15000 }),
          (p) => p.getByText("Try Demo Mode").click({ timeout: 15000 }),
          (p) => p.waitForTimeout(2500),
          // The toggle lives in a <nav>, not a <header> - the earlier
          // `header button` selector matched nothing and failed silently.
          (p) => p.getByLabel("Toggle dark mode").click({ timeout: 8000 }),
        ],
      },
      {
        name: "welcome",
        path: "/",
        settle: 3500,
        actions: [(p) => p.getByRole("button", { name: "Cancel" }).click({ timeout: 15000 })],
      },
      { name: "api-config", path: "/", settle: 3500 },
    ],
  },

  {
    id: "interview_ai",
    title: "Interview AI",
    root: `${DOCS}/CODES_2/AI_interview/Ai_Interview`,
    services: [
      {
        name: "web",
        cwd: "interviewAi",
        cmd: "npx vite --host 127.0.0.1 --port 5304 --strictPort",
        ready: "http://127.0.0.1:5304/",
      },
    ],
    base: "http://127.0.0.1:5304",
    shots: [
      { name: "home", path: "/", settle: 5000 },
      {
        // The landing page is 1018px tall against a 900px viewport, so this
        // is the bottom of it - enough to bring the four feature cards fully
        // into frame. A second, deeper scroll clamped to the same place and
        // produced a byte-identical shot, which is what the duplicate check
        // is for. There is no interviewer-dashboard shot on purpose: that
        // route is gated by real Supabase auth, and faking a session to
        // photograph it would make the picture a lie.
        name: "features",
        path: "/",
        settle: 3000,
        actions: [(p) => p.evaluate(() => window.scrollTo({ top: 1100, behavior: "instant" }))],
      },
      { name: "interviewee", path: "/interviewee", settle: 5000 },
      { name: "login", path: "/login", settle: 4000 },
    ],
  },

  {
    id: "documind_ai",
    title: "DocuMind AI",
    root: `${DOCS}/CODES_2/AI_Docx`,
    services: [
      {
        name: "web",
        cwd: "frontend",
        /**
         * `MONGODB_URI=` on purpose, and it matters.
         *
         * The checkout's own `.env` points at a real Mongo instance, and
         * `lib/userStore.ts` uses Mongo whenever that variable is set. The
         * dashboard shot signs up an account to get through the JWT gate -
         * which would have written a throwaway harness user into a live
         * database. Blanking it falls back to the local JSON store
         * (`AI_Docx/tmp/users_db.json`), so photographing the project writes
         * nothing anywhere but that file.
         */
        cmd: "MONGODB_URI= npx next dev --hostname 127.0.0.1 --port 5305",
        ready: "http://127.0.0.1:5305/",
      },
    ],
    base: "http://127.0.0.1:5305",
    shots: [
      { name: "home", path: "/", settle: 8000 },
      {
        name: "retrieval",
        path: "/",
        settle: 3500,
        actions: [(p) => p.evaluate(() => window.scrollTo({ top: 480, behavior: "instant" }))],
      },
      {
        name: "pipeline",
        path: "/",
        settle: 3500,
        actions: [// 997 is the real bottom (1897px page, 900px viewport). 2400
          // clamped to the same place as the shot above it.
          (p) => p.evaluate(() => window.scrollTo({ top: 997, behavior: "instant" }))],
      },
      { name: "signin", path: "/signin", settle: 5000 },
      {
        // The studio behind the JWT gate. Signs up a throwaway local account
        // (accounts land in a JSON file when MONGODB_URI is unset) then signs
        // in, because /Dashboard is genuinely protected - middleware.ts
        // verifies the cookie, so there is no way to photograph it from
        // outside.
        name: "dashboard",
        path: "/signup",
        settle: 9000,
        actions: [
          // Matched on input type, not on placeholder text: the real
          // placeholders are "Your name" / "you@domain.com" / "At least six
          // characters", so /email/i and /password/i matched nothing and the
          // whole flow failed silently.
          (p) => p.locator('input[type="text"]').first().fill("Shots Harness"),
          (p) => p.locator('input[type="email"]').first().fill("shots@example.com"),
          (p) => p.locator('input[type="password"]').first().fill("shots-harness-pw"),
          (p) => p.getByRole("button", { name: /create workspace/i }).first().click({ timeout: 10000 }),
          (p) => p.waitForTimeout(3000),
          (p) => p.goto("http://127.0.0.1:5305/signin", { waitUntil: "domcontentloaded" }),
          (p) => p.waitForTimeout(2500),
          (p) => p.locator('input[type="email"]').first().fill("shots@example.com"),
          (p) => p.locator('input[type="password"]').first().fill("shots-harness-pw"),
          // "Open Session", not "Sign in" - this app names its buttons.
          (p) => p.getByRole("button", { name: /open session/i }).first().click({ timeout: 10000 }),
          (p) => p.waitForTimeout(5000),
          (p) => p.goto("http://127.0.0.1:5305/Dashboard", { waitUntil: "domcontentloaded" }),
        ],
      },
    ],
  },

  {
    id: "bioscript",
    title: "BioScript",
    root: `${DOCS}/AI-Powered-Drug-Repurposing-Platform`,
    services: [
      {
        name: "streamlit",
        cwd: ".",
        cmd: "venv/bin/streamlit run app.py --server.address 127.0.0.1 --server.port 8306 --server.headless true --browser.gatherUsageStats false",
        ready: "http://127.0.0.1:8306/",
      },
    ],
    base: "http://127.0.0.1:8306",
    shots: [
      { name: "workbench", path: "/", settle: 8000 },
      {
        name: "guide",
        path: "/",
        settle: 4000,
        actions: [(p) => p.getByText("Research Workbench Guide").first().click({ timeout: 15000 })],
      },
      {
        name: "advanced-settings",
        path: "/",
        settle: 4000,
        actions: [(p) => p.getByText("Advanced Settings").first().click({ timeout: 15000 })],
      },
      {
        name: "configuration",
        path: "/",
        settle: 4000,
        actions: [
          (p) =>
            p
              .locator('[data-testid="stSidebar"]')
              .first()
              .evaluate((el) => el.querySelector("div")?.scrollTo({ top: 900, behavior: "instant" })),
        ],
      },
    ],
  },

  {
    id: "website_cloner",
    title: "Website Cloner",
    root: `${DOCS}/website_cloner`,
    services: [
      // No backend service here on purpose. `app/llm_client.py` constructs
      // its OpenAI client at import time, so the API will not start - not
      // even to serve its own /docs - without a key, and the attempt just
      // photographs a browser error page. Two honest views is what this
      // project has; it is one form and one endpoint.
      {
        name: "web",
        cwd: "frontend",
        cmd: "npx next dev --hostname 127.0.0.1 --port 5307",
        ready: "http://127.0.0.1:5307/",
      },
    ],
    base: "http://127.0.0.1:5307",
    shots: [
      { name: "home", path: "/", settle: 6000 },
      {
        name: "url-entered",
        path: "/",
        settle: 2500,
        actions: [(p) => p.getByPlaceholder(/Enter website URL/i).fill("https://news.ycombinator.com")],
      },
    ],
  },
  {
    id: "autocareer",
    title: "AutoCareer",
    /**
     * The only project here with no local checkout, so the harness makes one.
     * Only the dashboard is started: the backend exposes the Selenium applier
     * behind explicit endpoints and this never calls them, so photographing
     * the project submits nothing to anybody.
     */
    root: `${CHECKOUTS}autocareer`,
    prepare: [
      "[ -d .git ] || git clone --depth 1 https://github.com/Dakshjain1604/Job-Application-AutoFiller-Agent.git .",
      "[ -d frontend/node_modules ] || (cd frontend && npm install --no-audit --no-fund)",
      "[ -d .venv ] || (uv venv .venv --python 3.12 && uv pip install --python .venv/bin/python -r backend/requirements.txt)",
    ],
    services: [
      {
        // The dashboard hardcodes http://localhost:8000, so this one cannot
        // be moved off the default port.
        name: "api",
        cwd: "backend",
        cmd: "../.venv/bin/python main.py",
        ready: "http://127.0.0.1:8000/",
        optional: true,
      },
      {
        name: "web",
        cwd: "frontend",
        cmd: "PORT=5308 BROWSER=none npx react-scripts start",
        ready: "http://127.0.0.1:5308/",
      },
    ],
    base: "http://127.0.0.1:5308",
    shots: [
      { name: "dashboard", path: "/", settle: 7000 },
      {
        name: "jobs",
        path: "/",
        settle: 4000,
        actions: [(p) => p.getByText("Jobs", { exact: false }).first().click({ timeout: 12000 })],
      },
      {
        name: "draft",
        path: "/",
        settle: 4000,
        actions: [(p) => p.getByText("Draft", { exact: false }).first().click({ timeout: 12000 })],
      },
      {
        name: "logs",
        path: "/",
        settle: 4000,
        actions: [(p) => p.getByText("Logs", { exact: false }).first().click({ timeout: 12000 })],
      },
      {
        name: "settings",
        path: "/",
        settle: 4000,
        actions: [(p) => p.locator("button").filter({ hasText: /⚙/ }).first().click({ timeout: 12000 })],
      },
    ],
  }

]

export const byId = Object.fromEntries(targets.map((t) => [t.id, t]))
