// =============================================================================
// LIS 二分（patience sorting）· 纯算法实现
// tails[k] = 长度为 k+1 的递增子序列的最小结尾；每元素做一次二分。
// =============================================================================

export interface LisBinHooks {
  onScan?: (x: number, i: number) => void;
  onProbe?: (x: number, lo: number, hi: number, mid: number, tailsMid: number) => void;
  onPlace?: (x: number, pos: number, tails: readonly number[]) => void;
  onDone?: (len: number, tails: readonly number[]) => void;
}

export function lisLength(nums: readonly number[], hooks: LisBinHooks = {}): number {
  const n = nums.length;
  const tails: number[] = [];
  for (let i = 0; i < n; i++) {
    const x = nums[i]!;
    hooks.onScan?.(x, i);
    // 二分找第一个 tails[k] >= x
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const tm = tails[mid]!;
      hooks.onProbe?.(x, lo, hi, mid, tm);
      if (tm >= x) hi = mid;
      else lo = mid + 1;
    }
    if (lo === tails.length) tails.push(x);
    else tails[lo] = x;
    hooks.onPlace?.(x, lo, tails);
  }
  hooks.onDone?.(tails.length, tails);
  return tails.length;
}
