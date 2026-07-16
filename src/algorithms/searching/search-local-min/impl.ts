// 查找局部最小 · 纯算法实现
export interface LocalMinHooks {
  onCompare?: (mid: number) => void;
}

export function findLocalMinimum(arr: readonly number[], hooks: LocalMinHooks = {}): number {
  const n = arr.length;
  if (n === 0) return -1;
  if (n === 1) return 0;
  if (arr[0]! < arr[1]!) return 0;
  if (arr[n - 1]! < arr[n - 2]!) return n - 1;
  let lo = 1,
    hi = n - 2;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onCompare?.(mid);
    if (arr[mid]! < arr[mid - 1]! && arr[mid]! < arr[mid + 1]!) return mid;
    if (arr[mid]! > arr[mid - 1]!) hi = mid - 1;
    else lo = mid + 1;
  }
  return lo;
}
