// 线性查找（朴素）· 纯算法实现
export interface Linear2Hooks {
  onCompare?: (i: number) => void;
}

export function linearSearch2(
  arr: readonly number[],
  target: number,
  hooks: Linear2Hooks = {},
): number {
  for (let i = 0; i < arr.length; i++) {
    hooks.onCompare?.(i);
    if (arr[i]! === target) return i;
  }
  return -1;
}
