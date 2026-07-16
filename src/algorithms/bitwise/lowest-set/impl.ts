// =============================================================================
// 最低设置位（Lowest Set Bit / Isolate LSB）· 纯算法实现（零 DOM 依赖，可独立单测）
// 提取整数二进制表示中「最低位的 1」。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface LowestSetHooks {
  /** 每个输入 x 及其分离出的最低位 `x & -x`。 */
  onIsolate?: (x: number, isolated: number) => void;
}

/**
 * 最低设置位分离：`x & (-x)`。
 *
 * 原理：`-x = ~x + 1`（补码）。`~x` 把最低位的 1 变 0、其下所有 0 变 1，
 * 再 `+1` 会让进位恰好停在原最低位 1 的位置，更高位全部取反。
 * 与原 `x` 相与后，仅保留这一个 1。
 *
 * - `12 (1100)` → `4 (0100)`
 * - `10 (1010)` → `2 (0010)`
 * - `x = 0` 时结果为 0（无设置位）
 *
 * 返回值是该最低位本身的「权值」(2^k)。若需要其位下标，可用 `Math.log2` 或再调用本库的 log2。
 *
 * @param x 输入整数
 * @param hooks 可选的事件钩子
 */
export function lowestSet(x: number, hooks: LowestSetHooks = {}): number {
  const v = x | 0;
  const isolated = v & -v; // -v 即 (~v + 1)
  hooks.onIsolate?.(v, isolated);
  return isolated;
}
