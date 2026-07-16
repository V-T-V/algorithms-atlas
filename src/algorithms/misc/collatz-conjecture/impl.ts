// =============================================================================
// 考拉兹猜想（Collatz Conjecture / 3n+1）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每一步的数值变化。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface CollatzHooks {
  /** 从当前值 n 走到下一个值 next（含起点 n 本身的 onStep(n, n) 作为初始帧）。 */
  onStep?: (n: number, next: number) => void;
  /** 序列到达 1（终止）。 */
  onEnd?: (steps: number, maxValue: number) => void;
}

export interface CollatzResult {
  /** 完整序列（从起始值到 1，含两端）。 */
  sequence: number[];
  /** 经历的步数（即序列长度减 1）。 */
  steps: number;
  /** 序列中出现的最大值（峰值）。 */
  maxValue: number;
}

/**
 * 考拉兹（3n+1）猜想迭代：
 *   - 若 n 为偶数：n → n/2
 *   - 若 n 为奇数（且 n>1）：n → 3n+1
 *   - 直到 n === 1 停止
 *
 * 猜想断言：任意正整数起始，最终都必定到达 1。
 *
 * @param start 起始正整数
 * @param maxSteps 安全上限，防止异常输入死循环（默认 1e6）
 * @param hooks 可选事件钩子
 */
export function collatzConjecture(
  start: number,
  maxSteps: number = 1_000_000,
  hooks: CollatzHooks = {},
): CollatzResult {
  if (start < 1) {
    return { sequence: [], steps: 0, maxValue: NaN };
  }
  const sequence: number[] = [start];
  let n = start;
  let maxValue = start;
  let steps = 0;
  hooks.onStep?.(n, n);

  while (n !== 1 && steps < maxSteps) {
    const next = n % 2 === 0 ? n / 2 : 3 * n + 1;
    hooks.onStep?.(n, next);
    n = next;
    sequence.push(n);
    if (n > maxValue) maxValue = n;
    steps++;
  }
  hooks.onEnd?.(steps, maxValue);
  return { sequence, steps, maxValue };
}
