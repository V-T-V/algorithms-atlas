// 查找插入位置 · 纯算法实现
export interface Insert2Hooks {
  onCompare?: (mid: number) => void;
}

export function searchInsert2(
  arr: readonly number[],
  target: number,
  hooks: Insert2Hooks = {},
): number {
  let lo = 0,
    hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}
