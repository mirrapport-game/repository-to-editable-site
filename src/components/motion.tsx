import { useEffect, useRef, useState } from "react";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fades in homepage sections on scroll and adds gentle hero parallax. */
export function PageMotion() {
  useEffect(() => {
    if (reduced()) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("main section")).slice(1);
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("reveal-in"); io.unobserve(e.target); }
    }), { threshold: 0.08, rootMargin: "0px 0px -60px 0px" });
    els.forEach((el) => { if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("reveal"); io.observe(el); } });

    const hero = document.querySelector<HTMLElement>("[data-parallax]");
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, 900);
      if (hero) hero.style.transform = `translate3d(0, ${y * 0.25}px, 0) scale(1.08)`;
    }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return null;
}

/** Counts up from 0 to the numeric part of `value` when visible, e.g. "5000+". */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const m = value.match(/^(\d+)(.*)$/);
  const target = m ? Number(m[1]) : 0;
  const [n, setN] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!m || reduced() || !ref.current) return;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const start = performance.now(), dur = 1400;
      const tick = (t: number) => { const p = Math.min(1, (t - start) / dur); setN(Math.round(target * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  if (!m) return <span className={className}>{value}</span>;
  return <span ref={ref} className={className}>{n}{m[2]}</span>;
}
