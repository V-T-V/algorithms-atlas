// =============================================================================
// 找缺失数字（Find Missing Number）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MissingNumberHooks {
  /** 异或法：处理下标 i 的元素，给出当前累异或值。 */
  onXorStep?: (i: number, acc: number) => void;
  /** 求和法：处理下标 i 的元素，给出当前累加和。 */
  onSumStep?: (i: number, acc: number) => void;
  /** 完成。 */
  onDone?: (method: 'xor' | 'sum', missing: number) => void;
}

/**
 * 找缺失数字（异或法）。
 *
 * @param nums 长度 n 的数组，含 0..n 中 n 个不同整数
 * @param hooks 可选的事件钩子
 * @returns 缺失的整数
 */
export function missingNumberXor(nums: readonly number[], hooks: MissingNumberHooks = {}): number {
  const n = nums.length;
  let acc = n; // 先异或 n
  for (let i = 0; i < n; i++) {
    acc = acc ^ i ^ nums[i]!;
    hooks.onXorStep?.(i, acc);
  }
  hooks.onDone?.('xor', acc);
  return acc;
}

/**
 * 找缺失数字（求和法）。
 */
export function missingNumberSum(nums: readonly number[], hooks: MissingNumberHooks = {}): number {
  const n = nums.length;
  const expected = (n * (n + 1)) / 2;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += nums[i]!;
    hooks.onSumStep?.(i, sum);
  }
  const missing = expected - sum;
  hooks.onDone?.('sum', missing);
  return missing;
}

/** 默认实现：异或法。 */
export function missingNumber(nums: readonly number[], hooks: MissingNumberHooks = {}): number {
  return missingNumberXor(nums, hooks);
}
