// =============================================================================
// 单调递增数字（Monotone Increasing Digits）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface MonotoneIncreasingHooks {
  onScan?: (i: number, digits: number[]) => void;
  onMark?: (mark: number) => void;
  onResult?: (n: number) => void;
}

export interface MonotoneIncreasingResult {
  /** <= n 的最大单调（不降）数字。 */
  value: number;
}

/**
 * 单调递增数字（LeetCode 738）：求 <= n 的各位「不降」的最大数字。
 *
 * 贪心：从右向左扫描，遇到降序（d[i] > d[i+1]）就把 d[i] 减 1，并标记之后全部置 9。
 * @param n 输入数字
 * @param hooks 可选的事件钩子
 */
export function monotoneIncreasing(
  n: number,
  hooks: MonotoneIncreasingHooks = {},
): MonotoneIncreasingResult {
  if (n < 10) return { value: n };
  const digits = String(n).split('').map(Number);
  let mark = digits.length;
  for (let i = digits.length - 1; i > 0; i--) {
    hooks.onScan?.(i, [...digits]);
    if (digits[i]! < digits[i - 1]!) {
      digits[i - 1] = digits[i - 1]! - 1;
      mark = i;
      hooks.onMark?.(mark);
    }
  }
  for (let i = mark; i < digits.length; i++) digits[i] = 9;
  const value = Number(digits.join(''));
  hooks.onResult?.(value);
  return { value };
}
