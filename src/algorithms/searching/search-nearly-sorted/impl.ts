// 近似有序数组查找 · 纯算法实现
export interface NearlySortedHooks {
  onCheck?: (i: number) => void;
}

export function searchNearlySorted(
  arr: readonly number[],
  target: number,
  k: number = 2,
  hooks: NearlySortedHooks = {},
): number {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    const lo = Math.max(0, i - k),
      hi = Math.min(n - 1, i + k);
    for (let j = lo; j <= hi; j++) {
      hooks.onCheck?.(j);
      if (arr[j]! === target) return j;
    }
  }
  return -1;
}
