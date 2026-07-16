export interface AraHooks {
  onEps?: (eps: number) => void;
  onImprove?: (cost: number, path: number[]) => void;
}
export interface AraGraph {
  start: number;
  goal: number;
  neighbors: (n: number) => Array<{ to: number; cost: number }>;
  h: (n: number) => number;
}
export function anytimeAStar(
  g: AraGraph,
  eps0: number,
  epsMin: number,
  dec: number,
  hooks: AraHooks = {},
): number[] {
  let best: number[] | null = null;
  const runOnce = (eps: number): number[] => {
    type N = { n: number; g: number; f: number };
    const open: N[] = [{ n: g.start, g: 0, f: eps * g.h(g.start) }];
    const parent = new Map<number, number>();
    const gC = new Map<number, number>([[g.start, 0]]);
    while (open.length) {
      open.sort((a, b) => a.f - b.f);
      const cur = open.shift()!;
      if (cur.n === g.goal) {
        const path: number[] = [];
        let c: number | undefined = g.goal;
        while (c !== undefined) {
          path.unshift(c);
          c = parent.get(c);
        }
        return path;
      }
      for (const e of g.neighbors(cur.n)) {
        const ng = cur.g + e.cost;
        if (ng < (gC.get(e.to) ?? Infinity)) {
          gC.set(e.to, ng);
          parent.set(e.to, cur.n);
          open.push({ n: e.to, g: ng, f: ng + eps * g.h(e.to) });
        }
      }
    }
    return [];
  };
  for (let eps = eps0; eps >= epsMin; eps -= dec) {
    hooks.onEps?.(eps);
    const p = runOnce(eps);
    if (p.length && (best === null || p.length <= best.length)) {
      best = p;
      hooks.onImprove?.(p.length, p);
    }
  }
  return best ?? [];
}
