// =============================================================================
// BNF 文法表示 · 纯算法实现
// 把 BNF 文本解析成结构化的产生式集合。
// 规则形式：<非终结符> ::= alt1 | alt2 | ...
//   - 非终结符：<name>，内部不能含 '>'。
//   - 终结符：用单引号或双引号包裹，如 'if'、"then"；也可裸写单词。
//   - 候选分隔：'|'。
//   - ε（空串）：写为空候选 或 'ε' / 'epsilon'。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** 一个文法符号：非终结符或终结符。 */
export interface BnfSymbol {
  /** 是否非终结符。 */
  nonTerminal: boolean;
  /** 文本。非终结符不含尖括号；终结符不含引号。 */
  text: string;
}

/** 一条候选（产生式右部的一个分支）。空数组表示 ε。 */
export type Alternative = BnfSymbol[];

/** 一个非终结符的完整规则：<lhs> ::= alt0 | alt1 | ... */
export interface BnfRule {
  lhs: string; // 非终结符名（不含尖括号）
  alternatives: Alternative[];
}

/** 解析整个 BNF 文本得到的所有规则（按出现顺序）。 */
export interface BnfGrammar {
  rules: BnfRule[];
  /** 所有规则名集合。 */
  nonTerminals: Set<string>;
  /** 所有终结符集合。 */
  terminals: Set<string>;
  /** 起始非终结符（第一条规则的 lhs）。 */
  start: string;
}

/** 事件钩子。 */
export interface BnfHooks {
  /** 解析完一条规则。 */
  onRule?: (rule: BnfRule) => void;
  /** 解析完一个候选。 */
  onAlternative?: (lhs: string, alt: Alternative, altIndex: number) => void;
  /** 全部完成。 */
  onResult?: (grammar: BnfGrammar) => void;
}

/** 解析错误。 */
export class BnfParseError extends Error {
  public constructor(
    msg: string,
    public readonly pos: number,
  ) {
    super(`${msg} @${pos}`);
    this.name = 'BnfParseError';
  }
}

interface Cursor {
  s: string;
  pos: number;
}

function skipWsAndComments(c: Cursor): void {
  while (c.pos < c.s.length) {
    const ch = c.s[c.pos]!;
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      c.pos++;
    } else if (c.s.startsWith('/*', c.pos)) {
      // 块注释
      const end = c.s.indexOf('*/', c.pos + 2);
      c.pos = end === -1 ? c.s.length : end + 2;
    } else if (c.s.startsWith('//', c.pos) || ch === '#') {
      // 行注释
      const nl = c.s.indexOf('\n', c.pos);
      c.pos = nl === -1 ? c.s.length : nl + 1;
    } else {
      break;
    }
  }
}

function peek(c: Cursor): string {
  return c.pos < c.s.length ? c.s[c.pos]! : '';
}

/** 解析 <非终结符>，调用方需保证当前位置是 '<'。 */
function parseNonTerminal(c: Cursor): BnfSymbol {
  c.pos++; // 消耗 '<'
  const start = c.pos;
  while (c.pos < c.s.length && c.s[c.pos] !== '>') c.pos++;
  if (c.pos >= c.s.length) {
    throw new BnfParseError('非终结符缺少闭合 >', start);
  }
  const name = c.s.slice(start, c.pos).trim();
  if (name === '') throw new BnfParseError('空非终结符名', start);
  c.pos++; // 消耗 '>'
  return { nonTerminal: true, text: name };
}

/** 解析引号包裹的终结符。 */
function parseQuotedTerminal(c: Cursor, quote: string): BnfSymbol {
  c.pos++; // 消耗引号
  const start = c.pos;
  while (c.pos < c.s.length && c.s[c.pos] !== quote) c.pos++;
  if (c.pos >= c.s.length) {
    throw new BnfParseError(`终结符缺少闭合 ${quote}`, start);
  }
  const text = c.s.slice(start, c.pos);
  c.pos++; // 消耗引号
  return { nonTerminal: false, text };
}

/** 解析裸写的终结符（一串非空白、非特殊字符的字符）。 */
function parseBareTerminal(c: Cursor): BnfSymbol {
  const start = c.pos;
  while (c.pos < c.s.length) {
    const ch = c.s[c.pos]!;
    if (
      ch === ' ' ||
      ch === '\t' ||
      ch === '\n' ||
      ch === '\r' ||
      ch === '|' ||
      ch === '<' ||
      ch === '>' ||
      ch === '='
    ) {
      break;
    }
    c.pos++;
  }
  const text = c.s.slice(start, c.pos);
  return { nonTerminal: false, text };
}

