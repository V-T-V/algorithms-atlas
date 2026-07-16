export interface BnbHooks {
  onBind?: (best: number) => void;
  onVisit?: (node: number, cost: number, bound: number) => void;
  onPrune?: (node: number, bound: number) => void;
}
export interface BnbProblem {
  items: Array<{ weight: number; value: number }>;
  capacity: number;
}
export function bnbSearch(p: BnbProblem, hooks: BnbHooks = {}): number {
  const n = p.items.length;
  const order = [...p.items]
    .map((it, i) => ({ i, ratio: it.value / it.weight }))
    .sort((a, b) => b.ratio - a.ratio);
  let best = 0;
  const ub = (idx: number, cap: number, val: number): number => {
    let b = val;
    let c = cap;
    for (let k = idx; k < n; k++) {
      const it = p.items[order[k]!.i]!;
      if (c >= it.weight) {
        c -= it.weight;
        b += it.value;
      } else {
        b += it.value * (c / it.weight);
        break;
      }
    }
    return b;
  };
  const dfs = (idx: number, cap: number, val: number) => {
    if (val > best) {
      best = val;
      hooks.onBind?.(best);
    }
    if (idx >= n) return;
    const it = p.items[order[idx]!.i]!;
    const bound = ub(idx, cap, val);
    hooks.onVisit?.(order[idx]!.i, val, bound);
    if (bound <= best) {
      hooks.onPrune?.(order[idx]!.i, bound);
      return;
    }
    if (cap >= it.weight) dfs(idx + 1, cap - it.weight, val + it.value);
    dfs(idx + 1, cap, val);
  };
  dfs(0, p.capacity, 0);
  return best;
}
