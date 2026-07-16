// =============================================================================
// 破界贪心（0-1 背包 LP 上界）· 纯算法实现
// 按价值密度降序，整件装入，最后一件按分数取，得到整数解的上界。
// =============================================================================
export interface Item {
  weight: number;
  value: number;
}

export interface GreedyBreakingBoundHooks {
  onTakeWhole?: (itemIndex: number, remaining: number) => void;
  onTakeFraction?: (itemIndex: number, fraction: number, bound: number) => void;
  onConclude?: (bound: number) => void;
}

export function greedyBreakingBound(
  items: readonly Item[],
  capacity: number,
  hooks: GreedyBreakingBoundHooks = {},
): number {
  const sorted = items
    .map((it, i) => ({ ...it, idx: i }))
    .sort((a, b) => b.value / b.weight - a.value / a.weight);

  let remaining = capacity;
  let bound = 0;
  for (const it of sorted) {
    if (remaining <= 0) break;
    if (it.weight <= remaining) {
      bound += it.value;
      hooks.onTakeWhole?.(it.idx, remaining);
      remaining -= it.weight;
    } else {
      const fraction = remaining / it.weight;
      bound += it.value * fraction;
      hooks.onTakeFraction?.(it.idx, fraction, bound);
      remaining = 0;
      break;
    }
  }
  hooks.onConclude?.(bound);
  return bound;
}
