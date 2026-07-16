// =============================================================================
// 下一个 2 的幂（Next Power of 2）· 纯算法实现（零 DOM 依赖，可独立单测）
// 求「不小于 x 的最小 2 的幂」(向上取整到 2 的幂)，全程仅用位运算。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface NextPower2Hooks {
  /** 每完成一次「自或右移」后 v 的当前值。 */
  onPropagate?: (step: number, v: number) => void;
}

/**
 * 下一个 2 的幂：返回 `≥ x` 的最小 2 的幂（x 本身是 2 的幂时返回 x）。
 *
 * 做法（branchless，对 `x-1` 做位填充后 +1）：
 * 1. `v = x - 1`（处理 x 已是 2 的幂的情况，使结果不翻倍）
 * 2. `v |= v >>> 1; v |= v >>> 2; v |= v >>> 4; v |= v >>> 8; v |= v >>> 16`（把最高位以下填满 1）
 * 3. 返回 `v + 1`（进位得到下一个 2 的幂）
 *
 * - `nextPower2(5)` = 8
 * - `nextPower2(8)` = 8（已是 2 的幂）
 * - `nextPower2(1)` = 1
 * - `nextPower2(0)` = 1
 *
 * 时间复杂度 `O(1)`，空间 `O(1)`。
 *
 * @param x 输入非负整数
 * @param hooks 可选的事件钩子
 */
export function nextPower2(x: number, hooks: NextPower2Hooks = {}): number {
  if (x <= 1) return 1;
  let v = (x - 1) >>> 0;
  const shifts = [1, 2, 4, 8, 16];
  shifts.forEach((s, i) => {
    v |= v >>> s;
    hooks.onPropagate?.(i, v >>> 0);
  });
  return (v + 1) >>> 0;
}
