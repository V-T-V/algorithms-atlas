// AST 构建（表达式树）· 纯算法实现

export interface NumNode {
  type: 'num';
  value: number;
}
export interface BinOpNode {
  type: 'binop';
  op: string;
  left: AstNode;
  right: AstNode;
}
export type AstNode = NumNode | BinOpNode;

/** 事件钩子。 */
export interface AstHooks {
  /** 进入某非终结符。 */
  onEnter?: (nt: 'expr' | 'term' | 'factor') => void;
  /** 构造一个节点。 */
  onNode?: (node: AstNode) => void;
  /** 完成。 */
  onResult?: (root: AstNode) => void;
}

/** 简单词法：数字与单字符算符/括号。 */
interface Cursor {
  s: string;
  pos: number;
}

function skipWs(c: Cursor): void {
  while (c.pos < c.s.length && c.s[c.pos] === ' ') c.pos++;
}

function peek(c: Cursor): string {
  return c.pos < c.s.length ? c.s[c.pos]! : '';
}

/**
 * 递归下降构建 AST。
 *
 * @param expr 表达式字符串
 * @param hooks 可选事件钩子
 * @returns AST 根节点
 */
export function buildAst(expr: string, hooks: AstHooks = {}): AstNode {
  const c: Cursor = { s: expr, pos: 0 };

  const parseFactor = (): AstNode => {
    hooks.onEnter?.('factor');
    skipWs(c);
    const ch = peek(c);
    if (ch === '(') {
      c.pos++; // 消耗 (
      const inner = parseExpr();
      skipWs(c);
      if (peek(c) === ')') c.pos++; // 消耗 )
      return inner;
    }
    // 数字
    let num = '';
    while (c.pos < c.s.length && /[0-9.]/.test(c.s[c.pos]!)) num += c.s[c.pos++];
    if (num === '') throw new Error(`无法解析 factor @${c.pos}: "${peek(c)}"`);
    const node: NumNode = { type: 'num', value: parseFloat(num) };
    hooks.onNode?.(node);
    return node;
  };

  const parseTerm = (): AstNode => {
    hooks.onEnter?.('term');
    let node = parseFactor();
    skipWs(c);
    while (peek(c) === '*' || peek(c) === '/') {
      const op = c.s[c.pos++]!;
      const right = parseFactor();
      const binop: BinOpNode = { type: 'binop', op, left: node, right };
      hooks.onNode?.(binop);
      node = binop;
      skipWs(c);
    }
    return node;
  };

  const parseExpr = (): AstNode => {
    hooks.onEnter?.('expr');
    let node = parseTerm();
    skipWs(c);
    while (peek(c) === '+' || peek(c) === '-') {
      const op = c.s[c.pos++]!;
      const right = parseTerm();
      const binop: BinOpNode = { type: 'binop', op, left: node, right };
      hooks.onNode?.(binop);
      node = binop;
      skipWs(c);
    }
    return node;
  };

  const root = parseExpr();
  skipWs(c);
  if (c.pos < c.s.length) throw new Error(`未消费字符 @${c.pos}: "${c.s.slice(c.pos)}"`);
  hooks.onResult?.(root);
  return root;
}

/** 后序遍历求值 AST。 */
export function evalAst(node: AstNode): number {
  if (node.type === 'num') return node.value;
  const l = evalAst(node.left);
  const r = evalAst(node.right);
  switch (node.op) {
    case '+':
      return l + r;
    case '-':
      return l - r;
    case '*':
      return l * r;
    case '/':
      return l / r;
    default:
      throw new Error(`未知算符 ${node.op}`);
  }
}

/** 前序打印（LISP 风格）。 */
export function astToLisp(node: AstNode): string {
  if (node.type === 'num') return String(node.value);
  return `(${node.op} ${astToLisp(node.left)} ${astToLisp(node.right)})`;
}
