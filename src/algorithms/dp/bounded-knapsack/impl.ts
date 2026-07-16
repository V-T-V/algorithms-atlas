// =============================================================================
// 有界背包 Bounded Knapsack（多重背包）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 每件物品有重量、价值与最多可选件数 count，求容量限制下的最大价值。
// 采用「二进制分组」把多重背包转为 0/1 背包。
// =============================================================================

/** 一个物品：重量、价值、最多可选件数（≥1）。 */
export interface BoundedItem {
  weight: number;
  value: number;
  count: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface BoundedKnapsackHooks {
  /** 把物品 i 拆成若干「二进制组」(packWeight, packValue)。 */
  onSplit?: (itemIdx: number, groupIdx: number, packWeight: number, packValue: number) => void;
  /** 处理一个二进制组，在容量 w 处更新候选值 val。 */
  onPackUpdate?: (w: number, val: number) => void;
  /** 算法完成：最大价值。 */
  onDone?: (value: number) => void;
}

/**
 * 有界（多重）背包：每件物品 `i` 可选 `0..count[i]` 次，求容量上限下最大价值。
 *
 * **二进制分组优化**：把 `count[i]` 件同种物品拆成大小为 `1, 2, 4, ..., 2^k, r` 的若干「打包组」
 * （`r` 为剩余），这样用 `O(log count[i])` 个 0/1 物品即可表示「取 0..count[i] 件」的任意数量（二进制组合）。
 * 再对全体打包组跑 0/1 背包（滚动数组、容量倒序）。
 *
 * 时间 `O(W · Σlog count[i])`（W = capacity），空间 `O(W)`。
 *
 * @param items 物品列表（weight>0, value≥0, count≥1）
 * @param capacity 容量（≥0）
 * @returns 最大价值
 */
export function boundedKnapsack(
  items: readonly BoundedItem[],
  capacity: number,
  hooks: BoundedKnapsackHooks = {},
): number {
  if (capacity <= 0 || items.length === 0) {
    hooks.onDone?.(0);
    return 0;
  }

  const dp = new Array<number>(capacity + 1).fill(0);

  for (let idx = 0; idx < items.length; idx++) {
    const { weight, value, count } = items[idx]!;
    let remain = count;
    let groupIdx = 0;
    for (let size = 1; size <= remain; size <<= 1) {
      remain -= size;
      const pw = weight * size;
      const pv = value * size;
      hooks.onSplit?.(idx, groupIdx++, pw, pv);
      // 0/1 背包：容量倒序
      for (let w = capacity; w >= pw; w--) {
        const cand = dp[w - pw]! + pv;
        if (cand > dp[w]!) {
          dp[w] = cand;
          hooks.onPackUpdate?.(w, cand);
        }
      }
    }
    if (remain > 0) {
      const pw = weight * remain;
      const pv = value * remain;
      hooks.onSplit?.(idx, groupIdx, pw, pv);
      for (let w = capacity; w >= pw; w--) {
        const cand = dp[w - pw]! + pv;
        if (cand > dp[w]!) {
          dp[w] = cand;
          hooks.onPackUpdate?.(w, cand);
        }
      }
    }
  }

  hooks.onDone?.(dp[capacity]!);
  return dp[capacity]!;
}
