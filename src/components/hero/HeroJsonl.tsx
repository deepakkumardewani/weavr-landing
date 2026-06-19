import { ScrollCue } from "./ScrollCue";

const HEADLINE = "Make your Claude Code transcripts readable.";
const SUBLINE =
  "weavr turns raw JSONL session logs into beautiful, shareable HTML — 100% local, no AI.";

/**
 * S1 hero (R2): framing copy over the shared FunnelStream wall (now in App.tsx
 * wrapper). Vignette + glow keep the copy legible against the JSONL texture.
 * No CTA — the GitHub icon lives in the header.
 */
export function HeroJsonl() {
  return (
    <section
      aria-label="weavr — make your Claude Code transcripts readable"
      className="relative grid h-dvh place-items-center overflow-hidden"
    >
      {/* Vignette: fade the texture into the page edges so it reads as endless. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, transparent 30%, rgb(var(--color-bg)) 95%)",
        }}
      />

      {/* Soft glow directly behind the copy to lift it off the texture for AA. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(closest-side, rgb(var(--color-bg) / 0.92), transparent 80%)",
        }}
      />

      {/* Focal layer: the framing copy. */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl md:text-6xl">
          {HEADLINE}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted sm:text-lg">
          {SUBLINE}
        </p>
      </div>

      <ScrollCue />
    </section>
  );
}
