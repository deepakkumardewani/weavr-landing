# weavr Landing Page — Implementation Plan

> Consumes: [landing-page-spec.md](./landing-page-spec.md)
> Task list: [landing-page-tasks.md](./landing-page-tasks.md)

This plan describes **how** we build the spec — architecture, sequencing, and the
risky parts to de-risk first. Work is ordered so the hardest interaction (the
pinned, scroll-scrubbed conversation panel) is proven early, before polish.

---

## R2 — Hero & transformation rework (2026-06-17)

Phases A–E shipped. This revision reworks the opening and the transformation per
the spec's R2 summary. New/changed components:

```
components/
  hero/HeroJsonl.tsx        ← reworked: dim JSONL to background texture,
                              add headline + subline overlay + scroll cue
  hero/ScrollCue.tsx        ← new: animated chevron / "see it weave"
  transform/WeaveMorph.tsx  ← new: replaces ProcessPipeline. Scroll-scrubbed
                              morph of the SAME hero JSONL → woven conversation,
                              with parse · session DAG · render captions during
                              the morph. Static before→after fallback.
  output/OutputPanel.tsx    ← add a before/after toggle (rendered ↔ raw JSONL)
  install/InstallSection.tsx← becomes the primary CTA: install command +
                              "View on GitHub" + 100% local / No AI / Single
                              binary trust pills (moved out of the old S2)
components/process/ProcessPipeline.tsx  ← removed (folded into WeaveMorph)
```

Key R2 decisions:

- **Continuity by shared source.** The hero JSONL, the morph, and the output panel
  all read from the same `demo-session` data. The morph animates _between_ the
  serialized (raw) and parsed (rendered) forms of the same events, so "that mess
  became this" is true by construction, not faked with two unrelated mockups.
- **Morph stays compositor-cheap.** Reflow is faked with transform/opacity on
  pre-laid-out line/bubble elements (FLIP-style), scrubbed to scroll — not real
  layout thrash. Captions cross-fade at fixed scroll milestones.
- **Hero copy is the focal layer.** JSONL drops to low opacity behind a vignette;
  headline/subline sit on top with AA contrast against the lightest texture.
- **Before/after toggle reuses existing renderers.** The S3 panel already holds
  both forms (parsed renderers + the JSONL serializer); the toggle swaps which
  layer is visible, no new data path.

---

## 1. Architecture Overview

```
src/
  main.tsx                  app entry
  App.tsx                   section composition + Lenis/ScrollTrigger bootstrap
  lib/
    lenis.ts                Lenis instance + GSAP ScrollTrigger RAF bridge
    theme-scroll.ts         light→dark interpolation driven by global scroll progress
    motion.ts               reduced-motion helpers, shared GSAP defaults
  data/
    demo-session.ts         typed DemoEvent[] (one coherent Claude Code session)
    demo-jsonl.ts           serializer: DemoEvent[] -> raw JSONL string (for hero)
    stats.ts                speed numbers (single source of truth)
  components/
    layout/Header.tsx
    layout/Footer.tsx
    hero/HeroJsonl.tsx       S1 raw-jsonl wall + tension motion
    process/ProcessPipeline.tsx   S2 jsonl→weavr→html animated pipeline
    output/OutputPanel.tsx        S3 pinned panel shell + scroll scrub
    output/timeline/          dot-timeline message renderers:
        UserMessage.tsx  AssistantMessage.tsx  ThinkingBlock.tsx
        ToolCard.tsx  DiffView.tsx  Dot.tsx
    speed/SpeedStats.tsx     S4 count-up + race bar
    features/FeatureGrid.tsx S5
    install/InstallSection.tsx   S6 install + quickstart, CopyBlock
    ui/CopyBlock.tsx         copy-to-clipboard primitive
  styles/
    tokens.css               Material 3 warm-neutral tokens (light + dark phases)
    index.css                Tailwind layers + base
```

### Key technical decisions

