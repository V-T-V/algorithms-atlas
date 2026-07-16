// =============================================================================
// 位运算除法（Bitwise Divide）· 纯算法实现（零 DOM 依赖，可独立单测）
// 不使用 *、/、% 运算符，用「移位 + 减法」模拟长除法，求整商与余数。
// =============================================================================

/** 一轮减法试商的信息。 */
export interface DivideStep {
  /** 当前试的位移 k（商位）。 */
  shift: number;
  /** 该位是否够减（商位为 1）。 */
  fit: boolean;
  /** 试减后的剩余 remainder。 */
  remainder: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DivideHooks {
  /** 每完成一位试商。 */
  onStep?: (step: DivideStep) => void;
}

/** 整数除法结果。 */
export interface DivideResult {
  /** 整商 ⌊a / b⌋（向零截断）。 */
  quotient: number;
  /** 余数，满足 a = quotient * b + remainder 且余数与 a 同号。 */
  remainder: number;
}

/**
 * 位运算整数除法（不使用 `*` `/` `%`）。
 *
 * 思路：经典「移位减法」长除法。
 * 1. 取绝对值，对商与余数的符号最后再处理。
 * 2. 从最高可能的位移 k 开始，若 `remainder - (b << k) >= 0`，则商的第 k 位为 1，
 *    从 remainder 中减去 `b << k`；否则该位为 0。
 * 3. k 从高到低递减，最终 quotient 即为商。
 *
 * 注意：JS 位运算按 32 位补码，本实现为避免溢出对 32 位范围内输入使用算术比较而非位比较，
 * 但全程不调用 `*` `/` `%`。
 *
 * - `divide(43, 5)` → `{ quotient: 8, remainder: 3 }`
 * - `divide(-43, 5)` → `{ quotient: -8, remainder: -3 }`（向零截断）
 * - `divide(7, 0)` 抛错
 *
 * 时间复杂度 `O(log a)`（位移轮数），空间 `O(1)`。
 *
 * @param a 被除数
 * @param b 除数（非零）
 * @param hooks 可选的事件钩子
 */
export function divide(a: number, b: number, hooks: DivideHooks = {}): DivideResult {
  if (b === 0 || !Number.isFinite(b)) throw new Error('divide by zero');
  const aNeg = a < 0;
  const bNeg = b < 0;
  const ua = Math.abs(a);
  const ub = Math.abs(b);
  let quotient = 0;

  // 找到最高有效位移
  let shift = 0;
  while (ub << (shift + 1) <= ua && ub << (shift + 1) > 0 && shift < 30) shift++;

  let remainder = ua;
  for (let k = shift; k >= 0; k--) {
    const shifted = ub << k;
    const fit = shifted <= remainder && shifted > 0;
    if (fit) {
      remainder -= shifted;
      quotient += 1 << k;
    }
    hooks.onStep?.({ shift: k, fit, remainder });
  }

  // 向零截断的符号处理
  const q = aNeg === bNeg ? quotient : -quotient;
  const r = aNeg ? -remainder : remainder;
  return { quotient: q, remainder: r };
}
