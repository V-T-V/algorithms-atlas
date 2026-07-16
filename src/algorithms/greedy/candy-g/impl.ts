// =============================================================================
// 分糖果（Candy, 贪心版）· 纯算法实现
// 左右两遍扫描：先满足左规则，再满足右规则。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface CandyGHooks {
  /** 左→右扫描，确定 candies[i]（满足左规则）。 */
  onLeftPass?: (i: number, candies: number[]) => void;
  /** 右→左扫描，更新 candies[i]（满足右规则）。 */
  onRightPass?: (i: number, candies: number[]) => void;
  /** 结论：糖果总数。 */
  onConclude?: (total: number) => void;
}

export interface CandyGResult {
  /** 最少糖果总数。 */
  total: number;
  /** 每个孩子的糖果数。 */
  candies: number[];
}

/**
 * 分糖果：求最少糖果总数（贪心两遍扫描）。
 *
 * @param ratings 每个孩子的评分
 * @param hooks 可选事件钩子
 */
export function candy(ratings: readonly number[], hooks: CandyGHooks = {}): CandyGResult {
  const n = ratings.length;
  if (n === 0) return { total: 0, candies: [] };
  const candies: number[] = new Array<number>(n).fill(1);
  // 左→右
  for (let i = 1; i < n; i++) {
    if (ratings[i]! > ratings[i - 1]!) {
      candies[i] = candies[i - 1]! + 1;
    }
    hooks.onLeftPass?.(i, [...candies]);
  }
  // 右→左
  for (let i = n - 2; i >= 0; i--) {
    if (ratings[i]! > ratings[i + 1]!) {
      candies[i] = Math.max(candies[i]!, candies[i + 1]! + 1);
    }
    hooks.onRightPass?.(i, [...candies]);
  }
  const total = candies.reduce((a, b) => a + b, 0);
  hooks.onConclude?.(total);
  return { total, candies };
}
