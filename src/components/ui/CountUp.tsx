import { useEffect, useRef } from "react";
import gsap from "gsap";
import { registerMotion } from "../../lib/motion";

const COUNT_DURATION = 1.4;

/**
 * Counts a number up from zero when it scrolls into view. The DOM text is
 * written directly each frame (no React re-render per tick). Reduced motion
 * renders the final value immediately.
 */
export function CountUp({
  value,
  decimals,
  prefix = "",
  suffix,
  className,
}: {
  value: number;
  decimals: number;
  prefix?: string;
  suffix: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const render = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return registerMotion({
      animate: () => {
        const counter = { n: 0 };
        const tween = gsap.to(counter, {
          n: value,
          duration: COUNT_DURATION,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = render(counter.n);
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        return () => tween.scrollTrigger?.kill();
      },
      static: () => {
        el.textContent = render(value);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {render(value)}
    </span>
  );
}
