// =============================================================================
// PEG 表达式解析器（文法串编译）· 纯算法实现
// 流程：PEG 文法源码字符串 → 解析为表达式 AST → 递归求值做匹配。
// 文法语法（PEG 元语言）：
//   grammar → rule+
//   rule    → IDENT '<-' expression
//   expression → sequence ('/' sequence)*
//   sequence  → prefixed*
//   prefixed  → ('&' | '!')? suffixed
//   suffixed  → primary ('*' | '+' | '?')?
//   primary   → IDENT | literal | class | '(' expression ')'
//   literal   → "'" chars "'"
//   class     → '[' ranges ']'
// 与 packrat-parser 的区别：这里把「文法文本」作为输入解析，构造 AST。
// 零 DOM 依赖，可独立单测。
// =============================================================================

import type { TreeNode } from '../../../types.ts';

export type { TreeNode };

/** PEG 表达式 AST。 */
export type PegExpr =
  | { kind: 'lit'; value: string }
  | { kind: 'class'; chars: Set<string>; negate: boolean }
  | { kind: 'any' } // .
  | { kind: 'ref'; name: string }
  | { kind: 'seq'; parts: PegExpr[] }
  | { kind: 'choice'; alts: PegExpr[] }
  | { kind: 'star'; inner: PegExpr }
  | { kind: 'plus'; inner: PegExpr }
  | { kind: 'opt'; inner: PegExpr }
  | { kind: 'and'; inner: PegExpr } // & 前瞻（正断言）
  | { kind: 'not'; inner: PegExpr }; // ! 前瞻（负断言）

/** PEG 规则。 */
export interface PegRule {
  name: string;
  expr: PegExpr;
}

/** 编译后的文法。 */
export interface PegGrammar {
  rules: PegRule[];
  start: string;
}

// ---------------------------------------------------------------------------
// 文法字符串 → AST（一个手写解析器）
// ---------------------------------------------------------------------------

class GrammarParser {
  private pos = 0;
  constructor(private readonly src: string) {}

  private peek(): string | undefined {
    return this.src[this.pos];
  }
  private eat(): string {
    return this.src[this.pos++]!;
  }
  private skipWs(): void {
    while (this.pos < this.src.length && / s/.test(this.src[this.pos]!)) this.pos++;
  }
  /** 仅跳过行内空白（空格/制表符），不跨行——用于序列内分隔，规则以换行分隔。 */
  private skipInlineWs(): void {
    while (
      this.pos < this.src.length &&
      (this.src[this.pos] === ' ' || this.src[this.pos] === '\t')
    ) {
      this.pos++;
    }
  }
  private startsWith(s: string): boolean {
    return this.src.startsWith(s, this.pos);
  }

  parseGrammar(): PegGrammar {
    const rules: PegRule[] = [];
    this.skipWs();
    while (this.pos < this.src.length) {
      const rule = this.parseRule();
      rules.push(rule);
      this.skipWs();
    }
    if (rules.length === 0) throw new Error('空文法');
    return { rules, start: rules[0]!.name };
  }

  private parseRule(): PegRule {
    this.skipWs();
    const name = this.parseIdent();
    this.skipWs();
    if (!this.startsWith('<-')) throw new Error(`规则 ${name} 缺少 '<-' @${this.pos}`);
    this.pos += 2; // <-
    this.skipWs();
    const expr = this.parseExpression();
    return { name, expr };
  }

  private parseIdent(): string {
    let s = '';
    while (this.pos < this.src.length && /[A-Za-z0-9_]/.test(this.src[this.pos]!)) {
      s += this.eat();
    }
    if (s.length === 0) throw new Error(`期望标识符 @${this.pos}`);
    return s;
  }

  // expression → sequence ('/' sequence)*
  private parseExpression(): PegExpr {
    const first = this.parseSequence();
    const alts: PegExpr[] = [first];
    while (true) {
      this.skipInlineWs();
      if (this.peek() === '/') {
        this.eat();
        this.skipInlineWs();
        alts.push(this.parseSequence());
      } else {
        break;
      }
    }
    return alts.length === 1 ? first : { kind: 'choice', alts };
  }

  // sequence → prefixed*  （空序列 = ε，用空 lit 表示）
  private parseSequence(): PegExpr {
    const parts: PegExpr[] = [];
    while (true) {
      this.skipInlineWs();
      const c = this.peek();
      // 换行 / 结尾 / '/' / ')' 均终止序列
      if (c === undefined || c === '/' || c === ')' || c === '\n' || c === '\r') break;
      parts.push(this.parsePrefixed());
    }
    if (parts.length === 0) return { kind: 'lit', value: '' };
    if (parts.length === 1) return parts[0]!;
    return { kind: 'seq', parts };
  }

