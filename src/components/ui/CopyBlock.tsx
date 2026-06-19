import { useEffect, useRef, useState } from "react";

const FEEDBACK_MS = 1600;

/**
 * A copyable command line. The whole row is a button so it is keyboard- and
 * pointer-reachable; activating it writes `command` to the clipboard and shows
 * transient "Copied" feedback. Falls back gracefully if the Clipboard API is
 * unavailable or denied.
 */
export function CopyBlock({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), FEEDBACK_MS);
    } catch (error) {
      console.error("Clipboard write failed", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `Copied: ${command}` : `Copy command: ${command}`}
      className="group flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-surface/60 px-4 py-3 text-left font-mono text-sm text-fg transition-[colors,transform] hover:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.99] motion-reduce:active:scale-100"
    >
      <span className="min-w-0 truncate">
        <span className="select-none text-muted" aria-hidden="true">
          ${" "}
        </span>
        {command}
      </span>
      <span
        className={`shrink-0 ${copied ? "text-accent" : "text-muted group-hover:text-accent"}`}
        aria-hidden="true"
      >
        {copied ? (
          // Checkmark — confirmed copy
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M2.5 7.5L5.5 10.5L11.5 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Clipboard — copy action
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect
              x="4.5"
              y="3.5"
              width="7"
              height="8"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M4.5 5H3C2.44772 5 2 5.44772 2 6V11C2 11.5523 2.44772 12 3 12H8.5C9.05228 12 9.5 11.5523 9.5 11V10.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
