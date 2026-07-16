// 桶排序（sqrt(n) 桶）· 纯算法实现
export interface BucketSqrtHooks {
  onBucket?: (bucketIdx: number, arr: number[]) => void;
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

export function bucketSortSqrt(arr: readonly number[], hooks: BucketSqrtHooks = {}): number[] {
  if (arr.length <= 1) return [...arr];
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  const k = Math.max(1, Math.floor(Math.sqrt(arr.length)));
  const range = mx - mn + 1;
  const buckets: number[][] = Array.from({ length: k }, () => []);
  const idx = (v: number): number => Math.min(k - 1, Math.floor(((v - mn) / range) * k));
  for (const v of arr) buckets[idx(v)]!.push(v);
  for (let i = 0; i < k; i++) {
    insSort(buckets[i]!);
    hooks.onBucket?.(i, buckets[i]!);
  }
  const out: number[] = [];
  for (const b of buckets) out.push(...b);
  return out;
}
