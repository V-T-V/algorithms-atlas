// =============================================================================
// 区间按位与（Bitwise AND of Range）· 纯算法实现
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface AndRangeHooks {
  /** 每次右移一步（消去一位不同位），给出当前 shift 量。 */
  onShift?: (shift: number, left: number, right: number) => void;
  /** 完成。 */
  onDone?: (result: number) => void;
}

/**
 * 区间按位与：left & (left+1) & ... & right。
 *
 * @param left 区间左端（>= 0）
 * @param right 区间右端（>= left）
 * @param hooks 可选的事件钩子
 */
export function rangeBitwiseAnd(left: number, right: number, hooks: AndRangeHooks = {}): number {
  if (left < 0 || right < left)
    throw new RangeError(`要求 0 <= left <= right，收到 left=${left}, right=${right}`);
  let shift = 0;
  let l = left;
  let r = right;
  while (l < r) {
    l = Math.floor(l / 2); // 等价于 l >>= 1，支持安全大整数
    r = Math.floor(r / 2);
    shift++;
    hooks.onShift?.(shift, l, r);
  }
  const result = l << shift;
  hooks.onDone?.(result);
  return result;
}

/** 朴素版（O(n)），用于测试对照。 */
export function rangeBitwiseAndNaive(left: number, right: number): number {
  let acc = left;
  for (let v = left + 1; v <= right; v++) acc &= v;
  return acc;
}

/** 把非负整数格式化为二进制字符串。 */
export function toBinaryString(n: number): string {
  if (n === 0) return '0';
  let s = '';
  let x = n;
  while (x > 0) {
    s = (x & 1) + s;
    x = Math.floor(x / 2);
  }
  return s;
}
