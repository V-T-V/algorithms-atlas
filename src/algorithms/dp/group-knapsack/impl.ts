// =============================================================================
// 分组背包 Group Knapsack · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 物品分为若干组，每组至多选一件，求容量限制下最大价值。
// =============================================================================

/** 一个物品：重量、价值。 */
export interface GKItem {
  weight: number;
  value: number;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface GroupKnapsackHooks {
  /** 开始处理第 g 组。 */
  onGroup?: (g: number) => void;
  /** 在第 g 组内、容量 w 处，用物品（wItem,vItem）更新候选值 val。 */
  onPick?: (g: number, w: number, wItem: number, vItem: number, val: number) => void;
  /** 算法完成：最大价值。 */
  onDone?: (value: number) => void;
}

/**
 * 分组背包：物品划分为若干组，每组**至多选一件**，求容量 `W` 下最大价值。
 *
 * 滚动 DP：`dp[w]` = 当前已处理若干组、容量 `w` 下的最大价值。
 *   - 对每组：用一份上一状态的副本 `prev`，再对组内每件物品 `(wi, vi)`、容量**正序**枚举：
 *     `dp[w] = max(dp[w], prev[w - wi] + vi)`（用 prev 而非 dp，保证同组至多取一件）
 *   - 「不取本组任一件」天然保留（dp[w] 不变）
 *
 * 时间 `O(W · Σ|组内件数|) = O(W·n)`，空间 `O(W)`。
 *
 * @param groups 各组的物品列表
 * @param capacity 容量
 * @returns 最大价值
 */
export function groupKnapsack(
  groups: readonly (readonly GKItem[])[],
  capacity: number,
  hooks: GroupKnapsackHooks = {},
): number {
  if (capacity <= 0 || groups.length === 0) {
    hooks.onDone?.(0);
    return 0;
  }

  const dp = new Array<number>(capacity + 1).fill(0);

  for (let g = 0; g < groups.length; g++) {
    hooks.onGroup?.(g);
    const prev = [...dp]; // 上一组结束时的状态
    for (const item of groups[g]!) {
      const { weight: wi, value: vi } = item;
      for (let w = capacity; w >= wi; w--) {
        if (prev[w - wi]! + vi > dp[w]!) {
          dp[w] = prev[w - wi]! + vi;
          hooks.onPick?.(g, w, wi, vi, dp[w]!);
        }
      }
    }
  }

  hooks.onDone?.(dp[capacity]!);
  return dp[capacity]!;
}
