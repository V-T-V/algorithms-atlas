// =============================================================================
// 格雷码转二进制（Gray to Binary）· 纯算法实现（零 DOM 依赖，可独立单测）
// 把格雷码（Gray code）还原为普通二进制数。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface GrayToBinaryHooks {
  /** 每完成一次「向右异或」后 mask 与累计值 b 的当前状态。 */
  onXor?: (step: number, mask: number, b: number) => void;
}

/**
 * 格雷码 → 二进制：`b = g ^ (g >> 1) ^ (g >> 2) ^ …`。
 *
 * 等价的快速写法：让 b 初值 = g，再令 mask = g >> 1，循环 `b ^= mask; mask >>= 1`
 * 直到 mask 为 0。每一位二进制位 = 它及更高位格雷码位的异或前缀。
 *
 * - 格雷码 `0b1110`（14）→ 二进制 `0b1011`（11）
 * - 格雷码 `0b1000`（8）→ 二进制 `0b1111`（15）
 *
 * 时间复杂度 `O(log 位宽) = O(1)`，空间 `O(1)`。
 *
 * @param g 格雷码整数
 * @param hooks 可选的事件钩子
 */
export function grayToBinary(g: number, hooks: GrayToBinaryHooks = {}): number {
  let b = g | 0;
  let mask = b >>> 1;
  let step = 0;
  while (mask) {
    b ^= mask;
    hooks.onXor?.(step, mask, b);
    mask >>>= 1;
    step++;
  }
  return b >>> 0;
}
