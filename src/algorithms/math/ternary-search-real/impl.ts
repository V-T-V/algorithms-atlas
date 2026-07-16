// =============================================================================
// 三分查找 Ternary Search · 纯算法实现
// 在单峰（凸/凹）函数上求极值。零 DOM 依赖，可独立单测。
// 通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 一元函数类型。 */
export type RealFn = (x: number) => number;

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface TernarySearchHooks {
  /** 一次三分：取两个探针 m1, m2 并比较 f(m1), f(m2)。 */
  onProbe?: (lo: number, hi: number, m1: number, m2: number, f1: number, f2: number) => void;
  /** 根据比较结果缩小区间 [lo, hi]。 */
  onShrink?: (lo: number, hi: number, reason: string) => void;
  /** 完成，给出极值点 x* 与极值 f(x*)。 */
  onDone?: (x: number, fx: number, iterations: number) => void;
}

/**
 * 三分查找（实数版）：在 `[lo, hi]` 上求**单峰**函数 `f` 的极值。
 *
 * 原理：取两个内点 `m1 = lo + (hi−lo)/3`、`m2 = hi − (hi−lo)/3`，比较 `f(m1)` 与 `f(m2)`：\n
 *   - 求**极大值**（findMax=true，默认）：\n
 *     若 `f(m1) < f(m2)`，极值在右侧 → `lo = m1`；否则 `hi = m2`\n
 *   - 求**极小值**（findMax=false）：\n
 *     若 `f(m1) > f(m2)`，极值在右侧 → `lo = m1`；否则 `hi = m2`\n
 * 反复缩小区间直到 `|hi − lo| < eps`，返回中点。\n
 *
 * 复杂度：每轮区间缩小为原来的 2/3，故 `O(log_{1.5}((hi−lo)/eps))` 次求值。\n
 *
 * @param f 单峰函数
 * @param lo 区间下界
 * @param hi 区间上界（hi > lo）
 * @param eps 终止精度（默认 1e-7）
 * @param findMax true 求极大，false 求极小（默认 true）
 * @param maxIter 最大迭代次数保护（默认 1000）
 * @returns `{ x, fx, iterations }`
 */
export function ternarySearch(
  f: RealFn,
  lo: number,
  hi: number,
  hooks: TernarySearchHooks = {},
  eps = 1e-7,
  findMax = true,
  maxIter = 1000,
): { x: number; fx: number; iterations: number } {
  if (!(hi > lo)) throw new RangeError('ternarySearch: require hi > lo');
  let l = lo;
  let r = hi;
  let it = 0;
  while (r - l > eps && it < maxIter) {
    const m1 = l + (r - l) / 3;
    const m2 = r - (r - l) / 3;
    const f1 = f(m1);
    const f2 = f(m2);
    hooks.onProbe?.(l, r, m1, m2, f1, f2);
    let reason: string;
    if (findMax) {
      if (f1 < f2) {
        l = m1;
        reason = `f(m1)=${f1.toFixed(4)} < f(m2)=${f2.toFixed(4)}，极值在右，lo=m1`;
      } else {
        r = m2;
        reason = `f(m1)=${f1.toFixed(4)} ≥ f(m2)=${f2.toFixed(4)}，极值在左，hi=m2`;
      }
    } else {
      if (f1 > f2) {
        l = m1;
        reason = `f(m1)=${f1.toFixed(4)} > f(m2)=${f2.toFixed(4)}，极小值在右，lo=m1`;
      } else {
        r = m2;
        reason = `f(m1)=${f1.toFixed(4)} ≤ f(m2)=${f2.toFixed(4)}，极小值在左，hi=m2`;
      }
    }
    hooks.onShrink?.(l, r, reason);
    it++;
  }
  const x = (l + r) / 2;
  const fx = f(x);
  hooks.onDone?.(x, fx, it);
  return { x, fx, iterations: it };
}

/**
 * 离散三分：在升序整数下标 `[lo, hi]` 上的单峰数组中找极大值下标。
 * 用整数二分比较 `f(mid)` 与 `f(mid+1)` 实现，复杂度 `O(log n)`。
 *
 * @param arr 单峰数组（先严格增后严格减，或单调）
 * @returns 极大值元素的下标
 */
export function ternarySearchDiscrete(
  arr: readonly number[],
  hooks: TernarySearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) throw new RangeError('ternarySearchDiscrete: empty array');
  let lo = 0;
  let hi = n - 1;
  let it = 0;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const f1 = arr[mid]!;
    const f2 = arr[mid + 1]!;
    hooks.onProbe?.(lo, hi, mid, mid + 1, f1, f2);
    let reason: string;
    if (f1 < f2) {
      lo = mid + 1;
      reason = `arr[${mid}]=${f1} < arr[${mid + 1}]=${f2}，峰值在右`;
    } else {
      hi = mid;
      reason = `arr[${mid}]=${f1} ≥ arr[${mid + 1}]=${f2}，峰值在左`;
    }
    hooks.onShrink?.(lo, hi, reason);
    it++;
  }
  hooks.onDone?.(lo, arr[lo]!, it);
  return lo;
}
