// 梳排序（双收缩因子）· 纯算法实现
export interface Comb3Hooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function combSort3(arr: readonly number[], hooks: Comb3Hooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  let gap = n;
  let pass = 0;
  let swapped = true;
  while (gap > 1 || swapped) {
    gap = Math.max(1, Math.floor(gap / (pass % 2 === 0 ? 1.3 : 1.25)));
    swapped = false;
    for (let i = 0; i + gap < n; i++) {
      hooks.onCompare?.(i, i + gap, a);
      if (a[i]! > a[i + gap]!) {
        [a[i], a[i + gap]] = [a[i + gap]!, a[i]!];
        swapped = true;
      }
    }
    pass++;
  }
  return a;
}
