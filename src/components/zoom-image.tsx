import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";

/** Картинка: при наведении слегка увеличивается, по клику открывается на весь экран. */
export function ZoomImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Увеличить: ${alt}`} className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-3xl ${className}`}>
        <img src={src} alt={alt} loading="lazy" decoding="async" className="w-full transition-transform duration-500 ease-out group-hover:scale-[1.06]" />
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-foreground/80 px-3 py-1.5 text-xs text-background opacity-90 transition-opacity group-hover:opacity-100"><ZoomIn className="h-4 w-4" /> Открыть</span>
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)} className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-foreground/90 p-3 sm:p-8">
          <button type="button" aria-label="Закрыть" className="absolute right-4 top-4 rounded-full bg-background p-2 text-foreground"><X /></button>
          <img src={src} alt={alt} className="max-h-full max-w-full rounded-2xl object-contain" />
        </div>
      )}
    </>
  );
}
