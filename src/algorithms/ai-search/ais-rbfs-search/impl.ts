export interface RbfsHooks {
  onVisit?: (node: number, f: number, flimit: number) => void;
  onFound?: (node: number) => void;
}
export interface RbfsGraph {
  start: number;
  goal: number;
  neighbors: (n: number) => Array<{ to: number; cost: number }>;
  h: (n: number) => number;
}
export function rbfsSearch(g: RbfsGraph, hooks: RbfsHooks = {}): number[] {
  const rec = (
    node: number,
    gCost: number,
    flimit: number,
  ): { found: boolean; flimit: number; path: number[] } => {
    const f = gCost + g.h(node);
    hooks.onVisit?.(node, f, flimit);
    if (f > flimit) return { found: false, flimit: f, path: [] };
    if (node === g.goal) {
      hooks.onFound?.(node);
      return { found: true, flimit: f, path: [node] };
    }
    const succ: Array<{ to: number; f: number }> = g
      .neighbors(node)
      .map((e) => ({ to: e.to, f: Math.max(gCost + e.cost + g.h(e.to), f) }));
    if (!succ.length) return { found: false, flimit: Infinity, path: [] };
    while (true) {
      succ.sort((a, b) => a.f - b.f);
      const best = succ[0]!;
      if (best.f > flimit) return { found: false, flimit: best.f, path: [] };
      const alt = succ[1]?.f ?? Infinity;
      const e = g.neighbors(node).find((e) => e.to === best.to)!;
      const r = rec(best.to, gCost + e.cost, Math.min(flimit, alt));
      const idx = succ.findIndex((s) => s.to === best.to);
      if (idx >= 0) succ[idx]!.f = r.flimit;
      if (r.found) return { found: true, flimit: r.flimit, path: [node, ...r.path] };
    }
  };
  const r = rec(g.start, 0, Infinity);
  return r.path;
}
