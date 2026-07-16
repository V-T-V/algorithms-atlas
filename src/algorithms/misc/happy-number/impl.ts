// =============================================================================
// 快乐数（Happy Number）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface HappyNumberHooks {
  /** 进入一轮：当前数为 n，即将计算各位平方和 sum。 */
  onStep?: (n: number, sum: number) => void;
  /** 检测到环，提前终止。seen 表示导致重复的值。 */
  onCycle?: (seen: number) => void;
  /** 到达 1（是快乐数）。 */
  onHappy?: () => void;
}

/**
 * 计算正整数 n 各位数字的平方和。
 * 例如 19 → 1² + 9² = 1 + 81 = 82。
 */
export function sumOfSquaresOfDigits(n: number): number {
  let sum = 0;
  let x = n;
  while (x > 0) {
    const d = x % 10;
    sum += d * d;
    x = Math.floor(x / 10);
  }
  return sum;
}

/**
 * 判断 n 是否为「快乐数」。
 *
 * 反复将 n 替换为其各位平方和：
 *   - 若到达 1，则为快乐数（返回 true）；
 *   - 若某次和重复出现（陷入环），则非快乐数（返回 false）。
 *
 * @param n 待判定的正整数
 * @param hooks 可选事件钩子
 * @returns 是否为快乐数
 */
export function isHappyNumber(n: number, hooks: HappyNumberHooks = {}): boolean {
  if (n < 1) return false;

  const seen = new Set<number>();
  let cur = n;

  while (cur !== 1) {
    const sum = sumOfSquaresOfDigits(cur);
    hooks.onStep?.(cur, sum);
    if (seen.has(sum)) {
      hooks.onCycle?.(sum);
      return false;
    }
    seen.add(sum);
    cur = sum;
  }

  hooks.onHappy?.();
  return true;
}
