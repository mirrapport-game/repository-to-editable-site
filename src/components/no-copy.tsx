import type { ClipboardEvent, DragEvent, MouseEvent, ReactNode } from "react";

/** Запрещает выделение, копирование и контекстное меню внутри блока. */
export function NoCopy({ children, className = "" }: { children: ReactNode; className?: string }) {
  const stop = (event: ClipboardEvent<HTMLDivElement> | MouseEvent<HTMLDivElement> | DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  return (
    <div className={`select-none ${className}`} onCopy={stop} onCut={stop} onContextMenu={stop} onDragStart={stop}>
      {children}
    </div>
  );
}
