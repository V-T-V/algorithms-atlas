// 跳跃查找（经典）· 纯算法实现
export interface JumpClassicHooks {
  onJump?: (pos: number) => void;
  onLinear?: (i: number) => void;
}

export function jumpSearchClassic(
  arr: readonly number[],
  target: number,
  hooks: JumpClassicHooks = {},
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
  const hi = Math.min(pos, n - 1);
  for (let i = prev; i <= hi; i++) {
    hooks.onLinear?.(i);
    if (arr[i]! === target) return i;
    if (arr[i]! > target) return -1;
  }
  return -1;
}
