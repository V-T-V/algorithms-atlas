// 线性查找（哨兵）· 纯算法实现
export interface LinearSentinel2Hooks {
  onCompare?: (i: number) => void;
}

export function sentinelLinearSearch2(
  arr: readonly number[],
  target: number,
  hooks: LinearSentinel2Hooks = {},
): number {
  const n = arr.length;
  if (n === 0) return -1;
  const a = [...arr];
  const last = a[n - 1]!;
  a[n - 1] = target;
  let i = 0;
  while (a[i]! !== target) {
    hooks.onCompare?.(i);
    i++;
  }
  a[n - 1] = last;
  if (i < n - 1) return i;
  return last === target ? n - 1 : -1;
}
