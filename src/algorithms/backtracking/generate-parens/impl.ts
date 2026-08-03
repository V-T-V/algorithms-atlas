// =============================================================================
// 括号生成（Generate Parentheses）· 纯算法实现
// 经典回溯：生成 n 对括号的所有合法（有效）组合。
//
// 核心：维护已用的左括号数 open 与已用的右括号数 close，
//   - 若 open < n：可放 '('
//   - 若 close < open：可放 ')'（保证任意前缀左括号不少于右括号 → 合法）
//   - 当 open == close == n 时得到一个完整合法串。
//
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步：
//   - onAdd：放入一个括号（给出当前串、open、close）
//   - onBacktrack：撤销最近一次 onAdd
//   - onResult：找到一个合法串
//   - onDone：搜索结束
// =============================================================================

export interface GenerateParensHooks {
  /** 放入一个字符 ch（'(' 或 ')'），给出放入后的 open/close 计数与当前串。 */
  onAdd?: (ch: '(' | ')', open: number, close: number, current: string) => void;
  /** 撤销最近一次放入（回溯）。 */
  onBacktrack?: (ch: '(' | ')') => void;
  /** 找到一个完整合法串。 */
  onResult?: (s: string) => void;
  /** 搜索结束。 */
  onDone?: (results: string[]) => void;
}

/**
 * 生成 n 对括号的所有合法组合。
 *
 * 结果数量为第 n 个卡特兰数 C_n = (1/(n+1))·C(2n, n)。
 *
 * @param n 括号对数（非负整数）
 * @param hooks 可选事件钩子
 * @returns 全部合法括号串
 */
export function generateparens(n: number, hooks: GenerateParensHooks = {}): string[] {
  if (!Number.isInteger(n) || n < 0) return [];
  if (n === 0) {
    hooks.onResult?.('');
    hooks.onDone?.(['']);
    return [''];
  }

  const out: string[] = [];
  const cur: string[] = [];

  const backtrack = (open: number, close: number): void => {
    // 完成：已放入 n 对
    if (cur.length === n * 2) {
      const s = cur.join('');
      out.push(s);
      hooks.onResult?.(s);
      return;
    }
    // 可放左括号：已用左括号 < n
    if (open < n) {
      cur.push('(');
      hooks.onAdd?.('(', open + 1, close, cur.join(''));
      backtrack(open + 1, close);
      cur.pop();
      hooks.onBacktrack?.('(');
    }
    // 可放右括号：已用右括号 < 已用左括号（保证前缀合法）
    if (close < open) {
      cur.push(')');
      hooks.onAdd?.(')', open, close + 1, cur.join(''));
      backtrack(open, close + 1);
      cur.pop();
      hooks.onBacktrack?.(')');
    }
  };

  backtrack(0, 0);
  hooks.onDone?.(out);
  return out;
}
