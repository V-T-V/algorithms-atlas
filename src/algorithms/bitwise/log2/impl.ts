// =============================================================================
// 整数 log2（Log2 Integer / floor(log2)）· 纯算法实现（零 DOM 依赖，可独立单测）
// 求 ⌊log2(x)⌋，即最高设置位的下标（0-based）。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface Log2Hooks {
  /** 给出输入 x 及求得的 floor(log2(x))。 */
  onResult?: (x: number, log: number) => void;
}

/**
 * 整数 log2：返回 `⌊log2(x)⌋`（即最高设置位下标）。
 *
 * 原理：先用「自或右移」把最高位以下全部填成 1（参考 highest-set），
 * 再数 1 的个数（popcount）即为最高位的下标。
 *
 * 1. `v |= v >>> 1; …; v |= v >>> 16`（填满低位）
 * 2. 数 1 的个数：折半 popcount
 *
 * - `log2(1)` = 0（`2^0`）
 * - `log2(8)` = 3（`2^3`）
 * - `log2(10)` = 3（介于 `2^3` 与 `2^4` 之间，取下界）
 * - `log2(0)` 约定返回 -1（无定义）
 *
 * 时间复杂度 `O(1)`，空间 `O(1)`。
 *
 * @param x 输入非负整数
 * @param hooks 可选的事件钩子
 */
export function log2(x: number, hooks: Log2Hooks = {}): number {
  if (x <= 0) {
    hooks.onResult?.(x | 0, -1);
    return -1;
  }
  let v = x >>> 0;
  // 填满低位
  v |= v >>> 1;
  v |= v >>> 2;
  v |= v >>> 4;
  v |= v >>> 8;
  v |= v >>> 16;
  // popcount（折半）
  v = v - ((v >>> 1) & 0x55555555);
  v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
  v = (v + (v >>> 4)) & 0x0f0f0f0f;
  const log = (v * 0x01010101) >>> 24;
  const result = log - 1; // 最高位下标
  hooks.onResult?.(x >>> 0, result);
  return result;
}
