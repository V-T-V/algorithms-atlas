// =============================================================================
// 位运算加法（Bitwise Add）· 纯算法实现（零 DOM 依赖，可独立单测）
// 不使用 + 运算符，仅用 AND/XOR/NOT/<< 模拟二进制加法器。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface AddHooks {
  /** 每完成一轮进位传播：当前无进位和 sum 与新的进位 carry。 */
  onCarry?: (iter: number, sum: number, carry: number) => void;
}

/**
 * 位运算加法（面向 32 位有符号整数）。
 *
 * 原理（半加器/全加器逻辑）：
 * - `sum = a ^ b`：不考虑进位时的「本位和」
 * - `carry = (a & b) << 1`：每一位同时为 1 时向高位进位
 *
 * 把 sum 当作新的 a、carry 当作新的 b，重复直到 carry = 0。
 * 本质是把「加法」不断转化为「无进位和 + 进位」，最终进位归零。
 *
 * JS 位运算按 32 位补码工作；返回值经 `| 0` 落回 32 位有符号整数。
 *
 * @param a 加数
 * @param b 加数
 * @param hooks 可选的事件钩子
 */
export function add(a: number, b: number, hooks: AddHooks = {}): number {
  let x = a | 0;
  let y = b | 0;
  let iter = 0;
  while (y !== 0) {
    const sum = x ^ y; // 无进位和
    const carry = (x & y) << 1; // 进位
    hooks.onCarry?.(iter, sum, carry);
    x = sum;
    y = carry;
    iter++;
  }
  return x | 0;
}
