// =============================================================================
// 位运算绝对值 v2 · 纯算法实现
// 显式拆分 (x ^ mask) - mask 的两步流程，强调算术右移生成掩码。
// =============================================================================

export interface AbsV2Hooks {
  onSign?: (x: number, mask: number) => void;
  onXor?: (xored: number) => void;
  onResult?: (result: number) => void;
}

/**
 * 位运算绝对值 v2：显式三步。
 *   mask   = x >> 31        （算术右移：负数得 -1 = 全 1，非负得 0）
 *   xored  = x ^ mask       （负数按位取反；非负不变）
 *   result = xored - mask   （负数 +1 完成补码取反加一；非负 -0）
 *
 * 注意：JS 位运算按 32 位补码工作，故 x | 0 截断。
 * 对 INT_MIN (-2147483648) 溢出，返回仍为 -2147483648。
 */
export function bitwiseAbsV2(x: number, hooks: AbsV2Hooks = {}): number {
  const v = x | 0;
  const mask = v >> 31;
  hooks.onSign?.(v, mask);
  const xored = (v ^ mask) | 0;
  hooks.onXor?.(xored);
  const result = (xored - mask) | 0;
  hooks.onResult?.(result);
  return result;
}

export function toBinary32(n: number): string {
  return (n >>> 0).toString(2).padStart(32, '0');
}
