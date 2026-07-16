// =============================================================================
// 分糖果 Candy · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 135）：N 个孩子站成一排，评分 ratings[]，
// 每人至少 1 颗糖；相邻孩子评分高的必须拿到更多。求最少糖果总数。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface CandyHooks {
  /** 从左扫描时确定位置 i 的糖果数。 */
  onLeftPass?: (i: number, value: number) => void;
  /** 从右扫描时确定位置 i 的最终糖果数（取两次扫描的最大值）。 */
  onRightPass?: (i: number, value: number) => void;
  /** 算法完成：最少糖果总数。 */
  onDone?: (total: number) => void;
}

/**
 * 分糖果（LeetCode 135）。
 *
 * 双向贪心：每人先发 1 颗。
 *   - 左→右：若 `r[i] > r[i-1]`，则 `candy[i] = candy[i-1] + 1`（满足「比左边高分者拿更多」）
 *   - 右→左：若 `r[i] > r[i+1]`，则 `candy[i] = max(candy[i], candy[i+1] + 1)`
 *
 * 两次扫描后即满足左右两侧约束，且总量最少。等价于求每个位置的「最长上升/下降台阶」。
 *
 * 时间 `O(n)`，空间 `O(n)`。
 *
 * @param ratings 评分数组（任意整数）
 * @returns 每个孩子分到的糖果数（数组）
 */
export function candy(ratings: readonly number[], hooks: CandyHooks = {}): number[] {
  const n = ratings.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return [];
  }
  const candies = new Array<number>(n).fill(1);

  // 左→右
  for (let i = 1; i < n; i++) {
    if (ratings[i]! > ratings[i - 1]!) candies[i] = candies[i - 1]! + 1;
    hooks.onLeftPass?.(i, candies[i]!);
  }

  // 右→左
  let _total = candies[0]!;
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i]! > ratings[i + 1]!) candies[i] = Math.max(candies[i]!, candies[i + 1]! + 1);
    hooks.onRightPass?.(i, candies[i]!);
    _total += candies[i]!;
  }
  // 末尾元素的右扫没有触发回调，补上
  hooks.onRightPass?.(n - 1, candies[n - 1]!);

  const sum = candies.reduce((a, b) => a + b, 0);
  hooks.onDone?.(sum);
  return candies;
}
