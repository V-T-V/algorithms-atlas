// 希尔排序（Knuth 间隔）· 纯算法实现
export interface ShellKnuthHooks {
  onCompare?: (i: number, j: number, arr: number[]) => void;
}

export function shellSortKnuth(arr: readonly number[], hooks: ShellKnuthHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  let h = 1;
  while (h < Math.floor(n / 3)) h = 3 * h + 1;
  while (h >= 1) {
    for (let i = h; i < n; i++) {
      const v = a[i]!;
      let j = i;
      while (j >= h && a[j - h]! > v) {
        hooks.onCompare?.(j - h, j, a);
        a[j] = a[j - h]!;
        j -= h;
      }
      a[j] = v;
    }
    h = Math.floor(h / 3);
  }
  return a;
}
