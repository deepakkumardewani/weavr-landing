/**
 * Speed numbers (S4), sourced from weavr's benchmarks vs `claude-code-log`.
 * The component renders only from this file — no inline magic numbers.
 */
export interface Stat {
  /** Numeric target the count-up animates toward. */
  value: number;
  /** Decimal places to show while counting (keeps `1.3` from snapping to `1`). */
  decimals: number;
  /** Rendered before the number, e.g. the `~` in `~1.3s`. */
  prefix?: string;
  /** Rendered after the number, e.g. `s`, `ms`, `×`. */
  suffix: string;
  label: string;
}

export const SPEED_STATS: Stat[] = [
  { value: 1.3, decimals: 1, prefix: "~", suffix: "s", label: "Export every project" },
  { value: 28, decimals: 0, prefix: "~", suffix: "ms", label: "Render a single session" },
  { value: 46.5, decimals: 1, suffix: "×", label: "Faster than claude-code-log" },
];

/** Race-bar comparison (S4) — relative wall-clock to render the same workload. */
export interface RaceContender {
  name: string;
  /** Bar fill as a fraction of the slowest contender (0–1). */
  fraction: number;
  time: string;
  accent?: boolean;
}

export const SPEED_RACE: RaceContender[] = [
  { name: "weavr", fraction: 1 / 46.5, time: "1.3s", accent: true },
  { name: "claude-code-log", fraction: 1, time: "60.5s" },
];
