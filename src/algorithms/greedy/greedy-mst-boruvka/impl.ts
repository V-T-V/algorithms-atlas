// Borůvka MST · 实现
export interface Edge {
  u: number;
  v: number;
  w: number;
}
export interface BoHooks {
  onRound?: (round: number, components: number, added: number) => void;
  onConclude?: (totalWeight: number, edges: number) => void;
}
export function boruvkaMst(
  n: number,
  edges: ReadonlyArray<Edge>,
  hooks: BoHooks = {},
): { weight: number; count: number } {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]!]!;
      x = parent[x]!;
    }
    return x;
  };
  let weight = 0,
    count = 0,
    comps = n,
    round = 0;
  while (comps > 1) {
    const cheapest = new Array<number>(n).fill(-1);
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i]!;
      const ru = find(e.u),
        rv = find(e.v);
      if (ru === rv) continue;
      if (cheapest[ru] === -1 || edges[cheapest[ru]!]!.w > e.w) cheapest[ru] = i;
      if (cheapest[rv] === -1 || edges[cheapest[rv]!]!.w > e.w) cheapest[rv] = i;
    }
    let added = 0;
    for (let c = 0; c < n; c++) {
      const i = cheapest[c]!;
      if (i < 0) continue;
      const e = edges[i]!;
      const ru = find(e.u),
        rv = find(e.v);
      if (ru !== rv) {
        parent[ru] = rv;
        weight += e.w;
        count++;
        added++;
        comps--;
      }
    }
    round++;
    hooks.onRound?.(round, comps, added);
    if (added === 0) break;
  }
  hooks.onConclude?.(weight, count);
  return { weight, count };
}
