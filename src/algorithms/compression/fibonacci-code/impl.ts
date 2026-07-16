// =============================================================================
// Fibonacci编码（Fibonacci Coding）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 用 Fibonacci 数制表示整数，末尾追加 1 作为分隔（黄金比通用码）。
// =============================================================================

/** Fibonacci 数列（F1=1, F2=2 ...）。 */
export const FIBS: readonly number[] = (() => {
  const f = [1, 2];
  while (f[f.length - 1]! < 1e15) f.push(f[f.length - 1]! + f[f.length - 2]!);
  return f;
})();

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface FibonacciCodeHooks {
  onEncode?: (value: number, bits: string) => void;
}

export interface FibonacciCodeResult {
  /** 编码后的比特串。 */
  bits: string;
}

/**
 * Fibonacci 编码：把非负整数 +1 表示为 Zeckendorf 和，末尾补一个 1 作为分隔。
 * @param values 非负整数
 * @param hooks 可选的事件钩子
 */
export function fibonacciCode(
  values: number[],
  hooks: FibonacciCodeHooks = {},
): FibonacciCodeResult {
  let bits = '';
  for (const v of values) {
    const n = v + 1; // Fibonacci 编码通常对 n>=1，故 +1
    // 找最大的不超过 n 的 Fibonacci 下标
    let hi = 0;
    while (FIBS[hi + 1]! <= n) hi++;
    let code = '';
    let rem = n;
    let seenOne = false;
    for (let i = hi; i >= 0; i--) {
      if (FIBS[i]! <= rem) {
        code += '1';
        rem -= FIBS[i]!;
        if (seenOne) {
          // Zeckendorf 不允许连续 1；此处应不会发生
        }
        seenOne = true;
      } else {
        code += '0';
        seenOne = false;
      }
    }
    code = code.split('').reverse().join('') + '1'; // 低位在前 + 分隔 1
    bits += code;
    hooks.onEncode?.(v, code);
  }
  return { bits };
}
