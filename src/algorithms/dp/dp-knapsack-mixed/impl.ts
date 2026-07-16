// =============================================================================
// 混合背包 · 纯算法实现
// =============================================================================

/** 物品类型。 */
export type ItemType = '01' | 'complete' | 'bounded';

export interface MixedItem {
  weight: number;
  value: number;
  type: ItemType;
  /** bounded 类型最多取多少件。01 视为 count=1。 */
  count: number;
}

export interface MixedKnapsackHooks {
  onItem?: (idx: number, item: MixedItem) => void;
  onUpdate?: (cap: number, val: number) => void;
  onDone?: (best: number) => void;
}

export function mixedKnapsack(
  items: readonly MixedItem[],
  capacity: number,
  hooks: MixedKnapsackHooks = {},
): number {
  const dp = new Array<number>(capacity + 1).fill(0);
  for (let idx = 0; idx < items.length; idx++) {
    const it = items[idx]!;
    hooks.onItem?.(idx, it);
    if (it.type === 'complete') {
      // 完全背包：正序
      for (let c = it.weight; c <= capacity; c++) {
        const cand = dp[c - it.weight]! + it.value;
        if (cand > dp[c]!) dp[c] = cand;
        hooks.onUpdate?.(c, dp[c]!);
      }
    } else {
      // 0/1 或多重：二进制拆分
      let remain = it.type === '01' ? 1 : Math.max(0, it.count);
      let k = 1;
      while (remain > 0) {
        const take = Math.min(k, remain);
        remain -= take;
        const w = take * it.weight;
        const v = take * it.value;
        // 倒序 0/1 转移
        for (let c = capacity; c >= w; c--) {
          const cand = dp[c - w]! + v;
          if (cand > dp[c]!) dp[c] = cand;
          hooks.onUpdate?.(c, dp[c]!);
        }
        k <<= 1;
      }
    }
  }
  const ans = dp[capacity]!;
  hooks.onDone?.(ans);
  return ans;
}
