// =============================================================================
// 完全背包（Complete Knapsack）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 与 0/1 背包的区别：每件物品可选**任意多次**（无限件）。
// =============================================================================

/** 一个物品：重量与价值。 */
export interface KnapsackItem {
  weight: number;
  value: number;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface KnapsackCompleteHooks {
  /** 填好 dp[i][w]。from = 'take'（选了第 i 件，可重复）或 'skip'（没选）。 */
  onFillCell?: (i: number, w: number, val: number, from: 'take' | 'skip') => void;
}

/** 结果。 */
export interface KnapsackCompleteResult {
  /** 最大价值。 */
  value: number;
  /** 完整 dp 表 (n+1) x (capacity+1)。 */
  dp: number[][];
}

/**
 * 完全背包：每件物品可选任意多次，求容量限制下最大价值。
 *
 * 状态：`dp[i][w]` = 仅考虑前 `i` 件物品、容量上限 `w` 时的最大价值。
 *
 * 转移：
 *   - 不选第 i 件：`dp[i][w] = dp[i-1][w]`
 *   - 选第 i 件（当 `weight <= w`，**可重复**，故从同层 `dp[i][w-weight]` 转移）：
 *     `dp[i][w] = max(dp[i][w], dp[i][w-weight] + value)`
 *   - 答案 = `dp[n][capacity]`
 *
 * 与 0/1 背包唯一区别：选物品时从 `dp[i]`（同层）而非 `dp[i-1]` 转移，从而允许重复取。
 * 也可滚动为一维 `dp[w]`，内层正序遍历 w。复杂度 `O(n·capacity)`。
 *
 * @param items 物品列表（weight > 0，value >= 0）
 * @param capacity 背包容量（>= 0）
 * @param hooks 可选事件钩子
 */
export function knapsackComplete(
  items: readonly KnapsackItem[],
  capacity: number,
  hooks: KnapsackCompleteHooks = {},
): KnapsackCompleteResult {
  const n = items.length;
  if (n === 0 || capacity <= 0) {
    const dp = Array.from({ length: n + 1 }, () => new Array<number>(capacity + 1).fill(0));
    return { value: 0, dp };
  }

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(capacity + 1).fill(0),
  );

  for (let i = 1; i <= n; i++) {
    const { weight, value } = items[i - 1]!;
    for (let w = 0; w <= capacity; w++) {
      let best = dp[i - 1]![w]!; // 不选第 i 件
      let from: 'take' | 'skip' = 'skip';
      if (weight <= w) {
        // 选第 i 件（可重复）：从同层 dp[i][w-weight] 转移
        const take = dp[i]![w - weight]! + value;
        if (take > best) {
          best = take;
          from = 'take';
        }
      }
      dp[i]![w] = best;
      hooks.onFillCell?.(i, w, best, from);
    }
  }

  return { value: dp[n]![capacity]!, dp };
}

/**
 * 从一维最优 dp 回溯各物品选取次数（用于展示）。count[i] = 第 i 件被选次数。
 * 在二维 dp 上回溯：若 dp[i][w] != dp[i-1][w]，说明选了第 i 件，扣除一件重量继续在同层。
 */
export function reconstructCounts(
  items: readonly KnapsackItem[],
  capacity: number,
  dp: number[][],
): number[] {
  const n = items.length;
  const counts = new Array<number>(n).fill(0);
  let w = capacity;
  let i = n;
  while (i >= 1 && w > 0) {
    if (dp[i]![w]! !== dp[i - 1]![w]!) {
      counts[i - 1]!++;
      w -= items[i - 1]!.weight;
    } else {
      i--;
    }
  }
  return counts;
}
