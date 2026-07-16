// =============================================================================
// 加权中位数（Weighted Median）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过钩子暴露累加过程。
// =============================================================================

/** 加权项。 */
export interface WeightedItem {
  value: number;
  weight: number;
}

/** 事件钩子。 */
export interface WeightedMedianHooks {
  /** 完成排序，给出排序后的项序列。 */
  onSorted?: (items: WeightedItem[]) => void;
  /** 累加到第 idx 项（排序后下标），当前前缀权重 prefix，阈值 half。 */
  onAccumulate?: (idx: number, prefix: number, half: number) => void;
  /** 命中：加权中位数 = value。 */
  onFound?: (value: number) => void;
}

/**
 * 加权中位数：累计权重首次达到总权重一半时的 value。
 *
 * @param items (value, weight) 对数组，weight > 0
 * @param hooks 可选事件钩子
 * @returns 加权中位数的 value
 */
export function weightedMedian(
  items: readonly WeightedItem[],
  hooks: WeightedMedianHooks = {},
): number {
  if (items.length === 0) throw new RangeError('items 不能为空');

  const sorted = [...items].sort((a, b) => a.value - b.value);
  hooks.onSorted?.(sorted);

  let total = 0;
  for (const it of sorted) total += it.weight;
  const half = total / 2;

  let prefix = 0;
  for (let i = 0; i < sorted.length; i++) {
    prefix += sorted[i]!.weight;
    hooks.onAccumulate?.(i, prefix, half);
    if (prefix >= half) {
      const ans = sorted[i]!.value;
      hooks.onFound?.(ans);
      return ans;
    }
  }
  // 理论上不会到达（最后一项 prefix === total >= half）
  const last = sorted[sorted.length - 1]!.value;
  hooks.onFound?.(last);
  return last;
}
