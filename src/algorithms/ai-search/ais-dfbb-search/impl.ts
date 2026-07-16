export interface DfbbHooks {
  onBind?: (best: number) => void;
  onPrune?: (cost: number) => void;
  onFound?: (cost: number) => void;
}
export interface DfbbProblem {
  weights: number[];
  values: number[];
  capacity: number;
}
export function dfbbSearch(p: DfbbProblem, hooks: DfbbHooks = {}): number {
  let best = 0;
  const dfs = (i: number, w: number, v: number) => {
    if (v > best) {
      best = v;
      hooks.onBind?.(best);
    }
    if (i >= p.weights.length) {
      hooks.onFound?.(v);
      return;
    }
    if (w + p.weights[i]! <= p.capacity) dfs(i + 1, w + p.weights[i]!, v + p.values[i]!);
    const remainVal = p.values.slice(i + 1).reduce((s, x) => s + x, 0);
    if (v + remainVal > best) dfs(i + 1, w, v);
    else hooks.onPrune?.(v);
  };
  dfs(0, 0, 0);
  return best;
}
