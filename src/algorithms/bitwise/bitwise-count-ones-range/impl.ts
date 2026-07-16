// =============================================================================
// 区间内 1 的个数（Count Set Bits in Range）· 纯算法实现
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface CountOnesRangeHooks {
  /** 处理第 k 位为 1 时贡献多少。 */
  onBit?: (bit: number, contribution: number) => void;
  /** 完成前缀 S(n)。 */
  onPrefix?: (n: number, value: number) => void;
  /** 完成。 */
  onDone?: (count: number) => void;
}

/** popcount（Kernighan 法）。 */
function popcount(n: number): number {
  let c = 0;
  let x = n;
  while (x > 0) {
    x = x - (x & -x); // 清最低 1（仅对安全整数成立）
    c++;
  }
  return c;
}

/**
 * 前缀 1 的个数 S(n) = Σ_{i=0}^{n} popcount(i)（n >= 0），O(log n)。
 */
export function countSetBitsUpTo(n: number, hooks?: CountOnesRangeHooks): number {
  if (n <= 0) {
    hooks?.onPrefix?.(n, 0);
    return 0;
  }
  let count = 0;
  let k = 0;
  let remaining = n;
  while (1 << (k + 1) <= n) k++; // 最高有效位
  for (let bit = k; bit >= 0; bit--) {
    const power = 1 << bit;
    if ((remaining & power) !== 0) {
      // 低 bit 位所有组合贡献 bit * 2^(bit-1) 个 1（bit=0 时为 0）
      const lowContribution = bit === 0 ? 0 : bit * (1 << (bit - 1));
      // 该位为 1 的「额外」1 的个数 = remaining - power + 1
      const extraContribution = remaining - power + 1;
      const contribution = lowContribution + extraContribution;
      count += contribution;
      hooks?.onBit?.(bit, contribution);
      remaining -= power;
    }
  }
  hooks?.onPrefix?.(n, count);
  return count;
}

/**
 * 区间内 1 的个数 [lo, hi]（含两端）。
 *
 * @param lo >= 0
 * @param hi >= lo
 * @param hooks 可选的事件钩子
 */
export function countSetBitsRange(lo: number, hi: number, hooks: CountOnesRangeHooks = {}): number {
  if (lo < 0 || hi < lo) throw new RangeError(`要求 0 <= lo <= hi，收到 lo=${lo}, hi=${hi}`);
  const high = countSetBitsUpTo(hi, hooks);
  const low = lo === 0 ? 0 : countSetBitsUpTo(lo - 1, hooks);
  const result = high - low;
  hooks.onDone?.(result);
  return result;
}

/** 朴素版（O(n log n)），用于测试对照。 */
export function countSetBitsRangeNaive(lo: number, hi: number): number {
  let total = 0;
  for (let v = lo; v <= hi; v++) total += popcount(v);
  return total;
}
