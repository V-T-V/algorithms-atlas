// =============================================================================
// 救生艇 · 纯算法实现 (LeetCode 881)
// 排序 + 双指针。
// =============================================================================
export interface GreedyBoatsLifeHooks {
  onPair?: (light: number, heavy: number, together: boolean) => void;
  onConclude?: (boats: number) => void;
}

export function greedyBoatsLife(
  people: readonly number[],
  limit: number,
  hooks: GreedyBoatsLifeHooks = {},
): number {
  const sorted = [...people].sort((a, b) => a - b);
  let lo = 0;
  let hi = sorted.length - 1;
  let boats = 0;
  while (lo <= hi) {
    if (lo < hi && sorted[lo]! + sorted[hi]! <= limit) {
      hooks.onPair?.(sorted[lo]!, sorted[hi]!, true);
      lo++;
    } else {
      hooks.onPair?.(lo === hi ? sorted[lo]! : -1, sorted[hi]!, false);
    }
    hi--;
    boats++;
  }
  hooks.onConclude?.(boats);
  return boats;
}