  // prefixed → ('&' | '!')? suffixed
  private parsePrefixed(): PegExpr {
    this.skipInlineWs();
    const c = this.peek();
    if (c === '&') {
      this.eat();
      return { kind: 'and', inner: this.parseSuffixed() };
    }
    if (c === '!') {
      this.eat();
      return { kind: 'not', inner: this.parseSuffixed() };
    }
    return this.parseSuffixed();
  }

  // suffixed → primary ('*' | '+' | '?')?
  private parseSuffixed(): PegExpr {
    const prim = this.parsePrimary();
    this.skipInlineWs(); // 后缀紧随 primary（行内），不跨行
    const c = this.peek();
    if (c === '*') {
      this.eat();
      return { kind: 'star', inner: prim };
    }
    if (c === '+') {
      this.eat();
      return { kind: 'plus', inner: prim };
    }
    if (c === '?') {
      this.eat();
      return { kind: 'opt', inner: prim };
    }
    return prim;
  }

  // primary → IDENT | literal | class | '.' | '(' expression ')'
  private parsePrimary(): PegExpr {
    this.skipInlineWs();
    const c = this.peek();
    if (c === undefined) throw new Error(`意外结尾 @${this.pos}`);
    if (c === '(') {
      this.eat();
      const inner = this.parseExpression();
      this.skipWs();
      if (this.peek() !== ')') throw new Error(`期望 ')' @${this.pos}`);
      this.eat();
      return inner;
    }
    if (c === "'") {
      return this.parseLiteral();
    }
    if (c === '"') {
      return this.parseDoubleQuotedLiteral();
    }
    if (c === '[') {
      return this.parseClass();
    }
    if (c === '.') {
      this.eat();
      return { kind: 'any' };
    }
    if (/[A-Za-z_]/.test(c)) {
      return { kind: 'ref', name: this.parseIdent() };
    }
    throw new Error(`意外字符 '${c}' @${this.pos}`);
  }

  private parseLiteral(): PegExpr {
    this.eat(); // '
    let s = '';
    while (this.pos < this.src.length && this.src[this.pos] !== "'") {
      let ch = this.eat();
      if (ch === '\\' && this.pos < this.src.length) {
        ch = this.eat();
        if (ch === 'n') ch = '\n';
        else if (ch === 't') ch = '\t';
      }
      s += ch;
    }
    if (this.peek() !== "'") throw new Error(`未闭合的字面量 @${this.pos}`);
    this.eat();
    return { kind: 'lit', value: s };
  }

  private parseDoubleQuotedLiteral(): PegExpr {
    this.eat(); // "
    let s = '';
    while (this.pos < this.src.length && this.src[this.pos] !== '"') {
      s += this.eat();
    }
    this.eat();
    return { kind: 'lit', value: s };
  }

  private parseClass(): PegExpr {
    this.eat(); // [
    let negate = false;
    if (this.peek() === '^') {
      negate = true;
      this.eat();
    }
    const chars = new Set<string>();
    while (this.pos < this.src.length && this.src[this.pos] !== ']') {
      let c = this.eat()!;
      if (c === '\\' && this.pos < this.src.length) {
        const esc = this.eat()!;
        if (esc === 'd') {
          for (let code = 48; code <= 57; code++) chars.add(String.fromCharCode(code));
          continue;
        } else if (esc === 'w') {
          for (let code = 48; code <= 57; code++) chars.add(String.fromCharCode(code));
          for (let code = 65; code <= 90; code++) chars.add(String.fromCharCode(code));
          for (let code = 97; code <= 122; code++) chars.add(String.fromCharCode(code));
          chars.add('_');
          continue;
        } else if (esc === 's') {
          chars.add(' ');
          chars.add('\t');
          chars.add('\n');
          continue;
        } else if (esc === 'n') {
          chars.add('\n');
          continue;
        } else if (esc === 't') {
          chars.add('\t');
          continue;
        }
        c = esc;
      }
      if (
        this.peek() === '-' &&
        this.src[this.pos + 1] !== undefined &&
        this.src[this.pos + 1] !== ']'
      ) {
        this.eat(); // -
        const end = this.eat();
        for (let code = c.charCodeAt(0); code <= end!.charCodeAt(0); code++) {
          chars.add(String.fromCharCode(code));
        }
      } else {
        chars.add(c);
      }
    }
    if (this.peek() !== ']') throw new Error(`未闭合的字符类 @${this.pos}`);
    this.eat();
    return { kind: 'class', chars, negate };
  }
}

/** 把 PEG 文法源码编译为文法对象。 */
export function compileGrammar(src: string): PegGrammar {
  return new GrammarParser(src).parseGrammar();
}

// ---------------------------------------------------------------------------
// 匹配器：在输入上求值表达式
// ---------------------------------------------------------------------------

export type MatchResult = { ok: true; pos: number } | { ok: false };

export interface PegHooks {
  onMatch?: (name: string, pos: number, result: MatchResult) => void;
}

