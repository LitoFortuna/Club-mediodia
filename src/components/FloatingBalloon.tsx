import { useEffect, useRef } from "react";
import balloon from "@/assets/balloon.png";

/**
 * Pequeño globo rojo que sigue al cursor con interpolación suave.
 * Solo se muestra en pantallas medianas o mayores.
 */
export function FloatingBalloon() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const handleMove = (e: MouseEvent) => {
      target.current.x = e.clientX + 24;
      target.current.y = e.clientY + 24;
    };
    window.addEventListener("mousemove", handleMove);

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block balloon-tiny"
      style={{ willChange: "transform" }}
    >
      <img
        src={balloon}
        alt=""
        width={28}
        height={36}
        className="w-7 h-9 opacity-90"
        style={{ filter: "drop-shadow(2px 3px 0 rgba(1,148,127,0.6))" }}
      />
    </div>
  );
}
