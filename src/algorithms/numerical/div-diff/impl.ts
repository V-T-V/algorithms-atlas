// =============================================================================
// 差商（Divided Difference）· 纯算法实现（零 DOM 依赖，可独立单测）
// 计算牛顿插值所需的差商表，返回对角线系数 [f[x0], f[x0,x1], …, f[x0,…,xn]]。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DivDiffHooks {
  /** 每填入一个差商表单元后触发：起始下标 i、阶数 k、值。 */
  onCell?: (i: number, k: number, value: number) => void;
}

/**
 * 计算差商表的「对角线」系数，用于牛顿插值多项式：
 * `N(x) = f[x0] + f[x0,x1]·(x−x0) + f[x0,x1,x2]·(x−x0)(x−x1) + …`
 *
 * 递推定义：
 * - 0 阶：`f[xi] = yi`
 * - k 阶：`f[xi,…,xi+k] = (f[xi+1,…,xi+k] − f[xi,…,xi+k−1]) / (x[i+k] − x[i])`
 *
 * 实现用一维数组 `coef` 原地演化：初始 `coef[i] = y[i]`，
 * 对每一阶 k（从 1 到 n−1），从后往前更新：
 * `coef[i] = (coef[i+1] − coef[i]) / (x[i+k] − x[i])`
 *
 * 最终 `coef[0..n-1]` 即对角线差商 `f[x0], f[x0,x1], …`。
 *
 * 要求：节点 x 互不相同；长度 n ≥ 1。否则抛错。
 *
 * 时间复杂度 `O(n²)`，空间 `O(n)`（原地复用 coef）。
 *
 * @param xs 节点 x 坐标（互不相同）
 * @param ys 节点 y 值（与 xs 等长）
 * @param hooks 可选的事件钩子
 */
export function divDiff(
  xs: readonly number[],
  ys: readonly number[],
  hooks: DivDiffHooks = {},
): number[] {
  if (xs.length !== ys.length) {
    throw new Error('xs 与 ys 长度必须相等');
  }
  const n = xs.length;
  if (n === 0) return [];
  const coef = [...ys];
  // 0 阶单元
  for (let i = 0; i < n; i++) hooks.onCell?.(i, 0, coef[i]!);
  for (let k = 1; k < n; k++) {
    for (let i = n - 1; i >= k; i--) {
      const denom = xs[i]! - xs[i - k]!;
      if (denom === 0) throw new Error('节点 x 必须互不相同');
      coef[i] = (coef[i]! - coef[i - 1]!) / denom;
      hooks.onCell?.(i, k, coef[i]!);
    }
  }
  // 对角线：coef[0..n-1]，但原第 k 阶对角元素现在存在 coef[k] 处（因为是从后往前更新）
  // 由于上面从后往前更新，最终 coef[k] 正好是 f[x0,...,xk]
  return coef.slice(0, n);
}