/** 在输入 input 的 pos 处用表达式 expr 匹配，成功返回新位置。 */
export function matchExpr(
  expr: PegExpr,
  input: string,
  pos: number,
  grammar: PegGrammar,
  hooks?: PegHooks,
): MatchResult {
  switch (expr.kind) {
    case 'lit': {
      if (input.startsWith(expr.value, pos)) return { ok: true, pos: pos + expr.value.length };
      return { ok: false };
    }
    case 'class': {
      if (pos >= input.length) return { ok: false };
      const ch = input[pos]!;
      const inSet = expr.chars.has(ch);
      const matched = expr.negate ? !inSet : inSet;
      return matched ? { ok: true, pos: pos + 1 } : { ok: false };
    }
    case 'any': {
      if (pos < input.length && input[pos] !== '\n') return { ok: true, pos: pos + 1 };
      return { ok: false };
    }
    case 'ref': {
      const rule = grammar.rules.find((r) => r.name === expr.name);
      if (!rule) throw new Error(`未知规则 ${expr.name}`);
      const r = matchExpr(rule.expr, input, pos, grammar, hooks);
      hooks?.onMatch?.(expr.name, pos, r);
      return r;
    }
    case 'seq': {
      let cur = pos;
      for (const part of expr.parts) {
        const r = matchExpr(part, input, cur, grammar, hooks);
        if (!r.ok) return { ok: false };
        cur = r.pos;
      }
      return { ok: true, pos: cur };
    }
    case 'choice': {
      for (const alt of expr.alts) {
        const r = matchExpr(alt, input, pos, grammar, hooks);
        if (r.ok) return r;
      }
      return { ok: false };
    }
    case 'star': {
      let cur = pos;
      let guard = 0;
      while (guard < input.length + 1) {
        const r = matchExpr(expr.inner, input, cur, grammar, hooks);
        if (!r.ok || r.pos === cur) break;
        cur = r.pos;
        guard++;
      }
      return { ok: true, pos: cur };
    }
    case 'plus': {
      const first = matchExpr(expr.inner, input, pos, grammar, hooks);
      if (!first.ok) return { ok: false };
      const rest = matchExpr({ kind: 'star', inner: expr.inner }, input, first.pos, grammar, hooks);
      return rest;
    }
    case 'opt': {
      const r = matchExpr(expr.inner, input, pos, grammar, hooks);
      if (r.ok) return r;
      return { ok: true, pos };
    }
    case 'and': {
      // 正前瞻：匹配但不消费
      const r = matchExpr(expr.inner, input, pos, grammar, hooks);
      return r.ok ? { ok: true, pos } : { ok: false };
    }
    case 'not': {
      // 负前瞻：不匹配才成功，不消费
      const r = matchExpr(expr.inner, input, pos, grammar, hooks);
      return r.ok ? { ok: false } : { ok: true, pos };
    }
  }
}

/** 用编译好的文法匹配输入：从 start 规则起，要求消费全部输入。 */
export function pegMatch(input: string, grammar: PegGrammar, hooks?: PegHooks): boolean {
  const startRule = grammar.rules.find((r) => r.name === grammar.start);
  if (!startRule) return false;
  const r = matchExpr(startRule.expr, input, 0, grammar, hooks);
  return r.ok && r.pos === input.length;
}

// ---------------------------------------------------------------------------
// 演示文法源码：识别带优先级的算术表达式
//   Expr <- Term ('+' Term)*
//   Term <- Factor ('*' Factor)*
//   Factor <- [0-9]+ / '(' Expr ')'
// ---------------------------------------------------------------------------
export const DEMO_GRAMMAR_SRC = `Expr <- Term ('+' Term)*
Term <- Factor ('*' Factor)*
Factor <- [0-9]+ / '(' Expr ')'`;

export const DEMO_INPUT = '1+2*3';

/** 把 AST 表达式渲染为 TreeNode（展示用）。 */
export function exprToTreeNode(expr: PegExpr, counter: { n: number }): TreeNode {
  const id = `p${counter.n++}`;
  const labelMap: Record<string, string> = {
    lit: `lit:"${(expr as { value: string }).value}"`,
    class: `[${(expr as { chars: Set<string>; negate: boolean }).negate ? '^' : ''}...]`,
    any: '.',
    ref: (expr as { name: string }).name,
    star: '*',
    plus: '+',
    opt: '?',
    and: '&',
    not: '!',
    seq: 'seq',
    choice: '/',
  };
  const value = labelMap[expr.kind] ?? expr.kind;
  const children: TreeNode[] = [];
  if (expr.kind === 'seq') for (const p of expr.parts) children.push(exprToTreeNode(p, counter));
  if (expr.kind === 'choice') for (const a of expr.alts) children.push(exprToTreeNode(a, counter));
  if ('inner' in expr && expr.inner) children.push(exprToTreeNode(expr.inner, counter));
  return {
    id,
    value,
    role: children.length > 0 ? 'pivot' : 'default',
    children: children.length > 0 ? children : undefined,
  };
}
