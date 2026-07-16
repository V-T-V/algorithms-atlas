// 二分查找（迭代标准）· 纯算法实现
export interface BinIterHooks {
  onCompare?: (mid: number) => void;
}

export function binarySearchIter(
  arr: readonly number[],
  target: number,
  hooks: BinIterHooks = {},
): number {
  let lo = 0,
    hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! === target) return mid;
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
