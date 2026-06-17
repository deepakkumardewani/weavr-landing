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
        className={`shrink-0 text-xs ${copied ? "text-accent" : "text-muted group-hover:text-accent"}`}
        aria-hidden="true"
      >
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
