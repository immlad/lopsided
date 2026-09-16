import { createFileRoute } from "@tanstack/react-router";
import { DesktopProvider } from "@/lib/desktop/store";
import { Desktop } from "@/components/desktop/Desktop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lopsided — Unblocked Games Desktop" },
      {
        name: "description",
        content:
          "Lopsided is a macOS-style desktop for unblocked games, with draggable windows, themes, wallpapers and the Nebulo workspace.",
      },
      { property: "og:title", content: "Lopsided — Unblocked Games Desktop" },
      {
        property: "og:description",
        content: "A macOS-style desktop full of games, themes and windows you can drag around.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <DesktopProvider>
      <Desktop />
    </DesktopProvider>
  );
}
