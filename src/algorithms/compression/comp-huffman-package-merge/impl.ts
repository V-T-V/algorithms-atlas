export interface PmHooks {
  onLevel?: (level: number, items: number) => void;
}
type Item = { w: number; count: Set<number> };
export function packageMerge(weights: number[], L: number, hooks: PmHooks = {}): number[] {
  const n = weights.length;
  const base: Item[] = weights
    .map((w, i) => ({ w, count: new Set([i]) }))
    .sort((a, b) => a.w - b.w);
  let list: Item[] = base.map((it) => ({ w: it.w, count: new Set(it.count) }));
  for (let l = 0; l < L - 1; l++) {
    const packed: Item[] = [];
    for (let i = 0; i + 1 < list.length; i += 2)
      packed.push({
        w: list[i]!.w + list[i + 1]!.w,
        count: new Set([...list[i]!.count, ...list[i + 1]!.count]),
      });
    list = [...packed, ...base.map((it) => ({ w: it.w, count: new Set(it.count) }))].sort(
      (a, b) => a.w - b.w,
    );
    hooks.onLevel?.(l, list.length);
  }
  const lens = new Array(n).fill(0);
  const take = list.slice(0, 2 * (n - 1));
  for (const it of take) for (const o of it.count) lens[o]!++;
  return lens;
}
