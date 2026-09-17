import { useDesktop } from "@/lib/desktop/store";

export type Game = { id: string; name: string; tag: string; emoji: string; url: string };

export const games: Game[] = [];

export function GamesApp() {
  const { openWindow } = useDesktop();

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Arcade</h2>
        <p className="text-sm opacity-70">Your apps, always open.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <button
          className="game-card"
          onClick={() =>
            openWindow({ appId: "nebulo", title: "Nebulo", w: 1040, h: 700, singleton: true })
          }
        >
          <span className="text-3xl">🌌</span>
          <span className="mt-2 text-sm font-medium">Nebulo</span>
          <span className="text-xs opacity-60">Browser</span>
        </button>
      </div>
    </div>
  );
}

export function GameFrame({ url }: { url: string }) {
  return (
    <iframe
      title="Game"
      src={url}
      className="h-full w-full bg-black/10"
      referrerPolicy="no-referrer"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
    />
  );
}
