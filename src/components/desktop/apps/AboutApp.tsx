export function AboutApp() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
      <div className="logo-mark">L</div>
      <h2 className="text-xl font-semibold">Lopsided</h2>
      <p className="text-sm opacity-70">A desktop that happens to be full of games.</p>
      <p className="mt-3 max-w-sm text-xs opacity-55">
        Drag windows by their title bar, resize from the bottom-right corner, and use the three dots
        to close, minimize, or hide. Hidden windows come back from the menu bar.
      </p>
    </div>
  );
}
