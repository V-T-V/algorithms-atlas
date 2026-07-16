// 三分查找 · 纯算法实现
export interface Ternary2Hooks {
  onCompare?: (mid: number) => void;
}

export function ternarySearch2(
  arr: readonly number[],
  target: number,
  hooks: Ternary2Hooks = {},
): number {
  let lo = 0,
    hi = arr.length - 1;
  while (lo <= hi) {
    const mid1 = lo + Math.floor((hi - lo) / 3);
    const mid2 = hi - Math.floor((hi - lo) / 3);
    hooks.onCompare?.(mid1);
    hooks.onCompare?.(mid2);
    if (arr[mid1]! === target) return mid1;
    if (arr[mid2]! === target) return mid2;
    if (target < arr[mid1]!) hi = mid1 - 1;
    else if (target > arr[mid2]!) lo = mid2 + 1;
    else {
      lo = mid1 + 1;
      hi = mid2 - 1;
    }
  }
  return -1;
}
