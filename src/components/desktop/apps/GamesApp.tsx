import { useState } from "react";
import { useDesktop } from "@/lib/desktop/store";

export type Game = { id: string; name: string; tag: string; emoji: string; url: string };

export const games: Game[] = [
  { id: "2048", name: "2048", tag: "Puzzle", emoji: "🔢", url: "https://play2048.co/" },
  { id: "hextris", name: "Hextris", tag: "Arcade", emoji: "⬡", url: "https://hextris.io/" },
  { id: "chess", name: "Chess", tag: "Board", emoji: "♟️", url: "https://lichess.org/tv/frame?theme=brown&bg=dark" },
  { id: "pacman", name: "Pac-Man", tag: "Retro", emoji: "🟡", url: "https://freepacman.org/" },
  { id: "flappy", name: "Flappy Bird", tag: "Arcade", emoji: "🐦", url: "https://flappybird.io/" },
  { id: "tetris", name: "Blocks", tag: "Puzzle", emoji: "🧱", url: "https://tetris.com/play-tetris" },
  { id: "sudoku", name: "Sudoku", tag: "Logic", emoji: "🔷", url: "https://www.websudoku.com/?level=1" },
  { id: "snake", name: "Snake", tag: "Retro", emoji: "🐍", url: "https://playsnake.org/" },
];

export function GamesApp() {
  const { openWindow } = useDesktop();
  const [q, setQ] = useState("");
  const list = games.filter((g) => (g.name + g.tag).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Arcade</h2>
          <p className="text-sm opacity-70">{games.length} games, always open.</p>
        </div>
        <input
          className="pill w-44"
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((g) => (
          <button
            key={g.id}
            className="game-card"
            onDoubleClick={() =>
              openWindow({ appId: "games", title: g.name, w: 980, h: 640, payload: { url: g.url } })
            }
            onClick={() =>
              openWindow({ appId: "games", title: g.name, w: 980, h: 640, payload: { url: g.url } })
            }
          >
            <span className="text-3xl">{g.emoji}</span>
            <span className="mt-2 text-sm font-medium">{g.name}</span>
            <span className="text-xs opacity-60">{g.tag}</span>
          </button>
        ))}
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
