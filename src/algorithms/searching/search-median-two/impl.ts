// 两个有序数组中位数 · 纯算法实现
export interface MedianTwoHooks {
  onPartition?: (i: number, j: number) => void;
}

export function medianOfTwoSorted(
  nums1: readonly number[],
  nums2: readonly number[],
  hooks: MedianTwoHooks = {},
): number {
  let A = nums1,
    B = nums2;
  if (A.length > B.length) [A, B] = [B, A];
  const m = A.length,
    n = B.length;
  let lo = 0,
    hi = m,
    half = Math.floor((m + n + 1) / 2);
  while (lo <= hi) {
    const i = (lo + hi) >>> 1;
    const j = half - i;
    hooks.onPartition?.(i, j);
    const aLeft = i === 0 ? -Infinity : A[i - 1]!;
    const aRight = i === m ? Infinity : A[i]!;
    const bLeft = j === 0 ? -Infinity : B[j - 1]!;
    const bRight = j === n ? Infinity : B[j]!;
    if (aLeft <= bRight && bLeft <= aRight) {
      if ((m + n) % 2 === 1) return Math.max(aLeft, bLeft);
      return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
    } else if (aLeft > bRight) hi = i - 1;
    else lo = i + 1;
  }
  return 0;
}
