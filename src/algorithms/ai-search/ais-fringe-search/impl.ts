export interface FringeHooks {
  onExpand?: (node: number, f: number) => void;
  onThreshold?: (t: number) => void;
}
export interface FringeGraph {
  start: number;
  goal: number;
  neighbors: (n: number) => Array<{ to: number; cost: number }>;
  h: (n: number) => number;
}
export function fringeSearch(g: FringeGraph, hooks: FringeHooks = {}): number[] {
  let threshold = g.h(g.start);
  const now: Array<{ node: number; g: number }> = [{ node: g.start, g: 0 }];
  const parent = new Map<number, number>();
  while (now.length) {
    hooks.onThreshold?.(threshold);
    const later: Array<{ node: number; g: number }> = [];
    let next = Infinity;
    let i = 0;
    while (i < now.length) {
      const cur = now[i]!;
      const f = cur.g + g.h(cur.node);
      hooks.onExpand?.(cur.node, f);
      if (cur.node === g.goal) {
        const path: number[] = [];
        let n: number | undefined = cur.node;
        while (n !== undefined) {
          path.unshift(n);
          n = parent.get(n);
        }
        return path;
      }
      if (f > threshold) {
        if (f < next) next = f;
        later.push(cur);
      } else {
        for (const e of g.neighbors(cur.node)) {
          if (!parent.has(e.to)) {
            parent.set(e.to, cur.node);
            now.splice(i + 1, 0, { node: e.to, g: cur.g + e.cost });
          }
        }
      }
      i++;
    }
    threshold = next;
    now.length = 0;
    now.push(...later);
    if (next === Infinity) break;
  }
  return [];
}
