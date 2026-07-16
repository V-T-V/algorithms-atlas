// =============================================================================
// CYK 算法（Cocke–Younger–Kasami）· 纯算法实现
// 在 Chomsky 范式（CNF）文法下用二维 DP 判断输入串是否可推导。
//   CNF 规则：A → BC（两非终结符）或 A → a（单终结符）
//   DP：cell[i][len] = 能推导出 s[i..i+len-1] 的非终结符集合
//   按 len 从 1 到 n 填表，每格枚举切分点 k∈[1,len-1]
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** CNF 文法。 */
export interface CnfGrammar {
  /** 起始非终结符。 */
  start: string;
  /** A → a 形式：terminalRules[A] = [a, b, ...] */
  terminalRules: Record<string, string[]>;
  /** A → B C 形式：binaryRules 列出 {lhs, rhs1, rhs2} */
  binaryRules: Array<{ lhs: string; rhs1: string; rhs2: string }>;
}

/** 算法执行过程中的事件钩子。任一可选。 */
export interface CykHooks {
  /** 计算完一个 cell（i=起点, len=长度, nonterminals=可推导集）。 */
  onCell?: (i: number, len: number, nonterminals: string[]) => void;
  /** 填表完成，输出是否可推导。 */
  onResult?: (accepted: boolean) => void;
}

/**
 * CYK 解析：判断 input 能否由 grammar 推导。
 *
 * @param input 输入字符串（每个字符是一个终结符）
 * @param grammar CNF 文法
 * @param hooks 可选事件钩子
 * @returns 是否被文法接受
 */
export function cykParse(input: string, grammar: CnfGrammar, hooks: CykHooks = {}): boolean {
  const n = input.length;
  if (n === 0) {
    // CNF 下空串一般不可推导（除非允许 S→ε 特例，本实现不处理）
    hooks.onResult?.(false);
    return false;
  }

  // cell[i][len]：子串 input[i..i+len-1] 能推出的非终结符集合
  // 用 Set 数组；len 从 1..n
  const cell: Array<Array<Set<string>>> = [];
  for (let i = 0; i < n; i++) {
    cell.push([]);
    for (let len = 1; len <= n - i; len++) {
      cell[i]!.push(new Set<string>());
    }
  }
  // 访问辅助：cell[i][len] 用 index = len-1
  const get = (i: number, len: number): Set<string> => cell[i]![len - 1]!;

  // —— len = 1：A → a ——
  for (let i = 0; i < n; i++) {
    const a = input[i]!;
    const set = get(i, 1);
    for (const [nt, terms] of Object.entries(grammar.terminalRules)) {
      if (terms.includes(a)) set.add(nt);
    }
    hooks.onCell?.(i, 1, [...set]);
  }

  // —— len = 2..n ——
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len <= n; i++) {
      const set = get(i, len);
      // 枚举切分点 k：左长 k，右长 len-k
      for (let k = 1; k < len; k++) {
        const leftSet = get(i, k);
        const rightSet = get(i + k, len - k);
        if (leftSet.size === 0 || rightSet.size === 0) continue;
        for (const rule of grammar.binaryRules) {
          if (leftSet.has(rule.rhs1) && rightSet.has(rule.rhs2)) {
            set.add(rule.lhs);
          }
        }
      }
      hooks.onCell?.(i, len, [...set]);
    }
  }

  const accepted = get(0, n).has(grammar.start);
  hooks.onResult?.(accepted);
  return accepted;
}

// ---------------------------------------------------------------------------
// 示例文法（CNF）：识别 {a^n b^n | n ≥ 1}
//   原始文法 S → a S b | ab，转 CNF：
//     S  → A S1 | A B   （A=a，S1=中间）
//     S1 → S B          （递归层：a^n b^n 的「外层」）
//     A  → a
//     B  → b
//   推导 aabb：S ⇒ A S1 ⇒ a S1 ⇒ a S B ⇒ a A B B ⇒ a a b b ✓
//   推导 aaabbb：S ⇒ A S1 ⇒ a S1 ⇒ a S B ⇒ a A S1 B ⇒ a a S1 B
//                ⇒ a a S B B ⇒ a a A B B B ⇒ a a a b b b ✓
// ---------------------------------------------------------------------------
export const SAMPLE_GRAMMAR: CnfGrammar = {
  start: 'S',
  terminalRules: { A: ['a'], B: ['b'] },
  binaryRules: [
    { lhs: 'S', rhs1: 'A', rhs2: 'B' }, // S → AB （基础 ab）
    { lhs: 'S1', rhs1: 'S', rhs2: 'B' }, // S1 → SB
    { lhs: 'S', rhs1: 'A', rhs2: 'S1' }, // S → AS1
  ],
};
