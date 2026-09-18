import { createFileRoute } from "@tanstack/react-router";
import { DesktopProvider } from "@/lib/desktop/store";
import { Desktop } from "@/components/desktop/Desktop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "   " },
      {
        name: "description",
        content:
          "   .",
      },
      { property: "og:title", content: "Lopsided — Unblocked Games Desktop" },
      {
        property: "og:description",
        content: "   .",
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
