// =============================================================================
// 桶排序 · 纯算法实现
// 把元素分到 k 个桶（按值域等分），桶内用插入排序（稳定），最后拼接。
// =============================================================================

export interface BucketSortHooks {
  /** 把 value 放进桶 b。 */
  onDistribute?: (value: number, bucket: number, buckets: number[][]) => void;
  /** 对桶 b 完成内部排序。 */
  onSortBucket?: (bucket: number, sorted: number[]) => void;
  /** 合并所有桶，输出已排序结果。 */
  onMerge?: (result: number[]) => void;
}

/**
 * 桶排序。
 * @param arr 输入数组（数值）
 * @param k 桶数量（默认 max(2, floor(n/2))）
 */
export function bucketSort(
  arr: readonly number[],
  k?: number,
  hooks: BucketSortHooks = {},
): number[] {
  const n = arr.length;
  if (n <= 1) return [...arr];
  const numBuckets = k ?? Math.max(2, Math.floor(n / 2));
  // 值域
  let mn = arr[0]!;
  let mx = arr[0]!;
  for (const v of arr) {
    if (v < mn) mn = v;
    if (v > mx) mx = v;
  }
  const range = mx - mn;
  // 建桶
  const buckets: number[][] = Array.from({ length: numBuckets }, () => []);
  // 分配
  for (const v of arr) {
    let idx: number;
    if (range === 0) {
      idx = 0; // 所有值相同
    } else {
      idx = Math.min(numBuckets - 1, Math.floor(((v - mn) / range) * numBuckets));
    }
    buckets[idx]!.push(v);
    hooks.onDistribute?.(
      v,
      idx,
      buckets.map((b) => [...b]),
    );
  }
  // 桶内插入排序（稳定）
  for (let b = 0; b < numBuckets; b++) {
    insertSort(buckets[b]!);
    hooks.onSortBucket?.(b, [...buckets[b]!]);
  }
  // 合并
  const result: number[] = [];
  for (let b = 0; b < numBuckets; b++) {
    for (const v of buckets[b]!) result.push(v);
  }
  hooks.onMerge?.([...result]);
  return result;
}

/** 稳定插入排序（原地）。 */
function insertSort(a: number[]): void {
  for (let i = 1; i < a.length; i++) {
    const key = a[i]!;
    let j = i - 1;
    while (j >= 0 && a[j]! > key) {
      a[j + 1] = a[j]!;
      j--;
    }
    a[j + 1] = key;
  }
}
