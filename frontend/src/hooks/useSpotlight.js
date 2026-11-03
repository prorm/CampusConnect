import { useEffect } from "react";

// Tracks the pointer over glass surfaces so CSS can paint a soft light where
// the cursor is (--sx/--sy). One delegated listener serves the whole page.
export default function useSpotlight() {
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    const move = (e) => {
      const surface = e.target.closest?.(".glass, .spot");
      if (!surface) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = surface.getBoundingClientRect();
        surface.style.setProperty("--sx", `${e.clientX - box.left}px`);
        surface.style.setProperty("--sy", `${e.clientY - box.top}px`);
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
    };
  }, []);
}
