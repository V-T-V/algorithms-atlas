// =============================================================================
// MIT 位计数（Hacker's Delight popcount）· 纯算法实现
// =============================================================================

export interface MitPopcountHooks {
  onStage?: (stage: string, x: number) => void;
}

/**
 * MIT 位计数（Hacker's Delight）：32 位无符号整数 popcount。
 * 与 SWAR 同族；中间步骤采用 Hacker's Delight 的等价写法。
 * @param x 32 位无符号整数（0 ≤ x < 2^32）
 */
export function popcountMit(x: number, hooks: MitPopcountHooks = {}): number {
  if (!Number.isInteger(x) || x < 0 || x > 0xffffffff) {
    throw new RangeError(`popcountMit 要求 32 位无符号整数，收到 ${x}`);
  }
  let n = x >>> 0;
  hooks.onStage?.('input', n);

  n = n - ((n >>> 1) & 0x55555555);
  hooks.onStage?.('pair', n);

  n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
  hooks.onStage?.('nibble', n);

  n = (n + (n >>> 4)) & 0x0f0f0f0f;
  hooks.onStage?.('byte', n);

  const result = (Math.imul(n, 0x01010101) >>> 0) >>> 24;
  hooks.onStage?.('result', result);
  return result;
}
