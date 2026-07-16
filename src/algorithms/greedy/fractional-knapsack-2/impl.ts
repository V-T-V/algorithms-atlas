// =============================================================================
// 分数背包（Fractional Knapsack v2）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FractionalKnapsack2Hooks {
  onSort?: (ratios: number[]) => void;
  onTake?: (i: number, fraction: number, value: number) => void;
}

export interface FractionalKnapsack2Result {
  /** 能装入的最大价值。 */
  value: number;
}

export interface Item {
  weight: number;
  value: number;
}

/**
 * 分数背包：物品可切分，按「价值密度」v/w 降序贪心选取。
 * @param items 物品列表（重量、价值）
 * @param capacity 背包容量
 * @param hooks 可选的事件钩子
 */
export function fractionalKnapsack2(
  items: Item[],
  capacity: number,
  hooks: FractionalKnapsack2Hooks = {},
): FractionalKnapsack2Result {
  const order = items
    .map((it, i) => ({ i, ratio: it.value / it.weight, ...it }))
    .sort((a, b) => b.ratio - a.ratio);
  hooks.onSort?.(order.map((o) => o.ratio));

  let remaining = capacity;
  let total = 0;
  for (const o of order) {
    if (remaining <= 0) break;
    const take = Math.min(o.weight, remaining);
    const frac = take / o.weight;
    const got = frac * o.value;
    total += got;
    remaining -= take;
    hooks.onTake?.(o.i, frac, got);
  }
  return { value: total };
}
