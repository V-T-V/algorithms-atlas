export interface GraphInput {
  nodes: string[];
  edges: Array<{ from: string; to: string; weight: number }>;
}
class DSU {
  parent: Map<string, string> = new Map();
  constructor(ns: string[]) {
    for (const n of ns) this.parent.set(n, n);
  }
  find(x: string): string {
    const p = this.parent.get(x)!;
    if (p === x) return x;
    const r = this.find(p);
    this.parent.set(x, r);
    return r;
  }
  union(a: string, b: string): boolean {
    const ra = this.find(a),
      rb = this.find(b);
    if (ra === rb) return false;
    this.parent.set(ra, rb);
    return true;
  }
}
export interface KruskalHooks {
  onPick?: (f: string, t: string, w: number) => void;
  onResult?: (total: number) => void;
}
export function kruskalMST(g: GraphInput, hooks: KruskalHooks = {}): number {
  const dsu = new DSU(g.nodes);
  const sorted = [...g.edges].sort((a, b) => a.weight - b.weight);
  let total = 0,
    count = 0;
  for (const e of sorted) {
    if (dsu.union(e.from, e.to)) {
      total += e.weight;
      count++;
      hooks.onPick?.(e.from, e.to, e.weight);
      if (count === g.nodes.length - 1) break;
    }
  }
  hooks.onResult?.(total);
  return total;
}
