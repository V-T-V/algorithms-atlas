// =============================================================================
// 采样排序（Samplesort）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SamplesortHooks {
  /** 选取了 (k-1) 个主元。 */
  onPivots?: (pivots: number[]) => void;
  /** 完成一次 k 路划分，给出每个桶的元素数。 */
  onPartition?: (bucketSizes: number[]) => void;
  /** 进入插入排序收尾阶段（小段）。 */
  onInsertion?: (lo: number, hi: number) => void;
}

const INSERTION_THRESHOLD = 16;

/** 对 a[lo..hi] 做原地插入排序（含两端）。 */
function insertionSort(a: number[], lo: number, hi: number): void {
  for (let i = lo + 1; i <= hi; i++) {
    const key = a[i]!;
    let j = i - 1;
    while (j >= lo && a[j]! > key) {
      a[j + 1] = a[j]!;
      j--;
    }
    a[j + 1] = key;
  }
}

/**
 * 采样排序：随机采样、取等距主元、k 路划分、递归收尾。
 *
 * 为保证确定性，使用「中位数采样」而非真随机（取若干位置的中位数）。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param k 路数（主元数 = k-1），默认 3
 * @param hooks 可选的事件钩子
 */
export function samplesort(arr: readonly number[], k = 3, hooks: SamplesortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;

  // 采样：取 k-1 个近似等距位置的中位数候选（确定性）
  const pickPivots = (lo: number, hi: number): number[] => {
    const span = hi - lo + 1;
    if (span <= k) return []; // 太小，不取主元
    // 从 [lo,hi] 等距取 max(2k, k+4) 个样本
    const sampleCount = Math.min(span, Math.max(2 * k, k + 4));
    const samples: number[] = [];
    for (let i = 0; i < sampleCount; i++) {
      const pos = lo + Math.floor((i * (span - 1)) / Math.max(1, sampleCount - 1));
      samples.push(a[pos]!);
    }
    samples.sort((x, y) => x - y);
    // 取等距 (k-1) 个主元
    const pivots: number[] = [];
    for (let i = 1; i < k; i++) {
      const pos = Math.floor((i * samples.length) / k);
      pivots.push(samples[pos]!);
    }
    return pivots;
  };

  const recurse = (lo: number, hi: number): void => {
    if (hi - lo + 1 <= INSERTION_THRESHOLD) {
      hooks.onInsertion?.(lo, hi);
      insertionSort(a, lo, hi);
      return;
    }
    const pivots = pickPivots(lo, hi);
    if (pivots.length === 0) {
      insertionSort(a, lo, hi);
      return;
    }
    hooks.onPivots?.(pivots);

    // 多路划分：把 [lo,hi] 元素按主元分到 k 个桶
    const buckets: number[][] = Array.from({ length: pivots.length + 1 }, () => []);
    for (let i = lo; i <= hi; i++) {
      const v = a[i]!;
      let b = 0;
      while (b < pivots.length && v >= pivots[b]!) b++;
      buckets[b]!.push(v);
    }
    hooks.onPartition?.(buckets.map((bk) => bk.length));

    // 回填到 a[lo..hi]
    let pos = lo;
    for (const bucket of buckets) {
      for (const v of bucket) {
        a[pos] = v;
        pos++;
      }
    }
    // 递归各桶
    pos = lo;
    for (const bucket of buckets) {
      const bLo = pos;
      const bHi = pos + bucket.length - 1;
      if (bucket.length > 1) recurse(bLo, bHi);
      pos += bucket.length;
    }
  };

  if (n > 1) recurse(0, n - 1);
  return a;
}
