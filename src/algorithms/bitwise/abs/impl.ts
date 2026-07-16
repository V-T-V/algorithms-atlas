// =============================================================================
// 位运算绝对值（Bitwise Abs）· 纯算法实现（零 DOM 依赖，可独立单测）
// 不使用条件分支与 Math.abs，仅用位运算求得 32 位整数的绝对值。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AbsHooks {
  /** 给出输入 x 及其符号掩码 mask（0 或 -1）。 */
  onSign?: (x: number, mask: number) => void;
  /** 给出按位异或后的中间值以及最终绝对值。 */
  onResult?: (xored: number, result: number) => void;
}

/**
 * 位运算绝对值（面向 32 位有符号整数）。
 *
 * 原理：对 32 位整数 `x`，算术右移 `x >> 31` 得到「符号掩码」：
 * - 当 x ≥ 0 时 mask = 0
 * - 当 x < 0 时 mask = -1（所有位为 1）
 *
 * 然后 `x ^ mask` 后再减 mask：
 * - mask = 0 时：`(x ^ 0) - 0 = x`
 * - mask = -1 时：`(x ^ -1) - (-1) = ~x + 1 = -x`
 *
 * 注意：JavaScript 位运算按 32 位补码工作，故先 `x | 0` 截断到 32 位。
 * 对 `INT_MIN`（-2147483648）会溢出，其「绝对值」仍按位运算逻辑返回 -2147483648。
 *
 * @param x 输入整数
 * @param hooks 可选的事件钩子
 */
export function abs(x: number, hooks: AbsHooks = {}): number {
  const v = x | 0; // 截断到 32 位有符号整数
  const mask = v >> 31; // 符号掩码：0 或 -1
  hooks.onSign?.(v, mask);
  const xored = v ^ mask; // 非负时不变；负时按位取反
  const result = (xored - mask) | 0; // 非负时 -0；负时 +1（补码取反加一）
  hooks.onResult?.(xored, result);
  return result;
}
