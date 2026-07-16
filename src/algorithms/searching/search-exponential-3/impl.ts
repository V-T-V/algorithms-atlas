// 指数查找 · 纯算法实现
export interface Expo3Hooks {
  onGallop?: (bound: number) => void;
  onBinary?: (lo: number, hi: number) => void;
}

export function exponentialSearch3(
  arr: readonly number[],
  target: number,
  hooks: Expo3Hooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  if (arr[0]! === target) return 0;
  let bound = 1;
  while (bound < n && arr[bound]! < target) {
    hooks.onGallop?.(bound);
    bound *= 2;
  }
  let lo = Math.floor(bound / 2),
    hi = Math.min(bound, n - 1);
  hooks.onBinary?.(lo, hi);
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid]! === target) return mid;
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
