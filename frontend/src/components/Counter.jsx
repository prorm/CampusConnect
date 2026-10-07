import { useEffect, useRef, useState } from "react";

// Animates a number toward its new value so seat and queue changes read as
// changes rather than silent swaps.
export default function Counter({ value, duration = 650, format = (n) => n }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = value;
      const task = requestAnimationFrame(() => setShown(value));
      return () => cancelAnimationFrame(task);
    }
    let frame;
    const began = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - began) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setShown(Math.round(start + (value - start) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      from.current = value;
    };
  }, [value, duration]);
  return <span className="counter">{format(shown)}</span>;
}
