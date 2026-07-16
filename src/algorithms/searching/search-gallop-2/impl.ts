// =============================================================================
// 飞奔查找（变体）· 纯算法实现
// =============================================================================

export interface SearchHooks {
  onGallop?: (index: number, value: number | null) => void;
  onHalt?: (lo: number, hi: number) => void;
}

export function gallopSearch(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  if (arr[0]! > target) return -1;
  if (arr[0]! === target) return 0;
  // 倍增
  let i = 1;
  while (i < n && arr[i]! <= target) {
    hooks.onGallop?.(i, arr[i]!);
    i *= 2;
  }
  hooks.onGallop?.(i, i < n ? arr[i]! : null);
  const lo = i >> 1;
  const hi = Math.min(i, n - 1);
  hooks.onHalt?.(lo, hi);
  // 二分
  let l = lo;
  let h = hi;
  while (l <= h) {
    const mid = (l + h) >> 1;
    if (arr[mid]! === target) return mid;
    if (arr[mid]! < target) l = mid + 1;
    else h = mid - 1;
  }
  return -1;
}
