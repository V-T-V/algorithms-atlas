// 砖块排序（奇偶排序）· 纯算法实现
export interface BrickSortHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function brickSort(arr: readonly number[], hooks: BrickSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  let sorted = false;
  while (!sorted) {
    sorted = true;
    // 偶数相位：(1,2)(3,4)...
    for (let i = 1; i < n - 1; i += 2) {
      hooks.onCompare?.(i, i + 1, a);
      if (a[i]! > a[i + 1]!) {
        [a[i], a[i + 1]] = [a[i + 1]!, a[i]!];
        sorted = false;
      }
    }
    // 奇数相位：(0,1)(2,3)...
    for (let i = 0; i < n - 1; i += 2) {
      hooks.onCompare?.(i, i + 1, a);
      if (a[i]! > a[i + 1]!) {
        [a[i], a[i + 1]] = [a[i + 1]!, a[i]!];
        sorted = false;
      }
    }
  }
  return a;
}
