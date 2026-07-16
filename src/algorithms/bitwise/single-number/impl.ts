// =============================================================================
// 只出现一次的数 Single Number · 纯算法实现
// 数组中所有数都出现两次，唯有一个出现一次。用异或求出它。
// =============================================================================

export interface SingleNumberHooks {
  /** 每次异或一个元素时触发，show 当前累积值。 */
  onXor?: (index: number, value: number, acc: number) => void;
}

/**
 * 找出数组中唯一出现一次的数（其余均出现两次）。
 * 利用 x ^ x = 0 和 x ^ 0 = x：全部异或后结果即所求。
 */
export function singleNumber(arr: readonly number[], hooks: SingleNumberHooks = {}): number {
  let acc = 0;
  for (let i = 0; i < arr.length; i++) {
    acc ^= arr[i]!;
    hooks.onXor?.(i, arr[i]!, acc);
  }
  return acc;
}

/**
 * 找出数组中唯一出现一次的数（其余均出现 k 次）。
 * 按位统计：对每一位模 k，剩余即答案。
 */
export function singleNumberK(arr: readonly number[], k: number): number {
  let result = 0;
  for (let bit = 0; bit < 32; bit++) {
    let count = 0;
    for (const n of arr) {
      if ((n >> bit) & 1) count++;
    }
    if (count % k !== 0) result |= 1 << bit;
  }
  return result;
}
