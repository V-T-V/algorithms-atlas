// =============================================================================
// 词法分析器生成器（NFA → DFA）· 纯算法实现
// 流程：规则正则 → Thompson ε-NFA → 子集构造 DFA → 最长匹配扫描。
// 支持的 regex 语法：字符类 [a-z][A-Z0-9]、字面字符、连接、| 选择、* ? +
// ε 转移用 null 表示。
// 零 DOM 依赖，可独立单测。
// =============================================================================

import type { TreeNode } from '../../../types.ts';

export type { TreeNode };

/** NFA 转移标签：null = ε，string = 字符（或字符集合的单一代表）。 */
type Label = string | null;

/** NFA 片段：起始 + 接受状态。 */
interface NfaFrag {
  start: number;
  accept: number;
}

/** NFA：状态数 + 邻接表（按字符分组）。 */
interface Nfa {
  size: number;
  /** transitions[from] = Map<label, Set<to>>。 */
  transitions: Map<Label, Set<number>>[];
}

interface NfaBuilder {
  nfa: Nfa;
  newState: () => number;
  addTrans: (from: number, label: Label, to: number) => void;
}

/** token 规则定义。 */
export interface TokenRule {
  /** 规则名（token 类型）。 */
  kind: string;
  /** 正则式（简化语法）。 */
  pattern: string;
}

/** token 输出。 */
export interface Token {
  kind: string;
  text: string;
  start: number;
  end: number;
}

// ---------------------------------------------------------------------------
// 正则解析（递归下降）→ AST → Thompson NFA
// ---------------------------------------------------------------------------

type RegexAst =
  | { t: 'char'; chars: Set<string> } // 字符类/单字符
  | { t: 'concat'; parts: RegexAst[] }
  | { t: 'alt'; left: RegexAst; right: RegexAst }
  | { t: 'star'; inner: RegexAst }
  | { t: 'plus'; inner: RegexAst }
  | { t: 'opt'; inner: RegexAst };

/** 解析正则式为 AST。文法：alt → concat ('|' concat)* ; concat → factor* ; factor → base ('*' | '+' | '?')? */
function parseRegex(pat: string): RegexAst {
  let i = 0;
  const peek = (): string | undefined => pat[i];
  const eat = (): string => pat[i++]!;

  const parseCharClass = (): RegexAst => {
    // 已消费 '['
    const chars = new Set<string>();
    let negate = false;
    if (peek() === '^') {
      negate = true;
      eat();
    }
    while (peek() !== undefined && peek() !== ']') {
      const c = eat()!;
      // 转义：\t \n 等
      if (c === '\\') {
        const esc = eat();
        if (esc === 't') chars.add('\t');
        else if (esc === 'n') chars.add('\n');
        else if (esc === 's') {
          chars.add(' ');
          chars.add('\t');
          chars.add('\n');
        } else if (esc !== undefined) {
          chars.add(esc);
        }
        continue;
      }
      if (peek() === '-' && pat[i + 1] !== undefined && pat[i + 1] !== ']') {
        eat(); // -
        const end = eat()!;
        for (let code = c.charCodeAt(0); code <= end.charCodeAt(0); code++) {
          chars.add(String.fromCharCode(code));
        }
      } else {
        chars.add(c);
      }
    }
    if (peek() === ']') eat();
    if (negate) {
      const all = new Set<string>();
      for (let code = 32; code <= 126; code++) all.add(String.fromCharCode(code));
      for (const c of chars) all.delete(c);
      return { t: 'char', chars: all };
    }
    return { t: 'char', chars };
  };

  const parseBase = (): RegexAst => {
    const c = peek();
    if (c === '(') {
      eat();
      const inner = parseAlt();
      if (peek() === ')') eat();
      return inner;
    }
    if (c === '[') {
      eat();
      return parseCharClass();
    }
    if (c === '.') {
      eat();
      // 任意非换行字符
      const chars = new Set<string>();
      for (let code = 32; code <= 126; code++) chars.add(String.fromCharCode(code));
      return { t: 'char', chars };
    }
    // 普通字符（含转义：\x 表示字面量 x）
    let ch = eat() ?? '';
    if (ch === '\\') ch = eat() ?? '\\';
    return { t: 'char', chars: new Set([ch]) };
  };

  const parseFactor = (): RegexAst => {
    let base = parseBase();
    while (peek() === '*' || peek() === '+' || peek() === '?') {
      const op = eat()!;
      if (op === '*') base = { t: 'star', inner: base };
      else if (op === '+') base = { t: 'plus', inner: base };
      else base = { t: 'opt', inner: base };
    }
    return base;
  };

  const parseConcat = (): RegexAst => {
    const parts: RegexAst[] = [];
    while (peek() !== undefined && peek() !== '|' && peek() !== ')') {
      parts.push(parseFactor());
    }
    if (parts.length === 0) return { t: 'char', chars: new Set<string>() }; // ε
    if (parts.length === 1) return parts[0]!;
    return { t: 'concat', parts };
  };

  const parseAlt = (): RegexAst => {
    let left = parseConcat();
    while (peek() === '|') {
      eat();
      const right = parseConcat();
      left = { t: 'alt', left, right };
    }
    return left;
  };

  return parseAlt();
}

