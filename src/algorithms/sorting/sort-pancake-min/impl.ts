// 煎饼排序（选极值翻转）· 纯算法实现
export interface PancakeMinHooks {
  onFlip?: (k: number, arr: number[]) => void;
}

function flip(a: number[], k: number): void {
  let l = 0,
    r = k;
  while (l < r) {
    [a[l], a[r]] = [a[r]!, a[l]!];
    l++;
    r--;
  }
}

export function pancakeSortMin(arr: readonly number[], hooks: PancakeMinHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  for (let size = n; size > 1; size--) {
    let mi = 0;
    for (let i = 1; i < size; i++) if (a[i]! > a[mi]!) mi = i;
    if (mi !== size - 1) {
      if (mi !== 0) {
        flip(a, mi);
        hooks.onFlip?.(mi, a);
      }
      flip(a, size - 1);
      hooks.onFlip?.(size - 1, a);
    }
  }
  return a;
}
