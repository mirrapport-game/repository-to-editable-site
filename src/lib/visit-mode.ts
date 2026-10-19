import { useEffect, useState } from "react";

export type VisitMode = "quest" | "site";
const KEY = "rapport-visit-mode";
const EVENT = "rapport-visit-mode";

export function setVisitMode(mode: VisitMode) {
  localStorage.setItem(KEY, mode);
  window.dispatchEvent(new Event(EVENT));
}

// null — посетитель ещё не выбрал путь (или ещё не прошла гидратация).
export function useVisitMode() {
  const [mode, setMode] = useState<VisitMode | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const read = () => { const v = localStorage.getItem(KEY); setMode(v === "quest" || v === "site" ? v : null); setReady(true); };
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, []);
  return { mode, ready };
}
