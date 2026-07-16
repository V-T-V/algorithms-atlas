// =============================================================================
// 整数平方根（Integer Square Root）· 纯算法实现
// 用二分求 floor(sqrt(x))，O(log x)。零 DOM 依赖，可独立单测。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SqrtIntHooks {
  /** 在 [lo,hi] 区间探测中点 mid，比较 mid*mid 与 x。 */
  onProbe?: (lo: number, hi: number, mid: number, cmp: 'less' | 'equal' | 'greater') => void;
  /** 区间收缩。 */
  onShrink?: (lo: number, hi: number, dir: 'left' | 'right') => void;
  /** 计算完成。 */
  onDone?: (root: number) => void;
}

/**
 * 求 floor(sqrt(x))（非负整数的整数平方根）。
 * @param x 非负整数
 * @returns 不超过 sqrt(x) 的最大整数
 */
export function sqrtInt(x: number, hooks: SqrtIntHooks = {}): number {
  if (x < 0 || !Number.isInteger(x)) {
    hooks.onDone?.(NaN);
    return NaN;
  }
  if (x < 2) {
    hooks.onDone?.(x);
    return x;
  }
  let lo = 1;
  let hi = x >> 1;
  let ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const sq = mid * mid;
    let cmp: 'less' | 'equal' | 'greater';
    if (sq === x) {
      cmp = 'equal';
      hooks.onProbe?.(lo, hi, mid, cmp);
      hooks.onDone?.(mid);
      return mid;
    } else if (sq < x) {
      cmp = 'less';
      ans = mid;
      lo = mid + 1;
      hooks.onProbe?.(lo - 1, hi, mid, cmp);
      hooks.onShrink?.(lo, hi, 'right');
    } else {
      cmp = 'greater';
      hi = mid - 1;
      hooks.onProbe?.(lo, hi + 1, mid, cmp);
      hooks.onShrink?.(lo, hi, 'left');
    }
  }
  hooks.onDone?.(ans);
  return ans;
}
