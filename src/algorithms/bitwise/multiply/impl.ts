// =============================================================================
// 位运算乘法（Bitwise Multiply / Russian Peasant）· 纯算法实现（零 DOM 依赖，可独立单测）
// 不使用 * 运算符，用「移位 + 加法」模拟二进制乘法（俄国农夫乘法）。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MultiplyHooks {
  /** 每处理乘数的一位：该位是否为 1、当前累加结果 acc、当前位移后的被乘数 a。 */
  onBit?: (step: number, bit: 0 | 1, acc: number, a: number) => void;
}

/**
 * 位运算乘法（俄国农夫乘法 / shift-and-add）。
 *
 * 原理：把乘法 b 分解为各二进制位的加权和——
 * - 若 b 当前最低位为 1，则 `acc += a`
 * - 然后 `a <<= 1`、`b >>>= 1`，重复直到 b 为 0
 *
 * 这正是硬件乘法器的「移位累加」过程。
 *
 * - `multiply(13, 11)` = 143
 * - `multiply(-3, 4)` = -12
 *
 * 注意：本实现用算术运算（加法/减法）处理符号，结果按 32 位截断（`| 0`）。
 * 因此对极大乘积会有 32 位回绕，与 `(a * b) | 0` 一致。
 *
 * 时间复杂度 `O(log b)`（b 的位数），空间 `O(1)`。
 *
 * @param a 被乘数
 * @param b 乘数
 * @param hooks 可选的事件钩子
 */
export function multiply(a: number, b: number, hooks: MultiplyHooks = {}): number {
  // 处理符号：以绝对值做移位累加，最后统一补号
  let sign = 1;
  let ua = a | 0;
  let ub = b | 0;
  if (ua < 0) {
    ua = -ua;
    sign = -sign;
  }
  if (ub < 0) {
    ub = -ub;
    sign = -sign;
  }
  let acc = 0;
  let step = 0;
  while (ub > 0) {
    const bit = (ub & 1) as 0 | 1;
    if (bit) acc = (acc + ua) | 0;
    hooks.onBit?.(step, bit, acc, ua);
    ua = ua << 1;
    ub = ub >>> 1;
    step++;
  }
  return (sign < 0 ? -acc : acc) | 0;
}
