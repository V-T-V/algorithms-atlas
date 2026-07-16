// 二分查找（最右命中）· 纯算法实现
export interface BinRightHooks {
  onCompare?: (mid: number) => void;
}

export function binarySearchRightmost(
  arr: readonly number[],
  target: number,
  hooks: BinRightHooks = {},
): number {
  let lo = 0,
    hi = arr.length - 1,
    ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! === target) {
      ans = mid;
      lo = mid + 1;
    } else if (arr[mid]! < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return ans;
}
