// =============================================================================
// 位运算符号（Bitwise Sign）· 纯算法实现（零 DOM 依赖，可独立单测）
// 无分支求整数的符号：返回 -1（负）、0（零）、1（正）。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SignHooks {
  /** 给出输入 x、其是否非零的标志位，以及最终符号。 */
  onResolve?: (x: number, nonzero: number, sign: number) => void;
}

/**
 * 位运算符号函数：返回 `-1`（x<0）、`0`（x=0）、`1`（x>0）。
 *
 * 原理（branchless，面向 32 位有符号整数）：
 * 1. `signBit = x >> 31` —— 负数得 -1（全 1），非负得 0
 * 2. `nonzero = (x | -x) >> 31` —— `x | -x` 在 x≠0 时最高位必为 1（得 -1），x=0 时为 0
 * 3. `sign = (signBit | 1) & nonzero`
 *    - x>0：signBit=0 → `0 | 1 = 1`，与 nonzero=-1 相与得 1
 *    - x=0：nonzero=0 → 0
 *    - x<0：signBit=-1 → `-1 | 1 = -1`，与 nonzero=-1 相与得 -1
 *
 * 时间复杂度 `O(1)`，空间 `O(1)`。
 *
 * @param x 输入整数
 * @param hooks 可选的事件钩子
 */
export function sign(x: number, hooks: SignHooks = {}): number {
  const v = x | 0;
  const signBit = v >> 31; // 0 或 -1
  const nonzero = (v | -v) >> 31; // 0 或 -1
  const result = (signBit | 1) & nonzero; // 1 / 0 / -1
  hooks.onResolve?.(v, nonzero, result);
  return result;
}
