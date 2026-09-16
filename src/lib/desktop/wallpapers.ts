import sonoma from "@/assets/wall-sonoma.jpg";
import sequoia from "@/assets/wall-sequoia.jpg";
import tahoe from "@/assets/wall-tahoe.jpg";

export type Wallpaper = { id: string; name: string; value: string; kind: "image" | "gradient" };

export const wallpapers: Wallpaper[] = [
  { id: "sonoma", name: "Ember Silk", value: `url(${sonoma})`, kind: "image" },
  { id: "sequoia", name: "Deep Tide", value: `url(${sequoia})`, kind: "image" },
  { id: "tahoe", name: "Liquid Glass", value: `url(${tahoe})`, kind: "image" },
  {
    id: "graphite",
    name: "Graphite",
    value: "linear-gradient(160deg, #1c1f26 0%, #2b3140 55%, #10131a 100%)",
    kind: "gradient",
  },
  {
    id: "sunrise",
    name: "Sunrise",
    value: "linear-gradient(150deg, #ffb26b 0%, #ff6a88 45%, #6a5acd 100%)",
    kind: "gradient",
  },
  {
    id: "mint",
    name: "Mint Fog",
    value: "linear-gradient(140deg, #d9f6ef 0%, #a5d8ff 50%, #cfc4ff 100%)",
    kind: "gradient",
  },
];

export function wallpaperById(id: string) {
  return wallpapers.find((w) => w.id === id) ?? wallpapers[0]!;
}
