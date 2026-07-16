// 闪排序（稠密分桶）· 纯算法实现
export interface Flash2Hooks {
  onClassify?: (bucketIdx: number, arr: number[]) => void;
}

function insSort(a: number[]): void {
  for (let i = 1; i < a.length; i++) {
    const v = a[i]!;
    let j = i;
    while (j > 0 && a[j - 1]! > v) {
      a[j] = a[j - 1]!;
      j--;
    }
    a[j] = v;
  }
}

export function flashSort2(arr: readonly number[], hooks: Flash2Hooks = {}): number[] {
  if (arr.length <= 1) return [...arr];
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  const m = Math.max(1, Math.floor(0.42 * arr.length));
  const range = mx - mn + 1;
  const idx = (v: number): number => Math.min(m - 1, Math.floor(((v - mn) / range) * m));
  const buckets: number[][] = Array.from({ length: m }, () => []);
  for (const v of arr) buckets[idx(v)]!.push(v);
  for (let i = 0; i < m; i++) {
    hooks.onClassify?.(i, buckets[i]!);
    insSort(buckets[i]!);
  }
  const out: number[] = [];
  for (const b of buckets) out.push(...b);
  return out;
}
