// 桶选择（均匀分布假设）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过钩子暴露每一步。

/** 事件钩子。 */
export interface BucketSelectHooks {
  /** 扫描出 [min,max]，确定桶数 B。 */
  onRange?: (min: number, max: number, buckets: number) => void;
  /** 元素 a[i] 落入桶 b。 */
  onScatter?: (index: number, value: number, bucket: number) => void;
  /** 定位目标桶 b（及桶内相对排名 kRel）。 */
  onLocate?: (bucket: number, kRel: number) => void;
  /** 进入递归（给出当前候选集合与 k）。 */
  onRecurse?: (size: number, k: number) => void;
  /** 基线：集合足够小，排序取第 k 小。 */
  onBase?: (size: number, value: number) => void;
}

/**
 * 桶选择：在均匀分布假设下找数组中第 k 小（0-based）。
 *
 * @param arr 待选数组（不修改原数组）
 * @param k 目标排名（0-based，0 = 最小）
 * @param hooks 可选事件钩子
 * @returns 第 k 小的元素值
 */
export function bucketSelect(
  arr: readonly number[],
  k: number,
  hooks: BucketSelectHooks = {},
): number {
  if (k < 0) throw new RangeError(`k out of range: ${k}`);

  const select = (data: number[], rank: number): number => {
    const n = data.length;
    if (n === 0) throw new RangeError('empty data');
    if (rank < 0 || rank >= n) throw new RangeError(`rank out of range: ${rank}`);

    // 基线：足够小，排序取值
    if (n <= 5) {
      const sorted = [...data].sort((a, b) => a - b);
      const v = sorted[rank]!;
      hooks.onBase?.(n, v);
      return v;
    }

    let lo = Infinity;
    let hi = -Infinity;
    for (const x of data) {
      if (x < lo) lo = x;
      if (x > hi) hi = x;
    }
    const B = n; // 桶数 ≈ n
    hooks.onRange?.(lo, hi, B);

    const buckets: number[][] = Array.from({ length: B }, () => []);
    const span = hi - lo;
    for (let i = 0; i < n; i++) {
      const x = data[i]!;
      let b: number;
      if (span === 0) {
        b = 0;
      } else {
        b = Math.floor(((x - lo) / span) * B);
        if (b >= B) b = B - 1;
        if (b < 0) b = 0;
      }
      buckets[b]!.push(x);
      hooks.onScatter?.(i, x, b);
    }

    // 定位第 rank 小所在桶
    let acc = 0;
    let target = 0;
    let kRel = rank;
    for (let b = 0; b < B; b++) {
      const sz = buckets[b]!.length;
      if (acc + sz > rank) {
        target = b;
        kRel = rank - acc;
        break;
      }
      acc += sz;
    }
    hooks.onLocate?.(target, kRel);
    hooks.onRecurse?.(buckets[target]!.length, kRel);
    return select(buckets[target]!, kRel);
  };

  return select([...arr], k);
}
