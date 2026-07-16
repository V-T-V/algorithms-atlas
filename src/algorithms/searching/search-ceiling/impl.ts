// 查找天花板值 · 纯算法实现
export interface CeilingHooks {
  onCompare?: (mid: number) => void;
}

export function findCeiling(
  arr: readonly number[],
  target: number,
  hooks: CeilingHooks = {},
): number {
  let lo = 0,
    hi = arr.length - 1,
    ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! >= target) {
      ans = mid;
      hi = mid - 1;
    } else lo = mid + 1;
  }
  return ans;
}
