// =============================================================================
// FizzBuzz · 纯算法实现
// 遍历 1..n，按整除规则分类输出。零 DOM 依赖，可独立单测。
// =============================================================================

/** 事件钩子。 */
export interface FizzBuzzHooks {
  /** 处理数字 i，返回分类标签。 */
  onNumber?: (i: number, label: string, by3: boolean, by5: boolean) => void;
  /** 完成全部输出。 */
  onResult?: (output: string[]) => void;
}

/**
 * 生成 1..n 的 FizzBuzz 序列。
 * @param n 上界（含）
 * @param hooks 可选事件钩子
 * @returns 长度 n 的字符串数组（下标 i 对应数字 i+1）
 */
export function fizzBuzz(n: number, hooks: FizzBuzzHooks = {}): string[] {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('n must be a non-negative integer');
  }
  const out: string[] = [];
  for (let i = 1; i <= n; i++) {
    const by3 = i % 3 === 0;
    const by5 = i % 5 === 0;
    let label: string;
    if (by3 && by5) label = 'FizzBuzz';
    else if (by3) label = 'Fizz';
    else if (by5) label = 'Buzz';
    else label = String(i);
    out.push(label);
    hooks.onNumber?.(i, label, by3, by5);
  }
  hooks.onResult?.(out);
  return out;
}

/** 单个数字的 FizzBuzz 分类（不遍历）。 */
export function fizzBuzzOf(i: number): string {
  if (!Number.isInteger(i) || i <= 0) {
    throw new RangeError('i must be a positive integer');
  }
  const by3 = i % 3 === 0;
  const by5 = i % 5 === 0;
  if (by3 && by5) return 'FizzBuzz';
  if (by3) return 'Fizz';
  if (by5) return 'Buzz';
  return String(i);
}