/** 解析单个符号。 */
function parseSymbol(c: Cursor): BnfSymbol {
  skipWsAndComments(c);
  const ch = peek(c);
  if (ch === '<') return parseNonTerminal(c);
  if (ch === '"' || ch === "'") return parseQuotedTerminal(c, ch);
  if (ch === '') throw new BnfParseError('意外的输入结束，期望符号', c.pos);
  // 允许 ε / epsilon 显式写法
  const rest = c.s.slice(c.pos);
  if (rest.startsWith('ε') || rest.startsWith('epsilon')) {
    // ε 由上层 parseAlternative 处理为空候选，这里不应到达
    throw new BnfParseError('ε 不应作为符号解析', c.pos);
  }
  return parseBareTerminal(c);
}

/** 解析一条候选，直到 '|' 或 '\n'(分隔下一条规则) 或规则结束。 */
function parseAlternative(c: Cursor, ruleSep: string): Alternative {
  const alt: Alternative = [];
  // 检测 ε：一个候选内只有一个符号且文本为 'ε'/'epsilon'。
  skipWsAndComments(c);
  const rest = c.s.slice(c.pos);
  if (rest.startsWith('ε')) {
    c.pos += 1; // ε 是一个字符
    return []; // ε → 空
  }
  if (rest.startsWith('epsilon')) {
    c.pos += 'epsilon'.length;
    return [];
  }
  while (c.pos < c.s.length) {
    skipWsAndComments(c);
    const ch = peek(c);
    if (ch === '' || ch === '|' || ch === ruleSep) break;
    alt.push(parseSymbol(c));
  }
  return alt;
}

/**
 * 解析 BNF 文本为结构化文法。
 *
 * @param src BNF 文本
 * @param hooks 可选事件钩子
 * @returns 文法结构
 */
export function parseBNF(src: string, hooks: BnfHooks = {}): BnfGrammar {
  const c: Cursor = { s: src, pos: 0 };
  const rules: BnfRule[] = [];
  const nonTerminals = new Set<string>();
  const terminals = new Set<string>();
  // 支持 ::= 和 := 和单 = 作为定义符。
  // 多条规则之间用换行或 ';' 分隔；这里采用「扫描到下一条 <lhs> ::= 时即新开规则」。

  let start = '';
  while (true) {
    skipWsAndComments(c);
    if (c.pos >= c.s.length) break;
    // 1. 读取左部非终结符
    const lhsSym = parseSymbol(c);
    if (!lhsSym.nonTerminal) {
      throw new BnfParseError(`规则左部必须是 <非终结符>，但得到 "${lhsSym.text}"`, c.pos);
    }
    const lhs = lhsSym.text;
    skipWsAndComments(c);
    // 2. 期望 ::= / := / =
    let matched = false;
    for (const sep of ['::=', ':=', '=']) {
      if (c.s.startsWith(sep, c.pos)) {
        c.pos += sep.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      throw new BnfParseError('期望定义符 ::= / := / =', c.pos);
    }
    if (start === '') start = lhs;
    nonTerminals.add(lhs);
    // 3. 读取候选（用 '|' 分隔）
    const alternatives: Alternative[] = [];
    let altIndex = 0;
    while (true) {
      const alt = parseAlternative(c, '\n');
      alternatives.push(alt);
      hooks.onAlternative?.(lhs, alt, altIndex++);
      // 收集终结符
      for (const sym of alt) {
        if (!sym.nonTerminal) terminals.add(sym.text);
        else nonTerminals.add(sym.text);
      }
      skipWsAndComments(c);
      if (peek(c) === '|') {
        c.pos++; // 消耗 '|'
        continue;
      }
      break;
    }
    const rule: BnfRule = { lhs, alternatives };
    rules.push(rule);
    hooks.onRule?.(rule);
  }

  const grammar: BnfGrammar = { rules, nonTerminals, terminals, start };
  hooks.onResult?.(grammar);
  return grammar;
}

/** 把文法反向序列化为标准 BNF 文本（带尖括号）。 */
export function serializeBNF(grammar: BnfGrammar): string {
  return grammar.rules
    .map((r) => {
      const alts = r.alternatives.map((alt) =>
        alt.length === 0
          ? 'ε'
          : alt.map((s) => (s.nonTerminal ? `<${s.text}>` : `'${s.text}'`)).join(' '),
      );
      return `<${r.lhs}> ::= ${alts.join(' | ')}`;
    })
    .join('\n');
}
