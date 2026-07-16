// =============================================================================
// 生成括号（Generate Parentheses）· 纯算法实现
// 经典回溯：在 2n 个位置上选择 '(' 或 ')'，约束「右括号数 ≤ 左括号数」。
// 生成所有 n 对合法括号的组合，结果数 = 卡塔兰数 C_n。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露 加入字符 / 回溯 / 收集。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface GenerateParenthesesHooks {
  /** 在当前串后追加一个字符（'(' 或 ')'）。 */
  onAdd?: (current: string, ch: string, open: number, close: number) => void;
  /** 回溯（弹出最后一个字符）。 */
  onBacktrack?: (current: string, open: number, close: number) => void;
  /** 收集到一个合法的完整结果。 */
  onCollect?: (result: string, index: number) => void;
}

/**
 * 生成所有 n 对合法括号的组合（回溯法）。
 *
 * 约束：
 *  - open（已用 '(' 数）≤ n
 *  - close（已用 ')' 数）≤ open（保证任意前缀合法）
 *  - 当 open = close = n 时收集结果
 *
 * @param n 括号对数
 * @param hooks 可选事件钩子
 * @returns 所有合法括号字符串
 */
export function generateParentheses(n: number, hooks: GenerateParenthesesHooks = {}): string[] {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`generateParentheses 要求非负整数，收到 ${n}`);
  }
  if (n === 0) return [''];

  const results: string[] = [];
  const buf: string[] = [];

  const backtrack = (open: number, close: number): void => {
    if (open === n && close === n) {
      const s = buf.join('');
      results.push(s);
      hooks.onCollect?.(s, results.length - 1);
      return;
    }
    // 选 '('
    if (open < n) {
      buf.push('(');
      hooks.onAdd?.(buf.join(''), '(', open + 1, close);
      backtrack(open + 1, close);
      buf.pop();
      hooks.onBacktrack?.(buf.join(''), open, close);
    }
    // 选 ')'
    if (close < open) {
      buf.push(')');
      hooks.onAdd?.(buf.join(''), ')', open, close + 1);
      backtrack(open, close + 1);
      buf.pop();
      hooks.onBacktrack?.(buf.join(''), open, close);
    }
  };

  backtrack(0, 0);
  return results;
}

/**
 * 第 n 个卡塔兰数 C_n = (2n)! / ((n+1)! n!)，即 n 对括号的合法组合数。
 * 用于断言结果数量。
 */
export function catalan(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`catalan 要求非负整数，收到 ${n}`);
  }
  // C_n = C(2n, n) / (n+1)
  let c = 1;
  for (let i = 0; i < n; i++) {
    c = (c * (2 * n - i)) / (i + 1);
  }
  return Math.round(c / (n + 1));
}
