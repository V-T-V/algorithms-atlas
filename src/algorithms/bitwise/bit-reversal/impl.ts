// =============================================================================
// 位反转（Bit Reversal）· 纯算法实现（零 DOM 依赖，可独立单测）
// 在给定比特位宽 bits 内，把整数的二进制位顺序反转（最低位↔最高位）。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BitReversalHooks {
  /** 每完成一次「按位块交换」后 v 的当前值。 */
  onSwap?: (step: number, v: number) => void;
}

/**
 * 位反转：返回在 `bits` 位宽内反转后的整数。
 *
 * 做法（branchless，分治交换相邻位块）：
 * 1. 交换相邻 1 位：`v = ((v & 0xAAAAAAAA) >>> 1) | ((v & 0x55555555) << 1)`
 * 2. 交换相邻 2 位组：`v = ((v & 0xCCCCCCCC) >>> 2) | ((v & 0x33333333) << 2)`
 * 3. 交换相邻 4 位组（字节内）：`v = ((v & 0xF0F0F0F0) >>> 4) | ((v & 0x0F0F0F0F) << 4)`
 * 4. 交换相邻字节：`v = ((v & 0xFF00FF00) >>> 8) | ((v & 0x00FF00FF) << 8)`
 * 5. 交换相邻 16 位：`v = (v >>> 16) | (v << 16)`
 *
 * 最后右移 `(32 - bits)` 位，只保留低 `bits` 位作为结果。
 *
 * - `bitReversal(0b0011, 4)` → `0b1100 = 12`
 * - `bitReversal(1, 8)` → `0b10000000 = 128`
 *
 * 时间复杂度 `O(1)`，空间 `O(1)`。
 *
 * @param x 输入非负整数
 * @param bits 位宽（1~32）
 * @param hooks 可选的事件钩子
 */
export function bitReversal(x: number, bits: number, hooks: BitReversalHooks = {}): number {
  const b = Math.max(0, Math.min(32, bits | 0));
  let v = x >>> 0;
  v = ((v & 0xaaaaaaaa) >>> 1) | ((v & 0x55555555) << 1);
  hooks.onSwap?.(0, v >>> 0);
  v = ((v & 0xcccccccc) >>> 2) | ((v & 0x33333333) << 2);
  hooks.onSwap?.(1, v >>> 0);
  v = ((v & 0xf0f0f0f0) >>> 4) | ((v & 0x0f0f0f0f) << 4);
  hooks.onSwap?.(2, v >>> 0);
  v = ((v & 0xff00ff00) >>> 8) | ((v & 0x00ff00ff) << 8);
  hooks.onSwap?.(3, v >>> 0);
  v = (v >>> 16) | (v << 16);
  hooks.onSwap?.(4, v >>> 0);
  return (v >>> (32 - b)) >>> 0;
}
