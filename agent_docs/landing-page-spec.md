# weavr Landing Page — Specification

> Status: **Confirmed** (intent approved by owner, 2026-06-15)
> Product: [weavr](https://github.com/deepakkumardewani/weavr) — a fast Rust CLI that converts Claude Code transcript JSONL files into beautiful, self-contained HTML & Markdown.

---

## 1. Purpose & Intent

A single-page, **scroll-driven story site** that takes a Claude Code user from
"raw JSONL is unreadable" → "weavr transforms it" → "look how beautiful and fast
the output is" → "here's how to install it."

The page is the demo. Scrolling _is_ the narrative: as the visitor scrolls, the
theme transitions **light → dark**, mirroring weavr turning a messy problem into
an elegant artefact.

- **Outcome:** A first-time visitor understands what weavr does in a single scroll, feels it is world-class / Awwwards-grade, and ends knowing how to install it.
- **User:** Developers who use Claude Code and have piles of `~/.claude/projects/**/*.jsonl` transcripts they cannot read.
- **Success criteria:**
  - The "before → process → after" story is legible without reading a word of body copy.
  - The output section _feels_ like real weavr output (Material 3 dot-timeline).
  - The speed story (18–46× faster) lands with impact.
  - Motion is smooth (target 60fps) and fully respects `prefers-reduced-motion`.
  - Lighthouse: Performance ≥ 90, Accessibility ≥ 95 on desktop.

---

## 2. Hard Constraints (non-negotiable)

1. **No buttons / CTAs in the hero.** The hero is a pure visual hook (unreadable raw JSONL). Conversion CTAs live further down.
2. **Single page**, no routing, no backend, no auth.
3. **Light → dark theme transition is driven by scroll** and is part of the story, not a toggle.
4. **The output conversation is recreated in React** (not an embedded real weavr HTML file), fed by a genuine-looking demo data file.
5. **Reduced-motion**: every scroll-scrubbed animation has a static, legible fallback.
6. Honor the project's CLAUDE.md engineering rules (DRY, small components, explicit over clever, no magic numbers).

---

## 3. Tech Stack

| Concern             | Choice                                                          |
| ------------------- | --------------------------------------------------------------- |
| Tooling / dev       | **Viteplus** (`vp` commands) — via the `/viteplus` skill        |
| Framework           | React + TypeScript                                              |
| Styling             | Tailwind CSS                                                    |
| Smooth scroll       | **Lenis** (inertial scroll)                                     |
| Scroll choreography | **GSAP + ScrollTrigger** (pin, scrub, timelines) — `/gsap-core` |
| Accent components   | **reactbits** (decorative / accent only)                        |
| Deploy              | **Vercel** (static build)                                       |
| Repo / folder       | `weavr-landing`                                                 |

---

## 4. Page Narrative (sections, in scroll order)

### S0 — Header (fixed)

- Logo (weavr wordmark/mark) on the **left**.
- GitHub icon on the **right** → `https://github.com/deepakkumardewani/weavr`.
- Header adapts to the light→dark scroll transition (contrast-aware).

### S1 — Hero · "The problem" (LIGHT, harsh)

- Full-viewport. A wall of **raw, unreadable JSONL** (genuine-looking Claude Code transcript lines: `{"type":"user",...}`, escaped content, token noise).
- No buttons. Minimal, tense framing. The mess is the message.
- Subtle motion: lines drift / flicker; cursor blink; "you can't read this" tension.

### S2 — Process · "How it works" (LIGHT → transitioning)

- Simplest-terms, 3-beat explainer, revealed on scroll:
  `~/.claude/projects/**/*.jsonl` → **weavr** (parse → session DAG → SQLite cache → render) → **beautiful self-contained HTML**.
- Animated pipeline: raw JSONL visibly flows into weavr and emerges structured.
- 100% local / no AI / single binary reinforced here.
- Theme begins shifting toward dark as weavr "does its work."

### S3 — Output · "The result" (DARK) — **centerpiece**

- The theme is now fully dark (warm-neutral Material 3, echoing weavr's real output).
- A **pinned conversation panel** styled as weavr's flat dot-timeline.
- As the visitor scrolls, the **page stays pinned** and the **conversation scrolls/reveals inside the panel** — user messages, assistant text, thinking blocks, tool cards (Bash IN/OUT, Read/Edit diffs).
- Driven by a `demo-session` data file shaped like parsed weavr output (genuine-looking, realistic content).
- On reduced-motion: panel becomes a normal scrollable, fully-rendered transcript.

### S4 — Speed · "Fast" (DARK)

- The 18–46× faster story vs `claude-code-log`.
- Animated count-up stats: `~1.3s` all-projects, `~28ms` single session, `46.5×` speedup.
- Optional race-bar visual (weavr vs Python) that fills on scroll.

### S5 — Features (DARK)

- Concise grid of key differentiators: Self-contained HTML, Light/Dark themes, Markdown export + detail levels, Rich tool rendering, Token tracking, Multi-project export, SQLite incremental cache, 100% local.

### S6 — Install & Quickstart (DARK)

- On-page sections (no separate routes).
- **Install**: copy-to-clipboard command blocks — `brew install deepakkumardewani/weavr/weavr`, `cargo binstall weavr`, `cargo install weavr`.
- **Quickstart**: 3 steps — install → export a session (`weavr -i …`) → export everything (`weavr --all-projects --open-browser`).
- Copy buttons with success feedback.

### S7 — Footer (DARK)

- Links: GitHub, crates.io, License (MIT), claude-code-log credit.
- Subtle close-out; reinforce "100% local, no AI."

---

## 5. Demo Data Model

A single typed data file (`demo-session.ts`) describing an ordered event stream:

```ts
type DemoEvent =
  | { kind: "user"; text: string; ts?: string }
  | { kind: "assistant"; text: string; tokens?: { in: number; out: number } }
  | { kind: "thinking"; text: string }
  | {
      kind: "tool";
      name: "Bash" | "Read" | "Edit" | "Write" | "Grep";
      input: string;
      output?: string;
      diff?: DiffHunk[];
    };
```

- Content must look like a real, coherent Claude Code session (e.g. a small bug-fix
  task) — not lorem ipsum.
- The same data file powers the raw-JSONL hero (serialized form) and the rendered
  output panel (parsed form), reinforcing the before/after.

---

## 6. Visual / Motion Principles

- **Theme as narrative:** light (problem) → dark (solution). One continuous gradient of state across the scroll, not a hard cut.
- **Warm-neutral Material 3** palette in the dark phase, matching weavr's real tokens; a single accent color for motion highlights.
- **Premium dev-tool grade** (Linear / Vercel / Awwwards reference quality): restraint, precise spacing, intentional typography, no generic AI gradients.
- **Performance budget:** animate transform/opacity only; pin via GSAP; debounce/scrub tied to Lenis RAF; lazy-mount heavy sections.
- **Accessibility:** semantic landmarks, focus-visible, color-contrast AA in both phases, full reduced-motion fallback, keyboard-reachable copy buttons & links.

---

## 7. Out of Scope

- Multi-page routing, backend, auth, databases.
- Embedding real weavr-generated HTML.
- Live "share your transcript" / hosted-output demo.
- i18n, analytics dashboards, A/B testing, cookie banners.
- Blog, docs site, changelog.

---

## 8. Open / Deferred Decisions

- Exact accent color + final type pairing → settled during design pass (S in plan).
- Whether S4 uses a race-bar or pure count-up → decide during build, count-up is the baseline.
- Logo asset: use existing weavr mark if available in the repo; otherwise a clean wordmark.
