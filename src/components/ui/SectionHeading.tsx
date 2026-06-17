/**
 * Shared section header — a mono accent eyebrow above a tracked title. Centralises
 * the type scale and vertical rhythm so every section opens identically. `align`
 * supports the centred sections and the left-aligned install columns.
 */
export function SectionHeading({
  eyebrow,
  title,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
}) {
  const aligned = align === "center" ? "text-center" : "text-left";
  return (
    <>
      <p
        className={`mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent-strong ${aligned}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`text-2xl font-medium tracking-tight sm:text-3xl ${aligned} ${
          align === "center" ? "mb-16" : "mb-8"
        }`}
      >
        {title}
      </h2>
    </>
  );
}
