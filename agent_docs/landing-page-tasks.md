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

- [x] **A3. Smooth-scroll + ScrollTrigger bridge.**
      `lib/lenis.ts` — Lenis instance bridged to GSAP ScrollTrigger via one RAF loop.
  - AC: page scrolls with inertia; a sample ScrollTrigger fires at correct progress.

- [x] **A4. Reduced-motion harness.**
      `lib/motion.ts` — detect `prefers-reduced-motion`; shared GSAP defaults; helper
      to register motion-or-static.
  - AC: with reduced-motion on, animations are skipped and static state shows.

- [x] **A5. Deploy skeleton to Vercel + repo remote.**
      Create GitHub repo `weavr-landing`, add remote, push; connect Vercel.
  - AC: blank app builds and serves on a Vercel preview URL.

---

## Phase B — Centerpiece (S3 Output panel) — _de-risk first_

- [x] **B1. Demo data model + content.**
      `data/demo-session.ts` (typed `DemoEvent[]`) — one coherent, realistic Claude
      Code bug-fix session: user msgs, assistant text, thinking, Bash/Read/Edit tool
      calls with a real-looking diff.
  - AC: data typed; content reads as authentic, not lorem.

- [x] **B2. JSONL serializer.**
      `data/demo-jsonl.ts` — serialize `DemoEvent[]` → raw JSONL string for the hero.
  - AC: output looks like genuine Claude Code transcript lines.

- [x] **B3. Dot-timeline renderers.**
      `components/output/timeline/*` — `Dot`, `UserMessage`, `AssistantMessage`,
      `ThinkingBlock`, `ToolCard`, `DiffView`. Styled to weavr's Material 3 output.
  - AC: rendering the full demo session looks like real weavr HTML output.

- [x] **B4. Pinned, scroll-scrubbed panel.**
      `components/output/OutputPanel.tsx` — GSAP pin the section; scrub message
      reveals to scroll distance so the page holds while the conversation advances.
  - AC: scrolling pins the page and walks through the conversation at 60fps.

- [x] **B5. Output reduced-motion fallback.**
  - AC: with reduced-motion, panel is a normal scrollable, fully-rendered transcript (no pin).

---

## Phase C — Theme narrative (S1, S2, transition)

- [x] **C1. Light→dark scroll interpolation.**
      `lib/theme-scroll.ts` — interpolate token CSS vars on `:root` from global scroll
      progress (light at top → dark by S3).
  - AC: scrolling continuously shifts the palette; AA contrast holds at midpoints.

- [x] **C2. Hero (S1) raw-JSONL wall.**
      `components/hero/HeroJsonl.tsx` — full-viewport unreadable JSONL (from B2), tension
      motion (drift/flicker/cursor). **No buttons.**
  - AC: hero is pure visual hook; reads as "you can't read this"; no CTA present.

- [x] **C3. Process (S2) pipeline.**
      `components/process/ProcessPipeline.tsx` — animated `jsonl → weavr → html`
      3-beat explainer; raw flows in, structured emerges; reinforces local/no-AI.
  - AC: a non-technical viewer grasps the flow from animation alone; static fallback is a clear diagram.

- [x] **C4. Stitch S1→S2→S3 transition.**
  - AC: hero→process→output reads as one continuous light→dark transformation.

---

## Phase D — Supporting sections

- [x] **D1. Header.**
      `components/layout/Header.tsx` — logo left, GitHub icon right (→ repo);
      contrast-aware across theme phases.
  - AC: fixed header legible in both light and dark phases; GitHub link works.

- [x] **D2. Speed (S4).**
      `data/stats.ts` + `components/speed/SpeedStats.tsx` — count-up stats
      (`~1.3s`, `~28ms`, `46.5×`); optional weavr-vs-Python race bar.
  - AC: stats count up on scroll-into-view; numbers sourced from `stats.ts` only.

- [x] **D3. Features (S5).**
      `components/features/FeatureGrid.tsx` — concise differentiator grid.
  - AC: 8 key features render; reveal on scroll; readable on mobile.

- [x] **D4. Copy primitive + Install/Quickstart (S6).**
      `components/ui/CopyBlock.tsx` + `components/install/InstallSection.tsx` —
      copyable brew/cargo commands; 3-step quickstart.
  - AC: each command copies with success feedback; keyboard-accessible.

- [x] **D5. Footer (S7).**
      `components/layout/Footer.tsx` — GitHub, crates.io, MIT, claude-code-log credit.
  - AC: all links valid; reinforces 100% local / no AI.

---

## Phase E — Polish & Ship

