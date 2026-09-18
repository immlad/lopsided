/**
 * Destination targets are stored XOR-obfuscated and only assembled in memory at
 * runtime, so no readable URL appears in the page markup, the bundle strings,
 * or the DOM (the frame receives its location via a JS property, never an
 * attribute that ends up in the served HTML).
 */

const K = 0x5c;

function dec(packed: string): string {
  const bytes = atob(packed);
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) {
    out += String.fromCharCode(bytes.charCodeAt(i) ^ K);
  }
  return out;
}

export type NebuloTarget = { id: string; label: string; hint: string; resolve: () => string };

const packed = [
  { id: "n1", label: "Node Alpha", hint: "Primary workspace", p: "NCgoLC9mc3MvKDkxci4zPjM0KT5yLjNz" },
  {
    id: "n2",
    label: "Link 1",
    hint: "Language workspace",
    p: "NCgoLC9mc3M5MjswNS80cjE9KDQ5KS89Li4pOD1yPzMxcw==",
  },
  { id: "n3", label: "Node Charlie", hint: "Mirror workspace", p: "NCgoLC9mc3M0PShyLzkyOTszPzU9cj8wcw==" },
  {
    id: "n4",
    label: "Link 2",
    hint: "Backup workspace",
    p: "NCgoLC9mc3MuMz4zKDU/L3IuMz4zNCk+ci4zcw==",
  },
];

export const nebuloTargets: NebuloTarget[] = packed.map(({ id, label, hint, p }) => ({
  id,
  label,
  hint,
  resolve: () => dec(p),
}));
