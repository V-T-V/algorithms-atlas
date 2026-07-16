// =============================================================================
// EBNF 扩展巴科斯范式 · 纯算法实现
// 把 EBNF 规则解析为 AST，并能「展开」为等价的纯 BNF 产生式集合。
// 支持的算子：
//   () 分组；[] 可选；{} 重复（0+）；后缀 * 重复、+ 至少一次、? 可选；
//   | 或；连接（直接相邻）；终结符用引号包裹或裸写；非终结符用 <...> 或首字母大写单词。
// 零 DOM 依赖，可独立单测。
// =============================================================================

/** EBNF 表达式 AST 节点。 */
export type EbnfNode =
  | { kind: 'empty' } // ε
  | { kind: 'term'; text: string } // 终结符（不含引号）
  | { kind: 'nonterm'; name: string } // 非终结符
  | { kind: 'concat'; items: EbnfNode[] }
  | { kind: 'alt'; options: EbnfNode[] }
  | { kind: 'group'; inner: EbnfNode }
  | { kind: 'opt'; inner: EbnfNode } // [..] 或后缀 ?
  | { kind: 'star'; inner: EbnfNode } // {..} 或后缀 *
  | { kind: 'plus'; inner: EbnfNode }; // 后缀 +

/** 一条 EBNF 规则：lhs ::= expr */
export interface EbnfRule {
  lhs: string;
  expr: EbnfNode;
}

export interface EbnfGrammar {
  rules: EbnfRule[];
  start: string;
}

export class EbnfParseError extends Error {
  public constructor(
    msg: string,
    public readonly pos: number,
  ) {
    super(`${msg} @${pos}`);
    this.name = 'EbnfParseError';
  }
}

export interface EbnfHooks {
  onRule?: (rule: EbnfRule) => void;
  onResult?: (g: EbnfGrammar) => void;
}

interface Cursor {
  s: string;
  pos: number;
}

function skipWs(c: Cursor): void {
  while (c.pos < c.s.length && / s/.test(c.s[c.pos]!)) c.pos++;
}

function peek(c: Cursor): string {
  return c.pos < c.s.length ? c.s[c.pos]! : '';
}

/** 主表达式：alt 列表，按 | 分隔。 */
function parseExpr(c: Cursor): EbnfNode {
  skipWs(c);
  const options: EbnfNode[] = [parseConcat(c)];
  while (true) {
    skipWs(c);
    if (peek(c) !== '|') break;
    c.pos++; // 消耗 |
    options.push(parseConcat(c));
  }
  return options.length === 1 ? options[0]! : { kind: 'alt', options };
}

/** 连接：一串带后缀的因子。 */
function parseConcat(c: Cursor): EbnfNode {
  const items: EbnfNode[] = [];
  while (true) {
    skipWs(c);
    const ch = peek(c);
    if (ch === '' || ch === '|' || ch === ')' || ch === ']' || ch === '}') {
      break;
    }
    items.push(parseSuffix(c));
  }
  return items.length === 0
    ? { kind: 'empty' }
    : items.length === 1
      ? items[0]!
      : { kind: 'concat', items };
}

/** 因子 + 可选后缀 (* + ?)。 */
function parseSuffix(c: Cursor): EbnfNode {
  let node = parseFactor(c);
  // 连续后缀
  while (true) {
    skipWs(c);
    const ch = peek(c);
    if (ch === '*') {
      c.pos++;
      node = { kind: 'star', inner: node };
    } else if (ch === '+') {
      c.pos++;
      node = { kind: 'plus', inner: node };
    } else if (ch === '?') {
      c.pos++;
      node = { kind: 'opt', inner: node };
    } else {
      break;
    }
  }
  return node;
}

