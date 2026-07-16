// 加权中位数（排序法）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过钩子暴露每一步。

export interface Weighted {
  value: number;
  weight: number;
}

/** 事件钩子。 */
export interface WeightedMedianSortHooks {
  /** 排序完成（给出按值升序的元素）。 */
  onSorted?: (sorted: Weighted[]) => void;
  /** 总权重 W。 */
  onTotal?: (total: number, half: number) => void;
  /** 累加到第 i 个元素（含），给出当前前缀和。 */
  onAccumulate?: (index: number, item: Weighted, prefix: number) => void;
  /** 命中加权中位数。 */
  onResult?: (item: Weighted) => void;
}

/**
 * 排序法求加权中位数。
 *
 * @param items 带权元素（权重非负）
 * @param hooks 可选事件钩子
 * @returns 加权中位数（值）
 */
export function weightedMedianSort(
  items: readonly Weighted[],
  hooks: WeightedMedianSortHooks = {},
): number {
  const n = items.length;
  if (n === 0) throw new RangeError('空数组');
  for (const it of items) {
    if (it.weight < 0) throw new RangeError(`权重不能为负: ${it.weight}`);
  }

  const sorted = [...items].sort((a, b) => a.value - b.value);
  hooks.onSorted?.(sorted);

  const total = sorted.reduce((s, x) => s + x.weight, 0);
  const half = total / 2;
  hooks.onTotal?.(total, half);

  let prefix = 0;
  for (let i = 0; i < n; i++) {
    prefix += sorted[i]!.weight;
    hooks.onAccumulate?.(i, sorted[i]!, prefix);
    if (prefix >= half) {
      hooks.onResult?.(sorted[i]!);
      return sorted[i]!.value;
    }
  }
  // 理论不可达（最后一个必命中），兜底
  hooks.onResult?.(sorted[n - 1]!);
  return sorted[n - 1]!.value;
}