- **One global scroll source of truth.** Lenis drives scroll; a single GSAP
  ScrollTrigger reports overall progress, which feeds `theme-scroll.ts`. Section
  animations are independent ScrollTriggers. No competing scroll listeners.
- **Theme transition via CSS custom properties.** `theme-scroll.ts` interpolates
  token values (bg, fg, surface, accent) on `:root` as scroll progresses; Tailwind
  reads `var(--…)`. Avoids re-render churn; pure compositor work.
- **Conversation panel = pinned container + internal scrub.** GSAP `pin: true`
  on the panel section; an inner timeline scrubs message reveals to scroll
  distance. Messages mount as a static list; GSAP toggles their reveal state.
- **demo-session is the single source.** Hero serializes it to JSONL; output
  renders it parsed. Before/after stays consistent by construction.

---

## 2. Sequencing (de-risk first)

**Phase A — Foundation.** Scaffold via `/viteplus`, Tailwind, tokens, Lenis +
ScrollTrigger bridge, reduced-motion harness, deploy skeleton to Vercel. Prove the
plumbing (a smooth-scrolling empty page that deploys) before any content.

**Phase B — The risky centerpiece (S3).** Build the demo data model and the
pinned, scroll-scrubbed conversation panel + dot-timeline renderers _first_. If
the pin/scrub interaction can't be made buttery, everything else must adapt — so
prove it now.

**Phase C — Theme narrative (S1→S2→S3 transition).** Hero JSONL wall, process
pipeline, and the light→dark scroll interpolation tying them together.

**Phase D — Supporting sections.** Speed stats (S4), features (S5),
install/quickstart (S6), header/footer.

**Phase E — Polish & ship.** Design pass (color/type final), micro-interactions,
accessibility + reduced-motion audit, Lighthouse, responsive, production deploy.

Rationale: A→B→C→D→E front-loads the two highest-risk items (smooth scroll infra,
pinned scrub) and leaves only low-risk content/polish at the end.

---

## 3. Risks & Mitigations

| Risk                                                      | Mitigation                                                                                                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Pinned scrub feels janky / fights Lenis                   | Single RAF loop bridging Lenis→ScrollTrigger; animate transform/opacity only; test on mid-tier hardware early (Phase B).                    |
| Light→dark transition causes flashing / contrast failures | Interpolate via CSS vars (no re-render); verify AA contrast at several scroll midpoints.                                                    |
| Reduced-motion users get a broken/empty page              | Build static fallbacks alongside each animation, not after. Panel → normal scroll list; theme → settles to dark; pipeline → static diagram. |
| Demo content feels fake                                   | Author one coherent bug-fix session with realistic tool calls/diffs; review for authenticity.                                               |
| Mobile: pinning long sections is awkward                  | Define mobile behavior per section (shorten/disable pin, stack pipeline) during Phase E; don't pin aggressively on small viewports.         |
| Bundle bloat from GSAP/reactbits                          | Import only used GSAP plugins; use reactbits sparingly (accents only); check bundle in Phase E.                                             |

---

## 4. Verification Strategy

- **Per phase:** `vp` dev run + manual scroll-through; verify reduced-motion via
  OS setting / DevTools emulation.
- **Centerpiece (B):** confirm 60fps scrub in DevTools performance trace; confirm
  static fallback renders the full transcript.
- **Browser verification:** use the **agent-browser** skill/CLI for visual checks
  and screenshots (never chrome-devtools MCP — project rule).
- **Pre-ship (E):** Lighthouse (Perf ≥ 90, A11y ≥ 95), keyboard nav pass, contrast
  audit in both theme phases, responsive checks (mobile/tablet/desktop).

---

## 5. Deployment

- Static build via Viteplus; deploy to **Vercel** (preview per push, production on
  main). Add basic OG/meta tags + favicon during Phase E.
- Repo `weavr-landing`; remote on GitHub under the owner's account.
