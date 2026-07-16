// =============================================================================
// 最大异或值（Maximum XOR）· 纯算法实现
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface MaxXorHooks {
  /** 处理第 bit 位，尝试置 1 是否成功。 */
  onBit?: (bit: number, candidate: number, ok: boolean) => void;
  /** 完成。 */
  onDone?: (maxXor: number) => void;
}

/**
 * 最大异或值：数组中两元素的最大异或。
 *
 * @param nums 非负整数数组
 * @param hooks 可选的事件钩子
 */
export function findMaximumXOR(nums: readonly number[], hooks: MaxXorHooks = {}): number {
  if (nums.length < 2) {
    hooks.onDone?.(0);
    return 0;
  }
  let maxVal = 0;
  for (const v of nums) if (v > maxVal) maxVal = v;
  // 最高位
  let maxBit = 0;
  while (1 << maxBit <= maxVal) maxBit++;
  if (maxBit === 0) {
    hooks.onDone?.(0);
    return 0;
  }

  let ans = 0;
  let mask = 0;
  for (let k = maxBit - 1; k >= 0; k--) {
    mask = mask | (1 << k);
    const prefixes = new Set<number>();
    for (const v of nums) prefixes.add(v & mask);
    const candidate = ans | (1 << k);
    let ok = false;
    for (const p of prefixes) {
      if (prefixes.has(p ^ candidate)) {
        ok = true;
        break;
      }
    }
    hooks.onBit?.(k, candidate, ok);
    if (ok) ans = candidate;
  }
  hooks.onDone?.(ans);
  return ans;
}

/** 朴素版（O(n²)），用于测试对照。 */
export function findMaximumXORNaive(nums: readonly number[]): number {
  if (nums.length < 2) return 0;
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      const xr = nums[i]! ^ nums[j]!;
      if (xr > best) best = xr;
    }
  }
  return best;
}
