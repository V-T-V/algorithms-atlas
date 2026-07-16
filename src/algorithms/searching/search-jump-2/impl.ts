// =============================================================================
// 跳跃查找（变体）· 纯算法实现
// =============================================================================

export interface SearchHooks {
  onJump?: (index: number, value: number | null) => void;
  onLinear?: (index: number, value: number) => void;
}

export function jumpSearch(
  arr: readonly number[],
  target: number,
  hooks: SearchHooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  let curr = step;
  // 跳过小于 target 的块
  while (curr < n && arr[curr]! < target) {
    hooks.onJump?.(curr, arr[curr]!);
    prev = curr;
    curr += step;
  }
  hooks.onJump?.(Math.min(curr, n - 1), curr < n ? arr[curr]! : null);
  // 线性回扫 [prev, min(curr, n-1)]
  const hi = Math.min(curr, n - 1);
  for (let i = prev; i <= hi; i++) {
    hooks.onLinear?.(i, arr[i]!);
    if (arr[i]! === target) return i;
    if (arr[i]! > target) return -1;
  }
  return -1;
}