/** 原子：终结符 / 非终结符 / (...) / [...] / {...} */
function parseFactor(c: Cursor): EbnfNode {
  skipWs(c);
  const ch = peek(c);
  if (ch === '(') {
    c.pos++;
    const inner = parseExpr(c);
    skipWs(c);
    if (peek(c) !== ')') throw new EbnfParseError('分组缺少 )', c.pos);
    c.pos++;
    return { kind: 'group', inner };
  }
  if (ch === '[') {
    c.pos++;
    const inner = parseExpr(c);
    skipWs(c);
    if (peek(c) !== ']') throw new EbnfParseError('可选缺少 ]', c.pos);
    c.pos++;
    return { kind: 'opt', inner };
  }
  if (ch === '{') {
    c.pos++;
    const inner = parseExpr(c);
    skipWs(c);
    if (peek(c) !== '}') throw new EbnfParseError('重复缺少 }', c.pos);
    c.pos++;
    return { kind: 'star', inner };
  }
  if (ch === '"' || ch === "'") {
    c.pos++;
    const start = c.pos;
    while (c.pos < c.s.length && c.s[c.pos] !== ch) c.pos++;
    if (c.pos >= c.s.length) throw new EbnfParseError('终结符未闭合', start);
    const text = c.s.slice(start, c.pos);
    c.pos++;
    return { kind: 'term', text };
  }
  if (ch === '<') {
    c.pos++;
    const start = c.pos;
    while (c.pos < c.s.length && c.s[c.pos] !== '>') c.pos++;
    if (c.pos >= c.s.length) throw new EbnfParseError('非终结符缺少 >', start);
    const name = c.s.slice(start, c.pos).trim();
    c.pos++;
    return { kind: 'nonterm', name };
  }
  // ε
  if (c.s.startsWith('ε', c.pos) || c.s.startsWith('epsilon', c.pos)) {
    if (c.s.startsWith('epsilon', c.pos)) c.pos += 7;
    else c.pos += 1;
    return { kind: 'empty' };
  }
  // 裸单词：首字母大写视作非终结符，否则终结符。
  const wordMatch = /^([A-Za-z_][A-Za-z0-9_]*)/.exec(c.s.slice(c.pos));
  if (!wordMatch) throw new EbnfParseError(`意外字符 "${ch}"`, c.pos);
  const word = wordMatch[1]!;
  c.pos += word.length;
  if (/^[A-Z]/.test(word)) {
    return { kind: 'nonterm', name: word };
  }
  return { kind: 'term', text: word };
}

/**
 * 解析 EBNF 文本为文法。
 *
 * @param src EBNF 文本（多条规则，每条 `lhs ::= expr`）
 * @param hooks 可选钩子
 */
export function parseEBNF(src: string, hooks: EbnfHooks = {}): EbnfGrammar {
  const c: Cursor = { s: src, pos: 0 };
  const rules: EbnfRule[] = [];
  let start = '';
  while (true) {
    skipWs(c);
    if (c.pos >= c.s.length) break;
    // 读取左部：裸单词或 <...>
    let lhs: string;
    if (peek(c) === '<') {
      c.pos++;
      const s2 = c.pos;
      while (c.pos < c.s.length && c.s[c.pos] !== '>') c.pos++;
      lhs = c.s.slice(s2, c.pos).trim();
      c.pos++;
    } else {
      const m = /^([A-Za-z_][A-Za-z0-9_]*)/.exec(c.s.slice(c.pos));
      if (!m) throw new EbnfParseError('规则左部应为标识符', c.pos);
      lhs = m[1]!;
      c.pos += lhs.length;
    }
    if (start === '') start = lhs;
    skipWs(c);
    let matched = false;
    for (const sep of ['::=', ':=', '=']) {
      if (c.s.startsWith(sep, c.pos)) {
        c.pos += sep.length;
        matched = true;
        break;
      }
    }
    if (!matched) throw new EbnfParseError('期望 ::= / := / =', c.pos);
    const expr = parseExpr(c);
    const rule: EbnfRule = { lhs, expr };
    rules.push(rule);
    hooks.onRule?.(rule);
    // 规则间可选的 ';' 或 '.'
    skipWs(c);
    if (peek(c) === ';' || peek(c) === '.') c.pos++;
  }
  const g: EbnfGrammar = { rules, start };
  hooks.onResult?.(g);
  return g;
}

