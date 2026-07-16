// 内省选择 · 纯算法实现
// 快选为主，递归深度超阈值（2*log2(n)）后改用 median-of-medians 选基准。

import { LCG } from '../quickselect-randomized/impl.ts';

/** 事件钩子。 */
export interface IntroSelectHooks {
  /** 进入 [lo, hi]，使用某种策略（'random' | 'mom'）。 */
  onPartition?: (lo: number, hi: number, strategy: 'random' | 'mom', pivotIdx: number) => void;
  /** 基准就位 p。 */
  onPinned?: (p: number) => void;
  /** 触发退化到 median-of-medians。 */
  onFallback?: (depth: number, limit: number) => void;
}

/** 对子数组 a[lo..hi] 用插入排序找中位数下标（用于 5 元素分组）。 */
function medianOfFive(a: number[], lo: number, hi: number): number {
  const idx: number[] = [];
  for (let i = lo; i <= hi; i++) idx.push(i);
  idx.sort((p, q) => a[p]! - a[q]!);
  return idx[Math.floor(idx.length / 2)]!;
}

/** BFPRT：返回一个「好基准」的下标（其值保证两侧 >= n/5）。 */
function medianOfMedians(a: number[], lo: number, hi: number): number {
  const n = hi - lo + 1;
  if (n <= 5) return medianOfFive(a, lo, hi);
  const medians: number[] = [];
  for (let i = lo; i <= hi; i += 5) {
    const subHi = Math.min(i + 4, hi);
    medians.push(medianOfFive(a, i, subHi));
  }
  // 递归找中位数的中位数：用 medians 中的值对应的下标集合再求
  // 这里把中位数的值收集后递归求近似中位下标
  const midIdx = Math.floor(medians.length / 2);
  medians.sort((x, y) => a[x]! - a[y]!);
  return medians[midIdx]!;
}

/** 用给定基准下标对 [lo, hi] 做 Lomuto 风格划分，返回基准最终位置。 */
function partitionBy(a: number[], lo: number, hi: number, pivotIdx: number): number {
  const pivotVal = a[pivotIdx]!;
  // 把基准换到末尾
  const t = a[pivotIdx]!;
  a[pivotIdx] = a[hi]!;
  a[hi] = t;
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (a[j]! < pivotVal) {
      i++;
      const u = a[i]!;
      a[i] = a[j]!;
      a[j] = u;
    }
  }
  const p = i + 1;
  const v = a[p]!;
  a[p] = a[hi]!;
  a[hi] = v;
  return p;
}

/**
 * 内省选择：找数组中第 k 小（0-based）。
 * @param arr 待选数组（不修改原数组）
 * @param k 目标排名
 * @param seed 随机种子
 * @param hooks 可选事件钩子
 */
export function introselect(
  arr: readonly number[],
  k: number,
  seed = 1,
  hooks: IntroSelectHooks = {},
): number {
  const a = [...arr];
  if (k < 0 || k >= a.length) throw new RangeError(`k out of range: ${k}`);
  const rng = new LCG(seed);
  const depthLimit = 2 * Math.ceil(Math.log2(Math.max(2, a.length)));

  const select = (lo: number, hi: number, depth: number): number => {
    if (lo === hi) return a[lo]!;
    let strategy: 'random' | 'mom' = 'random';
    let pivotIdx: number;
    if (depth >= depthLimit) {
      hooks.onFallback?.(depth, depthLimit);
      strategy = 'mom';
      pivotIdx = medianOfMedians(a, lo, hi);
    } else {
      pivotIdx = lo + rng.nextInt(hi - lo + 1);
    }
    hooks.onPartition?.(lo, hi, strategy, pivotIdx);
    const p = partitionBy(a, lo, hi, pivotIdx);
    hooks.onPinned?.(p);
    if (k === p) return a[k]!;
    if (k < p) return select(lo, p - 1, depth + 1);
    return select(p + 1, hi, depth + 1);
  };

  return select(0, a.length - 1, 0);
}
