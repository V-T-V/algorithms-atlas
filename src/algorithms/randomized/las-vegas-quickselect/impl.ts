// =============================================================================
// Las Vegas 快速选择 · 纯算法实现
// 随机化选第 k 小（0 基）：随机 pivot + 三路划分（<, =, >），只递归含 k 的一段。
// Las Vegas：结果始终正确；期望时间 Θ(n)。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每步。
// =============================================================================

/** [0,1) 随机源类型。 */
export type Rng = () => number;

/** 事件钩子。 */
export interface QuickselectHooks {
  /** 进入一次递归：当前搜索范围 [lo, hi) 与目标 k。 */
  onRecurse?: (lo: number, hi: number, k: number) => void;
  /** 选定 pivot 的下标与值。 */
  onPivot?: (pivotIndex: number, pivotValue: number) => void;
  /** 三路划分后三段范围。 */
  onPartition?: (lessStart: number, lessEnd: number, eqEnd: number, hi: number) => void;
  /** 找到结果。 */
  onResult?: (value: number) => void;
}

/** 确定性 RNG（便于单测）。 */
export function makeRng(seed: number): Rng {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0;
    return s / 0x100000000;
  };
}

/** 交换。 */
function swap(arr: number[], i: number, j: number): void {
  const tmp = arr[i]!;
  arr[i] = arr[j]!;
  arr[j] = tmp;
}

/**
 * 三路划分（Dutch national flag），pivot 值为 pivotValue。
 * 划分后：[lo, lt) < pivotValue，[lt, gt) == pivotValue，[gt, hi) > pivotValue。
 */
function threeWayPartition(
  arr: number[],
  lo: number,
  hi: number,
  pivotValue: number,
): { lt: number; gt: number } {
  let lt = lo;
  let gt = lo;
  let i = lo;
  while (i < hi) {
    const cur = arr[i]!;
    if (cur < pivotValue) {
      swap(arr, gt, i);
      swap(arr, lt, gt);
      lt++;
      gt++;
    } else if (cur === pivotValue) {
      swap(arr, gt, i);
      gt++;
    }
    i++;
  }
  return { lt, gt };
}

/**
 * 随机化快速选择：在 arr 的 [lo, hi) 范围内找第 k 小（全局 0 基）的元素。
 * 原地修改 arr。
 *
 * @param arr 待选数组（会被部分重排）
 * @param k 目标次序（0 基，0 ≤ k < arr.length）
 * @param rng [0,1) 随机源
 * @param hooks 可选钩子
 * @returns 第 k 小的值
 */
export function quickselect(
  arr: number[],
  k: number,
  rng: Rng = Math.random,
  hooks: QuickselectHooks = {},
): number {
  if (arr.length === 0) throw new Error('数组为空');
  if (k < 0 || k >= arr.length) throw new Error(`k=${k} 越界（长度 ${arr.length}）`);

  // 迭代实现以避免深递归
  let lo = 0;
  let hi = arr.length;
  const target = k;

  while (lo < hi) {
    hooks.onRecurse?.(lo, hi, target);

    // 随机选 pivot：在 [lo, hi) 均匀取一个下标
    const pivotIndex = lo + Math.floor(rng() * (hi - lo));
    const pivotValue = arr[pivotIndex]!;
    hooks.onPivot?.(pivotIndex, pivotValue);

    // 三路划分
    const { lt, gt } = threeWayPartition(arr, lo, hi, pivotValue);
    hooks.onPartition?.(lt, gt, gt, hi);

    if (target < lt) {
      // 第 k 小在 < 段
      hi = lt;
    } else if (target < gt) {
      // 第 k 小在 == 段，恰好是 pivotValue
      hooks.onResult?.(pivotValue);
      return pivotValue;
    } else {
      // 第 k 小在 > 段，相对偏移
      lo = gt;
    }
  }

  // 理论上 lo === target 时直接返回
  const result = arr[lo]!;
  hooks.onResult?.(result);
  return result;
}

/**
 * 计算比较次数的统计估计（不修改输入）：重复多次返回平均递归深度近似。
 * 这里返回一个简单的「pivot 序列长度」指标，用于演示。
 */
export function estimatePivotSequenceLength(arr: number[], k: number, rng: Rng): number {
  let count = 0;
  const hooks: QuickselectHooks = {
    onPivot: () => count++,
  };
  quickselect([...arr], k, rng, hooks);
  return count;
}

/** 构造示例数组。 */
export function makeSampleArray(): number[] {
  return [9, 3, 7, 1, 5, 8, 2, 6, 4, 0];
}

/** 中位数（偶数长度取下中位）。 */
export function median(arr: number[], rng: Rng = Math.random): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const k = Math.floor((sorted.length - 1) / 2);
  return quickselect([...arr], k, rng);
}
