// Floyd-Rivest 选择 · 纯算法实现
// 采用单基准 Dijkstra 三向划分（荷兰国旗），对采样基准值做 < / == / > 三段。
// 当 k 落入 == 段时（其值唯一）即为答案；否则递归 < 或 > 段。

import { LCG } from '../quickselect-randomized/impl.ts';

/** 事件钩子。 */
export interface FloydRivestHooks {
  /** 进入 [lo, hi] 寻找第 k 小（绝对下标 k），本次采样基准下标 pivotIdx。 */
  onPartition?: (lo: number, hi: number, k: number, pivotIdx: number) => void;
  /** 三向划分完成：[lo..lt-1] < pivot, [lt..gt] == pivot, [gt+1..hi] > pivot。 */
  onSegregated?: (pivotVal: number, lt: number, gt: number) => void;
}

const CUTOFF = 5;

/**
 * Floyd-Rivest 风格选择：找数组中第 k 小（0-based 绝对下标 k）。
 * 单基准采样 + Dijkstra 三向划分，常数小、对重复元素正确。
 * @param arr 待选数组（不修改原数组）
 * @param k 目标排名（0-based）
 * @param seed 随机种子
 * @param hooks 可选事件钩子
 */
export function floydRivestSelect(
  arr: readonly number[],
  k: number,
  seed = 1,
  hooks: FloydRivestHooks = {},
): number {
  const a = [...arr];
  if (k < 0 || k >= a.length) throw new RangeError(`k out of range: ${k}`);
  const rng = new LCG(seed);

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  const select = (lo: number, hi: number, kk: number): number => {
    if (hi - lo < CUTOFF) {
      // 小段：插入排序后取 a[kk]
      for (let p = lo + 1; p <= hi; p++) {
        let q = p;
        while (q > lo && a[q - 1]! > a[q]!) {
          swap(q - 1, q);
          q--;
        }
      }
      return a[kk]!;
    }
    // 采样基准下标
    const pivotIdx = lo + rng.nextInt(hi - lo + 1);
    const pivotVal = a[pivotIdx]!;
    hooks.onPartition?.(lo, hi, kk, pivotIdx);

    // Dijkstra 三向划分：< pivot | == pivot | > pivot
    let lt = lo;
    let gt = hi;
    let cur = lo;
    while (cur <= gt) {
      const v = a[cur]!;
      if (v < pivotVal) {
        swap(cur, lt);
        lt++;
        cur++;
      } else if (v > pivotVal) {
        swap(cur, gt);
        gt--;
      } else {
        cur++;
      }
    }
    // [lo..lt-1] < pivotVal, [lt..gt] == pivotVal, [gt+1..hi] > pivotVal
    hooks.onSegregated?.(pivotVal, lt, gt);

    if (kk < lt) return select(lo, lt - 1, kk);
    if (kk > gt) return select(gt + 1, hi, kk);
    // kk ∈ [lt, gt]，该段值全部等于 pivotVal，即答案
    return pivotVal;
  };

  return select(0, a.length - 1, k);
}
