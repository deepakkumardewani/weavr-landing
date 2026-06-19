# weavr Landing — Data Truth & Section Polish — Task Breakdown

> Consumes: [/Users/deepakdewani1/.claude/plans/for-the-fast-proud-sedgewick.md](../../../../.claude/plans/for-the-fast-proud-sedgewick.md)
> Revision goal (2026-06-18): replace fabricated Fast-section numbers with **real, measured**
> benchmark data; fix two inaccurate Feature cards; surface **macOS + Linux** in Install via OS
> tabs; slim the Footer to 3 chips + the claude-code-log credit line.
> Each task is small, independently verifiable, and ordered by dependency.

Legend: `[ ]` todo · `[x]` done · `AC` = acceptance criteria · `Dep` = dependencies.

---

## Phase A — Measure (de-risk first: real data must exist before the UI can show it)

- [x] **A1. Capture the all-projects benchmark.**
      Run `bench.sh` from `/Users/deepakdewani1/Documents/Programs/rust/cclog/scripts/bench.sh`
      against `~/.claude/projects/`. Record the real **mean** wall-clock for `weavr --all-projects`
      and for `claude-code-log`, plus the `JSONL_COUNT` it prints. Save raw `hyperfine` JSON/markdown
      outputs so the numbers are auditable.
  - AC: real means for both tools + JSONL file count captured and written down (with the date).
  - Dep: None. **Scope: S** (no app files yet).

- [x] **A2. Capture single-session render + metadata.**
      Time `weavr -i <one real session>` for the "render a single session" stat (ms).
      Count distinct project dirs under `~/.claude/projects/` (→ `projects`). Run
      `weavr --all-projects` and read its summary for **total tokens**; if weavr does not emit a
      token total, derive it from output or **drop the token field** (note which).
  - AC: single-session ms, project count, and total-tokens (or an explicit decision to omit) recorded.
  - Dep: A1 (release binary already built). **Scope: S**.

> **Measured 2026-06-18** (hyperfine, 3 runs, --no-cache):
>
> - `weavr --all-projects`: **412.1 ms** mean
> - `claude-code-log --all-projects`: **23.987 s** mean (uvx, 2 runs)
> - `weavr -i <single session>`: **5.8 ms** mean
> - JSONL files: **186** · projects: **15** · sessions: **156**
> - Tokens: **16.3M in / 11.1M out** (from weavr stdout summary)
> - Speedup: **58.2×**

### Checkpoint: Real numbers in hand

- [x] All figures for the Fast section are measured, dated, and written down — no placeholders remain undecided.

---

## Phase B — Fast section (data + metadata disclosure)

- [x] **B1. Replace stats data with real numbers.**
      `src/data/stats.ts` — update `SPEED_STATS` (all-projects time, single-session ms,
      derived `N×` = python_mean / weavr_mean) and `SPEED_RACE` (real `weavr` vs `claude-code-log`
      times; recompute `fraction` from real means). Keep existing `Stat` / `RaceContender` shapes.
  - AC: every number in `stats.ts` traces to an A1/A2 measurement; no hardcoded magic numbers in components.
  - Dep: A1, A2. **Scope: S** (1 file).

- [x] **B2. Add benchmark metadata constant.**
      `src/data/stats.ts` — export `BENCHMARK_META = { projects, totalTokens?, jsonlFiles, measuredOn }`
      (ISO date). Omit `totalTokens` if A2 decided to drop it.
  - AC: `BENCHMARK_META` typed and exported with real values.
  - Dep: A2, B1. **Scope: XS** (same file).

- [x] **B3. Render the metadata disclosure.**
      `src/components/speed/SpeedStats.tsx` — a `<button>`-toggled "Benchmark details" panel below the
      race bar, collapsed by default, expanding to show `projects` / `total tokens` / `JSONL files` from
      `BENCHMARK_META`. Style with existing tokens (`text-muted`, `bg-surface/50`, `font-mono`,
      `border-border`); keyboard-reachable (`aria-expanded`); respects reduced motion.
  - AC: collapsed by default; toggles on click/Enter; shows real metadata; stats stay the visual focus.
  - Dep: B2. **Scope: S** (1 file).

- [x] **B4. Update SpeedStats test.**
      `src/components/speed/SpeedStats.test.tsx` — assert real stats render and the disclosure
      toggles (hidden → visible).
  - AC: test passes and covers the new disclosure behavior.
  - Dep: B3. **Scope: S**.

### Checkpoint: Fast section

- [x] `vp check` clean; SpeedStats test green; browser shows real stats + race bar + collapsible details.

---

## Phase C — Features copy fixes

- [x] **C1. Fix Token tracking + Multi-project copy.**
      `src/components/features/FeatureGrid.tsx` — rewrite "Token tracking" body to reflect
      **session- and project-level** totals (not per-message); change `~/.claude` → `~/.claude/projects`
      in "Multi-project export".
  - AC: both card bodies are accurate; no per-message claim remains.
  - Dep: None. **Scope: XS** (1 file).

---

## Phase D — Install / Quickstart (macOS + Linux tabs)

- [x] **D1. OS tabs for install commands.**
      `src/components/install/InstallSection.tsx` — add `macOS` / `Linux` tabs switching the shown
      commands (macOS: brew + cargo binstall + cargo install; Linux: cargo binstall + cargo install).
      Extract an OS→commands map to a typed constant; keep every command as a `CopyBlock`
      (copy feedback + keyboard reach). Apply /impeccable + /layout polish to spacing/hierarchy.
      Remove the `TRUST_PILLS` block (moves to footer in E1).
  - AC: tabs switch commands; brew only under macOS; tabs are keyboard-accessible; copy works.
  - Dep: None (independent of Phase B). **Scope: M** (1 file, moderate UI).

---

## Phase E — Footer slim-down

- [x] **E1. Chips in, nav links out, keep credit.**
      `src/components/layout/Footer.tsx` — render the 3 chips ("100% local", "no AI",
      "a single Rust binary") as pills (reuse the pill style moved from InstallSection); remove the
      `FOOTER_LINKS` nav (GitHub, crates.io, License, claude-code-log); keep the
      "Built with claude-code-log inspiration" credit line (still links `LINKS.claudeCodeLog`).
  - AC: 3 chips render; the 4 nav links are gone; credit line remains and links out.
  - Dep: D1 (pill style source). **Scope: S** (1 file).

- [x] **E2. Update Footer test + verify links.ts.**
      `src/components/layout/Footer.test.tsx` — assert chips render and nav links are absent.
      Confirm `src/lib/links.ts` entries still used elsewhere (`github` by InstallSection;
      `claudeCodeLog` by credit) before removing any — likely remove only truly-unused keys.
  - AC: Footer test passes; no dead/unused exports left in `links.ts`.
  - Dep: E1. **Scope: S**.

### Checkpoint: Complete

- [x] `vp check` + full test suite green.
- [x] agent-browser pass: Fast (real numbers + details), Features (corrected copy), Install (OS tabs),
      Footer (chips, no nav links, credit present).
- [x] No hardcoded magic numbers remain in components.

---

## Risks

| Risk                                                   | Impact | Mitigation                                                                         |
| ------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------- |
| weavr emits no total-token summary                     | Med    | A2 decides up front: derive or drop the token metadata field.                      |
| bench.sh build/`hyperfine`/`uvx` not available locally | High   | Verify toolchain in A1 before UI work; the whole revision depends on real numbers. |
| Single-session timing not covered by bench.sh          | Low    | A2 runs a separate timed `weavr -i` invocation.                                    |
