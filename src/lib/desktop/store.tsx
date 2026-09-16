import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Skin = "sonoma" | "sequoia" | "tahoe";
export type Mode = "light" | "dark";

export type AppId = "games" | "nebulo" | "settings" | "about";

export type WindowState = {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  hidden: boolean;
  payload?: Record<string, string> | undefined;
};

type Settings = {
  mode: Mode;
  skin: Skin;
  wallpaper: string;
};

type DesktopValue = {
  settings: Settings;
  setSettings: (patch: Partial<Settings>) => void;
  windows: WindowState[];
  openWindow: (opts: {
    appId: AppId;
    title: string;
    w?: number | undefined;
    h?: number | undefined;
    payload?: Record<string, string> | undefined;
    singleton?: boolean | undefined;
  }) => void;
  close: (id: string) => void;
  minimize: (id: string) => void;
  hide: (id: string) => void;
  unhideAll: () => void;
  restore: (id: string) => void;
  focus: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, w: number, h: number) => void;
  activeId: string | null;
};

const DesktopContext = createContext<DesktopValue | null>(null);

const STORAGE_KEY = "lopsided.settings.v1";

const defaultSettings: Settings = {
  mode: "dark",
  skin: "sonoma",
  wallpaper: "sonoma",
};

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const zRef = useRef(10);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettingsState({ ...defaultSettings, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const setSettings = useCallback((patch: Partial<Settings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const focus = useCallback((id: string) => {
    zRef.current += 1;
    const z = zRef.current;
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, z, minimized: false, hidden: false } : w)),
    );
  }, []);

  const openWindow = useCallback<DesktopValue["openWindow"]>(
    ({ appId, title, w = 860, h = 560, payload, singleton }) => {
      zRef.current += 1;
      const z = zRef.current;
      setWindows((ws) => {
        if (singleton) {
          const existing = ws.find((win) => win.appId === appId);
          if (existing) {
            return ws.map((win) =>
              win.id === existing.id
                ? { ...win, z, minimized: false, hidden: false, payload: payload ?? win.payload }
                : win,
            );
          }
        }
        const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
        const vh = typeof window !== "undefined" ? window.innerHeight : 900;
        const width = Math.min(w, vw - 60);
        const height = Math.min(h, vh - 160);
        const offset = (ws.length % 6) * 28;
        return [
          ...ws,
          {
            id: `${appId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            appId,
            title,
            w: width,
            h: height,
            x: Math.max(16, (vw - width) / 2 - 60 + offset),
            y: Math.max(44, (vh - height) / 2 - 60 + offset),
            z,
            minimized: false,
            hidden: false,
            payload,
          },
        ];
      });
    },
    [],
  );

  const close = useCallback((id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
  }, []);
  const minimize = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
  }, []);
  const hide = useCallback((id: string) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, hidden: true } : w)));
  }, []);
  const unhideAll = useCallback(() => {
    setWindows((ws) => ws.map((w) => ({ ...w, hidden: false })));
  }, []);
  const restore = useCallback(
    (id: string) => {
      focus(id);
    },
    [focus],
  );
  const move = useCallback((id: string, x: number, y: number) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);
  const resize = useCallback((id: string, w: number, h: number) => {
    setWindows((ws) => ws.map((win) => (win.id === id ? { ...win, w, h } : win)));
  }, []);

  const activeId = useMemo(() => {
    const visible = windows.filter((w) => !w.minimized && !w.hidden);
    if (!visible.length) return null;
    return visible.reduce((a, b) => (a.z > b.z ? a : b)).id;
  }, [windows]);

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      windows,
      openWindow,
      close,
      minimize,
      hide,
      unhideAll,
      restore,
      focus,
      move,
      resize,
      activeId,
    }),
    [
      settings,
      setSettings,
      windows,
      openWindow,
      close,
      minimize,
      hide,
      unhideAll,
      restore,
      focus,
      move,
      resize,
      activeId,
    ],
  );

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>;
}

export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error("useDesktop must be used inside DesktopProvider");
  return ctx;
}
