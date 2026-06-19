# weavr Landing Page — Specification

> Status: **Confirmed** (intent approved by owner, 2026-06-15)
> Revision: **R2 — Hero & transformation rework** (approved 2026-06-17)
> Product: [weavr](https://github.com/deepakkumardewani/weavr) — a fast Rust CLI that converts Claude Code transcript JSONL files into beautiful, self-contained HTML & Markdown.

---

## R2 — Revision summary (2026-06-17)

Owner feedback after first build: the hero reads as confusing decoration (a wall
of raw logs with no framing), and the post-hero section explains ("How it works"
cards) instead of _showing_ the magic. This revision reframes the opening and the
transformation:

1. **Hero gets minimal framing.** Keep the raw JSONL as the _villain_, but dim it
   to a background texture and overlay a real headline + subline so a visitor who
   never scrolls understands the promise in ~3s. Add a subtle scroll cue. Still
   **no big CTA, no modal** in the hero; the GitHub icon top-right stays.
2. **One continuous morph replaces the static explainer.** The _same_ raw JSONL
   from the hero literally weaves into the readable conversation as the visitor
   scrolls. Mechanism words (`parse · session DAG · render`) surface as captions
   _during_ the morph. The old static 3-card "How it works" section is removed.
3. **Payoff resolves the same session.** The rendered conversation is the same
   date-bug session shown in the hero JSONL, with an optional **before/after
   toggle** back to raw — "_that_ mess became _this_."
4. **CTA lands after the payoff.** Copyable install command + "View on GitHub" +
   the `100% local · No AI · Single binary` trust pills, placed once the visitor
   is convinced.

Where this conflicts with the original sections below, **R2 wins**.

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

1. **No conversion CTA / no modal in the hero.** The hero is a visual hook: dimmed
   raw JSONL background + a headline, subline, and a subtle scroll cue. The only
   nav affordance is the GitHub icon top-right. The install CTA lives after the
   payoff. _(R2: relaxes the original "no text in hero" rule — minimal framing copy
   is now required; a big install button or a raw-JSONL modal is not.)_
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

### S1 — Hero · "The problem" (LIGHT, harsh) — _R2_

- Full-viewport. **Dimmed raw JSONL** as a background texture (genuine-looking
  Claude Code transcript lines: `{"type":"user",...}`, escaped content, token
  noise), low-opacity with a vignette/fade so it reads as texture, not content to
  read. Optional slow upward drift so it feels like a live log firehose.
- **Overlaid framing copy** with strong contrast — the focal point:
  - Headline: **"Make your Claude Code transcripts readable."**
  - Subline: _"weavr turns raw JSONL session logs into beautiful, shareable HTML — 100% local, no AI."_
- **Subtle scroll cue** (animated chevron / "see it weave") inviting the visitor down.
- **No conversion CTA, no modal.** GitHub icon stays in the header (S0).

### S2 — Transformation · "weavr weaves" (LIGHT → transitioning) — _R2_

- Replaces the old static 3-card explainer. The **same raw JSONL from the hero
  literally morphs into the woven conversation**: lines untangle, collapse, and
  reflow into chat bubbles as the visitor scrolls — one continuous "raw → woven →
  readable" motion.
- **Mechanism captions surface _during_ the morph** — `parse · session DAG ·
render` appear as labels that explain the magic as it happens (not a separate
  diagram).
- Theme begins shifting toward dark as weavr "does its work."
- Reduced-motion: a clear static before→after diagram (raw block → rendered block)
  with the mechanism words labeled, no scrub.

### S3 — Output · "The result" (DARK) — **centerpiece** — _R2_

- The morph resolves into the readable conversation: the theme is now fully dark
  (warm-neutral Material 3, echoing weavr's real output).
- A **pinned conversation panel** styled as weavr's flat dot-timeline, rendering
  the **same date-bug session** that appeared as raw JSONL in the hero.
- As the visitor scrolls, the **page stays pinned** and the **conversation
  scrolls/reveals inside the panel** — user messages, assistant text, thinking
  blocks, tool cards (Bash IN/OUT, Read/Edit diffs).
- **Before/after toggle:** an affordance to flip the rendered panel back to its
  raw JSONL form — reinforcing "look how much weavr cleaned up." (Optional but
  preferred placement for the "see the raw input" idea, instead of a hero modal.)
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
- _R2:_ This is the **primary CTA moment** — it lands _after_ the payoff (S3),
  when the visitor is convinced. Pair the copyable install command with a "View on
  GitHub" link and the `100% local · No AI · Single binary` **trust pills** here
  (the pills move out of the removed S2 explainer to this convergence point).

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
- _R2:_ A raw-JSONL **modal** in the hero (rejected — redundant with the background
  texture; the before/after toggle in S3 covers "see the raw input" better).
- _R2:_ The static 3-card "How it works" explainer (replaced by the S2 morph).
- _R2:_ A loud install button or multiple example conversations in the hero.

---

## 8. Open / Deferred Decisions

- Exact accent color + final type pairing → settled during design pass (S in plan).
- Whether S4 uses a race-bar or pure count-up → decide during build, count-up is the baseline.
- Logo asset: use existing weavr mark if available in the repo; otherwise a clean wordmark.