- [x] **E1. Design pass.**
      Finalize accent color + type pairing; tighten spacing/rhythm; remove generic-AI feel.
  - AC: passes a `/premium-website-design` review; feels Awwwards-grade.

- [x] **E2. Micro-interactions.**
      Hover/focus states, copy feedback, subtle reveals; nothing gratuitous.
  - AC: interactions feel intentional and consistent.

- [x] **E3. Responsive pass.**
      Define per-section mobile behavior (reduce/disable pinning, stack pipeline).
  - AC: clean on mobile / tablet / desktop; no horizontal overflow; pinning sane on small screens.

- [x] **E4. Accessibility + reduced-motion audit.**
      Semantic landmarks, focus-visible, keyboard nav, AA contrast in both phases, full
      reduced-motion fallbacks.
  - AC: keyboard-only traversal works; reduced-motion path is complete and legible.

- [x] **E5. Performance + Lighthouse.**
      Audit bundle (trim GSAP plugins/reactbits), lazy-mount heavy sections.
  - AC: Lighthouse Perf ≥ 90, A11y ≥ 95 on desktop; scrub holds 60fps.

- [x] **E6. SEO/meta + production deploy.**
      OG tags, title/description, favicon; promote to Vercel production.
  - AC: production URL live; OG preview renders; meta present.

- [x] **E7. Browser verification.**
      Use the **agent-browser** skill to scroll-through and screenshot the full journey.
  - AC: screenshots confirm the light→dark story and pinned conversation across breakpoints.

---

## Phase F — Hero & transformation rework (R2, 2026-06-17)

> Reframes the opening and the magic. See spec R2 summary + plan R2 section.

- [x] **F1. Rework hero into framed visual hook.**
      `components/hero/HeroJsonl.tsx` — dim the raw JSONL to a low-opacity
      background texture with a vignette/fade (optional slow upward drift). Overlay
      headline **"Make your Claude Code transcripts readable."** + subline + keep
      it CTA-free.
  - AC: a first-time visitor grasps the promise in ~3s without scrolling; JSONL
    reads as texture, not content; AA contrast on the overlay copy; no CTA/modal.

- [x] **F2. Scroll cue.**
      `components/hero/ScrollCue.tsx` — subtle animated chevron / "see it weave"
      inviting the visitor down; respects reduced-motion.
  - AC: cue is visible and clearly signals "scroll"; static (non-animated) when
    reduced-motion is on.

- [x] **F3. Weave morph (replaces ProcessPipeline).**
      `components/transform/WeaveMorph.tsx` — scroll-scrubbed morph of the **same
      hero JSONL** into the woven conversation (lines untangle → reflow into
      bubbles), with `parse · session DAG · render` captions surfacing during the
      morph. Remove `components/process/ProcessPipeline.tsx` and its references.
  - AC: the raw→woven transformation reads as one continuous motion at 60fps;
    captions explain the steps as they happen; transform/opacity only.

- [x] **F4. Morph reduced-motion fallback.**
  - AC: with reduced-motion, F3 shows a clear static before→after diagram (raw
    block → rendered block) with the mechanism words labeled, no scrub.

- [x] **F5. Continuity wiring.**
      Ensure hero JSONL, F3 morph, and S3 output panel all derive from the same
      `demo-session` data (date-bug session) so the payoff resolves the exact mess
      from the hero.
  - AC: the session shown raw in the hero is the same one rendered in S3; verified
    by content, not coincidence.

- [x] **F6. Before/after toggle in output panel.**
      `components/output/OutputPanel.tsx` — add a toggle to flip the rendered panel
      back to its raw JSONL form (reuses existing renderers + serializer).
  - AC: toggle swaps rendered ↔ raw with no layout jump; keyboard-accessible;
    labeled clearly ("rendered / raw").

- [x] **F7. Install becomes the primary CTA.**
      `components/install/InstallSection.tsx` — place after the payoff: copyable
      install command + "View on GitHub" + move the `100% local · No AI · Single
binary` trust pills here (out of the removed S2).
  - AC: trust pills no longer appear in the explainer; CTA section reads as the
    convergence/conversion point; copy + GitHub link work.

- [x] **F8. Stitch & verify the new flow.**
      Re-stitch S1 → S2 (morph) → S3 → CTA into one continuous story; update the
      light→dark transition timing to the new section boundaries.
  - AC: scroll-through reads as raw chaos → weave → readable → install; agent-browser
    screenshots confirm across breakpoints; no leftover "How it works" cards.

---

## Suggested commit cadence

One commit per task (or per small task cluster), message describing the user-facing
change. Branch off `main`; never commit secrets. Push to the `weavr-landing` remote.
