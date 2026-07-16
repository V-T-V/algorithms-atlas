export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string }>;
}
export function buildAdj(g: GraphInput): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) {
    adj.get(e.from)!.push(e.to);
    adj.get(e.to)!.push(e.from);
  }
  return adj;
}
export interface BipHooks {
  onColor?: (v: string, c: number) => void;
  onResult?: (b: boolean) => void;
}
export function isBipartite(g: GraphInput, hooks: BipHooks = {}): boolean {
  const adj = buildAdj(g);
  const color = new Map<string, number>();
  for (const start of g.nodes) {
    if (color.has(start)) continue;
    color.set(start, 0);
    const q = [start];
    while (q.length) {
      const u = q.shift()!;
      hooks.onColor?.(u, color.get(u)!);
      for (const v of adj.get(u) ?? []) {
        if (!color.has(v)) {
          color.set(v, 1 - color.get(u)!);
          q.push(v);
        } else if (color.get(v) === color.get(u)) {
          hooks.onResult?.(false);
          return false;
        }
      }
    }
  }
  hooks.onResult?.(true);
  return true;
}
