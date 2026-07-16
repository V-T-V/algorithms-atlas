// 递归打印 1 到 n · 纯算法实现

/** 事件钩子。 */
export interface PrintNumbersHooks {
  /** 递归进入某层（参数 n）。 */
  onRecurse?: (n: number, depth: number) => void;
  /** 基线命中（n < 1）。 */
  onBase?: () => void;
  /** 某层「打印」（输出）一个数。 */
  onPrint?: (value: number, depth: number) => void;
}

/**
 * 递归打印 1 到 n（升序），返回打印的数字数组。
 *
 * @param n 上界（>=0；若 0 返回空数组）
 * @param hooks 可选事件钩子
 * @returns 打印序列 [1, 2, ..., n]
 */
export function printNumbers(
  n: number,
  hooks: PrintNumbersHooks = {},
  depth: number = 0,
): number[] {
  if (!Number.isInteger(n) || n < 0) throw new RangeError(`n 须为非负整数: ${n}`);
  if (n < 1) {
    hooks.onBase?.();
    return [];
  }
  hooks.onRecurse?.(n, depth);
  const rest = printNumbers(n - 1, hooks, depth + 1);
  hooks.onPrint?.(n, depth);
  return [...rest, n];
}
