# weavr Landing Page — Task Breakdown

> Consumes: [landing-page-spec.md](./landing-page-spec.md) · [landing-page-plan.md](./landing-page-plan.md)
> Each task is small, independently verifiable, and ordered by dependency.
> Phases match the plan (A Foundation → B Centerpiece → C Theme narrative → D Sections → E Polish/Ship).

Legend: `[ ]` todo · `AC` = acceptance criteria.

---

## Phase A — Foundation

- [x] **A1. Scaffold project (Viteplus + React + TS).**
  Use the `/viteplus` skill to scaffold under `weavr-landing/`. Add Tailwind.
  - AC: `vp dev` serves a blank page; TS + Tailwind compile clean.

- [x] **A2. Design tokens.**
  `styles/tokens.css` — Material 3 warm-neutral tokens for both light and dark
  phases as CSS custom properties; Tailwind configured to read `var(--…)`.
  - AC: a test element reflects token vars; switching `:root` values updates it.

- [ ] **A3. Smooth-scroll + ScrollTrigger bridge.**
  `lib/lenis.ts` — Lenis instance bridged to GSAP ScrollTrigger via one RAF loop.
  - AC: page scrolls with inertia; a sample ScrollTrigger fires at correct progress.

- [ ] **A4. Reduced-motion harness.**
  `lib/motion.ts` — detect `prefers-reduced-motion`; shared GSAP defaults; helper
  to register motion-or-static.
  - AC: with reduced-motion on, animations are skipped and static state shows.

- [ ] **A5. Deploy skeleton to Vercel + repo remote.**
  Create GitHub repo `weavr-landing`, add remote, push; connect Vercel.
  - AC: blank app builds and serves on a Vercel preview URL.

---

## Phase B — Centerpiece (S3 Output panel) — *de-risk first*

- [ ] **B1. Demo data model + content.**
  `data/demo-session.ts` (typed `DemoEvent[]`) — one coherent, realistic Claude
  Code bug-fix session: user msgs, assistant text, thinking, Bash/Read/Edit tool
  calls with a real-looking diff.
  - AC: data typed; content reads as authentic, not lorem.

- [ ] **B2. JSONL serializer.**
  `data/demo-jsonl.ts` — serialize `DemoEvent[]` → raw JSONL string for the hero.
  - AC: output looks like genuine Claude Code transcript lines.

- [ ] **B3. Dot-timeline renderers.**
  `components/output/timeline/*` — `Dot`, `UserMessage`, `AssistantMessage`,
  `ThinkingBlock`, `ToolCard`, `DiffView`. Styled to weavr's Material 3 output.
  - AC: rendering the full demo session looks like real weavr HTML output.

- [ ] **B4. Pinned, scroll-scrubbed panel.**
  `components/output/OutputPanel.tsx` — GSAP pin the section; scrub message
  reveals to scroll distance so the page holds while the conversation advances.
  - AC: scrolling pins the page and walks through the conversation at 60fps.

- [ ] **B5. Output reduced-motion fallback.**
  - AC: with reduced-motion, panel is a normal scrollable, fully-rendered transcript (no pin).

---

## Phase C — Theme narrative (S1, S2, transition)

- [ ] **C1. Light→dark scroll interpolation.**
  `lib/theme-scroll.ts` — interpolate token CSS vars on `:root` from global scroll
  progress (light at top → dark by S3).
  - AC: scrolling continuously shifts the palette; AA contrast holds at midpoints.

- [ ] **C2. Hero (S1) raw-JSONL wall.**
  `components/hero/HeroJsonl.tsx` — full-viewport unreadable JSONL (from B2), tension
  motion (drift/flicker/cursor). **No buttons.**
  - AC: hero is pure visual hook; reads as "you can't read this"; no CTA present.

- [ ] **C3. Process (S2) pipeline.**
  `components/process/ProcessPipeline.tsx` — animated `jsonl → weavr → html`
  3-beat explainer; raw flows in, structured emerges; reinforces local/no-AI.
  - AC: a non-technical viewer grasps the flow from animation alone; static fallback is a clear diagram.

- [ ] **C4. Stitch S1→S2→S3 transition.**
  - AC: hero→process→output reads as one continuous light→dark transformation.

---

## Phase D — Supporting sections

- [ ] **D1. Header.**
  `components/layout/Header.tsx` — logo left, GitHub icon right (→ repo);
  contrast-aware across theme phases.
  - AC: fixed header legible in both light and dark phases; GitHub link works.

- [ ] **D2. Speed (S4).**
  `data/stats.ts` + `components/speed/SpeedStats.tsx` — count-up stats
  (`~1.3s`, `~28ms`, `46.5×`); optional weavr-vs-Python race bar.
  - AC: stats count up on scroll-into-view; numbers sourced from `stats.ts` only.

- [ ] **D3. Features (S5).**
  `components/features/FeatureGrid.tsx` — concise differentiator grid.
  - AC: 8 key features render; reveal on scroll; readable on mobile.

- [ ] **D4. Copy primitive + Install/Quickstart (S6).**
  `components/ui/CopyBlock.tsx` + `components/install/InstallSection.tsx` —
  copyable brew/cargo commands; 3-step quickstart.
  - AC: each command copies with success feedback; keyboard-accessible.

- [ ] **D5. Footer (S7).**
  `components/layout/Footer.tsx` — GitHub, crates.io, MIT, claude-code-log credit.
  - AC: all links valid; reinforces 100% local / no AI.

---

## Phase E — Polish & Ship

- [ ] **E1. Design pass.**
  Finalize accent color + type pairing; tighten spacing/rhythm; remove generic-AI feel.
  - AC: passes a `/premium-website-design` review; feels Awwwards-grade.

- [ ] **E2. Micro-interactions.**
  Hover/focus states, copy feedback, subtle reveals; nothing gratuitous.
  - AC: interactions feel intentional and consistent.

- [ ] **E3. Responsive pass.**
  Define per-section mobile behavior (reduce/disable pinning, stack pipeline).
  - AC: clean on mobile / tablet / desktop; no horizontal overflow; pinning sane on small screens.

- [ ] **E4. Accessibility + reduced-motion audit.**
  Semantic landmarks, focus-visible, keyboard nav, AA contrast in both phases, full
  reduced-motion fallbacks.
  - AC: keyboard-only traversal works; reduced-motion path is complete and legible.

- [ ] **E5. Performance + Lighthouse.**
  Audit bundle (trim GSAP plugins/reactbits), lazy-mount heavy sections.
  - AC: Lighthouse Perf ≥ 90, A11y ≥ 95 on desktop; scrub holds 60fps.

- [ ] **E6. SEO/meta + production deploy.**
  OG tags, title/description, favicon; promote to Vercel production.
  - AC: production URL live; OG preview renders; meta present.

- [ ] **E7. Browser verification.**
  Use the **agent-browser** skill to scroll-through and screenshot the full journey.
  - AC: screenshots confirm the light→dark story and pinned conversation across breakpoints.

---

## Suggested commit cadence
One commit per task (or per small task cluster), message describing the user-facing
change. Branch off `main`; never commit secrets. Push to the `weavr-landing` remote.
