// =============================================================================
// 最大单元数 · 纯算法实现 (LeetCode 1710)
// boxTypes[i] = [数量, 每箱单元数]。truckSize 为箱子上限。
// =============================================================================
export interface GreedyMaxUnitsHooks {
  onPick?: (typeIndex: number, count: number, unitsPerBox: number) => void;
  onConclude?: (totalUnits: number) => void;
}

export function greedyMaxUnits(
  boxTypes: ReadonlyArray<readonly [number, number]>,
  truckSize: number,
  hooks: GreedyMaxUnitsHooks = {},
): number {
  const sorted = [...boxTypes].sort((a, b) => b[1] - a[1]);
  let remaining = truckSize;
  let total = 0;
  for (const [count, units] of sorted) {
    if (remaining <= 0) break;
    const take = Math.min(count, remaining);
    total += take * units;
    hooks.onPick?.(sorted.indexOf([count, units] as readonly [number, number]), take, units);
    remaining -= take;
  }
  hooks.onConclude?.(total);
  return total;
}
