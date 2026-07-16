export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string; weight: number }>;
  directed?: boolean;
}
export interface BfHooks {
  onRound?: (r: number, updated: boolean) => void;
  onResult?: (dist: Map<string, number>, negCycle: boolean) => void;
}
export function bellmanFord(
  g: GraphInput,
  src: string,
  hooks: BfHooks = {},
): { dist: Map<string, number>; negCycle: boolean } {
  const dist = new Map<string, number>();
  for (const n of g.nodes) dist.set(n, Infinity);
  dist.set(src, 0);
  const edges = g.edges.flatMap((e) =>
    g.directed ? [e] : [e, { from: e.to, to: e.from, weight: e.weight }],
  );
  for (let r = 0; r < g.nodes.length - 1; r++) {
    let updated = false;
    for (const e of edges) {
      const du = dist.get(e.from)!;
      if (du === Infinity) continue;
      if (du + e.weight < dist.get(e.to)!) {
        dist.set(e.to, du + e.weight);
        updated = true;
      }
    }
    hooks.onRound?.(r + 1, updated);
    if (!updated) break;
  }
  let negCycle = false;
  for (const e of edges) {
    const du = dist.get(e.from)!;
    if (du !== Infinity && du + e.weight < dist.get(e.to)!) {
      negCycle = true;
      break;
    }
  }
  hooks.onResult?.(dist, negCycle);
  return { dist, negCycle };
}
