// =============================================================================
// 花括号展开 II · 纯算法实现 (LeetCode 1096)
// 文法：expr = term (',' term)*       (并集)
//        term = factor+               (连接/笛卡尔积)
//        factor = letter* | '{' expr '}'
// 返回所有可能字符串的去重升序列表。
// =============================================================================
export interface BtBraceExpansion2Hooks {
  onUnion?: (parts: string[][]) => void;
  onConcat?: (left: string[], right: string[]) => void;
  onResult?: (results: string[]) => void;
}

class Parser {
  private i = 0;
  constructor(private s: string) {}

  // expr = term (',' term)*
  parseExpr(): string[] {
    const parts: string[][] = [this.parseTerm()];
    while (this.i < this.s.length && this.s[this.i] === ',') {
      this.i++;
      parts.push(this.parseTerm());
    }
    // 并集
    const out: string[] = [];
    for (const p of parts) out.push(...p);
    return out;
  }

  // term = factor+
  parseTerm(): string[] {
    let acc: string[] = [''];
    while (this.i < this.s.length && this.s[this.i] !== ',' && this.s[this.i] !== '}') {
      const f = this.parseFactor();
      // 笛卡尔积连接
      const next: string[] = [];
      for (const a of acc) for (const b of f) next.push(a + b);
      acc = next;
    }
    return acc;
  }

  // factor = letter* | '{' expr '}'
  parseFactor(): string[] {
    if (this.i < this.s.length && this.s[this.i] === '{') {
      this.i++; // skip {
      const res = this.parseExpr();
      if (this.i < this.s.length && this.s[this.i] === '}') this.i++; // skip }
      return res;
    }
    // 连续字母作为一个单选 factor
    let lit = '';
    while (this.i < this.s.length && /[a-z]/.test(this.s[this.i]!)) {
      lit += this.s[this.i]!;
      this.i++;
    }
    return [lit];
  }
}

export function btBraceExpansion2(expr: string, hooks: BtBraceExpansion2Hooks = {}): string[] {
  const p = new Parser(expr);
  const raw = p.parseExpr();
  const uniq = [...new Set(raw)].sort();
  hooks.onResult?.(uniq);
  return uniq;
}
