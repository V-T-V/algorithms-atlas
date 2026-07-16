// =============================================================================
// 0/1 背包（0/1 Knapsack）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 一个物品：重量（占用容量）与价值。 */
export interface KnapsackItem {
  weight: number;
  value: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface KnapsackHooks {
  /** 填好 dp[i][w]。from = 'take'（选了第 i 件）或 'skip'（没选）。 */
  onFillCell?: (i: number, w: number, val: number, from: 'take' | 'skip') => void;
  /** 回溯：标记物品索引 item（0-based）是否被选入。 */
  onBacktrack?: (i: number, w: number, item: number, taken: boolean) => void;
}

/**
 * 0/1 背包：每件物品「取或不取」各一次，求容量限制下最大价值。
 *
 * 状态：`dp[i][w]` = 仅考虑前 `i` 件物品、容量上限为 `w` 时的最大价值。
 * `i ∈ [0..n]`、`w ∈ [0..capacity]`。
 *
 * 转移：
 *   - 不选第 i 件：`dp[i][w] = dp[i-1][w]`
 *   - 选第 i 件（当 `items[i-1].weight <= w`）：
 *     `dp[i][w] = max(dp[i][w], dp[i-1][w - weight] + value)`
 *   - 答案 = `dp[n][capacity]`
 *
 * 回溯：从 `(n, capacity)` 出发，若 `dp[i][w] !== dp[i-1][w]`，说明选了第 i 件，
 * 扣减其重量继续；否则向上走。
 *
 * @param items 物品列表（weight > 0，value >= 0）
 * @param capacity 背包容量（>= 0）
 * @param hooks 可选事件钩子
 * @returns `{ value, chosen }`：最大价值，与被选入物品的 0-based 下标集合（升序）。
 */
export function knapsack01(
  items: readonly KnapsackItem[],
  capacity: number,
  hooks: KnapsackHooks = {},
): { value: number; chosen: number[] } {
  const n = items.length;
  if (n === 0 || capacity <= 0) return { value: 0, chosen: [] };

  // dp 大小 (n+1) x (capacity+1)
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(capacity + 1).fill(0),
  );

  for (let i = 1; i <= n; i++) {
    const { weight, value } = items[i - 1]!;
    for (let w = 0; w <= capacity; w++) {
      let best = dp[i - 1]![w]!; // 不选
      let from: 'take' | 'skip' = 'skip';
      if (weight <= w) {
        const take = dp[i - 1]![w - weight]! + value;
        if (take > best) {
          best = take;
          from = 'take';
        }
      }
      dp[i]![w] = best;
      hooks.onFillCell?.(i, w, best, from);
    }
  }

  // 回溯还原所选物品
  const chosen: number[] = [];
  let w = capacity;
  for (let i = n; i >= 1; i--) {
    const item = items[i - 1]!;
    const taken = dp[i]![w]! !== dp[i - 1]![w]!;
    hooks.onBacktrack?.(i, w, i - 1, taken);
    if (taken) {
      chosen.push(i - 1);
      w -= item.weight;
    }
  }
  chosen.reverse();
  return { value: dp[n]![capacity]!, chosen };
}
