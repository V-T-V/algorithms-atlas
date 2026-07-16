export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string }>;
}
export interface ColorHooks {
  onColor?: (v: string, c: number) => void;
  onResult?: (n: number) => void;
}
export function greedyColor(g: GraphInput, hooks: ColorHooks = {}): Map<string, number> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) {
    adj.get(e.from)!.push(e.to);
    adj.get(e.to)!.push(e.from);
  }
  const color = new Map<string, number>();
  let maxColor = 0;
  for (const v of g.nodes) {
    const used = new Set<number>();
    for (const u of adj.get(v) ?? []) if (color.has(u)) used.add(color.get(u)!);
    let c = 0;
    while (used.has(c)) c++;
    color.set(v, c);
    maxColor = Math.max(maxColor, c);
    hooks.onColor?.(v, c);
  }
  hooks.onResult?.(maxColor + 1);
  return color;
}
