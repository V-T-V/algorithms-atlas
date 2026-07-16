// 状态词法分析器 · 纯算法实现
export interface Token {
  type: string;
  value: string;
}
export interface LexerRule {
  re: RegExp;
  type: string;
  pushState?: string;
  popState?: boolean;
}
export type Rules = Record<string, LexerRule[]>;
export interface LexerHooks {
  onToken?: (t: Token, state: string) => void;
  onStateChange?: (s: string) => void;
}

export class StatefulLexer {
  private state = 'INIT';
  constructor(
    private rules: Rules,
    private hooks: LexerHooks = {},
  ) {}
  lex(src: string): Token[] {
    const out: Token[] = [];
    let i = 0;
    while (i < src.length) {
      const rs = this.rules[this.state];
      if (!rs) throw new Error(`no rules for state ${this.state}`);
      let matched = false;
      for (const r of rs) {
        r.re.lastIndex = i;
        const m = r.re.exec(src);
        if (m && m.index === i) {
          const text = m[0];
          if (text.length === 0) throw new Error('zero-length rule');
          if (r.type !== 'SKIP') {
            const t: Token = { type: r.type, value: text };
            out.push(t);
            this.hooks.onToken?.(t, this.state);
          }
          if (r.pushState) {
            this.state = r.pushState;
            this.hooks.onStateChange?.(this.state);
          }
          if (r.popState) {
            this.state = 'INIT';
            this.hooks.onStateChange?.(this.state);
          }
          i += text.length;
          matched = true;
          break;
        }
      }
      if (!matched) throw new Error(`no rule matches at ${i}: ${src.slice(i, i + 10)}`);
    }
    return out;
  }
}
