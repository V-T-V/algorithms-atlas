// 同时找最小与最大（成对比较法）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过钩子暴露每对比较。

/** 事件钩子。 */
export interface MinMaxHooks {
  /** 初始化 min/max（给出初始值与下标）。 */
  onInit?: (min: number, max: number) => void;
  /** 处理一对 (smallIdx, largeIdx)。给出该对内部比较后的小者与大者。 */
  onPair?: (
    pairIndex: number,
    smallIdx: number,
    largeIdx: number,
    small: number,
    large: number,
  ) => void;
  /** 与当前最小比较（给出候选下标与是否更新）。 */
  onCompareMin?: (idx: number, candidate: number, curMin: number, updated: boolean) => void;
  /** 与当前最大比较（给出候选下标与是否更新）。 */
  onCompareMax?: (idx: number, candidate: number, curMax: number, updated: boolean) => void;
  /** 完成。 */
  onResult?: (min: number, max: number, comparisons: number) => void;
}

export interface MinMaxResult {
  min: number;
  max: number;
  comparisons: number;
}

/**
 * 成对比较法同时找最小与最大。
 * @param arr 输入数组
 * @param hooks 可选事件钩子
 * @returns { min, max, comparisons }
 */
export function minMax(arr: readonly number[], hooks: MinMaxHooks = {}): MinMaxResult {
  const n = arr.length;
  if (n === 0) throw new RangeError('空数组');

  let min: number;
  let max: number;
  let start: number;
  let comparisons = 0;

  if (n % 2 === 0) {
    // 偶数：前两个先比一次定初值
    comparisons++;
    if (arr[0]! <= arr[1]!) {
      min = arr[0]!;
      max = arr[1]!;
    } else {
      min = arr[1]!;
      max = arr[0]!;
    }
    start = 2;
  } else {
    min = arr[0]!;
    max = arr[0]!;
    start = 1;
  }
  hooks.onInit?.(min, max);

  let pair = 0;
  for (let i = start; i + 1 < n; i += 2) {
    const a = arr[i]!;
    const b = arr[i + 1]!;
    // 对内比较
    comparisons++;
    let smallIdx = i;
    let largeIdx = i + 1;
    let small = a;
    let large = b;
    if (a > b) {
      smallIdx = i + 1;
      largeIdx = i;
      small = b;
      large = a;
    }
    hooks.onPair?.(pair, smallIdx, largeIdx, small, large);

    // 小者比 min
    comparisons++;
    const minUpdated = small < min;
    if (minUpdated) min = small;
    hooks.onCompareMin?.(smallIdx, small, min, minUpdated);

    // 大者比 max
    comparisons++;
    const maxUpdated = large > max;
    if (maxUpdated) max = large;
    hooks.onCompareMax?.(largeIdx, large, max, maxUpdated);

    pair++;
  }

  hooks.onResult?.(min, max, comparisons);
  return { min, max, comparisons };
}
