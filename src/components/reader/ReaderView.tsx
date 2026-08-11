import Image from "next/image"
import { profile } from "@/data/profile"
import { projects } from "@/data/projects"
import { experience } from "@/data/experience"
import { skills } from "@/data/skills"
import { posts } from "@/data/writing"
import { socials } from "@/data/socials"
import { ReaderReturnBar } from "./ReaderReturnBar"

/**
 * Server component. Renders without JavaScript. Always in the DOM - see
 * plan/00-architecture.md section 4 and plan/17-reader-view.md. Every
 * string here comes from src/data/, the same modules the desktop apps
 * read, so there is no second copy of any content on the site.
 */
export function ReaderView() {
  return (
    <div id="reader" className="relative min-h-[100dvh] bg-void">
      <a
        href="#main"
        className="sr-only rounded-(--r-control) bg-accent-fill px-3 py-2 text-xs text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>

      <ReaderReturnBar />

      <article id="main" className="mx-auto max-w-[68ch] px-6 py-16">
        <header className="mb-16">
          <h1 className="text-[40px] font-semibold tracking-[-0.03em] text-text">{profile.name}</h1>
          <p className="mt-2 text-base text-text-2">
            {profile.role} at{" "}
            <a href={profile.employer.url} target="_blank" rel="noopener noreferrer" className="text-text underline underline-offset-[3px]">
              {profile.employer.name}
            </a>
          </p>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-[1.7] text-text-2">{profile.tagline}</p>
          <nav aria-label="Profile links" className="mt-5 flex flex-wrap gap-4 text-sm">
            <a href={`mailto:${socials.email}`} className="text-text underline underline-offset-[3px]">
              {socials.email}
            </a>
            <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-text underline underline-offset-[3px]">
              GitHub
            </a>
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-text underline underline-offset-[3px]">
              LinkedIn
            </a>
            <a href={socials.resume} className="text-text underline underline-offset-[3px]">
              Resume
            </a>
          </nav>
        </header>

        <section aria-labelledby="about-h" className="mb-16">
          <h2 id="about-h" className="mb-5 text-[13px] font-medium uppercase tracking-[0.14em] text-text-2">
            About
          </h2>
          <div className="space-y-4 text-[15px] leading-[1.7] text-text-2">
            {profile.bio.map((para, i) => (
              <p key={i}>
                {para.parts.map((part, j) =>
                  part.link ? (
                    <a key={j} href={part.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-text underline underline-offset-[3px]">
                      {part.text}
                    </a>
                  ) : part.bold ? (
                    <strong key={j} className="font-semibold text-text">
                      {part.text}
                    </strong>
                  ) : (
                    <span key={j}>{part.text}</span>
                  )
                )}
              </p>
            ))}
          </div>
        </section>

        <section aria-labelledby="exp-h" className="mb-16">
          <h2 id="exp-h" className="mb-5 text-[13px] font-medium uppercase tracking-[0.14em] text-text-2">
            Experience
          </h2>
          <div className="space-y-8">
            {experience.map((role) => (
              <article key={role.id}>
                <h3 className="text-lg font-medium text-text">{role.title}</h3>
                <p className="text-sm text-text-2">
                  {role.org} · {role.location} ·{" "}
                  <time dateTime={role.start}>{role.start}</time> to{" "}
                  {role.end === "Present" ? role.end : <time dateTime={role.end}>{role.end}</time>}
                </p>
                <p className="mt-2 text-[15px] leading-[1.7] text-text-2">{role.summary}</p>
                <ul className="mt-2 space-y-1">
                  {role.bullets.map((b, i) => (
                    <li key={i} className="text-[15px] leading-[1.7] text-text-2">
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-text-2">{role.tech.join(", ")}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="proj-h" className="mb-16">
          <h2 id="proj-h" className="mb-5 text-[13px] font-medium uppercase tracking-[0.14em] text-text-2">
            Projects
          </h2>
          <div className="space-y-10">
            {projects.map((p) => (
              <article key={p.id}>
                <Image
                  src={p.image}
                  alt={`${p.title} screenshot`}
                  width={1200}
                  height={750}
                  className="mb-3 w-full rounded-(--r-card) object-cover"
                />
                <h3 className="text-lg font-medium text-text">{p.title}</h3>
                <p className="text-sm text-text-2">{p.outcome}</p>
                <p className="mt-2 text-[15px] leading-[1.7] text-text-2">{p.description}</p>
                <p className="mt-2 text-sm text-text-2">{p.tech.join(", ")}</p>
                {p.metrics && (
                  <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-2">
                    {p.metrics.map((m) => (
                      <div key={m.label} className="flex gap-2">
                        <dt>{m.label}:</dt>
                        <dd className="text-text">{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {/* Mirrors Finder: a project's own `links` win over the
                    Source/Live default, so the crawlable copy carries the
                    same labels and destinations the app does. */}
                <p className="mt-2 flex flex-wrap gap-4 text-sm">
                  {(
                    p.links ?? [
                      ...(p.github ? [{ label: "Source", href: p.github }] : []),
                      ...(p.live ? [{ label: "Live", href: p.live }] : []),
                    ]
                  ).map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text underline underline-offset-[3px]"
                    >
                      {l.label}
                    </a>
                  ))}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="skills-h" className="mb-16">
          <h2 id="skills-h" className="mb-5 text-[13px] font-medium uppercase tracking-[0.14em] text-text-2">
            Skills
          </h2>
          <div className="space-y-4">
            {skills.map((group) => (
              <div key={group.id}>
                <h3 className="text-sm font-medium text-text">{group.label}</h3>
                <p className="text-[15px] leading-[1.7] text-text-2">{group.skills.map((s) => s.name).join(", ")}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Full post bodies, not just titles. This is the only route by
            which the writing is crawlable - the Writing app is a client
            component behind a shell that never server-renders - and long-form
            technical prose is the highest-value text on the whole page for
            search. Rendering only the deks here would waste it. */}
        <section aria-labelledby="writing-h" className="mb-16">
          <h2 id="writing-h" className="mb-5 text-[13px] font-medium tracking-[0.14em] text-text-2 uppercase">
            Writing
          </h2>
          <div className="space-y-10">
            {posts.map((post) => (
              <article key={post.slug}>
                <h3 className="text-sm font-medium text-text">{post.title}</h3>
                <p className="mt-1 text-[13px] text-text-2">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(post.date))}{" "}
                  · {post.readingMinutes} min read
                </p>
                <div className="mt-3 space-y-3">
                  {post.body.map((block, i) => {
                    if (block.kind === "code") {
                      return (
                        <pre
                          key={i}
                          className="overflow-x-auto rounded-lg bg-panel p-3 font-mono text-[13px] text-text-2"
                        >
                          <code>{block.text}</code>
                        </pre>
                      )
                    }
                    if (block.kind === "list") {
                      return (
                        <ul key={i} className="list-disc space-y-1 pl-5">
                          {block.items.map((item, j) => (
                            <li key={j} className="text-[15px] leading-[1.7] text-text-2">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )
                    }
                    if (block.kind === "h") {
                      return (
                        <h4 key={i} className="pt-2 text-sm font-medium text-text">
                          {block.text}
                        </h4>
                      )
                    }
                    if (block.kind === "quote") {
                      return (
                        <blockquote
                          key={i}
                          className="border-l-2 border-accent pl-4 text-[15px] leading-[1.7] text-text italic"
                        >
                          {block.text}
                        </blockquote>
                      )
                    }
                    return (
                      <p key={i} className="text-[15px] leading-[1.7] text-text-2">
                        {block.text}
                      </p>
                    )
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="contact-h">
          <h2 id="contact-h" className="mb-5 text-[13px] font-medium uppercase tracking-[0.14em] text-text-2">
            Contact
          </h2>
          <p className="text-[15px] leading-[1.7] text-text-2">
            <a href={`mailto:${socials.email}`} className="text-text underline underline-offset-[3px]">
              {socials.email}
            </a>
            <br />
            <a href={`tel:${socials.phone.replace(/\s/g, "")}`} className="text-text underline underline-offset-[3px]">
              {socials.phone}
            </a>
            <br />
            {profile.location}
          </p>
        </section>
      </article>
    </div>
  )
}
