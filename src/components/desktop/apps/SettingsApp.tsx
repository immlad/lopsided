import { useDesktop, type Mode, type Skin } from "@/lib/desktop/store";
import { wallpapers } from "@/lib/desktop/wallpapers";

const skins: { id: Skin; name: string; blurb: string }[] = [
  { id: "sonoma", name: "macOS Sonoma", blurb: "Classic frosted glass, square-ish corners" },
  { id: "sequoia", name: "macOS Sequoia", blurb: "Deeper blur, softer shadows, rounder edges" },
  { id: "tahoe", name: "macOS Tahoe", blurb: "Liquid glass, high translucency, pill controls" },
];

export function SettingsApp() {
  const { settings, setSettings } = useDesktop();

  return (
    <div className="h-full overflow-auto p-6">
      <h2 className="text-lg font-semibold">Settings</h2>
      <p className="text-sm opacity-70">Personalize Lopsided.</p>

      <section className="mt-6">
        <h3 className="section-title">Appearance</h3>
        <div className="flex gap-3">
          {(["light", "dark"] as Mode[]).map((m) => (
            <button
              key={m}
              className="tile flex-1 justify-center capitalize"
              data-selected={settings.mode === m}
              onClick={() => setSettings({ mode: m })}
            >
              {m}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="section-title">Interface style</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {skins.map((s) => (
            <button
              key={s.id}
              className="tile flex-col items-start"
              data-selected={settings.skin === s.id}
              onClick={() => setSettings({ skin: s.id })}
            >
              <span className="font-medium">{s.name}</span>
              <span className="text-xs opacity-60">{s.blurb}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="section-title">Wallpaper</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {wallpapers.map((w) => (
            <button
              key={w.id}
              className="wall-swatch"
              data-selected={settings.wallpaper === w.id}
              style={{ backgroundImage: w.value }}
              onClick={() => setSettings({ wallpaper: w.id })}
            >
              <span>{w.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
