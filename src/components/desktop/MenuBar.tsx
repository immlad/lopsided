import { useEffect, useState } from "react";
import { useDesktop } from "@/lib/desktop/store";

export function MenuBar() {
  const { openWindow, unhideAll, windows, settings } = useDesktop();
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleString(undefined, {
          weekday: "short",
          hour: "numeric",
          minute: "2-digit",
        }),
      );
    tick();
    const id = window.setInterval(tick, 20000);
    return () => window.clearInterval(id);
  }, []);

  const hiddenCount = windows.filter((w) => w.hidden).length;

  return (
    <div className="menubar">
      <button className="menu-item font-semibold" onClick={() => openWindow({ appId: "about", title: "About Lopsided", w: 460, h: 320, singleton: true })}>
        Lopsided
      </button>
      <button className="menu-item" onClick={() => openWindow({ appId: "games", title: "Arcade", singleton: true })}>
        Arcade
      </button>
      <button className="menu-item" onClick={() => openWindow({ appId: "nebulo", title: "Nebulo", w: 1000, h: 660 })}>
        Nebulo
      </button>
      <button className="menu-item" onClick={() => openWindow({ appId: "settings", title: "Settings", w: 720, h: 560, singleton: true })}>
        Settings
      </button>
      {hiddenCount > 0 && (
        <button className="menu-item" onClick={unhideAll}>
          Show hidden ({hiddenCount})
        </button>
      )}
      <div className="ml-auto flex items-center gap-3 pr-1 text-xs">
        <span className="opacity-70 capitalize">{settings.skin}</span>
        <span>{now}</span>
      </div>
    </div>
  );
}
