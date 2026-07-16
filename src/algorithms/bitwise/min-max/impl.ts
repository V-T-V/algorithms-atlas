// =============================================================================
// 位运算 min/max（Bitwise Min/Max）· 纯算法实现（零 DOM 依赖，可独立单测）
// 不使用比较运算符与三元，仅用算术与位运算无分支求两数的最小 / 最大值。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MinMaxHooks {
  /** 给出 a、b 以及「b − a」与由此推导出的最小值、最大值。 */
  onResolve?: (a: number, b: number, diff: number, min: number, max: number) => void;
}

/** min/max 结果对。 */
export interface MinMaxResult {
  min: number;
  max: number;
}

/**
 * 无分支求两数的最小与最大值（面向 32 位有符号整数）。
 *
 * 原理：令 `diff = b - a`。
 * - 若 `diff >= 0`，则 `b >= a`：`min = a`、`max = b`
 * - 若 `diff < 0`，则 `b < a`：`min = b`、`max = a`
 *
 * 用符号掩码避免分支：`mask = diff >> 31`（非负时为 0、负时为 -1，全 1）。
 * 利用 XOR 技巧按掩码选取：
 * - `min = a ^ ((a ^ b) & mask)` —— mask=0 取 a；mask=-1 取 b
 * - `max = b ^ ((a ^ b) & mask)` —— mask=0 取 b；mask=-1 取 a
 *
 * 时间复杂度 `O(1)`，空间 `O(1)`。
 *
 * @param a 数一
 * @param b 数二
 * @param hooks 可选的事件钩子
 */
export function minMax(a: number, b: number, hooks: MinMaxHooks = {}): MinMaxResult {
  const x = a | 0;
  const y = b | 0;
  const diff = (y - x) | 0;
  const mask = diff >> 31; // 0 或 -1
  const min = (x ^ ((x ^ y) & mask)) | 0;
  const max = (y ^ ((x ^ y) & mask)) | 0;
  hooks.onResolve?.(x, y, diff, min, max);
  return { min, max };
}
