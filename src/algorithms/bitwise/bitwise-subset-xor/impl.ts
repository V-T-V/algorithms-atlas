// =============================================================================
// 子集异或和（Subset XOR Sum）· 纯算法实现
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface SubsetXorHooks {
  /** 处理第 k 位，该位是否在某元素中出现。 */
  onBit?: (bit: number, present: boolean) => void;
  /** 完成。 */
  onDone?: (result: number) => void;
}

/**
 * 子集异或和：所有子集的异或之和。
 *
 * @param nums 非负整数数组
 * @param hooks 可选的事件钩子
 */
export function subsetXorSum(nums: readonly number[], hooks: SubsetXorHooks = {}): number {
  const n = nums.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  // bitMask = OR of all elements（出现过的位）
  let bitMask = 0;
  for (const v of nums) bitMask |= v;

  let result = 0;
  const maxBit = 20; // 假设值不超过 2^20
  for (let k = 0; k < maxBit; k++) {
    const present = ((bitMask >> k) & 1) === 1;
    hooks.onBit?.(k, present);
    if (present) {
      result += (1 << k) * Math.pow(2, n - 1);
    }
  }
  hooks.onDone?.(result);
  return result;
}

/** 朴素枚举版（O(n·2^n)），用于测试对照。 */
export function subsetXorSumNaive(nums: readonly number[]): number {
  const n = nums.length;
  let total = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    let xr = 0;
    for (let i = 0; i < n; i++) {
      if (((mask >> i) & 1) === 1) xr ^= nums[i]!;
    }
    total += xr;
  }
  return total;
}
