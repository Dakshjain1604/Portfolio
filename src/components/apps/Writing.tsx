"use client"

import { useState } from "react"
import { ArrowLeft, Clock } from "@phosphor-icons/react/dist/ssr"
import { posts, type Block, type Post } from "@/data/writing"
import { Chip } from "@/components/primitives/Chip"
import { Sidebar } from "@/components/primitives/Sidebar"
import { cn } from "@/lib/utils"

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(iso)
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "h":
      return <h4 className="mt-7 mb-2 text-[13px] font-semibold text-text">{block.text}</h4>

    case "code":
      return (
        <pre className="my-4 overflow-x-auto rounded-(--r-card) bg-void/70 p-3.5 font-mono text-[11px] leading-[1.6] text-text-2">
          <code>{block.text}</code>
        </pre>
      )

    case "quote":
      return (
        <blockquote
          className="my-5 py-1 pl-4 text-[13px] leading-[1.65] font-medium text-text italic"
          style={{ borderLeft: "2px solid var(--os-accent)" }}
        >
          {block.text}
        </blockquote>
      )

    case "list":
      return (
        <ul className="my-3 space-y-2 pl-4">
          {block.items.map((item, i) => (
            <li key={i} className="list-disc text-[13px] leading-[1.65] text-text-2 marker:text-text-3">
              {item}
            </li>
          ))}
        </ul>
      )

    default:
      return <p className="my-3 text-[13px] leading-[1.7] text-text-2">{block.text}</p>
  }
}

function Article({ post, onBack }: { post: Post; onBack: () => void }) {
  return (
    <article className="os-plate h-full overflow-auto rounded-(--r-float)">
      {/* Sticky so the way back is always one click away no matter how far
          down a 6-minute read you are. */}
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-divider bg-panel/80 px-4 py-2 backdrop-blur-md @[560px]:hidden">
        <button
          type="button"
          onClick={onBack}
          className="os-press flex items-center gap-1.5 rounded-(--r-pill) bg-panel-3 px-2.5 py-1 text-[11px] text-text"
        >
          <ArrowLeft size={12} weight="bold" />
          All posts
        </button>
      </div>

      <div className="mx-auto max-w-[68ch] px-6 py-7 @[560px]:px-8">
        <div className="mb-1.5 flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-wide text-text-2 uppercase">
          <span>{formatDate(post.date)}</span>
          <span className="text-text-3">·</span>
          <span className="flex items-center gap-1">
            <Clock size={11} weight="regular" />
            {post.readingMinutes} min
          </span>
        </div>

        <h3 className="text-[1.4rem] leading-tight font-semibold tracking-[-0.02em] text-balance text-text">
          {post.title}
        </h3>
        <p className="mt-2.5 text-[13px] leading-[1.6] text-text-2">{post.dek}</p>

        <div className="mt-4 mb-6 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        <hr className="mb-2 border-divider" />

        {post.body.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>
    </article>
  )
}

/**
 * Writing. See plan/22-evidence-pass.md.
 *
 * The gap this fills is not "the site needs a blog" - it is that every
 * other app here shows *what* was built, and none of them show judgment
 * about it. Each post is adapted from a real decision recorded in `plan/`,
 * which is why they can be specific about tradeoffs rather than generic.
 *
 * Master/detail on wide windows, drill-down on narrow ones, on the same
 * @container query the rest of the build uses - this window can be resized
 * below the breakpoint while the browser stays wide.
 */
export function Writing() {
  const [selectedSlug, setSelectedSlug] = useState(posts[0].slug)
  const [readingOnNarrow, setReadingOnNarrow] = useState(false)

  const selected = posts.find((p) => p.slug === selectedSlug) ?? posts[0]

  return (
    <div className="flex h-full gap-(--r-inset) @container">
      {/* Fluid, so the width is class-driven and the container query can
          actually win: wide = a 260px rail beside the article, narrow = the
          list is the whole window until a post is picked. */}
      <Sidebar
        ariaLabel="Posts"
        fluid
        className={cn(
          "w-full @[560px]:w-[260px] @[560px]:shrink-0 @[560px]:block",
          readingOnNarrow && "hidden"
        )}
      >
        <h3 className="px-2 pt-1 pb-2 text-[10px] font-medium tracking-wide text-text-2 uppercase">
          Writing
        </h3>

        <ul>
          {posts.map((p) => {
            const active = p.slug === selected.slug
            return (
              <li key={p.slug}>
                <button
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => {
                    setSelectedSlug(p.slug)
                    setReadingOnNarrow(true)
                  }}
                  className="w-full rounded-(--r-control) px-2 py-2 text-left"
                  style={{ background: active ? "var(--os-accent-soft)" : "transparent" }}
                >
                  <p className="font-mono text-[9.5px] tracking-wide text-text-2 uppercase">
                    {formatDate(p.date)} · {p.readingMinutes} min
                  </p>
                  <p className="mt-1 text-xs leading-snug font-medium text-text">{p.title}</p>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-text-2">{p.dek}</p>
                </button>
              </li>
            )
          })}
        </ul>
      </Sidebar>

      <div className={cn("min-w-0 flex-1 @[560px]:block", readingOnNarrow ? "block" : "hidden")}>
        <Article post={selected} onBack={() => setReadingOnNarrow(false)} />
      </div>
    </div>
  )
}
