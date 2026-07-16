// 旋转数组查找（无重复）· 纯算法实现
export interface Rotate2Hooks {
  onCompare?: (mid: number) => void;
}

export function searchRotated2(
  arr: readonly number[],
  target: number,
  hooks: Rotate2Hooks = {},
): number {
  let lo = 0,
    hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! === target) return mid;
    if (arr[lo]! <= arr[mid]!) {
      if (arr[lo]! <= target && target < arr[mid]!) hi = mid - 1;
      else lo = mid + 1;
    } else {
      if (arr[mid]! < target && target <= arr[hi]!) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}