/** 用 Thompson 构造把 AST 转为 NFA 片段。 */
function buildNfa(ast: RegexAst, b: NfaBuilder): NfaFrag {
  switch (ast.t) {
    case 'char': {
      const s = b.newState();
      const a = b.newState();
      for (const c of ast.chars) b.addTrans(s, c, a);
      // 空字符类 → ε 连接
      if (ast.chars.size === 0) b.addTrans(s, null, a);
      return { start: s, accept: a };
    }
    case 'concat': {
      let cur = buildNfa(ast.parts[0]!, b);
      for (let k = 1; k < ast.parts.length; k++) {
        const next = buildNfa(ast.parts[k]!, b);
        b.addTrans(cur.accept, null, next.start);
        cur = { start: cur.start, accept: next.accept };
      }
      return cur;
    }
    case 'alt': {
      const s = b.newState();
      const a = b.newState();
      const l = buildNfa(ast.left, b);
      const r = buildNfa(ast.right, b);
      b.addTrans(s, null, l.start);
      b.addTrans(s, null, r.start);
      b.addTrans(l.accept, null, a);
      b.addTrans(r.accept, null, a);
      return { start: s, accept: a };
    }
    case 'star': {
      const s = b.newState();
      const a = b.newState();
      const inner = buildNfa(ast.inner, b);
      b.addTrans(s, null, inner.start);
      b.addTrans(s, null, a);
      b.addTrans(inner.accept, null, inner.start);
      b.addTrans(inner.accept, null, a);
      return { start: s, accept: a };
    }
    case 'plus': {
      // X+ = X X*
      const s = b.newState();
      const a = b.newState();
      const inner = buildNfa(ast.inner, b);
      b.addTrans(s, null, inner.start);
      b.addTrans(inner.accept, null, inner.start);
      b.addTrans(inner.accept, null, a);
      return { start: s, accept: a };
    }
    case 'opt': {
      const s = b.newState();
      const a = b.newState();
      const inner = buildNfa(ast.inner, b);
      b.addTrans(s, null, inner.start);
      b.addTrans(s, null, a);
      b.addTrans(inner.accept, null, a);
      return { start: s, accept: a };
    }
  }
}

// ---------------------------------------------------------------------------
// 从一组规则构建合并 NFA（公共起始，每条规则的接受态标注 kind）
// ---------------------------------------------------------------------------

interface MergedNfa {
  nfa: Nfa;
  start: number;
  /** 接受态 → 规则序号（越小优先）。 */
  acceptToRule: Map<number, number>;
}

function buildMergedNfa(rules: TokenRule[]): MergedNfa {
  const transitions: Map<Label, Set<number>>[] = [];
  const nfa: Nfa = {
    size: 0,
    transitions,
  };
  const b: NfaBuilder = {
    nfa,
    newState: () => {
      const id = transitions.length;
      transitions.push(new Map());
      nfa.size++;
      return id;
    },
    addTrans: (from, label, to) => {
      const m = transitions[from]!;
      const set = m.get(label);
      if (set) set.add(to);
      else m.set(label, new Set([to]));
    },
  };

  const start = b.newState();
  const acceptToRule = new Map<number, number>();
  for (let ri = 0; ri < rules.length; ri++) {
    const ast = parseRegex(rules[ri]!.pattern);
    const frag = buildNfa(ast, b);
    b.addTrans(start, null, frag.start);
    acceptToRule.set(frag.accept, ri);
  }
  return { nfa, start, acceptToRule };
}

// ---------------------------------------------------------------------------
// 子集构造：NFA → DFA
// ---------------------------------------------------------------------------

/** ε-闭包：从状态集经 ε 可达的全部状态。 */
function epsilonClosure(states: Set<number>, nfa: Nfa): Set<number> {
  const result = new Set(states);
  const stack = [...states];
  while (stack.length > 0) {
    const s = stack.pop()!;
    const eps = nfa.transitions[s]!.get(null);
    if (eps) {
      for (const t of eps) {
        if (!result.has(t)) {
          result.add(t);
          stack.push(t);
        }
      }
    }
  }
  return result;
}

/** move：从状态集经字符 c 可达的状态集（不含 ε）。 */
function move(states: Set<number>, c: string, nfa: Nfa): Set<number> {
  const result = new Set<number>();
  for (const s of states) {
    const targets = nfa.transitions[s]!.get(c);
    if (targets) for (const t of targets) result.add(t);
  }
  return result;
}

/** 收集 NFA 用到的全部字符标签。 */
function collectAlphabet(nfa: Nfa): Set<string> {
  const alpha = new Set<string>();
  for (const m of nfa.transitions) {
    for (const label of m.keys()) if (label !== null) alpha.add(label);
  }
  return alpha;
}

