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
  { id: "n1", label: "Workspace One", hint: "Primary node", p: "Jz8jNTsvL39zJydvNjA6Lyk3L2Q0IyM/Iw==" },
  { id: "n2", label: "Workspace Two", hint: "Mirror node", p: "Jz8jNTsvL39zJyc5Kzs/Pyk7Lm8rOj88LSMyKz8wIjgwbi87Lw==" },
  { id: "n3", label: "Workspace Three", hint: "Fallback node", p: "Jz8jNTsvL39zJyc0Oz5vLz8wPzM7LT87Lm8jMg==" },
  { id: "n4", label: "Workspace Four", hint: "Secondary node", p: "Jz8jNTsvL39zJyduIzosLj8jITtvLDshITM4ay8i" },
];

export const nebuloTargets: NebuloTarget[] = packed.map(({ id, label, hint, p }) => ({
  id,
  label,
  hint,
  resolve: () => dec(p),
}));
