// 随机化快速选择 · 纯算法实现
// 使用线性同余发生器（LCG）提供可复现的伪随机数，避免 DOM/时钟依赖。

/** 线性同余发生器（Numerical Recipes 常数），可复现。 */
export class LCG {
  private state: number;
  constructor(seed = 1) {
    this.state = seed >>> 0;
  }
  /** 返回 [0, n) 内的伪随机整数。 */
  nextInt(n: number): number {
    // state = (a * state + c) mod 2^32
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0;
    return this.state % n;
  }
}

/** 事件钩子。 */
export interface RandomSelectHooks {
  /** 在 [lo, hi] 区间随机选中下标 r，并将其换到 hi 位置。 */
  onPickPivot?: (lo: number, hi: number, r: number) => void;
  /** 比较下标 i 与 pivot 值。 */
  onCompare?: (i: number, pivotIdx: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 基准就位 p。 */
  onPinned?: (p: number) => void;
}

/**
 * 随机化快速选择：找数组中第 k 小（0-based）。
 * @param arr 待选数组（不修改原数组）
 * @param k 目标排名
 * @param seed 随机种子（默认 1）
 * @param hooks 可选事件钩子
 * @returns 第 k 小的元素值
 */
export function quickselectRandomized(
  arr: readonly number[],
  k: number,
  seed = 1,
  hooks: RandomSelectHooks = {},
): number {
  const a = [...arr];
  if (k < 0 || k >= a.length) throw new RangeError(`k out of range: ${k}`);
  const rng = new LCG(seed);

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  const select = (lo: number, hi: number): number => {
    if (lo === hi) return a[lo]!;
    // 随机选基准并换到 hi
    const r = lo + rng.nextInt(hi - lo + 1);
    hooks.onPickPivot?.(lo, hi, r);
    swap(r, hi);
    hooks.onSwap?.(r, hi);
    const pivot = a[hi]!;
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      hooks.onCompare?.(j, hi);
      if (a[j]! < pivot) {
        i++;
        if (i !== j) {
          swap(i, j);
          hooks.onSwap?.(i, j);
        }
      }
    }
    const p = i + 1;
    if (p !== hi) {
      swap(p, hi);
      hooks.onSwap?.(p, hi);
    }
    hooks.onPinned?.(p);
    if (k === p) return a[k]!;
    if (k < p) return select(lo, p - 1);
    return select(p + 1, hi);
  };

  return select(0, a.length - 1);
}
