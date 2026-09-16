import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useDesktop, type WindowState } from "@/lib/desktop/store";

type Props = { win: WindowState; active: boolean; children: ReactNode };

export function Window({ win, active, children }: Props) {
  const { focus, close, minimize, hide, move, resize } = useDesktop();
  const [mounted, setMounted] = useState(false);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const sizing = useRef<{ x: number; y: number; w: number; h: number } | null>(null);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (drag.current) {
        move(
          win.id,
          Math.max(0, Math.min(e.clientX - drag.current.dx, window.innerWidth - 120)),
          Math.max(28, Math.min(e.clientY - drag.current.dy, window.innerHeight - 80)),
        );
      } else if (sizing.current) {
        resize(
          win.id,
          Math.max(360, sizing.current.w + (e.clientX - sizing.current.x)),
          Math.max(240, sizing.current.h + (e.clientY - sizing.current.y)),
        );
      }
    },
    [move, resize, win.id],
  );

  useEffect(() => {
    const up = () => {
      drag.current = null;
      sizing.current = null;
      document.body.classList.remove("select-none");
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", up);
    };
  }, [onPointerMove]);

  const hiddenish = win.minimized || win.hidden;

  return (
    <div
      className="win-shell"
      data-active={active}
      data-state={hiddenish ? "away" : mounted ? "open" : "enter"}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }}
      onPointerDown={() => focus(win.id)}
    >
      <div
        className="win-bar"
        onPointerDown={(e) => {
          drag.current = { dx: e.clientX - win.x, dy: e.clientY - win.y };
          document.body.classList.add("select-none");
        }}
        onDoubleClick={() => minimize(win.id)}
      >
        <div className="flex items-center gap-2">
          <button
            aria-label="Close"
            className="traffic traffic-close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => close(win.id)}
          />
          <button
            aria-label="Minimize"
            className="traffic traffic-min"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => minimize(win.id)}
          />
          <button
            aria-label="Hide"
            className="traffic traffic-hide"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => hide(win.id)}
          />
        </div>
        <span className="win-title">{win.title}</span>
        <span className="w-14" />
      </div>
      <div className="win-body">{children}</div>
      <div
        className="win-grip"
        onPointerDown={(e) => {
          e.stopPropagation();
          sizing.current = { x: e.clientX, y: e.clientY, w: win.w, h: win.h };
          document.body.classList.add("select-none");
        }}
      />
    </div>
  );
}
