/**
 * Speed numbers (S4), sourced from weavr's benchmarks vs `claude-code-log`.
 * The component renders only from this file — no inline magic numbers.
 * Measured 2026-06-18 against ~/.claude/projects/ (157 sessions, 15 projects).
 */
export interface Stat {
  /** Numeric target the count-up animates toward. */
  value: number;
  /** Decimal places to show while counting (keeps `1.3` from snapping to `1`). */
  decimals: number;
  /** Rendered before the number, e.g. the `~` in `~412ms`. */
  prefix?: string;
  /** Rendered after the number, e.g. `s`, `ms`, `×`. */
  suffix: string;
  label: string;
}

// Measured means (hyperfine, 3 runs, --no-cache, macOS):
const WEAVR_ALL_PROJECTS_MS = 412.1;
const WEAVR_SINGLE_SESSION_MS = 5.7;
const PYTHON_ALL_PROJECTS_MS = 23987;
const PYTHON_SINGLE_SESSION_MS = 359.5;
const SPEEDUP = PYTHON_ALL_PROJECTS_MS / WEAVR_ALL_PROJECTS_MS; // ≈ 58.2

export const SPEED_STATS: Stat[] = [
  {
    value: Math.round(WEAVR_ALL_PROJECTS_MS),
    decimals: 0,
    prefix: "~",
    suffix: "ms",
    label: "Export every project",
  },
  {
    value: Math.round(WEAVR_SINGLE_SESSION_MS),
    decimals: 0,
    prefix: "~",
    suffix: "ms",
    label: "Render a single session",
  },
  {
    value: Math.round(SPEEDUP * 10) / 10,
    decimals: 1,
    suffix: "×",
    label: "Faster than claude-code-log",
  },
];

/** Race-bar comparison — relative wall-clock to render the same workload. */
export interface RaceContender {
  name: string;
  /** Bar fill as a fraction of the slowest contender (0–1). */
  fraction: number;
  time: string;
  accent?: boolean;
}

export interface RaceGroup {
  label: string;
  /** Round ceiling shown as the right-axis scale label — bars never reach the edge. */
  scaleMax: string;
  /** The scale ceiling in ms — bar widths are fractions of this value. */
  scaleMaxMs: number;
  contenders: RaceContender[];
}

const ALL_PROJECTS_SCALE_MS = 30_000; // 30s ceiling
const SINGLE_SESSION_SCALE_MS = 500; // 500ms ceiling

export const SPEED_RACE_GROUPS: RaceGroup[] = [
  {
    label: "All projects · 157 sessions",
    scaleMax: "30s",
    scaleMaxMs: ALL_PROJECTS_SCALE_MS,
    contenders: [
      {
        name: "weavr",
        fraction: WEAVR_ALL_PROJECTS_MS / ALL_PROJECTS_SCALE_MS,
        time: "412ms",
        accent: true,
      },
      {
        name: "claude-code-log",
        fraction: PYTHON_ALL_PROJECTS_MS / ALL_PROJECTS_SCALE_MS,
        time: "24.0s",
      },
    ],
  },
  {
    label: "Single session",
    scaleMax: "500ms",
    scaleMaxMs: SINGLE_SESSION_SCALE_MS,
    contenders: [
      {
        name: "weavr",
        fraction: WEAVR_SINGLE_SESSION_MS / SINGLE_SESSION_SCALE_MS,
        time: "5.7ms",
        accent: true,
      },
      {
        name: "claude-code-log",
        fraction: PYTHON_SINGLE_SESSION_MS / SINGLE_SESSION_SCALE_MS,
        time: "360ms",
      },
    ],
  },
];

/** Benchmark metadata for the disclosure panel — all fields derived from A1/A2 measurements. */
export interface BenchmarkMeta {
  /** Distinct project directories under ~/.claude/projects/ */
  projects: number;
  /** Total session files rendered */
  sessions: number;
  /** Total messages across all sessions */
  messages: string;
  /** Aggregate input tokens */
  totalTokensIn: string;
  /** Aggregate output tokens */
  totalTokensOut: string;
  /** Aggregate cache read tokens */
  totalCacheRead: string;
  /** Aggregate cache write tokens */
  totalCacheWrite: string;
}

export const BENCHMARK_META: BenchmarkMeta = {
  projects: 15,
  sessions: 157,
  messages: "26,948",
  totalTokensIn: "16.3M",
  totalTokensOut: "11.1M",
  totalCacheRead: "1.8B",
  totalCacheWrite: "40.7M",
};
