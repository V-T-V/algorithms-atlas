// =============================================================================
// 交换指定两位 · 纯算法实现
// =============================================================================

const MAX_BIT = 31;

export interface SwapBitsHooks {
  onExtract?: (i: number, j: number, bi: number, bj: number) => void;
  onDiff?: (differ: boolean) => void;
  onResult?: (result: number) => void;
}

/**
 * 交换 32 位整数 x 的第 i 位与第 j 位（0-based，LSB = 0）。
 * 若 i == j 则原样返回。
 *   bi = (x >> i) & 1
 *   bj = (x >> j) & 1
 *   若 bi != bj：x ^= (1 << i) | (1 << j)
 */
export function swapBits(x: number, i: number, j: number, hooks: SwapBitsHooks = {}): number {
  if (!Number.isInteger(i) || i < 0 || i > MAX_BIT) {
    throw new RangeError(`i 要求 [0, 31]，收到 ${i}`);
  }
  if (!Number.isInteger(j) || j < 0 || j > MAX_BIT) {
    throw new RangeError(`j 要求 [0, 31]，收到 ${j}`);
  }
  if (!Number.isInteger(x)) {
    throw new RangeError(`x 要求整数，收到 ${x}`);
  }
  const v = x | 0;
  if (i === j) return v >>> 0;

  const bi = (v >>> i) & 1;
  const bj = (v >>> j) & 1;
  hooks.onExtract?.(i, j, bi, bj);

  const differ = bi !== bj;
  hooks.onDiff?.(differ);

  let result = v;
  if (differ) {
    result = (v ^ ((1 << i) | (1 << j))) >>> 0;
  }
  hooks.onResult?.(result >>> 0);
  return result >>> 0;
}

export function toBinary32(n: number): string {
  return (n >>> 0).toString(2).padStart(32, '0');
}
