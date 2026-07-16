// =============================================================================
// 粉刷房子 · 纯算法实现
// =============================================================================
export interface PaintHooks {
  onHouse?: (i: number, costs: number[]) => void;
  onDone?: (min: number) => void;
}

export function paintHouse(costs: readonly (readonly number[])[], hooks: PaintHooks = {}): number {
  if (costs.length === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  let prev = [...costs[0]!];
  for (let i = 1; i < costs.length; i++) {
    const cur = new Array<number>(3).fill(0);
    for (let c = 0; c < 3; c++) {
      const other = prev.filter((_, k) => k !== c);
      cur[c] = costs[i]![c]! + Math.min(...other);
    }
    prev = cur;
    hooks.onHouse?.(i, cur);
  }
  const ans = Math.min(...prev);
  hooks.onDone?.(ans);
  return ans;
}
