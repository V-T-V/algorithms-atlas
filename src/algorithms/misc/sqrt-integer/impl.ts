// 整数平方根（牛顿法）· 纯算法实现

/** 事件钩子。 */
export interface SqrtIntegerHooks {
  /** 第 iter 次迭代：当前估计 x。 */
  onIter?: (iter: number, x: number) => void;
  /** 收敛。 */
  onConverge?: (iter: number, root: number) => void;
  /** 最终结果。 */
  onResult?: (n: number, root: number) => void;
}

/**
 * 整数平方根（牛顿法）：返回 floor(√n)。
 * @param n 非负整数
 */
export function integerSqrt(n: number, hooks: SqrtIntegerHooks = {}): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('n must be a non-negative integer');
  }
  if (n < 2) {
    hooks.onResult?.(n, n);
    return n;
  }
  // 初值取一个上界估计（避免初值偏低导致发散）
  let x = n;
  let iter = 0;
  // 牛顿迭代：x ← (x + n/x) / 2，整除
  // 当 x 的下一估计 >= x 时停止（此时 x 已是 floor(√n) 或 floor(√n)+1）
  while (true) {
    iter++;
    const next = Math.floor((x + Math.floor(n / x)) / 2);
    hooks.onIter?.(iter, next);
    if (next >= x) {
      hooks.onConverge?.(iter, x);
      break;
    }
    x = next;
  }
  // 直接校正：保证 x*x <= n < (x+1)^2
  while (x * x > n) x--;
  while ((x + 1) * (x + 1) <= n) x++;
  hooks.onResult?.(n, x);
  return x;
}

/**
 * 二分法整数平方根（更直观、用于校验）。
 */
export function integerSqrtBinary(n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new RangeError('n must be a non-negative integer');
  if (n < 2) return n;
  let lo = 1;
  let hi = Math.floor(n / 2) + 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const sq = mid * mid;
    if (sq === n) return mid;
    if (sq < n) lo = mid + 1;
    else hi = mid - 1;
  }
  return hi;
}
