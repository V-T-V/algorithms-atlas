// =============================================================================
// 循环移位（Bitwise Rotate / Circular Shift）· 纯算法实现（零 DOM 依赖，可独立单测）
// 在 32 位字内把位「环形旋转」，移出的位从另一端移回，不丢失信息。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface RotateHooks {
  /** 给出规范化后的位移 r 与旋转后的结果。 */
  onRotate?: (r: number, result: number) => void;
}

/**
 * 32 位循环左移：把 x 的低 (32 - r) 位左移、高 r 位回绕到低位。
 *
 * 公式（branchless）：
 * `result = (x << r) | (x >>> (32 - r))`
 *
 * 其中 `r = ((shift % 32) + 32) % 32` 把任意（含负）位移规范化到 `[0, 32)`。
 * 负位移表示「循环右移」（即等价于左移 `32 - |shift|`）。
 *
 * - `rotate(0x12345678, 8)` → `0x34567812`
 * - `rotate(0x12345678, -8)` → `0x78123456`（循环右移 8）
 * - `rotate(x, 0)` = `x`
 *
 * 时间复杂度 `O(1)`，空间 `O(1)`。
 *
 * @param x 输入整数（按 32 位无符号解释）
 * @param shift 位移（正=左移，负=右移，自动按 32 取模）
 * @param hooks 可选的事件钩子
 */
export function rotate(x: number, shift: number, hooks: RotateHooks = {}): number {
  const r = (((shift | 0) % 32) + 32) % 32;
  const v = x >>> 0;
  const result = r === 0 ? v : ((v << r) | (v >>> (32 - r))) >>> 0;
  hooks.onRotate?.(r, result);
  return result;
}
