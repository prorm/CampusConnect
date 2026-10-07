import { useEffect, useRef } from "react";
// Perspective-projected ribbons and particles, drawn without a 3D dependency.
export default function Atmosphere({ quiet = false, paused = false }) {
  const canvas = useRef(null);
  useEffect(() => {
    const element = canvas.current,
      ctx = element.getContext("2d");
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0,
      height = 0,
      frame,
      last = 0,
      time = 0,
      target = { x: 0, y: 0 },
      mouse = { x: 0, y: 0 };
    const resize = () => {
      const box = element.getBoundingClientRect();
      width = box.width;
      height = box.height;
      const dpr = Math.min(devicePixelRatio, 1.5);
      element.width = width * dpr;
      element.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const pointer = (e) => {
      target.x = (e.clientX / innerWidth - 0.5) * 2;
      target.y = (e.clientY / innerHeight - 0.5) * 2;
    };
    const render = (now) => {
      if (now - last < 32 && !media.matches && !paused) {
        frame = requestAnimationFrame(render);
        return;
      }
      last = now;
      if (!paused && !media.matches && !document.hidden) time += 0.008;
      mouse.x += (target.x - mouse.x) * 0.04;
      mouse.y += (target.y - mouse.y) * 0.04;
      ctx.clearRect(0, 0, width, height);
      const cx = width * (quiet ? 0.65 : 0.72) + mouse.x * 35,
        cy = height * 0.47 + mouse.y * 25,
        radius = Math.min(width * 0.32, height * 0.44);
      for (let band = 0; band < (quiet ? 16 : 34); band++) {
        ctx.beginPath();
        for (let s = 0; s <= 180; s++) {
          const a = (s / 180) * Math.PI * 2,
            offset = band * 0.012,
            r = radius * (1 + 0.15 * Math.sin(a * 3 + time)) + band * 2;
          const x = r * Math.cos(a + time * 0.22),
            y = r * Math.sin(a + time * 0.22),
            z = Math.sin(a * 2 + time + offset) * radius * 0.48;
          const tilt = -0.6 + mouse.y * 0.2,
            yy = y * Math.cos(tilt) - z * Math.sin(tilt),
            zz = y * Math.sin(tilt) + z * Math.cos(tilt),
            perspective = 800 / (800 - zz);
          const px = cx + (x + yy * 0.16) * perspective,
            py = cy + yy * 0.64 * perspective;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `hsla(${158 + band * 3.8}, 75%, ${65 + band * 0.3}%, ${quiet ? 0.06 : 0.16 + band * 0.004})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      for (let i = 0; i < 45; i++) {
        const x =
            ((Math.sin(i * 127.1) * 0.5 + 0.5) * width +
              mouse.x * i * 0.3 +
              time * (i % 3)) %
            width,
          y =
            (Math.cos(i * 71.7) * 0.5 + 0.5) * height + Math.sin(time + i) * 8;
        ctx.fillStyle = `rgba(191,224,223,${0.13 + (Math.sin(time + i) + 1) * 0.13})`;
        ctx.beginPath();
        ctx.arc(x, y, i % 7 === 0 ? 1.7 : 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!media.matches && !paused) frame = requestAnimationFrame(render);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element.parentElement);
    resize();
    window.addEventListener("pointermove", pointer, { passive: true });
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };
    media.addEventListener("change", refresh);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", pointer);
      media.removeEventListener("change", refresh);
    };
  }, [quiet, paused]);
  return (
    <canvas
      ref={canvas}
      className={`atmosphere ${quiet ? "quiet" : ""}`}
      aria-hidden="true"
    />
  );
}