export interface Dfa {
  /** 状态数。 */
  numStates: number;
  /** transitions[state][char] = 目标状态（-1 表示无转移）。 */
  transitions: Map<string, number>[];
  /** 接受态 → 规则序号（最小序号优先）。 */
  accept: Map<number, number>;
  start: number;
}

/** 子集构造：把 NFA 确定化为 DFA。 */
export function nfaToDfa(merged: MergedNfa): Dfa {
  const { nfa, start, acceptToRule } = merged;
  const alphabet = collectAlphabet(nfa);

  const setKey = (s: Set<number>): string => [...s].sort((a, b) => a - b).join(',');

  const dfaTrans: Map<string, number>[] = [];
  const dfaAccept = new Map<number, number>();
  const setToId = new Map<string, number>();
  const idToSet = new Map<number, Set<number>>();

  const register = (s: Set<number>): number => {
    const k = setKey(s);
    const existing = setToId.get(k);
    if (existing !== undefined) return existing;
    const id = dfaTrans.length;
    dfaTrans.push(new Map());
    setToId.set(k, id);
    idToSet.set(id, s);
    // 接受态：取集合中包含的最小规则序号（规则靠前优先）
    let minRule = Infinity;
    for (const st of s) {
      const r = acceptToRule.get(st);
      if (r !== undefined && r < minRule) minRule = r;
    }
    if (minRule !== Infinity) dfaAccept.set(id, minRule);
    return id;
  };

  const startSet = epsilonClosure(new Set([start]), nfa);
  register(startSet);

  // 工作列表：处理每个未展开的 DFA 状态
  let processed = 0;
  while (processed < dfaTrans.length) {
    const curId = processed;
    processed++;
    const cur = idToSet.get(curId)!;
    for (const c of alphabet) {
      const nxt = epsilonClosure(move(cur, c, nfa), nfa);
      if (nxt.size === 0) continue;
      const nxtId = register(nxt);
      dfaTrans[curId]!.set(c, nxtId);
    }
  }

  return { numStates: dfaTrans.length, transitions: dfaTrans, accept: dfaAccept, start: 0 };
}

// ---------------------------------------------------------------------------
// 最长匹配扫描
// ---------------------------------------------------------------------------

export interface LexerHooks {
  /** 匹配出一个 token。 */
  onToken?: (token: Token) => void;
  /** 遇到无法识别的字符。 */
  onError?: (char: string, pos: number) => void;
}

export interface Lexer {
  dfa: Dfa;
  rules: TokenRule[];
  /** 扫描输入，返回 token 列表。忽略空白（匹配 'WS' 规则的 token 不输出）。 */
  scan: (input: string, hooks?: LexerHooks) => Token[];
}

/**
 * 从规则列表生成词法分析器。
 * 特殊规则名 'WS'（空白）的匹配将被跳过（不输出 token）。
 */
export function generateLexer(rules: TokenRule[]): Lexer {
  const merged = buildMergedNfa(rules);
  const dfa = nfaToDfa(merged);
  return {
    dfa,
    rules,
    scan: (input: string, hooks: LexerHooks = {}): Token[] => {
      const tokens: Token[] = [];
      let pos = 0;
      while (pos < input.length) {
        let state = dfa.start;
        let lastAcceptPos = -1;
        let lastAcceptRule = -1;
        let cur = pos;
        // 最长匹配
        while (cur < input.length) {
          const c = input[cur]!;
          const nxt = dfa.transitions[state]!.get(c);
          if (nxt === undefined) break;
          state = nxt;
          cur++;
          const acc = dfa.accept.get(state);
          if (acc !== undefined) {
            lastAcceptPos = cur;
            lastAcceptRule = acc;
          }
        }
        if (lastAcceptPos === -1) {
          // 无法识别当前字符
          hooks.onError?.(input[pos]!, pos);
          pos++;
          continue;
        }
        const rule = rules[lastAcceptRule]!;
        const text = input.slice(pos, lastAcceptPos);
        const tok: Token = { kind: rule.kind, text, start: pos, end: lastAcceptPos };
        if (rule.kind !== 'WS') {
          tokens.push(tok);
          hooks.onToken?.(tok);
        }
        pos = lastAcceptPos;
      }
      return tokens;
    },
  };
}

// ---------------------------------------------------------------------------
// 演示规则集
// ---------------------------------------------------------------------------

export const DEMO_RULES: TokenRule[] = [
  { kind: 'WS', pattern: '[ \\t\\n]+' }, // 空白
  { kind: 'NUM', pattern: '[0-9]+' },
  { kind: 'ID', pattern: '[a-zA-Z_][a-zA-Z0-9_]*' },
  { kind: 'PLUS', pattern: '\\+' },
  { kind: 'ASSIGN', pattern: '=' },
];

export const DEMO_INPUT = 'x = 42 + y1';
