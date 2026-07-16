// 跳跃查找（黄金步长）· 纯算法实现
export interface JumpGoldenHooks {
  onJump?: (pos: number) => void;
  onLinear?: (i: number) => void;
}

export function jumpSearchGolden(
  arr: readonly number[],
  target: number,
  hooks: JumpGoldenHooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  const step = Math.max(1, Math.floor(n * 0.618));
  let prev = 0,
    pos = Math.min(step - 1, n - 1);
  while (pos < n && arr[pos]! < target) {
    hooks.onJump?.(pos);
    prev = pos + 1;
    pos += step;
  }
  pos = Math.min(pos, n - 1);
  for (let i = prev; i <= pos; i++) {
    hooks.onLinear?.(i);
    if (arr[i]! === target) return i;
    if (arr[i]! > target) return -1;
  }
  return -1;
}
