// =============================================================================
// 位运算交换（Bitwise Swap / XOR Swap）· 纯算法实现（零 DOM 依赖，可独立单测）
// 不借助临时变量，仅用 XOR 交换两个 32 位整数。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface SwapHooks {
  /** 每一步 XOR 后的 (a, b) 当前值。step ∈ {0,1,2}。 */
  onStep?: (step: number, a: number, b: number) => void;
}

/**
 * 位运算交换（XOR Swap），原地修改传入的对象字段。
 *
 * 三次异或交换 a、b（要求 a、b 不为同一存储位置）：
 * 1. `a = a ^ b`
 * 2. `b = a ^ b`（= 原 a）
 * 3. `a = a ^ b`（= 原 b）
 *
 * 由于 JS 没有指针，本实现接收一个二元组 `[a, b]` 并返回交换后的新元组，
 * 同时通过钩子暴露三次异或的中间状态。
 *
 * @param pair 待交换的二元组 `[a, b]`
 * @param hooks 可选的事件钩子
 * @returns 交换后的二元组 `[b, a]`
 */
export function swap(pair: readonly [number, number], hooks: SwapHooks = {}): [number, number] {
  let [a, b] = pair;
  a = a | 0;
  b = b | 0;
  a = a ^ b;
  hooks.onStep?.(0, a, b);
  b = a ^ b; // 现在 b = 原 a
  hooks.onStep?.(1, a, b);
  a = a ^ b; // 现在 a = 原 b
  hooks.onStep?.(2, a, b);
  return [a, b];
}
