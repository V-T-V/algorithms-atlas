export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string }>;
  sources: string[];
}
export interface SiHooks {
  onReach?: (v: string, d: number) => void;
  onResult?: (dist: Map<string, number>) => void;
}
export function spreadInfo(g: GraphInput, hooks: SiHooks = {}): Map<string, number> {
  const adj = new Map<string, string[]>();
  for (const n of g.nodes) adj.set(n, []);
  for (const e of g.edges) {
    adj.get(e.from)!.push(e.to);
    adj.get(e.to)!.push(e.from);
  }
  const dist = new Map<string, number>();
  const q: Array<{ v: string; d: number }> = [];
  for (const s of g.sources) {
    dist.set(s, 0);
    q.push({ v: s, d: 0 });
  }
  while (q.length) {
    const { v, d } = q.shift()!;
    hooks.onReach?.(v, d);
    for (const u of adj.get(v) ?? [])
      if (!dist.has(u)) {
        dist.set(u, d + 1);
        q.push({ v: u, d: d + 1 });
      }
  }
  hooks.onResult?.(dist);
  return dist;
}
