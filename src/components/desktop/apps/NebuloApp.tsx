import { useEffect, useRef, useState } from "react";
import { nebuloTargets } from "@/lib/desktop/nebulo-links";

function openInBlank(id: string) {
  const target = nebuloTargets.find((t) => t.id === id);
  if (!target) return;
  const value = target.resolve();
  // A real new tab that stays on about:blank; the page is built in memory.
  const tab = window.open("about:blank", "_blank");
  if (!tab) {
    window.alert("Allow pop-ups for this site to open a new tab.");
    return;
  }
  const doc = tab.document;
  doc.open();
  doc.write(
    '<!doctype html><html><head><title>Home</title><link rel="icon" href="data:,">' +
      "<style>html,body{margin:0;height:100%;overflow:hidden;background:#000}" +
      "iframe{border:0;width:100%;height:100%;display:block}</style></head><body></body></html>",
  );
  doc.close();
  tab.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  });
  const frame = doc.createElement("iframe");
  frame.setAttribute("allowfullscreen", "true");
  frame.setAttribute("allow", "fullscreen; autoplay; clipboard-read; clipboard-write");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (frame as any).src = value;
  doc.body.appendChild(frame);
}

export function NebuloApp({ initial }: { initial?: string }) {
  const [targetId, setTargetId] = useState<string | null>(initial ?? null);
  const [loading, setLoading] = useState(false);
  const [nonce, setNonce] = useState(0);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !targetId) return;
    const target = nebuloTargets.find((t) => t.id === targetId);
    if (!target) return;
    setLoading(true);
    // Assigned as a JS property after mount: nothing readable lands in markup.
    const value = target.resolve();
    const id = window.setTimeout(() => {
      frame.setAttribute("data-session", targetId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (frame as any).src = "about:blank";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (frame as any).src = value;
    }, 30);
    return () => window.clearTimeout(id);
  }, [targetId, nonce]);

  if (!targetId) {
    return (
      <div className="flex h-full flex-col gap-4 overflow-auto p-6">
        <div>
          <h2 className="text-lg font-semibold">Nebulo</h2>
          <p className="text-sm opacity-70">Pick a workspace to open inside this window.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {nebuloTargets.map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <button className="tile flex-1" onClick={() => setTargetId(t.id)}>
                <span className="tile-badge">{t.label.slice(-1)}</span>
                <span className="flex flex-col items-start">
                  <span className="font-medium">{t.label}</span>
                  <span className="text-xs opacity-60">{t.hint}</span>
                </span>
              </button>
              <button
                className="pill"
                title="Open in a blank tab"
                onClick={() => openInBlank(t.id)}
              >
                Blank tab
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-[var(--glass-line)] px-3 py-2">
        <select
          className="pill"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          aria-label="Workspace"
        >
          {nebuloTargets.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <button className="pill" onClick={() => openInBlank(targetId)}>
          Blank tab
        </button>
        <button
          className="pill"
          onClick={() => {
            const f = frameRef.current;
            if (f) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const s = (f as any).src;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (f as any).src = s;
            }
          }}
        >
          Reload
        </button>
        <span className="ml-auto text-xs opacity-60">{loading ? "Connecting…" : "Connected"}</span>
      </div>
      <div className="relative flex-1 bg-black/5">
        <iframe
          ref={frameRef}
          title="Nebulo"
          className="h-full w-full"
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
        />
      </div>
    </div>
  );
}
