import { useDesktop, type AppId } from "@/lib/desktop/store";

const items: { appId: AppId; label: string; emoji: string; w?: number; h?: number; singleton?: boolean }[] = [
  { appId: "games", label: "Arcade", emoji: "🎮", singleton: true },
  { appId: "nebulo", label: "Nebulo", emoji: "🌌", w: 1000, h: 660 },
  { appId: "settings", label: "Settings", emoji: "⚙️", w: 720, h: 560, singleton: true },
  { appId: "about", label: "About", emoji: "ℹ️", w: 460, h: 320, singleton: true },
];

export function Dock() {
  const { openWindow, windows, restore } = useDesktop();
  const minimized = windows.filter((w) => w.minimized);

  return (
    <div className="dock-wrap">
      <div className="dock">
        {items.map((it) => {
          const running = windows.some((w) => w.appId === it.appId);
          return (
            <button
              key={it.appId}
              className="dock-item"
              aria-label={it.label}
              onClick={() =>
                openWindow({
                  appId: it.appId,
                  title: it.label === "About" ? "About Lopsided" : it.label,
                  w: it.w,
                  h: it.h,
                  singleton: it.singleton,
                })
              }
            >
              <span>{it.emoji}</span>
              <span className="dock-label">{it.label}</span>
              {running && <i className="dock-dot" />}
            </button>
          );
        })}
        {minimized.length > 0 && <div className="dock-sep" />}
        {minimized.map((w) => (
          <button key={w.id} className="dock-item" onClick={() => restore(w.id)} aria-label={w.title}>
            <span className="text-sm">🗕</span>
            <span className="dock-label">{w.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
