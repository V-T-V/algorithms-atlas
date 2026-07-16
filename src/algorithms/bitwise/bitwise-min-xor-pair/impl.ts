// =============================================================================
// 最小异或对（Minimum XOR Pair）· 纯算法实现
// =============================================================================

export interface MinXorResult {
  minXor: number;
  pair: [number, number] | null;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MinXorHooks {
  /** 比较相邻对，给出异或值。 */
  onPair?: (a: number, b: number, xor: number) => void;
  /** 完成。 */
  onDone?: (result: MinXorResult) => void;
}

/**
 * 最小异或对：排序后扫描相邻对。
 *
 * @param nums 非空整数数组
 * @param hooks 可选的事件钩子
 */
export function minXorPair(nums: readonly number[], hooks: MinXorHooks = {}): MinXorResult {
  if (nums.length < 2) {
    const res: MinXorResult = { minXor: 0, pair: null };
    hooks.onDone?.(res);
    return res;
  }
  const sorted = [...nums].sort((a, b) => a - b);
  let best = Infinity;
  let bestPair: [number, number] | null = null;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]!;
    const b = sorted[i + 1]!;
    const xr = a ^ b;
    hooks.onPair?.(a, b, xr);
    if (xr < best) {
      best = xr;
      bestPair = [a, b];
    }
  }
  const res: MinXorResult = { minXor: best, pair: bestPair };
  hooks.onDone?.(res);
  return res;
}

/** 朴素版（O(n²)），用于测试对照。 */
export function minXorPairNaive(nums: readonly number[]): MinXorResult {
  if (nums.length < 2) return { minXor: 0, pair: null };
  let best = Infinity;
  let bestPair: [number, number] | null = null;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      const xr = nums[i]! ^ nums[j]!;
      if (xr < best) {
        best = xr;
        bestPair = [nums[i]!, nums[j]!];
      }
    }
  }
  return { minXor: best, pair: bestPair };
}