/** 把 EBNF AST 序列化回文本（带括号）。 */
export function serializeNode(node: EbnfNode): string {
  switch (node.kind) {
    case 'empty':
      return 'ε';
    case 'term':
      return `'${node.text}'`;
    case 'nonterm':
      return node.name;
    case 'concat':
      return node.items.map(serializeNode).join(' ');
    case 'alt':
      return node.options.map(serializeNode).join(' | ');
    case 'group':
      return `( ${serializeNode(node.inner)} )`;
    case 'opt':
      return `[ ${serializeNode(node.inner)} ]`;
    case 'star':
      return `{ ${serializeNode(node.inner)} }`;
    case 'plus':
      return `( ${serializeNode(node.inner)} )+`;
  }
}

// —— 展开（desugar）为纯 BNF ——
// 每个需要辅助非终结符的算子引入新规则，名字形如 lhs_A、lhs_B ...

export interface BnfProduction {
  lhs: string;
  /** 候选；每个候选是终结符/非终结符符号序列；空数组表示 ε。 */
  alternatives: Array<Array<{ nonTerminal: boolean; text: string }>>;
}

/** 把一条 EBNF 规则展开为多条 BNF 产生式（含辅助）。 */
export function desugarRule(rule: EbnfRule, counter: { n: number }): BnfProduction[] {
  const prods: BnfProduction[] = [];
  const fresh = (base: string): string => {
    counter.n += 1;
    return `${base}_${counter.n}`;
  };
  /**
   * 把节点展开为若干「候选」。
   * 返回：代表该节点的非终结符名集合（多个表示 alt）。
   * 若节点是纯终结/非终结，返回单个候选，不引入新规则。
   */
  const expand = (node: EbnfNode, nameHint: string): string => {
    switch (node.kind) {
      case 'empty': {
        const nm = fresh(nameHint);
        prods.push({ lhs: nm, alternatives: [[]] });
        return nm;
      }
      case 'term': {
        const nm = fresh(nameHint);
        prods.push({ lhs: nm, alternatives: [[{ nonTerminal: false, text: node.text }]] });
        return nm;
      }
      case 'nonterm': {
        return node.name;
      }
      case 'concat': {
        // 每个 item 展开为名字，连接成一个候选
        const partNames = node.items.map((it, i) => expand(it, `${nameHint}_c${i}`));
        const nm = fresh(nameHint);
        prods.push({
          lhs: nm,
          alternatives: [partNames.map((n) => ({ nonTerminal: true, text: n }))],
        });
        return nm;
      }
      case 'alt': {
        const optNames = node.options.map((it, i) => expand(it, `${nameHint}_a${i}`));
        const nm = fresh(nameHint);
        prods.push({
          lhs: nm,
          alternatives: optNames.map((n) => [{ nonTerminal: true, text: n }]),
        });
        return nm;
      }
      case 'group': {
        return expand(node.inner, `${nameHint}_g`);
      }
      case 'opt': {
        const innerName = expand(node.inner, `${nameHint}_o`);
        const nm = fresh(nameHint);
        prods.push({
          lhs: nm,
          alternatives: [[{ nonTerminal: true, text: innerName }], []],
        });
        return nm;
      }
      case 'star': {
        const innerName = expand(node.inner, `${nameHint}_s`);
        const nm = fresh(nameHint);
        // nm -> innerName nm | ε
        prods.push({
          lhs: nm,
          alternatives: [
            [
              { nonTerminal: true, text: innerName },
              { nonTerminal: true, text: nm },
            ],
            [],
          ],
        });
        return nm;
      }
      case 'plus': {
        const innerName = expand(node.inner, `${nameHint}_p`);
        const nm = fresh(nameHint);
        // nm -> innerName nm | innerName
        prods.push({
          lhs: nm,
          alternatives: [
            [
              { nonTerminal: true, text: innerName },
              { nonTerminal: true, text: nm },
            ],
            [{ nonTerminal: true, text: innerName }],
          ],
        });
        return nm;
      }
    }
  };

  const topName = expand(rule.expr, rule.lhs);
  prods.unshift({ lhs: rule.lhs, alternatives: [[{ nonTerminal: true, text: topName }]] });
  return prods;
}

/** 把整个 EBNF 文法展开为纯 BNF 产生式列表。 */
export function desugar(g: EbnfGrammar): BnfProduction[] {
  const counter = { n: 0 };
  const all: BnfProduction[] = [];
  for (const r of g.rules) {
    all.push(...desugarRule(r, counter));
  }
  return all;
}
