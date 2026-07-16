// 梳排序（收缩 1.33）· 纯算法实现
export interface Comb133Hooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function combSort133(arr: readonly number[], hooks: Comb133Hooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  let gap = n;
  let swapped = true;
  while (gap > 1 || swapped) {
    gap = Math.max(1, Math.floor(gap / 1.33));
    swapped = false;
    for (let i = 0; i + gap < n; i++) {
      hooks.onCompare?.(i, i + gap, a);
      if (a[i]! > a[i + gap]!) {
        [a[i], a[i + gap]] = [a[i + gap]!, a[i]!];
        swapped = true;
      }
    }
  }
  return a;
}
