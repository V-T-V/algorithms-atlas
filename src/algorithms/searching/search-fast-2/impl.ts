// 快速查找（混合）· 纯算法实现
export interface Fast2Hooks {
  onJump?: (pos: number) => void;
  onBinary?: (mid: number) => void;
}

export function fastSearch2(
  arr: readonly number[],
  target: number,
  hooks: Fast2Hooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  const step = Math.max(1, Math.floor(Math.sqrt(n)));
  let prev = 0,
    pos = Math.min(step - 1, n - 1);
  while (pos < n && arr[pos]! < target) {
    hooks.onJump?.(pos);
    prev = pos + 1;
    pos += step;
  }
  let hi = Math.min(pos, n - 1);
  let lo = prev;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    hooks.onBinary?.(mid);
    if (arr[mid]! === target) return mid;
    if (arr[mid]! < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
