import { useEffect } from "react";
import { useDesktop } from "@/lib/desktop/store";
import { wallpaperById } from "@/lib/desktop/wallpapers";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { Window } from "./Window";
import { GamesApp, GameFrame } from "./apps/GamesApp";
import { NebuloApp } from "./apps/NebuloApp";
import { SettingsApp } from "./apps/SettingsApp";
import { AboutApp } from "./apps/AboutApp";

export function Desktop() {
  const { settings, windows, activeId, openWindow } = useDesktop();
  const wall = wallpaperById(settings.wallpaper);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset["skin"] = settings.skin;
    root.classList.toggle("dark", settings.mode === "dark");
  }, [settings.skin, settings.mode]);

  useEffect(() => {
    openWindow({ appId: "games", title: "Arcade", singleton: true });
  }, [openWindow]);

  return (
    <div className="desktop" style={{ backgroundImage: wall.value }}>
      <MenuBar />
      <main className="relative h-full w-full">
        <h1 className="sr-only">Lopsided — unblocked games desktop</h1>
        {windows.map((win) => (
          <Window key={win.id} win={win} active={win.id === activeId}>
            {win.appId === "settings" && <SettingsApp />}
            {win.appId === "about" && <AboutApp />}
            {win.appId === "nebulo" && <NebuloApp />}
            {win.appId === "games" &&
              (win.payload?.["url"] ? <GameFrame url={win.payload["url"]} /> : <GamesApp />)}
          </Window>
        ))}
      </main>
      <Dock />
    </div>
  );
}
