// =============================================================================
// 正则表达式 AST 构建 · 纯算法实现
// 递归下降，零 DOM 依赖。
// =============================================================================

/** 正则 AST 节点。 */
export type RegexAst =
  | { kind: 'empty' }
  | { kind: 'char'; ch: string } // 单字符
  | { kind: 'anychar' } // . 任意字符
  | { kind: 'class'; ranges: Array<{ from: string; to: string }>; negate: boolean }
  | { kind: 'concat'; children: RegexAst[] }
  | { kind: 'alt'; children: RegexAst[] }
  | { kind: 'star'; child: RegexAst }
  | { kind: 'plus'; child: RegexAst }
  | { kind: 'opt'; child: RegexAst };

export class RegexParseError extends Error {
  public constructor(
    msg: string,
    public readonly pos: number,
  ) {
    super(`${msg} @${pos}`);
    this.name = 'RegexParseError';
  }
}

export interface RegexHooks {
  onNode?: (node: RegexAst) => void;
  onResult?: (root: RegexAst) => void;
}

interface Cursor {
  s: string;
  pos: number;
}

function peek(c: Cursor): string {
  return c.pos < c.s.length ? c.s[c.pos]! : '';
}

// alt := concat ('|' concat)*
function parseAlt(c: Cursor, hooks: RegexHooks): RegexAst {
  const children: RegexAst[] = [parseConcat(c, hooks)];
  while (peek(c) === '|') {
    c.pos++; // 消耗 |
    children.push(parseConcat(c, hooks));
  }
  if (children.length === 1) return children[0]!;
  const node: RegexAst = { kind: 'alt', children };
  hooks.onNode?.(node);
  return node;
}

// concat := rep*（直到 | ) 或 EOF）
function parseConcat(c: Cursor, hooks: RegexHooks): RegexAst {
  const children: RegexAst[] = [];
  while (true) {
    const ch = peek(c);
    if (ch === '' || ch === '|' || ch === ')') break;
    children.push(parseRep(c, hooks));
  }
  if (children.length === 0) return { kind: 'empty' };
  if (children.length === 1) return children[0]!;
  const node: RegexAst = { kind: 'concat', children };
  hooks.onNode?.(node);
  return node;
}

// rep := atom ('*' | '+' | '?')?
function parseRep(c: Cursor, hooks: RegexHooks): RegexAst {
  let atom = parseAtom(c, hooks);
  while (true) {
    const ch = peek(c);
    if (ch === '*') {
      c.pos++;
      atom = { kind: 'star', child: atom };
      hooks.onNode?.(atom);
    } else if (ch === '+') {
      c.pos++;
      atom = { kind: 'plus', child: atom };
      hooks.onNode?.(atom);
    } else if (ch === '?') {
      c.pos++;
      atom = { kind: 'opt', child: atom };
      hooks.onNode?.(atom);
    } else {
      break;
    }
  }
  return atom;
}

// atom := '(' alt ')' | '.' | '[' class ']' | escape | char
function parseAtom(c: Cursor, hooks: RegexHooks): RegexAst {
  const ch = peek(c);
  if (ch === '(') {
    c.pos++; // (
    const inner = parseAlt(c, hooks);
    if (peek(c) !== ')') throw new RegexParseError('缺少 )', c.pos);
    c.pos++; // )
    return inner;
  }
  if (ch === '.') {
    c.pos++;
    const node: RegexAst = { kind: 'anychar' };
    hooks.onNode?.(node);
    return node;
  }
  if (ch === '[') {
    return parseClass(c, hooks);
  }
  if (ch === '\\') {
    c.pos++;
    const esc = peek(c);
    if (esc === '') throw new RegexParseError('转义后无字符', c.pos);
    c.pos++;
    const node: RegexAst = { kind: 'char', ch: esc };
    hooks.onNode?.(node);
    return node;
  }
  if (ch === '' || ch === ')' || ch === '|' || ch === '*' || ch === '+' || ch === '?') {
    throw new RegexParseError(`意外的 "${ch}"`, c.pos);
  }
  c.pos++;
  const node: RegexAst = { kind: 'char', ch };
  hooks.onNode?.(node);
  return node;
}

// 解析字符类 [..]
function parseClass(c: Cursor, hooks: RegexHooks): RegexAst {
  c.pos++; // 消耗 [
  let negate = false;
  if (peek(c) === '^') {
    negate = true;
    c.pos++;
  }
  const ranges: Array<{ from: string; to: string }> = [];
  while (peek(c) !== '' && peek(c) !== ']') {
    let from = peek(c);
    if (from === '\\') {
      c.pos++;
      from = peek(c);
      if (from === '') throw new RegexParseError('转义后无字符', c.pos);
    }
    c.pos++;
    // 区间？a-z
    if (peek(c) === '-' && c.pos + 1 < c.s.length && c.s[c.pos + 1] !== ']') {
      c.pos++; // 消耗 -
      let to = peek(c);
      if (to === '\\') {
        c.pos++;
        to = peek(c);
        if (to === '') throw new RegexParseError('转义后无字符', c.pos);
      }
      c.pos++;
      ranges.push({ from, to });
    } else {
      ranges.push({ from, to: from });
    }
  }
  if (peek(c) !== ']') throw new RegexParseError('字符类缺少 ]', c.pos);
  c.pos++; // 消耗 ]
  const node: RegexAst = { kind: 'class', ranges, negate };
  hooks.onNode?.(node);
  return node;
}

/**
 * 解析正则字符串为 AST。
 *
 * @param pattern 正则字符串
 * @param hooks 可选钩子
 */
export function parseRegex(pattern: string, hooks: RegexHooks = {}): RegexAst {
  const c: Cursor = { s: pattern, pos: 0 };
  const root = parseAlt(c, hooks);
  if (c.pos < pattern.length) {
    throw new RegexParseError(`未消耗的输入 "${pattern.slice(c.pos)}"`, c.pos);
  }
  hooks.onResult?.(root);
  return root;
}

/** 序列化 AST 为规范文本（用于展示与往返）。 */
export function serializeRegex(node: RegexAst): string {
  switch (node.kind) {
    case 'empty':
      return '';
    case 'char':
      return node.ch;
    case 'anychar':
      return '.';
    case 'class': {
      const body = node.ranges
        .map((r) => (r.from === r.to ? r.from : `${r.from}-${r.to}`))
        .join('');
      return `[${node.negate ? '^' : ''}${body}]`;
    }
    case 'concat':
      return node.children.map(serializeRegex).join('');
    case 'alt':
      return node.children.map(serializeRegex).join('|');
    case 'star':
      return wrapForRep(node.child) + '*';
    case 'plus':
      return wrapForRep(node.child) + '+';
    case 'opt':
      return wrapForRep(node.child) + '?';
  }
}

/** 后缀算子的子节点若是 alt/concat 则加括号。 */
function wrapForRep(child: RegexAst): string {
  if (child.kind === 'alt' || child.kind === 'concat') {
    return `(${serializeRegex(child)})`;
  }
  return serializeRegex(child);
}

/** 统计叶子字符数（用于复杂度估算）。 */
export function countLeaves(node: RegexAst): number {
  switch (node.kind) {
    case 'empty':
      return 0;
    case 'char':
    case 'anychar':
    case 'class':
      return 1;
    case 'concat':
    case 'alt':
      return node.children.reduce((s, n) => s + countLeaves(n), 0);
    case 'star':
    case 'plus':
    case 'opt':
      return countLeaves(node.child);
  }
}
