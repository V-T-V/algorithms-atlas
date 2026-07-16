// 飞奔查找 · 纯算法实现
export interface Gallop3Hooks {
  onGallop?: (i: number) => void;
  onLinear?: (i: number) => void;
}

export function gallopSearch3(
  arr: readonly number[],
  target: number,
  hooks: Gallop3Hooks = {},
): number {
  const n = arr.length;
  if (n === 0 || target < arr[0]!) return -1;
  let i = 1;
  while (i < n && arr[i]! <= target) {
    hooks.onGallop?.(i);
    i *= 2;
  }
  const lo = Math.floor(i / 2);
  const hi = Math.min(i, n - 1);
  for (let k = hi; k >= lo; k--) {
    hooks.onLinear?.(k);
    if (arr[k]! === target) return k;
    if (arr[k]! < target) return -1;
  }
  return -1;
}
